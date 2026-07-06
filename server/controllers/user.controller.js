import asyncHandler from "../utils/asyncHandler.js";
import { success, created } from "../utils/response.js";
import { updateProfile, getProfileById } from "../services/supabase.service.js";
import { supabaseAdmin } from "../config/supabase.js";

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await getProfileById(req.user.profileId);
  success(res, profile);
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const updated = await updateProfile(req.user.profileId, req.body);
  success(res, updated);
});

export const registerDonor = asyncHandler(async (req, res) => {
  const profile = await updateProfile(req.user.profileId, {
    blood_type: req.body.blood_type,
    is_donor_registered: true,
    default_radius_km: req.body.default_radius_km || 3,
    transport_mode: req.body.transport_mode || "bike",
    quiet_hours_start: req.body.quiet_hours_start || null,
    quiet_hours_end: req.body.quiet_hours_end || null,
    auto_unavailable_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
  });
  created(res, profile);
});

export const toggleAvailability = asyncHandler(async (req, res) => {
  const { is_available } = req.body;
  const updated = await updateProfile(req.user.profileId, {
    is_available,
    auto_unavailable_at: is_available
      ? new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString()
      : null,
  });
  if (!is_available) {
    await supabaseAdmin.from("live_locations").delete().eq("profile_id", req.user.profileId);
  }
  success(res, updated);
});

export const getDonorAlerts = asyncHandler(async (req, res) => {
  const { data } = await supabaseAdmin
    .from("donor_responses")
    .select("*, blood_requests!inner(*, hospitals(name, address, lat, lng))")
    .eq("donor_id", req.user.profileId)
    .in("status", ["pending", "accepted", "en_route"])
    .order("created_at", { ascending: false });
  success(res, data || []);
});

export const getDonationHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.per_page) || 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  const { data, count } = await supabaseAdmin
    .from("donation_history")
    .select("*, hospitals(name, address)", { count: "exact" })
    .eq("donor_id", req.user.profileId)
    .order("donated_at", { ascending: false })
    .range(from, to);
  success(res, data || [], { page, per_page: perPage, total: count });
});

export const getDonorBadges = asyncHandler(async (req, res) => {
  const { data } = await supabaseAdmin
    .from("donor_badges")
    .select("*, badges(name, description, icon_url)")
    .eq("donor_id", req.user.profileId)
    .order("earned_at", { ascending: false });
  success(res, data || []);
});

export const updateDonorSettings = asyncHandler(async (req, res) => {
  const updated = await updateProfile(req.user.profileId, req.body);
  success(res, updated);
});

export const getMySearches = asyncHandler(async (req, res) => {
  const { data } = await supabaseAdmin
    .from("blood_searches")
    .select("*")
    .eq("searched_by", req.user.profileId)
    .order("created_at", { ascending: false })
    .limit(20);
  success(res, data || []);
});

export const getMyRequests = asyncHandler(async (req, res) => {
  const { data } = await supabaseAdmin
    .from("blood_requests")
    .select("*, hospitals(name, address)")
    .eq("raised_by", req.user.profileId)
    .order("created_at", { ascending: false })
    .limit(20);
  success(res, data || []);
});

export const respondToRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { response, rejection_reason } = req.body;
  const existing = await supabaseAdmin
    .from("donor_responses")
    .select("id, status")
    .eq("request_id", requestId)
    .eq("donor_id", req.user.profileId)
    .maybeSingle();
  if (existing.data) {
    return res.status(409).json({ status: "error", code: "CONFLICT", message: "Already responded" });
  }
  const statusMap = { accepted: "accepted", rejected: "rejected" };
  const newStatus = statusMap[response];
  const { data } = await supabaseAdmin
    .from("donor_responses")
    .insert({
      request_id: requestId,
      donor_id: req.user.profileId,
      status: newStatus,
      rejection_reason: response === "rejected" ? rejection_reason : null,
      ...(response === "accepted" ? { accepted_at: new Date().toISOString() } : {}),
    })
    .select()
    .single();
  success(res, data);
});