import { supabaseAdmin } from "../config/supabase.js";
import { haversineKm } from "../utils/geo.js";

const RADIUS_EXPANSIONS = [5, 7, 10, 15];
const MAX_EXPANSION_LEVEL = 3;

export async function findMatchingDonors(requestId) {
  const { data: req } = await supabaseAdmin
    .from("blood_requests")
    .select("blood_type, lat, lng, search_radius_km, escalation_level, urgency")
    .eq("id", requestId)
    .single();

  if (!req) throw new Error("Request not found");

  const expansionLevel = req.escalation_level || 0;
  const radiusKm = RADIUS_EXPANSIONS[expansionLevel] || req.search_radius_km;

  const urgencyMultiplier = req.urgency === "critical" ? 2 : req.urgency === "urgent" ? 1.5 : 1;
  const finalRadius = radiusKm * urgencyMultiplier;

  const { data: donors } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, blood_type, city, donor_badge_level, total_donations, avg_response_seconds, transport_mode")
    .eq("is_donor_registered", true)
    .eq("is_available", true)
    .eq("blood_type", req.blood_type)
    .neq("id", req.raised_by);

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
      if (!loc || !req.lat || !req.lng) return null;
      const dist = haversineKm(req.lat, req.lng, loc.lat, loc.lng);
      if (dist > finalRadius) return null;
      return { donor, distanceKm: Math.round(dist * 100) / 100, location: loc };
    })
    .filter(Boolean)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return results;
}

export { RADIUS_EXPANSIONS, MAX_EXPANSION_LEVEL };