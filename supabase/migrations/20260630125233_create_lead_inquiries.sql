/*
# Create lead_inquiries table (single-tenant, no auth)

1. New Tables
- `lead_inquiries`
  - `id` (uuid, primary key)
  - `name` (text, not null) — prospect's full name
  - `email` (text, not null) — contact email
  - `company` (text, nullable) — prospect's company
  - `budget` (text, not null) — monthly ad budget range
  - `message` (text, nullable) — free-text details about their needs
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `lead_inquiries`.
- Allow anon + authenticated INSERT only (public can submit inquiries).
- No public SELECT/UPDATE/DELETE — inquiries are private to the business owner,
  readable via the Supabase dashboard / service role.

3. Notes
- Public lead-capture form on a personal-brand landing page with no sign-in,
  so only INSERT is exposed to the anon role. Reading inquiries is done through
  the Supabase dashboard with the service role key, not from the frontend.
*/

CREATE TABLE IF NOT EXISTS lead_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  budget text NOT NULL,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lead_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_lead_inquiries" ON lead_inquiries;
CREATE POLICY "anon_insert_lead_inquiries"
ON lead_inquiries FOR INSERT
TO anon, authenticated WITH CHECK (true);
