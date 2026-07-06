import { supabaseAdmin } from "../config/supabase.js";
import { NotFoundError } from "../utils/errors.js";

export async function getProfileByAuthId(authId, columns = "id, role, is_donor_registered, full_name, blood_type, is_available") {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select(columns)
    .eq("auth_id", authId)
    .single();

  if (error || !data) throw new NotFoundError("Profile not found");
  return data;
}

export async function getProfileById(id) {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) throw new NotFoundError("Profile not found");
  return data;
}

export async function updateProfile(id, fields) {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getHospitalByProfileId(profileId) {
  const { data, error } = await supabaseAdmin
    .from("hospitals")
    .select("*")
    .eq("profile_id", profileId)
    .single();

  if (error || !data) throw new NotFoundError("Hospital not found");
  return data;
}

export async function getHospitalById(id) {
  const { data, error } = await supabaseAdmin
    .from("hospitals")
    .select("*, profiles(full_name)")
    .eq("id", id)
    .single();

  if (error || !data) throw new NotFoundError("Hospital not found");
  return data;
}

export async function getRequestById(requestId) {
  const { data, error } = await supabaseAdmin
    .from("blood_requests")
    .select("*, hospitals(name, address, lat, lng), profiles!raised_by(full_name)")
    .eq("id", requestId)
    .single();

  if (error || !data) throw new NotFoundError("Request not found");
  return data;
}

export async function insert(table, row) {
  const { data, error } = await supabaseAdmin.from(table).insert(row).select();

  if (error) throw error;
  return data?.[0] || data;
}

export async function update(table, id, fields) {
  const { data, error } = await supabaseAdmin
    .from(table)
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function query(table, queryFn) {
  const { data, error } = await queryFn();
  if (error) throw error;
  return data;
}