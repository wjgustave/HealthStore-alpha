-- Migration: 0003_create_org_profiles
-- Creates org_profiles table (org-shared Organisation Settings record)

CREATE TABLE IF NOT EXISTS org_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id),
  profile JSONB NOT NULL,
  updated_by_user_id UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_org_profiles_org ON org_profiles(organization_id);
