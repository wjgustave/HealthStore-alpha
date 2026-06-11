# "Where it's live" redesign — UCD artefacts & rationale

Status: design + build record. This document is the user-centred-design rationale for replacing the PDP "Live sites" content with a structured **Deployment register** table. It is the reference artefact for why the change was made, what evidence drove it, the data model, the interaction design, and the acceptance criteria. Companions: [PDP_CONTENT_MAP.md](PDP_CONTENT_MAP.md), [PDP_RESTRUCTURE_PLAN.md](PDP_RESTRUCTURE_PLAN.md), [ADDING_APPS.md](../ADDING_APPS.md).

## 1. Problem statement

> "Commissioners want to know more about where a DTX is live."

The current PDP represents deployment as a flat **Live sites** list (`named_sites[]` = `{ name, status }`) plus an optional **Deployment footprint** block. This answers "which organisations?" but not the questions commissioners actually ask when judging whether a deployment is relevant and trustworthy:

- In **which ICB / place** is it live (is it near me / like me)?
- In **which care setting and tier** (primary vs secondary vs community) — does it match my pathway?
- **How is it delivered** (home, hub, clinic)?
- Is it **actually commissioned and currently live**, or a pilot, a research/evaluation project, historic/de-procured, or an unverifiable vendor claim?
- How **confident** can I be in this row?

The source data that motivated the change — the *HealthStore DTx Deployment Register* (Luscii, myCOPD, myHeart) — carries all of these dimensions. The flat list cannot express them, and crucially cannot distinguish "ever procured" from "currently live", which the register explicitly calls out as a live commissioning risk (BNSSG de-procured while licences persist).

## 2. Users & needs (from persona cards)

Prioritised per the project brief: Commissioner, Clinical Lead, Clinical Safety.

- **Marci (Condition Area Owner / primary commissioner)** — needs *condition-specific real-world deployment evidence and case studies*; pain point: *"comparability of apps for a condition is inconsistent"* and *"no standard evidence format"*. Needs to filter to deployments like hers (her condition, her care setting) and trust the status.
- **Joe (Strategic commissioner)** — needs *low operational risk* and proven outcomes; horizon-scans national programmes. Needs the live-vs-pilot-vs-historic distinction to gauge maturity and risk.
- **Maisie (Clinical Lead / Safety Officer)** — assesses *pathway logic and care-setting fit*; needs to see whether a product is live in *her tier / setting* (secondary acute vs community PR) before endorsing.
- **Hashem (Finance)** — utilisation/maturity signal feeds affordability and demand assumptions.
- **Sinead (Procurement)** — the "ever procured ≠ currently live" distinction maps directly to her **post-procurement verification flow**; historic/de-procured rows are a contracting signal.

Shared need: a **standard, comparable, quality-flagged format** for deployment evidence — the exact gap the personas describe.

## 3. Current-state critique

- `named_sites[]` only models `name` + `status (active|decommissioned|unknown)` — no ICB, place, setting, tier, delivery, or evidence confidence.
- `live_sites` is free-text prose — not scannable or comparable.
- `deployments[]` exists but only renders when `named_sites` is absent, and isn't surfaced consistently.
- Status is binary-ish (active/decommissioned/unknown); it cannot represent **pilot**, **research/evaluation**, or **unverified aggregate vendor claims** — all present in the register and all materially different commissioning signals.
- No notion of **confidence** in a row's provenance.

## 4. Evidence base (the register)

15 rows across three apps, with a documented status taxonomy, confidence scale, and two deliberately separate location concepts (care setting vs commissioning tier). Key editorial caveats captured from the source:

- Luscii COPD = remote monitoring (SpO2/symptoms), not exercise PR; myCOPD delivers NICE-recognised PR (EVA HTE18/HTE19 to Dec 2027).
- my mhealth (myCOPD/myHeart) deploys "broadly but thinly" — named rows are exemplars; true footprint is wider but undocumented.
- myHeart has weak *named* English evidence (Dorset County Hospital is the only firmly confirmed English site).
- "Ever procured" ≠ "currently live" (BNSSG de-procurement test case).
- Non-England sites (NHS Highland, Jersey, NZ, etc.) are excluded.

These caveats are why **status** and **confidence** are first-class, per-row fields rather than a single page-level disclaimer.

## 5. Taxonomy

### Status (`status`)

| Value | Meaning | Badge |
|-------|---------|-------|
| `live` | Currently commissioned / in active use at the named org | Green |
| `pilot` | Live but time-limited / not yet fully embedded | Blue |
| `research` | Live within a study / evaluation | Indigo |
| `historic` | Was procured; commissioning ended (licences may persist) — NOT enrollable | Grey/strikethrough tone |
| `undocumented` | Aggregate vendor claim of wide use, unverifiable site-by-site | Amber |
| `unknown` | Status cannot be classified from sources | Grey |

