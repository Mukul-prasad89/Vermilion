import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";
import { supabaseAdmin } from "../config/supabase.js";
import { ForbiddenError } from "../utils/errors.js";

export const getVerificationQueue = asyncHandler(async (req, res) => {
  const { data } = await supabaseAdmin
    .from("verification_documents")
    .select("*, profiles(full_name, email)")
    .eq("status", "pending")
    .order("submitted_at", { ascending: true });
  success(res, data || []);
});

export const verifyDocument = asyncHandler(async (req, res) => {
  const { docId } = req.params;
  const { status, notes } = req.body;
  if (!["verified", "rejected"].includes(status)) {
    return res.status(400).json({ status: "error", code: "VALIDATION_ERROR", message: "status must be verified or rejected" });
  }
  const { data: doc } = await supabaseAdmin
    .from("verification_documents")
    .update({
      status,
      notes: notes || null,
      verified_by: req.user.profileId,
      verified_at: new Date().toISOString(),
    })
    .eq("id", docId)
    .select("profile_id")
    .single();

  if (status === "verified") {
    const { data: docs } = await supabaseAdmin
      .from("verification_documents")
      .select("status")
      .eq("profile_id", doc.profile_id)
      .eq("status", "verified");

    if (docs && docs.length >= 1) {
      await supabaseAdmin.from("profiles").update({ is_verified: true, verified_at: new Date().toISOString() }).eq("id", doc.profile_id);
    }
  }
  success(res, doc);
});

export const getPlatformStats = asyncHandler(async (req, res) => {
  const { count: totalDonors } = await supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }).eq("is_donor_registered", true);
  const { count: activeDonors } = await supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }).eq("is_available", true);
  const { count: totalHospitals } = await supabaseAdmin.from("hospitals").select("*", { count: "exact", head: true });
  const { count: requestsToday } = await supabaseAdmin.from("blood_requests").select("*", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  const { count: totalCompleted } = await supabaseAdmin.from("donation_history").select("*", { count: "exact", head: true }).eq("status", "completed");
  success(res, { total_donors: totalDonors || 0, active_donors: activeDonors || 0, total_hospitals: totalHospitals || 0, requests_today: requestsToday || 0, total_completed_donations: totalCompleted || 0 });
});

export const syncVerificationStatus = asyncHandler(async (req, res) => {
  const { profileId } = req.params;
  const { data: docs } = await supabaseAdmin.from("verification_documents").select("status").eq("profile_id", profileId);
  const allVerified = docs?.every((d) => d.status === "verified");
  await supabaseAdmin.from("profiles").update({ is_verified: allVerified, verified_at: allVerified ? new Date().toISOString() : null }).eq("id", profileId);
  success(res, { profile_id: profileId, is_verified: allVerified });
});