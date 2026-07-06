import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import { updateDonorLocation, getNearbyDonors, trackRequestDonors } from "../services/location.service.js";
import { supabaseAdmin } from "../config/supabase.js";
import { haversineKm } from "../utils/geo.js";
import { AuthError, ForbiddenError } from "../utils/errors.js";

export const updateLocation = asyncHandler(async (req, res) => {
  const updated = await updateDonorLocation(req.user.profileId, req.body);
  success(res, updated);
});

export const getNearby = asyncHandler(async (req, res) => {
  const { lat, lng, radius_km, blood_type } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ status: "error", code: "VALIDATION_ERROR", message: "lat and lng required" });
  }
  const donors = await getNearbyDonors(
    parseFloat(lat), parseFloat(lng),
    parseInt(radius_km) || 5,
    blood_type || null,
    req.user.profileId
  );

  const { data: bloodBanks } = await supabaseAdmin
    .from("hospitals")
    .select("id, name, address, lat, lng, emergency_phone, blood_bank_phone, type")
    .eq("type", "blood_bank")
    .eq("is_verified", true);

  const nearbyBanks = (bloodBanks || [])
    .map((b) => {
      const dist = haversineKm(parseFloat(lat), parseFloat(lng), parseFloat(b.lat), parseFloat(b.lng));
      if (dist > (parseInt(radius_km) || 5)) return null;
      return { ...b, distanceKm: Math.round(dist * 100) / 100 };
    })
    .filter(Boolean)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  success(res, { donors: donors || [], blood_banks: nearbyBanks, total: (donors?.length || 0) + nearbyBanks.length });
});

export const trackDonors = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { data: request } = await supabaseAdmin.from("blood_requests").select("hospital_id, raised_by").eq("id", requestId).single();
  if (!request) return res.status(404).json({ status: "error", code: "NOT_FOUND", message: "Request not found" });
  const isHospitalStaff = request.hospital_id && await isAccessingHospital(req.user.profileId, request.hospital_id);
  if (request.raised_by !== req.user.profileId && !isHospitalStaff) {
    throw new ForbiddenError("Not authorized to view this tracking");
  }
  const donors = await trackRequestDonors(requestId);
  success(res, { request_id: requestId, donors });
});

export const donorArrivedAtHospital = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const response = await supabaseAdmin
    .from("donor_responses")
    .update({ status: "arrived", arrived_at: new Date().toISOString() })
    .eq("request_id", requestId)
    .eq("donor_id", req.user.profileId)
    .eq("status", "en_route")
    .select()
    .single();
  if (response.error || !response.data) {
    return res.status(400).json({ status: "error", code: "BAD_REQUEST", message: "Cannot mark arrived. Not en route." });
  }
  await supabaseAdmin.from("blood_requests").update({ status: "en_route" }).eq("id", requestId);
  const updatedLocation = await updateDonorLocation(req.user.profileId, {
    ...req.body,
    tracking_mode: "normal",
  });
  success(res, { response: response.data, location: updatedLocation });
});

async function isAccessingHospital(profileId, hospitalId) {
  const { data } = await supabaseAdmin
    .from("hospital_staff")
    .select("id")
    .eq("hospital_id", hospitalId)
    .eq("profile_id", profileId)
    .eq("is_active", true)
    .maybeSingle();
  return !!data;
}