import asyncHandler from "../utils/asyncHandler.js";
import { success, created } from "../utils/response.js";
import { supabaseAdmin } from "../config/supabase.js";
import { getRequestById, insert, update as dbUpdate } from "../services/supabase.service.js";
import { findMatchingDonors } from "../services/donorMatching.service.js";
import { createAndPush } from "../services/notification.service.js";
import { ConflictError } from "../utils/errors.js";

export const raiseRequest = asyncHandler(async (req, res) => {
  if (req.body.idempotency_key) {
    const existing = await supabaseAdmin
      .from("blood_requests")
      .select("id")
      .eq("idempotency_key", req.body.idempotency_key)
      .maybeSingle();

    if (existing.data) {
      const request = await getRequestById(existing.data.id);
      return success(res, request);
    }
  }

  let hospitalId = req.body.hospital_id;

  if (req.body.for_whom === "self" || req.body.for_whom === "other") {
    const userHospital = await supabaseAdmin
      .from("hospitals")
      .select("id")
      .eq("profile_id", req.user.profileId)
      .maybeSingle();

    if (userHospital.data) hospitalId = userHospital.data.id;
  }

  const requestData = {
    hospital_id: hospitalId || null,
    raised_by: req.user.profileId,
    blood_type: req.body.blood_type,
    units_needed: req.body.units_needed,
    urgency: req.body.urgency,
    status: "matching",
    for_whom: req.body.for_whom,
    patient_name: req.body.patient_name || null,
    patient_notes: req.body.patient_notes || null,
    search_radius_km: req.body.search_radius_km || 5,
    lat: req.body.lat,
    lng: req.body.lng,
    idempotency_key: req.body.idempotency_key || null,
  };

  const request = await insert("blood_requests", requestData);

  if (req.body.for_whom === "hospital" && hospitalId && req.user.role !== "hospital") {
    await insert("proxy_requests", {
      request_id: request.id,
      hospital_id: hospitalId,
      raised_by: req.user.profileId,
      status: "pending",
    });
  }

  const matches = await findMatchingDonors(request.id);

  for (const match of matches) {
    await supabaseAdmin.from("donor_responses").insert({
      request_id: request.id,
      donor_id: match.donor.id,
      status: "pending",
    }).maybeSingle();

    const hospitalName = req.body.hospital_name || "a hospital";
    await createAndPush(
      match.donor.id,
      "emergency",
      `🚨 Emergency: ${req.body.blood_type} Blood Needed`,
      `${hospitalName} · ${match.distanceKm}km away · ${req.body.urgency}`,
      { request_id: request.id, blood_type: req.body.blood_type, urgency: req.body.urgency, distance_km: String(match.distanceKm) },
      request.id
    );
  }

  created(res, request, { donors_matched: matches.length });
});

export const getRequest = asyncHandler(async (req, res) => {
  const request = await getRequestById(req.params.requestId);
  const { data: responses } = await supabaseAdmin
    .from("donor_responses")
    .select("*, profiles(full_name, blood_type, donor_badge_level)")
    .eq("request_id", req.params.requestId)
    .order("created_at", { ascending: true });
  success(res, { ...request, responses: responses || [] });
});

export const cancelRequest = asyncHandler(async (req, res) => {
  const request = await getRequestById(req.params.requestId);
  if (request.raised_by !== req.user.profileId && request.hospital_id) {
    const hospital = await supabaseAdmin.from("hospitals").select("profile_id").eq("id", request.hospital_id).single();
    if (hospital.data?.profile_id !== req.user.profileId) {
      return res.status(403).json({ status: "error", code: "FORBIDDEN", message: "Not your request" });
    }
  }
  if (!["matching", "en_route"].includes(request.status)) {
    return res.status(400).json({ status: "error", code: "BAD_REQUEST", message: `Cannot cancel request in status: ${request.status}` });
  }
  const updated = await dbUpdate("blood_requests", req.params.requestId, {
    status: "cancelled",
    cancelled_reason: req.body.reason || "Cancelled by requester",
  });
  success(res, updated);
});

export const markFulfilled = asyncHandler(async (req, res) => {
  const request = await getRequestById(req.params.requestId);
  if (!request.hospitals?.profile_id || request.hospitals.profile_id !== req.user.profileId) {
    return res.status(403).json({ status: "error", code: "FORBIDDEN", message: "Not your hospital" });
  }
  const updated = await dbUpdate("blood_requests", req.params.requestId, {
    status: "fulfilled",
    fulfilled_at: new Date().toISOString(),
  });

  const { data: responses } = await supabaseAdmin
    .from("donor_responses")
    .select("donor_id")
    .eq("request_id", req.params.requestId)
    .in("status", ["accepted", "en_route", "arrived"]);

  if (responses) {
    for (const resData of responses) {
      await supabaseAdmin.from("donation_history").insert({
        donor_id: resData.donor_id,
        request_id: req.params.requestId,
        hospital_id: request.hospital_id,
        blood_type: request.blood_type,
        units_donated: request.units_needed,
        status: "completed",
        donated_at: new Date().toISOString(),
      }).maybeSingle();
      await supabaseAdmin.from("profiles").rpc("increment_donations", { donor_id: resData.donor_id });
      await createAndPush(
        resData.donor_id,
        "status_update",
        "🎉 Donation Complete!",
        `Your donation at ${request.hospitals?.name || "the hospital"} helped save lives.`,
        { request_id: req.params.requestId }
      );
    }
  }
  success(res, updated);
});