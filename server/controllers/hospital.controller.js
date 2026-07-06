import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import { supabaseAdmin } from "../config/supabase.js";
import { getHospitalByProfileId, getHospitalById, insert, update as dbUpdate } from "../services/supabase.service.js";
import { ForbiddenError } from "../utils/errors.js";

export const getHospitalProfile = asyncHandler(async (req, res) => {
  try {
    const hospital = await getHospitalByProfileId(req.user.profileId);
    success(res, hospital);
  } catch {
    return res.status(404).json({ status: "error", code: "NOT_FOUND", message: "Hospital profile not found" });
  }
});

export const updateHospitalProfile = asyncHandler(async (req, res) => {
  const hospital = await getHospitalByProfileId(req.user.profileId);
  const updated = await dbUpdate("hospitals", hospital.id, req.body);
  success(res, updated);
});

export const getHospitalRequests = asyncHandler(async (req, res) => {
  const hospital = await getHospitalByProfileId(req.user.profileId);
  const { data } = await supabaseAdmin
    .from("blood_requests")
    .select("*, profiles!raised_by(full_name)")
    .eq("hospital_id", hospital.id)
    .order("created_at", { ascending: false })
    .limit(50);
  success(res, data || []);
});

export const getProxyRequests = asyncHandler(async (req, res) => {
  const hospital = await getHospitalByProfileId(req.user.profileId);
  const { data } = await supabaseAdmin
    .from("proxy_requests")
    .select("*, blood_requests(*), profiles!raised_by(full_name, phone)")
    .eq("hospital_id", hospital.id)
    .in("status", ["pending", "confirmed"])
    .order("created_at", { ascending: false });
  success(res, data || []);
});

export const confirmProxy = asyncHandler(async (req, res) => {
  const hospital = await getHospitalByProfileId(req.user.profileId);
  const { data: proxy } = await supabaseAdmin
    .from("proxy_requests")
    .select("id, request_id")
    .eq("id", req.params.proxyId)
    .eq("hospital_id", hospital.id)
    .single();
  if (!proxy) throw new ForbiddenError("Not your proxy request");
  await supabaseAdmin.from("proxy_requests").update({
    status: "confirmed",
    confirmed_at: new Date().toISOString(),
  }).eq("id", proxy.id);
  const updated = await dbUpdate("blood_requests", proxy.request_id, {
    status: "matching", updated_at: new Date().toISOString(),
  });
  success(res, updated);
});

export const rejectProxy = asyncHandler(async (req, res) => {
  const hospital = await getHospitalByProfileId(req.user.profileId);
  const { data: proxy } = await supabaseAdmin
    .from("proxy_requests")
    .select("id, request_id")
    .eq("id", req.params.proxyId)
    .eq("hospital_id", hospital.id)
    .single();
  if (!proxy) throw new ForbiddenError("Not your proxy request");
  await supabaseAdmin.from("proxy_requests").update({
    status: "rejected", rejected_at: new Date().toISOString(),
  }).eq("id", proxy.id);
  await dbUpdate("blood_requests", proxy.request_id, {
    status: "cancelled", cancelled_reason: "Hospital rejected proxy request",
  });
  success(res, { message: "Proxy request rejected" });
});

export const getHospitalStaff = asyncHandler(async (req, res) => {
  const hospital = await getHospitalByProfileId(req.user.profileId);
  const { data } = await supabaseAdmin
    .from("hospital_staff")
    .select("*, profiles(id, full_name, email, phone)")
    .eq("hospital_id", hospital.id);
  success(res, data || []);
});

export const addStaff = asyncHandler(async (req, res) => {
  const hospital = await getHospitalByProfileId(req.user.profileId);
  const staff = await insert("hospital_staff", {
    hospital_id: hospital.id,
    profile_id: req.body.profile_id,
    staff_role: req.body.staff_role || "staff",
  });
  success(res, staff);
});

export const removeStaff = asyncHandler(async (req, res) => {
  const hospital = await getHospitalByProfileId(req.user.profileId);
  await supabaseAdmin
    .from("hospital_staff")
    .delete()
    .eq("id", req.params.staffId)
    .eq("hospital_id", hospital.id);
  success(res, { message: "Staff removed" });
});