### Confidence (`confidence`)

| Value | Meaning |
|-------|---------|
| `high` | Named org + independent/official corroboration (NHS trust/ICB source) |
| `medium` | Named org, mostly vendor/award-sourced, limited independent corroboration |
| `low` | Org unnamed, partly outside England, or aggregate vendor claim only |

## 6. Data model

New field `deployment_register[]` on the app JSON. Becomes the canonical source for "Where it's live"; legacy `named_sites` / `live_sites` / `deployments` / `live_icbs` are retained for back-compat (compare tool, snapshots) but the PDP renders the register.

```jsonc
"deployment_register": [
  {
    "site": "Airedale NHS FT — MyCare24 COPD service",   // required: site / service name
    "condition": "COPD remote monitoring",                // optional: condition / use case
    "icb": "NHS West Yorkshire ICB",                      // optional
    "location": "Bradford District & Craven place",       // optional: location within ICB
    "delivery": "Digital care hub + patient's home",      // optional: how it's delivered
    "care_setting": "Community",                           // optional: setting / tier
    "status": "live",                                      // enum (see taxonomy)
    "confidence": "high",                                  // optional enum
    "notes": "Largest COPD remote-monitoring rollout in England; ~1,000 registered (2025), target ~6,000."
  }
]
```

## 7. Interaction & information design

A responsive, accessible **Deployment register table** replacing the flat Live sites list inside the Deployment & adoption tab. The header "Where it's live" strip remains as a summary and links to it.

- **Summary line**: "Live at N sites across M ICBs" + counts of pilots / research / historic when present. Drives the at-a-glance answer.
- **Status filter** (chips: All · Live · Pilot & research · Historic): commissioners' first cut is "what's actually live near me". Default = All, sorted live-first.
- **Desktop columns** (priority-ordered, capped to stay scannable):
  1. Site / service (condition as subtext)
  2. ICB / place (location-within-ICB as subtext)
  3. Care setting (delivery as subtext)
  4. Status (badge) + confidence
- **Expandable detail row**: full context notes, delivery, condition, confidence rationale — progressive disclosure so the table stays scannable (NN/g) while keeping depth on demand.
- **Mobile**: rows collapse to stacked cards (label/value pairs) with the status badge prominent.
- **Empty/sparse states**: missing cells render "—"; apps with only a name still appear as rows (no data loss from migration).
- **Print/share**: in print mode every row is shown, expanded, with no filter UI, so shared/printed PDPs are complete and linear.

### Why two location concepts are preserved

Per the register's own method note: **care setting** (where/how delivered) and **tier** (who commissions/owns) can diverge (Airedale is delivered in home/community but owned by an acute trust). The tier is what maps to commissioner vs clinician personas, so both are captured; the table surfaces care setting and keeps tier in notes/delivery where relevant.

## 8. Accessibility

- Native `<table>` with `<caption>`, `<th scope="col">`, and a row-detail toggle implemented as a `<button aria-expanded aria-controls>` revealing a detail `<tr>`.
- Status filter as a labelled group of toggle buttons (`aria-pressed`).
- Colour is never the only signal — every status shows a text label, not just a colour.
- Detail content keyboard-reachable; focus order preserved.

## 9. Migration rules (all 16 apps)

- **Luscii, myCOPD, myHeart**: hand-authored from the register with full columns, status, confidence and notes.
- **Other apps**: derived programmatically from existing data —
  - `named_sites[]`: `name → site`, `status` mapped `active→live`, `decommissioned→historic`, `unknown→unknown`. `confidence` omitted (unverified in catalogue sources).
  - else `deployments[]`: `organisation_name → site`, `region → location`, `currently_active === false → historic` else `live`, `deployment_scope`/`attribution_note → notes`, non-UK `country → notes`.
  - else `live_sites` prose → a single `undocumented`/`unknown` row carrying the prose in `notes`.
- Legacy fields are left intact for other consumers.

## 10. Acceptance criteria

- Every PDP renders a Deployment register table; the 3 register apps show ICB, place, setting, status and confidence per row.
- Commissioners can filter by status and distinguish live vs pilot/research vs historic without reading prose.
- "Where it's live" summary reflects live-site and ICB counts derived from the register.
- Table is keyboard- and screen-reader-operable; status is never colour-only.
- Print/share renders all rows expanded.
- No deployment data is lost for the other 13 apps.
- Type-check, lint, tests and production build all pass.

## 11. Out of scope / follow-ups

- Sourcing richer register rows for the other 13 apps (currently migrated thinly from existing data).
- Per-row source URLs / citations (the register cites prose sources; a structured `source_url` per row is a future enhancement).
- Wiring the post-procurement verification flow to flip rows to `historic` automatically (Sinead's journey).
