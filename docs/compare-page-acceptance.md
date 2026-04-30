# Compare page — acceptance criteria & dev handoff

## Overview

The `/compare` route implements a **hybrid layout**:

1. **Summary strip** — Logo, app name, supplier, and condition tags per selected app.
2. **Grouped comparison matrix** — Three sections with sticky row-label column on wide screens; sticky header row with app names.
3. **Evidence & procurement footer** — Short **first-block clinical evidence excerpt** per app (from `evidence_summary`) plus links to the full PDP for evidence, DTAC, and pricing caveats.

Constraints unchanged: **up to four apps**, **same condition area** only (`CompareBasketProvider` + `sanitizeIdsForCompare`).

---

## Row catalogue → data mapping

| Row label | Primary source | Fallback |
|-----------|----------------|----------|
| Conditions | `condition_tags` via `formatConditionLabels()` | `Not stated` |
| Therapeutic purpose | `context_of_use.therapeutic_purpose` | `one_line_value_proposition` |
| Clinical pathways | `context_of_use.pathways` (joined) | `pathway_tags` (joined, hyphen→space) |
| Care settings | `context_of_use.care_settings` (joined) | `Not stated` |
| Clinical evidence (summary) | First block of `evidence_summary` (split on blank lines), max ~320 chars | `Not stated` |
| Expected benefit | `expected_benefit_note` (truncated) | `Not stated` |
| Deployment maturity | `maturity_level` → `MaturityBadge` | Badge raw key |
| NICE guidance status | `nice_guidance_refs` (+ dates); append `context_of_use.nice_scope` | `Not stated` |
| DTAC status | `dtac_status` → `DtacBadge` | — |
| Onboarding model | `onboarding_model` (title case) + truncated `onboarding_detail` | `Not stated` |
| Live ICB sites | `live_icbs` + abbreviated `live_sites` | Partial if only one present |
| Service wrap | `service_wrap_included` | Yes / No / amber `Not stated` |
| Integrations | `technical_integrations` summary (FHIR, EMIS, devices, dashboard, NHS App, hosting) max ~200 chars | `Not stated` |
| Pricing model | `pricing_model` | `Not stated` |
| Indicative price | First sentence of `indicative_price_text` max ~120 chars | `Not stated` |

Helpers live in [`lib/compareFieldFormat.ts`](../lib/compareFieldFormat.ts). Empty prose uses the shared token **`Not stated`**.

---

## Functional acceptance criteria

- [ ] Empty basket shows empty state with CTA to `/apps/condition-catalogue`.
- [ ] With 1–4 apps selected, summary strip shows each app’s logo, name, supplier, and condition tag pills.
- [ ] Comparison table lists **all rows** above under the correct **section headers**: Clinical context; Adoption & assurance; Commercial & delivery.
- [ ] Horizontal scroll appears below `min-width` breakpoint without clipping sticky first column.
- [ ] Sticky header row shows app name + supplier under each column (desktop).
- [ ] Each row renders per-cell content without throwing when optional JSON fields are missing (`context_of_use`, `technical_integrations`, etc.).
- [ ] “Evidence and procurement detail” section shows a **truncated clinical evidence excerpt** per selected app and **View full evidence on product page** links.

---

## Accessibility & content

- [ ] `<caption>` describes the table purpose (screen readers).
- [ ] Section bands use semantic `<section>` with `aria-labelledby` for the evidence footer.
- [ ] Remove buttons retain `aria-label` including app name.

---

## QA smoke matrix

Test with at least:

- **Two COPD apps** (e.g. myCOPD + Luscii) — pathways, integrations, live ICB fields populate.
- **One app** — single column layout; summary grid still readable.
- **Max four apps** — horizontal scroll; sticky column remains usable.

---

## Content backlog (catalogue)

Apps without `context_of_use`, `technical_integrations`, or `evidence_summary` will show **`Not stated`** or shorter excerpts until editors fill JSON fields.


| File | Role |
|------|------|
| [`app/compare/CompareClient.tsx`](../app/compare/CompareClient.tsx) | UI structure, grouped rows, summary + footer |
| [`lib/compareFieldFormat.ts`](../lib/compareFieldFormat.ts) | Formatting, truncation, fallbacks |
