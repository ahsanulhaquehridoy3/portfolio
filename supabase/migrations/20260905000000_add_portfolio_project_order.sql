ALTER TABLE portfolio_projects
ADD COLUMN IF NOT EXISTS sort_order integer;

WITH ordered_projects AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC, id) - 1 AS position
  FROM portfolio_projects
)
UPDATE portfolio_projects
SET sort_order = ordered_projects.position
FROM ordered_projects
WHERE portfolio_projects.id = ordered_projects.id
  AND portfolio_projects.sort_order IS NULL;

ALTER TABLE portfolio_projects
ALTER COLUMN sort_order SET DEFAULT 0;

ALTER TABLE portfolio_projects
ALTER COLUMN sort_order SET NOT NULL;