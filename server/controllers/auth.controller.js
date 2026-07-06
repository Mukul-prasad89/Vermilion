import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import { supabaseAdmin } from "../config/supabase.js";

export const refreshSession = asyncHandler(async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    return res.status(400).json({ status: "error", code: "VALIDATION_ERROR", message: "refresh_token required" });
  }
  const { data, error } = await supabaseAdmin.auth.refreshSession({ refresh_token });
  if (error) return res.status(401).json({ status: "error", code: "TOKEN_EXPIRED", message: error.message });
  success(res, { session: data.session, user: data.user });
});

export const logout = asyncHandler(async (req, res) => {
  const { error } = await supabaseAdmin.auth.admin.signOut(req.user.authId);
  await supabaseAdmin.from("device_tokens").update({ is_active: false }).eq("user_id", req.user.profileId);
  if (error) return res.status(500).json({ status: "error", code: "LOGOUT_FAILED", message: error.message });
  success(res, { message: "Logged out" });
});

export const registerDeviceToken = asyncHandler(async (req, res) => {
  const { token, platform } = req.body;
  if (!token || !platform) return res.status(400).json({ status: "error", code: "VALIDATION_ERROR", message: "token and platform required" });
  await supabaseAdmin.from("device_tokens").upsert(
    { user_id: req.user.profileId, token, platform, is_active: true, updated_at: new Date().toISOString() },
    { onConflict: "token" }
  );
  success(res, { message: "Device registered" });
});