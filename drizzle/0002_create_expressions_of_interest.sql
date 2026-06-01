-- Migration: 0002_create_expressions_of_interest
-- Creates org_expressions_of_interest table (org-shared EOI audit trail)

CREATE TABLE IF NOT EXISTS org_expressions_of_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  app_id TEXT NOT NULL,
  app_name TEXT NOT NULL,
  submitted_by_user_id UUID REFERENCES users(id),
  submitted_by_name TEXT,
  submitted_by_email TEXT,
  organisation_name TEXT,
  role TEXT,
  phone TEXT,
  population_estimate TEXT,
  timeline TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_org_eoi_org ON org_expressions_of_interest(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_eoi_created ON org_expressions_of_interest(created_at);
