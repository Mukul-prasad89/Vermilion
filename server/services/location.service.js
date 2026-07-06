import { supabaseAdmin } from "../config/supabase.js";
import { haversineKm, degradeCoordinate, estimateEtaMinutes } from "../utils/geo.js";
import { insert as dbInsert, update as dbUpdate } from "./supabase.service.js";

export async function updateDonorLocation(profileId, { lat, lng, accuracy, speed, heading, tracking_mode }) {
  const existing = await supabaseAdmin
    .from("live_locations")
    .select("id")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (existing.data) {
    return dbUpdate("live_locations", existing.data.id, {
      lat, lng, accuracy: accuracy || null, speed: speed || null,
      heading: heading || null, tracking_mode: tracking_mode || "normal",
      is_sharing: true, updated_at: new Date().toISOString(),
    });
  }

  return dbInsert("live_locations", {
    profile_id: profileId, lat, lng, accuracy: accuracy || null,
    speed: speed || null, heading: heading || null,
    tracking_mode: tracking_mode || "normal", is_sharing: true,
  });
}

export async function stopLocationSharing(profileId) {
  return supabaseAdmin.from("live_locations").delete().eq("profile_id", profileId);
}

export async function getNearbyDonors(lat, lng, radiusKm, bloodType, excludeProfileId) {
  const q = supabaseAdmin
    .from("profiles")
    .select("id, full_name, blood_type, city, donor_badge_level, total_donations, avg_response_seconds")
    .eq("is_donor_registered", true)
    .eq("is_available", true);

  if (bloodType) q.eq("blood_type", bloodType);
  if (excludeProfileId) q.neq("id", excludeProfileId);

  const { data: donors, error } = await q;
  if (error) throw error;
  if (!donors?.length) return [];

  const { data: locations } = await supabaseAdmin
    .from("live_locations")
    .select("profile_id, lat, lng")
    .in("profile_id", donors.map((d) => d.id));

  const locMap = new Map();
  locations?.forEach((l) => locMap.set(l.profile_id, l));

  const results = donors
    .map((donor) => {
      const loc = locMap.get(donor.id);
      if (!loc) return null;
      const dist = haversineKm(lat, lng, loc.lat, loc.lng);
      if (dist > radiusKm) return null;
      return {
        donor,
        distanceKm: Math.round(dist * 100) / 100,
        latDelegated: degradeCoordinate(loc.lat),
        lngDelegated: degradeCoordinate(loc.lng),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return results;
}

export async function trackRequestDonors(requestId) {
  const { data: responses } = await supabaseAdmin
    .from("donor_responses")
    .select("donor_id, status")
    .eq("request_id", requestId)
    .in("status", ["accepted", "en_route", "arrived"]);

  if (!responses?.length) return [];

  const { data: req } = await supabaseAdmin
    .from("blood_requests")
    .select("lat, lng")
    .eq("id", requestId)
    .single();

  const { data: locations } = await supabaseAdmin
    .from("live_locations")
    .select("profile_id, lat, lng")
    .in("profile_id", responses.map((r) => r.donor_id));

  const { data: donors } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, blood_type")
    .in("id", responses.map((r) => r.donor_id));

  const donorMap = new Map();
  donors?.forEach((d) => donorMap.set(d.id, d));

  return responses.map((res) => {
    const donor = donorMap.get(res.donor_id) || {};
    const loc = locations?.find((l) => l.profile_id === res.donor_id);
    const dist = (loc && req) ? haversineKm(req.lat, req.lng, loc.lat, loc.lng) : null;
    return {
      donorId: res.donor_id,
      name: donor.full_name,
      bloodType: donor.blood_type,
      status: res.status,
      lat: loc?.lat,
      lng: loc?.lng,
      distanceKm: dist ? Math.round(dist * 100) / 100 : null,
      etaMinutes: dist ? estimateEtaMinutes(dist) : null,
    };
  });
}