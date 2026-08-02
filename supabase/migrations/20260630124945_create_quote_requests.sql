/*
# Create quote_requests table (single-tenant, no auth)

1. New Tables
- `quote_requests`
  - `id` (uuid, primary key)
  - `name` (text, not null) — customer's full name
  - `phone` (text, not null) — contact phone
  - `email` (text, nullable) — optional contact email
  - `suburb` (text, nullable) — customer's suburb
  - `service` (text, not null) — requested service type
  - `message` (text, nullable) — free-text details
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `quote_requests`.
- Allow anon + authenticated INSERT only (public can submit quote requests).
- No public SELECT/UPDATE/DELETE — submissions are private to the business owner
  (who can read them via the Supabase dashboard / service role).

3. Notes
- This is a public lead-capture form on a marketing landing page with no sign-in,
  so only INSERT is exposed to the anon role. Reading submissions is done through
  the Supabase dashboard with the service role key, not from the frontend.
*/

CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  suburb text,
  service text NOT NULL,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_quote_requests" ON quote_requests;
CREATE POLICY "anon_insert_quote_requests"
ON quote_requests FOR INSERT
TO anon, authenticated WITH CHECK (true);
