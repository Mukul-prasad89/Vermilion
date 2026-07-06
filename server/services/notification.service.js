import { supabaseAdmin } from "../config/supabase.js";
import { fcm } from "../config/firebase.js";

export async function sendPushNotification(userId, notificationId, title, body, data = {}) {
  if (!fcm) return [];
  const { data: tokens } = await supabaseAdmin
    .from("device_tokens")
    .select("token, platform")
    .eq("user_id", userId)
    .eq("is_active", true);

  if (!tokens?.length) return null;

  const results = [];
  for (const { token, platform } of tokens) {
    try {
      const msg = {
        token,
        notification: { title, body },
        data: { ...data, notification_id: notificationId, click_action: "FLUTTER_NOTIFICATION_CLICK" },
      };

      if (platform === "android") {
        msg.android = { priority: "high", ttl: 300 * 1000 };
      }
      if (platform === "ios") {
        msg.apns = { headers: { "apns-priority": "10" }, payload: { aps: { sound: "default" } } };
      }
      if (platform === "web") {
        msg.webpush = { headers: { Urgency: "high", TTL: "300" } };
      }

      const res = await fcm.send(msg);
      results.push(res);
    } catch (err) {
      if (err.code === "messaging/registration-token-not-registered") {
        await deactivateToken(token);
      }
      continue;
    }
  }

  await supabaseAdmin
    .from("notifications")
    .update({ is_pushed: true })
    .eq("id", notificationId);

  return results;
}

async function deactivateToken(token) {
  await supabaseAdmin
    .from("device_tokens")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("token", token);
}

export async function createNotification(userId, type, title, body, actionUrl, requestId = null) {
  const { data } = await supabaseAdmin
    .from("notifications")
    .insert({ user_id: userId, type, title, body, action_url: actionUrl, request_id: requestId })
    .select("id")
    .single();

  return data;
}

export async function createAndPush(userId, type, title, body, data = {}, requestId = null) {
  const notif = await createNotification(userId, type, title, body, data.actionUrl || null, requestId);
  if (notif) {
    await sendPushNotification(userId, notif.id, title, body, data);
  }
  return notif;
}