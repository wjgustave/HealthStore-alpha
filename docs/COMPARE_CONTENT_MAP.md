# Comparison tool content map

Status: implementation reference for the NHS-table comparison page. Companion to [PDP_CONTENT_MAP.md](PDP_CONTENT_MAP.md).

The compare page renders **six captioned NHS responsive tables** (`nhsuk-table-responsive`), one per narrative section, with the selected products as columns and comparison dimensions as `scope="row"` headers. Section order mirrors the PDP narrative spine: what it is → evidence → NHS experience → running it locally → assurance → cost.

- Section/row definitions and all getters: `lib/compareNarrativeContent.ts` (`COMPARE_TABLE_SECTIONS`)
- Table renderer: `components/compare/CompareNarrativeTables.tsx`
- Page shell (intro, selected count, empty state): `app/compare/CompareClient.tsx`

## Sourcing rule: narrative first, catalogue fallback

Every cell resolves in two steps:

1. **Curated narrative** — if `getProductNarrative(app.slug)` returns a `ProductNarrative` (currently Luscii, myCOPD, myHeart, Joint Academy), the row getter reads the curated field (often condensed to its first sentence — editorial truncation happens in the getter, not CSS).
2. **Catalogue JSON fallback** — otherwise the getter falls back to the formatters in `lib/compareFieldFormat.ts`, so non-narrative products keep working.

### Empty-state token

Cells never render empty. Missing data renders **`Check with supplier`** (`CHECK_WITH_SUPPLIER` in `lib/data.ts`, re-exported as `NOT_STATED`) in `nhsuk-u-secondary-text-colour`.

### Statuses as NHS tags

Assurance pack items, evidence strength, deployment maturity and service wrap render as `nhsuk-tag` colour tags inside cells — the same presentation as the PDP assurance pack, so the two surfaces read as one system.

## Table inventory

### 1. What it is and who it's for (`what-it-is`)

| Row key | Label | Narrative source | Catalogue fallback |
|---------|-------|------------------|--------------------|
| `product_type` | Product type | `decision_summary.intervention_class` | `supervisionLabels[supervision_model]` |
| `what_it_does` | What it does | `decision_summary.one_line_proposition` | `one_line_value_proposition` |
| `problem` | Problem it addresses | first sentence of `decision_summary.pathway_problem` | first sentence of `target_problem_statement` |
| `conditions` | Conditions | — | `condition_tags` via `formatConditionLabels` |

### 2. Evidence and expected impact (`evidence-impact`)

| Row key | Label | Narrative source | Catalogue fallback |
|---------|-------|------------------|--------------------|
| `nice` | NICE guidance | `assurance_domains` → Clinical evidence summary (e.g. "NICE HTG736 EVA recommendations") | `getNiceGuidanceStatus` |
| `headline_outcome` | Headline outcome | best `evidence_claims` entry (evaluated outcome with a metric, else first): claim + strength lead + year | `getClinicalEvidenceExcerpt` (200 chars) |
| `evidence_strength` | Evidence strength | — | `evidence_strength` as NHS tag (strong=green, moderate=blue, else grey) |
| `economic_value` | Expected economic value | first sentence of `commissioner_economics.headline` | `getExpectedBenefit` |

### 3. NHS experience (`nhs-experience`)

| Row key | Label | Narrative source | Catalogue fallback |
|---------|-------|------------------|--------------------|
| `where_live` | Where it's live | — | `getWhereLiveCompare` (`deployment_register`) |
| `scale` | Scale in the NHS | top 2 `engagement_signals` ("value — metric") | `patients_covered_note` |
| `maturity` | Deployment maturity | — | `maturity_level` as NHS tag (scaled=green, multi_site_live=blue, limited_live=orange) |

### 4. What it takes to run locally (`run-locally`)

| Row key | Label | Narrative source | Catalogue fallback |
|---------|-------|------------------|--------------------|
| `clinical_model` | Clinical model | first sentence of `implementation.human_wrapper` | `getOnboardingCompareLine` |
| `workforce` | Workforce | first sentence of `implementation.workforce` | first sentence of `local_wraparound_detail` |
| `time_to_deploy` | Time to deploy | first sentence of `implementation.timescale` | Check with supplier |
| `service_wrap` | Service wrap included | — | `service_wrap_included` as Yes (green) / No (grey) tag |

### 5. Assurance pack (`assurance-pack`)

The five standardised pack items as rows — same names, order and status vocabulary as the PDP passport (single source of truth: `lib/content/assuranceDomains.ts`):

1. Clinical safety
2. Clinical evidence
3. Information governance and data protection
4. Interoperability
5. Commercial readiness pack

Per app, domains resolve from `narrative.assurance_domains` when present, else `deriveAssuranceDomains(app)`. Status tags: `verified_current` → **Available** (green), `verified_review_due` → **Review due** (yellow), `declared_pending` → **Incomplete** (blue), `incomplete` → **Incomplete** (red), `expired` → **Expired** (red), `not_applicable` → **Not applicable** (grey).

### 6. Cost and commercial route (`cost-commercial`)

| Row key | Label | Narrative source | Catalogue fallback |
|---------|-------|------------------|--------------------|
| `indicative_cost` | Indicative cost | `commercial_readiness.price_summary` | `getIndicativePriceShort` |
| `commercial_model` | Commercial model | `commercial_readiness.proposition_type` | `getPricingModelDisplay` |
| `procurement_route` | Procurement route | `commercial_readiness.route_status` | Check with supplier |
| `funding_levers` | Funding levers | top 3 `commissioner_economics.funding_levers` labels | `getFundingEligibility` |
| `product_profile` | Product profile | — | link to `/apps/{slug}` |

## Responsive behaviour

`nhsuk-table-responsive` (compiled in `app/styles/nhsuk-theme.generated.css`) stacks each row into a labelled block under 768px; per-cell `nhsuk-table-responsive__heading` spans repeat the product name. Overrides in `app/globals.css` (`.hs-compare-tables`) keep long prose cells top-aligned and left-aligned on mobile (the NHS default right-aligns values, which suits short numeric data only), fix the table layout, and narrow the dimension column.

## What was removed (July 2026 redesign)

- The bespoke CSS-grid "decision workspace" (`CompareWorkspaceView`, `compareRowRenderers`, ~180 lines of `hs-compare-workspace*` CSS) — replaced by semantic tables.
- Persona lenses and "differences only" filtering (`CompareLensControl`, `lib/compareConfig.ts`) — already hidden from the UI; deleted, not rebuilt. Git history preserves them.
- Collapsible row groups — the re-edited content is ~25 purposeful rows across 6 flat captioned tables, so no open/close state is needed.
