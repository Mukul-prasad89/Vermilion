import { supabaseAdmin } from "../config/supabase.js";
import { findMatchingDonors, MAX_EXPANSION_LEVEL } from "./donorMatching.service.js";
import { createAndPush } from "./notification.service.js";
import { insert } from "./supabase.service.js";

const EXPANSION_TIMEOUT_MS = {
  standard: 120_000,
  urgent: 60_000,
  critical: 30_000,
};

export async function autoEscalateIfNeeded(requestId) {
  const { data: req } = await supabaseAdmin
    .from("blood_requests")
    .select("status, escalation_level, search_radius_km, urgency, blood_type, units_needed, raised_by")
    .eq("id", requestId)
    .single();

  if (!req || req.escalation_level >= MAX_EXPANSION_LEVEL) return null;
  if (!["matching", "en_route"].includes(req.status)) return null;

  const elapsed = Date.now() - new Date(req.updated_at || req.created_at).getTime();
  const timeout = EXPANSION_TIMEOUT_MS[req.urgency] || 120_000;
  if (elapsed < timeout) return null;

  const newLevel = req.escalation_level + 1;
  const donors = await findMatchingDonors(requestId);

  const previousRadius = req.search_radius_km;

  await supabaseAdmin
    .from("blood_requests")
    .update({
      escalation_level: newLevel,
      search_radius_km: previousRadius + 2,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  await insert("radius_expansions", {
    request_id: requestId,
    expansion_level: newLevel,
    previous_radius_km: previousRadius,
    new_radius_km: previousRadius + 2,
    new_donors_count: donors.length,
    was_auto: true,
  });

  return { newLevel, donorCount: donors.length };
}

export async function expireStaleRequest(requestId) {
  const { data: req } = await supabaseAdmin
    .from("blood_requests")
    .select("status, urgency, created_at")
    .eq("id", requestId)
    .single();

  if (!req || req.status !== "matching") return;

  const maxAgeMs = req.urgency === "critical" ? 15 * 60 * 1000
    : req.urgency === "urgent" ? 30 * 60 * 1000
    : 60 * 60 * 1000;

  const age = Date.now() - new Date(req.created_at).getTime();
  if (age >= maxAgeMs) {
    await supabaseAdmin
      .from("blood_requests")
      .update({ status: "cancelled", cancelled_reason: "Expired — no donors responded" })
      .eq("id", requestId);
  }
}