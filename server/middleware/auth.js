import { AuthError } from "../utils/errors.js";
import { supabaseAdmin } from "../config/supabase.js";

export default async function auth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next(new AuthError("No token provided"));

  const token = header.slice(7);

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user) return next(new AuthError("Invalid token"));

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, role, is_donor_registered, full_name")
      .eq("auth_id", data.user.id)
      .single();

    req.user = {
      authId: data.user.id,
      email: data.user.email,
      phone: data.user.phone,
      profileId: profile?.id || null,
      role: profile?.role || "user",
      isDonor: profile?.is_donor_registered || false,
      fullName: profile?.full_name || null,
    };

    next();
  } catch (err) {
    next(new AuthError("Token verification failed"));
  }
}