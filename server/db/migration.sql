-- VERMILION Database Schema
-- Run this in Supabase SQL Editor

-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

------------------------------------------------------------
-- PROFILES (core table — one per user)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id           UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role              TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'hospital')),
  full_name         TEXT NOT NULL,
  phone             TEXT,
  email             TEXT,
  city              TEXT,
  avatar_url        TEXT,
  blood_type        TEXT CHECK (blood_type IN (
                      'O-','O+','A-','A+','B-','B+','AB-','AB+','unknown'
                    )),
  is_donor_registered BOOLEAN DEFAULT false,
  is_available      BOOLEAN DEFAULT false,
  donor_badge_level TEXT DEFAULT 'bronze' CHECK (donor_badge_level IN (
                      'bronze','silver','gold','platinum','lifesaver'
                    )),
  total_donations   INTEGER DEFAULT 0,
  avg_response_seconds INTEGER,
  default_radius_km INTEGER DEFAULT 3,
  transport_mode    TEXT DEFAULT 'bike' CHECK (transport_mode IN ('walking','bike','car')),
  quiet_hours_start TIME,
  quiet_hours_end   TIME,
  last_donated_at   TIMESTAMPTZ,
  auto_unavailable_at TIMESTAMPTZ,
  is_verified       BOOLEAN DEFAULT false,
  verified_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_profiles_auth ON profiles(auth_id);
CREATE INDEX idx_profiles_blood_available ON profiles(blood_type, is_available)
  WHERE is_donor_registered = true AND is_available = true;
CREATE INDEX idx_profiles_city ON profiles(city);

------------------------------------------------------------
-- HOSPITALS (extension of profile for hospital accounts)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hospitals (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id        UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  license_no        TEXT,
  address           TEXT,
  lat               NUMERIC(10,7),
  lng               NUMERIC(10,7),
  type              TEXT CHECK (type IN (
                      'multi_specialty','trauma_center','blood_bank','clinic','other'
                    )),
  emergency_phone   TEXT,
  blood_bank_phone  TEXT,
  is_verified       BOOLEAN DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_hospitals_verified ON hospitals(is_verified)
  WHERE is_verified = true;
CREATE INDEX idx_hospitals_location ON hospitals USING gist (
  ST_SetSRID(ST_MakePoint(lng, lat), 4326)
);

------------------------------------------------------------
-- HOSPITAL STAFF (staff members linked to a hospital)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hospital_staff (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id       UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  profile_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  staff_role        TEXT NOT NULL DEFAULT 'staff' CHECK (staff_role IN (
                      'admin','physician','nurse','staff'
                    )),
  is_active         BOOLEAN DEFAULT true,
  joined_at         TIMESTAMPTZ DEFAULT now(),
  UNIQUE (hospital_id, profile_id)
);

CREATE INDEX idx_staff_hospital ON hospital_staff(hospital_id, is_active);

------------------------------------------------------------
-- BLOOD REQUESTS
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blood_requests (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id       UUID REFERENCES hospitals(id),
  raised_by         UUID NOT NULL REFERENCES profiles(id),
  blood_type        TEXT NOT NULL CHECK (blood_type IN (
                      'O-','O+','A-','A+','B-','B+','AB-','AB+'
                    )),
  units_needed      INTEGER NOT NULL DEFAULT 1 CHECK (units_needed BETWEEN 1 AND 20),
  urgency           TEXT NOT NULL DEFAULT 'standard' CHECK (urgency IN (
                      'standard','urgent','critical'
                    )),
  status            TEXT NOT NULL DEFAULT 'matching' CHECK (status IN (
                      'matching','en_route','fulfilled','cancelled','escalated'
                    )),
  for_whom          TEXT NOT NULL DEFAULT 'hospital' CHECK (for_whom IN (
                      'self','other','hospital'
                    )),
  patient_name      TEXT,
  patient_notes     TEXT,
  search_radius_km  INTEGER DEFAULT 5,
  escalation_level  INTEGER DEFAULT 0 CHECK (escalation_level BETWEEN 0 AND 3),
  lat               NUMERIC(10,7),
  lng               NUMERIC(10,7),
  idempotency_key   UUID UNIQUE,
  cancelled_reason  TEXT,
  fulfilled_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_requests_status ON blood_requests(status, created_at DESC);
CREATE INDEX idx_requests_blood ON blood_requests(blood_type, status)
  WHERE status IN ('matching','en_route');
CREATE INDEX idx_requests_hospital ON blood_requests(hospital_id, created_at DESC);
CREATE INDEX idx_requests_raised ON blood_requests(raised_by, created_at DESC);

------------------------------------------------------------
-- DONOR RESPONSES
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS donor_responses (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id        UUID NOT NULL REFERENCES blood_requests(id) ON DELETE CASCADE,
  donor_id          UUID NOT NULL REFERENCES profiles(id),
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
                      'pending','accepted','en_route','arrived','delivered','rejected','cancelled'
                    )),
  accepted_at       TIMESTAMPTZ,
  arrived_at        TIMESTAMPTZ,
  delivered_at      TIMESTAMPTZ,
  cancelled_at      TIMESTAMPTZ,
  rejection_reason  TEXT,
  created_at        TIMESTAMPTZ DEFAULT now(),
  UNIQUE (request_id, donor_id)
);

