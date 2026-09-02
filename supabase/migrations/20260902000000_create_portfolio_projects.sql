CREATE TABLE IF NOT EXISTS portfolio_projects (
  id text PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  url text,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_portfolio_projects" ON portfolio_projects;
CREATE POLICY "public_read_portfolio_projects"
ON portfolio_projects FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_portfolio_projects" ON portfolio_projects;
CREATE POLICY "public_insert_portfolio_projects"
ON portfolio_projects FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_portfolio_projects" ON portfolio_projects;
CREATE POLICY "public_update_portfolio_projects"
ON portfolio_projects FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_portfolio_projects" ON portfolio_projects;
CREATE POLICY "public_delete_portfolio_projects"
ON portfolio_projects FOR DELETE
TO anon, authenticated USING (true);
