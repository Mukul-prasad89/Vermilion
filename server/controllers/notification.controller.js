import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import { supabaseAdmin } from "../config/supabase.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.per_page) || 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  const { data, count } = await supabaseAdmin
    .from("notifications")
    .select("*", { count: "exact" })
    .eq("user_id", req.user.profileId)
    .order("created_at", { ascending: false })
    .range(from, to);
  success(res, data || [], { page, per_page: perPage, total: count });
});

export const markRead = asyncHandler(async (req, res) => {
  const { error } = await supabaseAdmin
    .from("notifications")
    .update({ is_read: true })
    .eq("id", req.params.id)
    .eq("user_id", req.user.profileId);
  if (error) return res.status(400).json({ status: "error", code: "UPDATE_FAILED", message: error.message });
  success(res, { message: "Marked as read" });
});

export const markAllRead = asyncHandler(async (req, res) => {
  const { error } = await supabaseAdmin
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", req.user.profileId)
    .eq("is_read", false);
  if (error) return res.status(400).json({ status: "error", code: "UPDATE_FAILED", message: error.message });
  success(res, { message: "All marked as read" });
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const { count } = await supabaseAdmin
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", req.user.profileId)
    .eq("is_read", false);
  success(res, { unread_count: count || 0 });
});