CREATE INDEX idx_responses_donor ON donor_responses(donor_id, created_at DESC);
CREATE INDEX idx_responses_request ON donor_responses(request_id, status);

------------------------------------------------------------
-- LIVE LOCATIONS
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS live_locations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lat               NUMERIC(10,7) NOT NULL,
  lng               NUMERIC(10,7) NOT NULL,
  accuracy          NUMERIC(8,2),
  speed             NUMERIC(6,2),
  heading           NUMERIC(5,2),
  is_sharing        BOOLEAN DEFAULT true,
  tracking_mode     TEXT DEFAULT 'normal' CHECK (tracking_mode IN ('normal','high_frequency')),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  UNIQUE (profile_id)
);

CREATE INDEX idx_locations_coords ON live_locations(lat, lng);
CREATE INDEX idx_locations_profile ON live_locations(profile_id);

------------------------------------------------------------
-- NOTIFICATIONS
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type              TEXT NOT NULL CHECK (type IN (
                      'emergency','status_update','badge','system','request_update'
                    )),
  title             TEXT NOT NULL,
  body              TEXT NOT NULL,
  action_url        TEXT,
  request_id        UUID REFERENCES blood_requests(id),
  is_read           BOOLEAN DEFAULT false,
  is_pushed         BOOLEAN DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notifs_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifs_unpushed ON notifications(is_pushed)
  WHERE is_pushed = false;

------------------------------------------------------------
-- DONATION HISTORY
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS donation_history (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id          UUID NOT NULL REFERENCES profiles(id),
  request_id        UUID REFERENCES blood_requests(id),
  hospital_id       UUID REFERENCES hospitals(id),
  blood_type        TEXT NOT NULL,
  units_donated     INTEGER NOT NULL DEFAULT 1,
  response_time_seconds INTEGER,
  distance_km       NUMERIC(6,2),
  status            TEXT NOT NULL DEFAULT 'completed' CHECK (status IN (
                      'completed','cancelled','backup'
                    )),
  donated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_donations_donor ON donation_history(donor_id, donated_at DESC);
CREATE INDEX idx_donations_hospital ON donation_history(hospital_id, donated_at DESC);

------------------------------------------------------------
-- BLOOD SEARCHES (search history before escalation)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blood_searches (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  searched_by       UUID NOT NULL REFERENCES profiles(id),
  blood_type        TEXT NOT NULL,
  units_needed      INTEGER DEFAULT 1,
  lat               NUMERIC(10,7) NOT NULL,
  lng               NUMERIC(10,7) NOT NULL,
  search_radius_km  INTEGER DEFAULT 5,
  urgency           TEXT DEFAULT 'standard' CHECK (urgency IN (
                      'standard','urgent','critical'
                    )),
  for_whom          TEXT NOT NULL DEFAULT 'self' CHECK (for_whom IN (
                      'self','other','hospital'
                    )),
  hospital_id       UUID REFERENCES hospitals(id),
  patient_name      TEXT,
  escalated_to      UUID REFERENCES blood_requests(id),
  results_count     INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_searches_user ON blood_searches(searched_by, created_at DESC);

------------------------------------------------------------
-- RADIUS EXPANSIONS (escalation audit)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS radius_expansions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id        UUID NOT NULL REFERENCES blood_requests(id) ON DELETE CASCADE,
  expansion_level   INTEGER NOT NULL CHECK (expansion_level BETWEEN 1 AND 3),
  previous_radius_km INTEGER NOT NULL,
  new_radius_km     INTEGER NOT NULL,
  new_donors_count  INTEGER NOT NULL DEFAULT 0,
  was_auto          BOOLEAN DEFAULT true,
  triggered_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_expansions_request ON radius_expansions(request_id);

------------------------------------------------------------
-- VERIFICATION DOCUMENTS
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS verification_documents (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  doc_type          TEXT NOT NULL CHECK (doc_type IN (
                      'identity','blood_type_report','medical_clearance','license','address'
                    )),
  file_url          TEXT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
                      'pending','verified','rejected'
                    )),
  verified_by       UUID REFERENCES profiles(id),
  notes             TEXT,
  submitted_at      TIMESTAMPTZ DEFAULT now(),
  verified_at       TIMESTAMPTZ
);

