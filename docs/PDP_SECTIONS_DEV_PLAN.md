# Product Detail Page (PDP) Sections — Developer Plan

**Audience:** Development team  
**Status:** Implemented (March 2026)  
**Source:** UCD analysis and PO requirements from healthstore-m themes

---

## 1. Overview

The product detail page (`/apps/[slug]`) aligns with section themes requested by the Product Owner. From **Why it matters locally** through **Related funding opportunities**, each main-column block is its own **card** (`ProductPageExpander`): `bg-white rounded-xl border` with **`space-y-3`** between sections (half the previous `space-y-6` rhythm). The header is a full-width control: title (and optional description), **chevron** that rotates when open. **Hero, alerts, sidebar, and Express interest** stay outside this stack. **Default:** all sections start **collapsed** except **Commercial model and cost** (`defaultOpen`). **`#clinical-evidence`:** that section uses `id="clinical-evidence"`; `ProductPageExpander` opens it on load or `hashchange` when the hash matches. `CollapsibleSection` is **not** used on the PDP (component remains for `CollapsibleInline` or other pages).

---

## 2. Section Order (Main Column)

The main column renders sections in this order:

| Order | Section | Component / Location |
|-------|---------|----------------------|
| 1 | Why it matters locally | `ProductPageExpander` + inline body in `page.tsx` |
| 2 | Context of use | `ProductPageExpander` + `ContextOfUseGrid` (conditional) |
| 3 | Scale and maturity | `ProductPageExpander` + `ScaleAndMaturitySection` |
| 4 | What it takes locally | `ProductPageExpander` + `WhatItTakesLocallySection` (conditional; `hasWhatItTakesContent`) |
| 5 | Expected impact and case studies | `ProductPageExpander` + `ImpactAndCaseStudiesSection` (conditional; `shouldShowImpactSection`) |
| 6 | Clinical evidence | `ProductPageExpander` (`id="clinical-evidence"`) + `EvidenceCard` loops in `page.tsx` |
| 7 | NICE guidance | `ProductPageExpander` + inline list |
| 8 | Data quality flags | `ProductPageExpander` + inline (conditional) |
| 9 | Demo access | `ProductPageExpander` + `DemoAccessSection` (conditional; `shouldShowDemoAccess`) |
| 10 | NHS and care system integrations | `ProductPageExpander` + `TechnicalIntegrationTable` (conditional) |
| 11 | Commercial model and cost | `ProductPageExpander` (`defaultOpen`) + `CommercialModelAndCostSection` |
| 12 | Indicative financial context | `ProductPageExpander` + `IndicativeFinancialContextSection` (body only; no nested collapsible) |
| 13 | Related funding opportunities | `ProductPageExpander` + `RelatedFundingSection` |
| 14 | Express interest | Inline CTA card below the section stack (last in main column) |

**Important:** "Why it matters locally" and "What it takes locally" are **separate** sections. Do not merge them.

---

## 3. Key Files

| File | Purpose |
|------|---------|
| `app/apps/[slug]/page.tsx` | Page layout, section order, hero, expander wiring |
| `app/apps/[slug]/AppDetailClient.tsx` | Express interest modal |
| `components/AppDetailSections.tsx` | Reusable section bodies (no outer card chrome on PDP) |
| `components/ProductPageExpander.tsx` | `ProductPageExpander` (client; chevron; `#clinical-evidence` hash) |
| `app/globals.css` | Design tokens (`:root`); `.hs-surface-card-sm` / `.hs-surface-card` on PDP shell cards; expanders toggle sm (closed) vs md (open); `.app-card` default shadow + hover lift |
| `components/CollapsibleSection.tsx` | `CollapsibleSection`, `CollapsibleInline` (not used on PDP) |
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
| **Commercial model and cost** | `pricing_model` (see `content/common/enums.json` `pricing_labels`), `national_price_available`, `indicative_price_text`, `pricing_confidence` (muted subline under indicative price), `service_wrap_included`, `service_wrap_description` or `service_wrap_note`, `procurement_notes` or `contract_note`, optional `nhse_125k_note`, optional `monitoring_model`, `free_offer_flag` (warning callout when true) |
| **Indicative financial context** | `expected_benefit_note`, `tariff_considerations`, `provider_income_note`, `roi_note`, optional `minimum_conditions_for_success`; fixed disclaimer copy in component |
| **Related funding** | `linked_funding_ids` or `funding_ids` |
| **Express interest** | `supplier_contact_name`, `supplier_name` (CTA copy only; no contact email on page) |

---

## 5. Behaviour Rules

- **Case studies:** Always render when `case_studies` has entries. Do not gate on `clinical_evidence_detailed`.
- **Demo section:** Show when `demo_variants?.length > 0` or `demo_notes` is present.
- **NHS integrations table:** Omit NHS App row (hero badges cover it). Table shows FHIR, EMIS, population health dashboard, device integration, languages, data hosting.
- **Related funding:** Always show an expander row. If no linked IDs, body renders empty-state copy with link to `/funding`.
- **Commercial / financial:** Indicative price and procurement sit in **Commercial model and cost** (expander row, **open by default**). Tariff, ROI and related rows sit in **Indicative financial context** (separate expander row, **collapsed** by default).
- **Express interest:** Main column only, **below** the section stack. No sidebar contact block.

---

## 6. Sidebar Contents (Current)

- Quick facts (device class, supervision model, target patients)
- Assurance (DTAC, DCB0129, GDPR, ISO 27001, Cyber Essentials, DSP Toolkit)
- Product tiers (if present)
- Source note

---

## 7. Expander behaviour (main column)

- **Layout:** Separate bordered cards with **`space-y-3`** between them (not one shared group container).
- **Closed state:** Full-width header `<button>` with `p-6`, title at `var(--text-section-alt)`, optional description, **ChevronDown** (muted) rotating **180°** when open.
- **Open state:** `border-t` then panel body with `pt-4` (healthstore-m pattern).
- **Defaults:** All sections `defaultOpen={false}` except **Commercial model and cost** (`defaultOpen` / `true`).
- **Deep link:** `#clinical-evidence` opens that section (client `hashchange` + initial check); `id="clinical-evidence"` is on the outer `<section>`.

---

## 8. Adding a New App

See `ADDING_APPS.md` for the full JSON template and field mapping. Ensure new apps include:

- `demo_notes` and/or `demo_variants` for Demo access
- `linked_funding_ids` for Related funding
- `pricing_confidence` for indicative price subline (see `content/common/enums.json` `confidence_labels`)
- Prefer `service_wrap_description`; `service_wrap_note` is merged in UI if description is absent (`lib/data.ts` comment on `App` type)

---

## 9. QA Checklist

When changing PDP logic, verify:

- [ ] Apps with full `clinical_evidence_detailed` still show `case_studies` in Impact section
- [ ] Apps with no `technical_integrations` do not break (integrations row omitted)
- [ ] Apps with empty `linked_funding_ids` show funding empty state inside expander
- [ ] `demo_notes` renders when present (even without `demo_variants`)
- [ ] Express interest button opens modal (`data-express-interest`); CTA remains outside the collapsible section stack
- [ ] Clinical evidence row has `id="clinical-evidence"`; `#clinical-evidence` opens the row
- [ ] Commercial model and cost is **open** on first load; other sections **closed**; keyboard toggles via header button; chevron reflects state
- [ ] Indicative financial context is a single expander (no nested collapsible); `free_offer_flag` callout still shows inside Commercial body when true

---

## 10. Future Enhancements (Optional)

- In-page anchors / sticky subnav for long pages
- Back-to-top button (if not already present)
- Typed `App` interface instead of `any` in page components
