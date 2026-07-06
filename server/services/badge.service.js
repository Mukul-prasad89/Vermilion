import { supabaseAdmin } from "../config/supabase.js";
import { createAndPush } from "./notification.service.js";

export async function evaluateBadges(donorId) {
  const { data: stats } = await supabaseAdmin
    .from("profiles")
    .select("total_donations, avg_response_seconds")
    .eq("id", donorId)
    .single();

  if (!stats) return;

  const { data: badges } = await supabaseAdmin
    .from("badges")
    .select("*")
    .order("min_donations", { ascending: true });

  const { data: earned } = await supabaseAdmin
    .from("donor_badges")
    .select("badge_id")
    .eq("donor_id", donorId);

  const earnedIds = new Set(earned?.map((e) => e.badge_id) || []);

  const newBadges = badges?.filter(
    (b) => !earnedIds.has(b.id) && stats.total_donations >= b.min_donations
  ) || [];

  if (newBadges.length > 0) {
    const inserts = newBadges.map((b) => ({ donor_id: donorId, badge_id: b.id }));
    await supabaseAdmin.from("donor_badges").insert(inserts);

    const highestNew = newBadges[newBadges.length - 1];
    const level = highestNew.name;

    await supabaseAdmin
      .from("profiles")
      .update({ donor_badge_level: level })
      .eq("id", donorId);

    await createAndPush(
      donorId, "badge",
      `⭐ ${level.charAt(0).toUpperCase() + level.slice(1)} Donor Badge Earned!`,
      `You've reached ${level} level with ${stats.total_donations} donations.`,
      { actionUrl: "/profile/badges", badgeLevel: level }
    );
  }

  return newBadges;
}