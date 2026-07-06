import asyncHandler from "../utils/asyncHandler.js";
import { success, created } from "../utils/response.js";
import { getNearbyDonors } from "../services/location.service.js";
import { supabaseAdmin } from "../config/supabase.js";
import { haversineKm } from "../utils/geo.js";
import { insert } from "../services/supabase.service.js";

export const searchBlood = asyncHandler(async (req, res) => {
  const { blood_type, lat, lng, radius_km, units_needed, urgency, for_whom, patient_name, hospital_id } = req.query;

  if (!blood_type || !lat || !lng) {
    return res.status(400).json({ status: "error", code: "VALIDATION_ERROR", message: "blood_type, lat, lng required" });
  }

  const donors = await getNearbyDonors(
    parseFloat(lat), parseFloat(lng),
    parseInt(radius_km) || 5,
    blood_type,
    req.user.profileId
  );

  const { data: bloodBanks } = await supabaseAdmin
    .from("hospitals")
    .select("id, name, address, lat, lng, emergency_phone, blood_bank_phone, type, is_verified")
    .or("type.eq.blood_bank,type.eq.multi_specialty")
    .eq("is_verified", true);

  const nearbyBanks = (bloodBanks || [])
    .map((b) => {
      const dist = haversineKm(parseFloat(lat), parseFloat(lng), parseFloat(b.lat), parseFloat(b.lng));
      if (dist > (parseInt(radius_km) || 5)) return null;
      return { ...b, distanceKm: Math.round(dist * 100) / 100 };
    })
    .filter(Boolean)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  const searchRecord = await insert("blood_searches", {
    searched_by: req.user.profileId,
    blood_type,
    units_needed: parseInt(units_needed) || 1,
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    search_radius_km: parseInt(radius_km) || 5,
    urgency: urgency || "standard",
    for_whom: for_whom || "self",
    hospital_id: hospital_id || null,
    patient_name: patient_name || null,
    results_count: (donors?.length || 0) + nearbyBanks.length,
  });

  success(res, {
    search_id: searchRecord.id,
    donors: donors || [],
    blood_banks: nearbyBanks,
    total: (donors?.length || 0) + nearbyBanks.length,
  });
});

export const escalateSearch = asyncHandler(async (req, res) => {
  const { search_id, units_needed, urgency, patient_notes, idempotency_key } = req.body;

  const { data: search } = await supabaseAdmin
    .from("blood_searches")
    .select("*")
    .eq("id", search_id)
    .single();

  if (!search) {
    return res.status(404).json({ status: "error", code: "NOT_FOUND", message: "Search not found" });
  }

  const requestData = {
    raised_by: req.user.profileId,
    blood_type: search.blood_type,
    units_needed: units_needed || search.units_needed || 1,
    urgency: urgency || search.urgency || "urgent",
    status: "matching",
    for_whom: search.for_whom,
    patient_name: search.patient_name || null,
    patient_notes: patient_notes || null,
    search_radius_km: search.search_radius_km,
    lat: search.lat,
    lng: search.lng,
    hospital_id: search.hospital_id || null,
    idempotency_key: idempotency_key || null,
  };

  if (search.for_whom === "hospital" && search.hospital_id) {
    await insert("proxy_requests", {
      request_id: null,
      hospital_id: search.hospital_id,
      raised_by: req.user.profileId,
      status: "pending",
    });
  }

  const { data: request } = await supabaseAdmin.from("blood_requests").insert(requestData).select().single();

  await supabaseAdmin.from("blood_searches").update({ escalated_to: request.id }).eq("id", search_id);

  created(res, request);
});