# Product Detail Page (PDP) Sections — Developer Plan

**Audience:** Development team  
**Status:** Implemented (March 2026)  
**Source:** UCD analysis and PO requirements from healthstore-m themes

---

## 1. Overview

The product detail page (`/apps/[slug]`) was restructured to align with seven section themes requested by the Product Owner. This document describes the implementation, data mapping, and conventions for future changes.

---

## 2. Section Order (Main Column)

The main column renders sections in this order:

| Order | Section | Component / Location |
|-------|---------|----------------------|
| 1 | Why it matters locally | Inline in `page.tsx` |
| 2 | Context of use | Inline `ContextOfUseGrid` |
| 3 | Scale and maturity | `ScaleAndMaturitySection` |
| 4 | What it takes locally | `WhatItTakesLocallySection` |
| 5 | Expected impact and case studies | `ImpactAndCaseStudiesSection` |
| 6 | Clinical evidence | Inline `EvidenceCard` loop |
| 7 | NICE guidance | Inline |
| 8 | Data quality flags | Inline (conditional) |
| 9 | Demo access | `DemoAccessSection` |
| 10 | NHS and care system integrations | `CollapsibleSection` + `TechnicalIntegrationTable` |
| 11 | Financial and commercial | `IndicativeFinancialGlance` + `CollapsibleInline` + `FinancialCommercialBody` |
| 12 | Related funding opportunities | `RelatedFundingSection` |
| 13 | Express interest | Inline CTA card (last) |

**Important:** "Why it matters locally" and "What it takes locally" are **separate** sections. Do not merge them.

---

## 3. Key Files

| File | Purpose |
|------|---------|
| `app/apps/[slug]/page.tsx` | Page layout, section order, hero, inline blocks |
| `components/AppDetailSections.tsx` | Reusable section components |
| `components/CollapsibleSection.tsx` | `CollapsibleSection`, `CollapsibleInline` (client) |
| `components/Badges.tsx` | `SectionHeader`, badges |
| `content/apps/*.json` | App content (see field mapping below) |

---

## 4. JSON Field Mapping

| Section | JSON fields |
|---------|-------------|
| **Why it matters** | `why_it_matters_locally`, `sustainability_highlight` |
| **Scale and maturity** | `maturity_level`, `evidence_strength`, `live_icbs`, `live_sites`, `patients_covered_note`, `deployments` |
| **What it takes locally** | `local_wraparound`, `local_wraparound_detail`, `onboarding_model`, `onboarding_detail`, `training_required`, `training_note`, `supplier_wrap`, `service_wrap_included`, `service_wrap_note`, `monitoring_note`, `escalation_note`, `operating_hours_caveat`, `implementation_prerequisites` |
| **Expected impact** | `expected_benefit_note`, `case_studies` |
| **Demo access** | `demo_notes`, `demo_variants` |
| **NHS integrations** | `technical_integrations` (FHIR, EMIS, etc.); hero uses `nhs_app_integration`, `nhs_login_integration`, `nhs_notify_integration` |
| **Financial** | `indicative_price_text`, `pricing_confidence`, `procurement_notes`, `contract_note`, `nhse_125k_note`, `tariff_considerations`, `roi_note`, `monitoring_model`, `minimum_conditions_for_success` |
| **Related funding** | `linked_funding_ids` or `funding_ids` |
| **Express interest** | `supplier_contact_name`, `supplier_name` (CTA copy only; no contact email on page) |

---

## 5. Behaviour Rules

- **Case studies:** Always render when `case_studies` has entries. Do not gate on `clinical_evidence_detailed`.
- **Demo section:** Show when `demo_variants?.length > 0` or `demo_notes` is present.
- **NHS integrations table:** Omit NHS App row (hero badges cover it). Table shows FHIR, EMIS, population health dashboard, device integration, languages, data hosting.
- **Related funding:** Always show section. If no linked IDs, render empty-state copy with link to `/funding`.
- **Indicative cost:** Always visible at top of financial block (not inside collapsible).
- **Express interest:** Main column only, last section. No sidebar contact block.

---

## 6. Sidebar Contents (Current)

- Quick facts (device class, supervision model, target patients)
- Assurance (DTAC, DCB0129, GDPR, ISO 27001, Cyber Essentials, DSP Toolkit)
- Product tiers (if present)
- Source note

---

## 7. Collapsible Usage

- **NHS integrations:** `CollapsibleSection` with `defaultOpen={false}`.
- **Procurement/tariff detail:** `CollapsibleInline` with `defaultOpen={true}` inside financial section.

---

## 8. Adding a New App

See `ADDING_APPS.md` for the full JSON template and field mapping. Ensure new apps include:

- `demo_notes` and/or `demo_variants` for Demo access
- `linked_funding_ids` for Related funding
- `pricing_confidence` for indicative cost (optional: `not_stated`, `supplier_reported`, `confirmed`)

---

## 9. QA Checklist

When changing PDP logic, verify:

- [ ] Apps with full `clinical_evidence_detailed` still show `case_studies` in Impact section
- [ ] Apps with no `technical_integrations` do not break
- [ ] Apps with empty `linked_funding_ids` show funding empty state
- [ ] `demo_notes` renders when present (even without `demo_variants`)
- [ ] Express interest button opens modal (`data-express-interest`)
- [ ] Clinical evidence section has `id="clinical-evidence"` for anchor links

---

## 10. Future Enhancements (Optional)

- In-page anchors / sticky subnav for long pages
- Back-to-top button (if not already present)
- Typed `App` interface instead of `any` in page components
