CREATE TABLE IF NOT EXISTS commissioning_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE,
  organization_id UUID REFERENCES organizations(id),
  submitted_by_email TEXT NOT NULL,
  submitted_by_name TEXT NOT NULL,
  role TEXT,
  organisation_name TEXT,
  product_slug TEXT,
  product_name TEXT,
  context_snapshot JSONB NOT NULL,
  support_requested TEXT[] NOT NULL,
  decision_window TEXT,
  additional_context TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  next_action TEXT NOT NULL DEFAULT 'HealthStore will confirm your request within 5 working days',
  owner_queue TEXT DEFAULT 'Commissioning support triage',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  submitted_by_email TEXT NOT NULL,
  title TEXT NOT NULL,
  product_slug TEXT,
  context_snapshot JSONB NOT NULL,
  scenario_id TEXT NOT NULL,
  model_version TEXT NOT NULL DEFAULT 'copd-v1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