CREATE INDEX idx_verification_status ON verification_documents(status);

------------------------------------------------------------
-- DEVICE TOKENS (FCM push)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS device_tokens (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token             TEXT NOT NULL,
  platform          TEXT NOT NULL CHECK (platform IN ('ios','android','web')),
  is_active         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  UNIQUE (token)
);

CREATE INDEX idx_tokens_user ON device_tokens(user_id, is_active)
  WHERE is_active = true;

------------------------------------------------------------
-- LOCATION ACCESS LOGS (privacy audit)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS location_access_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id          UUID NOT NULL REFERENCES profiles(id),
  accessed_by       UUID NOT NULL REFERENCES profiles(id),
  request_id        UUID REFERENCES blood_requests(id),
  access_type       TEXT NOT NULL CHECK (access_type IN ('tracking','nearby_view')),
  precision         TEXT NOT NULL CHECK (precision IN ('exact','degraded')),
  accessed_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_access_donor ON location_access_logs(donor_id, accessed_at DESC);

------------------------------------------------------------
-- BADGES (gamification levels)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS badges (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT UNIQUE NOT NULL,
  min_donations     INTEGER NOT NULL DEFAULT 0,
  min_avg_response_seconds INTEGER,
  icon_url          TEXT,
  description       TEXT
);

INSERT INTO badges (name, min_donations, description) VALUES
  ('bronze',    0, 'First donation — welcome to the network'),
  ('silver',    5, 'Reliable donor — 5+ donations'),
  ('gold',      10, 'Experienced lifesaver — 10+ donations'),
  ('platinum',  20, 'Elite responder — 20+ donations'),
  ('lifesaver', 40, 'Legendary — 40+ donations')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS donor_badges (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id          UUID NOT NULL REFERENCES badges(id),
  earned_at         TIMESTAMPTZ DEFAULT now(),
  UNIQUE (donor_id, badge_id)
);

------------------------------------------------------------
-- PROXY REQUESTS (for hospital confirmation)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS proxy_requests (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id        UUID NOT NULL REFERENCES blood_requests(id) ON DELETE CASCADE,
  hospital_id       UUID NOT NULL REFERENCES hospitals(id),
  raised_by         UUID NOT NULL REFERENCES profiles(id),
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
                      'pending','confirmed','rejected','auto_confirmed'
                    )),
  confirmed_at      TIMESTAMPTZ,
  rejected_at       TIMESTAMPTZ,
  auto_confirmed_at TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_proxy_hospital ON proxy_requests(hospital_id, status);

------------------------------------------------------------
-- Auto-profile creation trigger (on auth.users insert)
------------------------------------------------------------
CREATE OR REPLACE FUNCTION create_profile_on_signup()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (auth_id, role, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'user'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_on_signup();

------------------------------------------------------------
-- Increment donation count (used by markFulfilled controller)
------------------------------------------------------------
CREATE OR REPLACE FUNCTION increment_donations(donor_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET
    total_donations = total_donations + 1,
    last_donated_at = now()
  WHERE id = donor_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;