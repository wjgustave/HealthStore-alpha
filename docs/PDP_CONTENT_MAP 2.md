# PDP Content Map

Status: proposal for review. This document assigns every piece of content currently on the product detail page (PDP, `app/apps/[slug]/page.tsx`) to a user-facing content group, optimised for the priority commissioning personas. It is the companion to [docs/PDP_RESTRUCTURE_PLAN.md](PDP_RESTRUCTURE_PLAN.md), which covers the design pattern and implementation.

## Why this exists

The current PDP presents a DTX (digital therapeutic) as 13 collapsed accordions (`ProductPageExpander`) plus a hero, a commissioning snapshot, conditional alerts, and a sidebar. Decision-critical facts are hidden behind accordions that all start closed. The most acute symptom: **a commissioner cannot quickly see where a DTX is currently live** — that fact sits inside the collapsed "Scale and maturity" accordion.

This map regroups all content into a smaller number of intuitive groups, so each persona can find their priority information without opening accordions one at a time, and so the facts that drive the decision are surfaced rather than buried.

## Source of the content inventory

Fields are named as they appear in [ADDING_APPS.md](../ADDING_APPS.md) and the current PDP components:

- `app/apps/[slug]/page.tsx` (section wiring, hero, alerts)
- `components/PdpCommissioningSnapshot.tsx` + `lib/commissioningSnapshot.ts` (snapshot cards)
- `components/AppDetailSections.tsx`, `app/apps/[slug]/pdpBlocks.tsx` (section bodies)
- Sidebar blocks in `page.tsx` (`shareKey: sidebar-summary`)
- Share/print region keys in `lib/pdpShareKeys.ts`

## Priority personas

Optimisation order follows the brief: Commissioner, Clinical Lead, Clinical Safety first.

Signed-in users (the page is designed around them):

- **Marci** — Condition Area Owner / commissioner. **Primary user.** Owns commissioning for one condition area; needs real-world outcomes, evidence of value (outcomes + cost), deployment evidence, and a business case she can defend.
- **Joe** — Strategic commissioner. Accountable for the whole commissioning cycle; horizon-scans (NICE EVA, GIRFT, national programmes); needs ROI benchmarks and multi-year funding signals.
- **Maisie** — Clinical Lead + Clinical Safety Officer. Clinical gatekeeper; validates clinical evidence, completes the DCB0160 safety case, assesses pathway safety and the "human wrapper" model, briefs frontline referrers.

Reference-only users (need content from the HealthStore, but likely will not sign in):

- **Deb** — Information Governance / DPO / digital risk. Wants DTAC, SCAL, Cyber Essentials, DSPT, ISO 27001 served from the product page rather than requested cold.
- **Hashem** — Finance / commercial value gatekeeper. Affordability, clear pricing models, cost-saving ROI, utilisation benchmarks.
- **Sinead** — ICB procurement. Procurement route classification, contract terms covering deployment/integration/service, audit trail.
- **Marlon** — Population health analyst. Mostly post-commissioning (outcomes and data returns); limited PDP need.

## The content groups

A persistent header plus six task-labelled groups, then a persistent sidebar and a "MISC / About this listing" bucket. Labels are task/content based, not persona based (people fail to self-identify; many personas need "a bit of all").

1. Decision snapshot (persistent header)
2. Overview & local fit
3. Clinical evidence & outcomes
4. Deployment & adoption
5. Safety & governance
6. Commercial, cost & funding
7. Technical & integration
8. Sidebar (persists) + MISC / About this listing

---

## 0. Decision snapshot — persistent header (never collapsed)

Always visible above the groups. Carries the headline facts every persona references, so cross-group comparison (e.g. evidence vs cost) does not require switching groups. Directly fixes the "where is it live / what's its status" problem.

Identity:

- `app_name`, `supplier_name`, `logo_path`
- `one_line_value_proposition`
- `condition_tags`
- `maturity_level` (badge), `supervision_model` (badge)
- `nhs_app_integration` (NHS App badge), demo-available pill (`catalogue_demo_available` / hash fallback)
- `content_confidence` (badge when not "Confirmed")
- Express interest CTA, Share / Save / Compare actions

Snapshot strip (the four signals that currently hide in accordions/snapshot):

- **Where it's live** — count and headline from `named_sites[]` (or legacy `live_sites`) and `live_icbs`; links to Deployment & adoption.
- **Regulation** — NICE-EVA, DTAC, Cyber Essentials pills (from `nice_guidance_refs`, `dtac_status`, `cyber_essentials`).
- **Indicative price** — `indicative_price_text` range or "Free" (`free_offer_flag`); links to Commercial.
- **Safety status** — `dtac_status`, and any `clinical_safety_alert` / `decommissioning_alert` / DTAC-refresh alerts raised here as banners.

Maps from current: `hero`, `commissioning-snapshot`, and the conditional `alerts` block.

Primary personas: all. Especially Marci and Joe for the at-a-glance decision signals; Hashem for price; Deb/Maisie for the safety/regulation flags.

## 1. Overview & local fit

The "is this relevant to my pathway?" group. Editorial framing and clinical scope.

- `why_it_matters_locally`
- `context_of_use.*` — `population`, `pathways[]`, `care_settings[]`, `therapeutic_purpose`, `hcp_involvement`, `nice_scope`
- `target_patients`
- `exclusions`
- `sustainability_highlight`

Maps from current: `why-it-matters`, `context-of-use` (plus `target_patients`/`exclusions` currently in the sidebar/JSON).

Primary personas: Marci (pathway fit), Joe (strategic fit), Maisie (eligibility, scope).

## 2. Clinical evidence & outcomes

Everything that answers "does it work, and how good is the evidence?" Grouping evidence + outcomes together supports the commissioner's outcomes-and-impact lens and the clinical lead's evidence-validation lens.

- `clinical_evidence_detailed[]` — rendered as `EvidenceCard`s grouped by study type (RCT / observational / NICE + other); per study: `ref`, `authors`, `journal`, `year`, `volume_issue`, `doi`/`pmid`/`pmc`/`trial_reg`, `n`, `setting`, `key_results`, `study_limitation`, `peer_reviewed`, `coi`, `data_quality_flag`, `data_quality_note`, `coi_note`
- `evidence_strength` + `evidence_strength_rationale`
- `nice_guidance_refs[]` — `ref`, `url`, `type`, `date`, `note`
- `case_studies[]` — `title`, `setting`, `sample_size`, `outcome`, `caveat`, `source`
- `expected_benefit_note`
- `contradictory_evidence[]` (data quality flags) — `domain`, `claim_a`, `claim_b`, `commissioner_impact`
- `product_videos[]` — `youtube_url`, `title`
- `evidence_summary` (currently used on compare/export, not PDP — include as the lead summary line here)

Maps from current: `expected-impact`, `clinical-evidence`, `nice-guidance`, `data-quality-flags`.

Primary personas: Marci (real-world outcomes, case studies), Joe (proven outcomes), Maisie (evidence quality, NICE backing, COI, limitations). Secondary: Marlon (outcomes interest).

## 3. Deployment & adoption

"Where is it live, and what does it take to run it here?" This is the group that rescues the buried "live sites" content and pairs it with the operational reality of deployment — high value to Marci (deployment evidence) and Maisie (human wrapper, escalation).

Where it's live:

- `deployment_register[]` — the canonical structured **Where it's live** table: `site`, `condition`, `icb`, `location`, `delivery`, `care_setting`, `status` (live/pilot/research/historic/undocumented/unknown), `confidence`, `notes`. Rendered as a filterable, accessible table; see [PDP_WHERE_ITS_LIVE_REDESIGN.md](PDP_WHERE_ITS_LIVE_REDESIGN.md).
- Legacy fallback when register absent: `named_sites[]` / `live_sites`, `deployments[]` footprint
- `patients_covered_note`
- `live_icbs` (retained for compare / snapshot)
- `maturity_level`, `evidence_strength` (restated in context)

What it takes locally (the "human wrapper" model):

- `onboarding_model`, `onboarding_detail`
- `training_required`, `training_note`
- `local_wraparound`, `local_wraparound_detail`
- `supplier_wrap`, `service_wrap_included`, `service_wrap_note`
- `implementation_prerequisites[]`
- `monitoring_note`, `escalation_note`, `operating_hours_caveat`

Maps from current: `scale-and-maturity`, `what-it-takes-locally`.

Primary personas: Marci (deployment evidence, comparability), Maisie (escalation, oversight, what staffing is required), Joe (operational risk).

## 4. Safety & governance

Clinical safety and information governance assurance, grouped because they are the two gatekeeper sign-offs (Maisie clinically, Deb for IG). Presented as two sub-sections.

Clinical safety:

- `dtac_status`, `dtac_note`
- `dcb0129_status`
- `dcb0160_boilerplate_available`
- `device_class`, `device_class_note` (with the device-class explainer from `lib/deviceClassExplainer.ts`)
- `clinical_safety_alert`
- `decommissioning_alert`
- `supervision_model`

Data & information governance:

- `gdpr_note`
- `iso27001`
- `cyber_essentials`
- `dspt_status`
- `cyber_notes`

Maps from current: the Assurance block of `sidebar-summary`, plus the `alerts` detail and device-class explainer.

Primary personas: Maisie (clinical safety, DCB0129/0160, device class), Deb (DTAC, Cyber Essentials, DSPT, ISO 27001, GDPR). Secondary: Sinead (DTAC for procurement compliance).

## 5. Commercial, cost & funding

Everything financial: price, procurement, ROI, and funding routes. Grouped so Hashem and the procurement/commercial view sit in one place, and so Marci/Joe can weigh value against the evidence in group 2.

Pricing:

- `pricing_model`, `national_price_available`, `indicative_price_text`, `pricing_confidence`, `free_offer_flag`

Procurement & contracting:

- `procurement_notes`, `contract_note`
- `service_wrap_description` (merged with `service_wrap_note`)

Financial context & ROI:

- `financial_expected_benefit_note` (falls back to `expected_benefit_note`)
- `tariff_considerations`, `provider_income_note`, `roi_note`, `minimum_conditions_for_success`

Funding:

- `nhse_125k_eligible`, `nhse_125k_note`
- Related funding from `linked_funding_ids[]` / `funding_ids[]` (legacy) — funding `title`, `description`, `status`, `total_value`, `external_url`
- `product_tiers[]` — `tier_name`, `description`

Maps from current: `commercial-model`, `indicative-financial`, `related-funding`.

Primary personas: Hashem (affordability, ROI, pricing model), Marci (value + business case), Joe (ROI benchmarks, multi-year funding), Sinead (procurement notes, contract terms).

## 6. Technical & integration

Interoperability and technical fit. Relevant to Deb (data hosting, data flows) and Maisie (integration into the clinical pathway).

- `nhs_app_integration`, `nhs_login_integration`, `nhs_notify_integration`
- `technical_integrations.*` — `fhir`, `emis`, `population_health_dashboard`, `device_integration`, `languages[]`, `data_hosting`

Maps from current: `nhs-integrations`.

Primary personas: Deb (data hosting, integration surface), Maisie (pathway integration). Secondary: Marci/Joe (integration as operational risk).

## 7. Sidebar (persists) + MISC / About this listing

Persistent sidebar (across all groups):

- Quick facts: `maturity_level`, `local_wraparound` (local effort), `device_class`, `supervision_model`, `target_patients`
- Assurance summary (mirrors group 4 at-a-glance): `dtac_status`, `dcb0129_status`, `gdpr_note` (first sentence), `iso27001`, `cyber_essentials`, `dspt_status`, `cyber_notes`
- Supplier contact: `supplier_contact_email`, `supplier_contact_name`

MISC / About this listing (provenance + demo; does not belong to a single decision group):

- `source_summary`, `confidence_note`, `content_confidence`, `last_reviewed_date`
- Demo access: `demo_notes`, `demo_variants[]` (`label`, `url`, `type`) — surfaced via the header demo pill, detail lives here

Maps from current: `sidebar-summary`, `demo-access`.

Primary personas: all (provenance/confidence builds trust for the neutral-evidence-source need that Joe and Marci both cite).

---

## Persona-to-group priority matrix

For each persona, the groups they most need, in rough priority order. "needs a bit of all" is Marci by design (primary user).

- **Marci (primary, commissioner):** Decision snapshot → Overview & local fit → Clinical evidence & outcomes → Deployment & adoption (where live + case studies) → Commercial, cost & funding. Touches every group.
- **Joe (strategic commissioner):** Decision snapshot → Clinical evidence & outcomes → Commercial, cost & funding (ROI, multi-year funding) → Deployment & adoption (operational risk).
- **Maisie (clinical lead / safety):** Clinical evidence & outcomes → Safety & governance (DCB0129/0160, device class, human wrapper) → Deployment & adoption (escalation, what it takes) → Technical & integration.
- **Deb (IG / DPO):** Safety & governance (DTAC, Cyber Essentials, DSPT, ISO 27001, GDPR) → Technical & integration (data hosting, integration surface).
- **Hashem (finance):** Commercial, cost & funding → Decision snapshot (price/ROI signals).
- **Sinead (procurement):** Commercial, cost & funding (procurement notes, contract, tiers) → Safety & governance (DTAC compliance).
- **Marlon (analyst):** Clinical evidence & outcomes (outcomes); mostly works post-commissioning, largely out of PDP scope.

## Mapping from current PDP sections to new groups

Quick cross-reference for the implementation plan (current `shareKey` -> new group):

- `hero` -> Decision snapshot
- `commissioning-snapshot` -> Decision snapshot
- `alerts` (conditional) -> Decision snapshot (banners) + Safety & governance (detail)
- `why-it-matters` -> Overview & local fit
- `context-of-use` -> Overview & local fit
- `scale-and-maturity` -> Deployment & adoption
- `what-it-takes-locally` -> Deployment & adoption
- `expected-impact` -> Clinical evidence & outcomes
- `clinical-evidence` -> Clinical evidence & outcomes
- `nice-guidance` -> Clinical evidence & outcomes
- `data-quality-flags` -> Clinical evidence & outcomes
- `nhs-integrations` -> Technical & integration
- `commercial-model` -> Commercial, cost & funding
- `indicative-financial` -> Commercial, cost & funding
- `related-funding` -> Commercial, cost & funding
- `demo-access` -> MISC / About this listing
- `sidebar-summary` -> Sidebar (persists) + Safety & governance (assurance detail)

## Content gaps (persona needs with no current field)

These are needs surfaced in the persona cards that the current data model does not capture. Flagged for content/schema follow-up, not blocking the restructure.

- **SCAL status** and **supplier DPIA / data-flow map** availability — Deb explicitly needs these on the page; only DTAC/DCB/cyber fields exist today.
- **Procurement route classification** (Provider Selection Regime vs Procurement Act; framework eligibility such as G-Cloud / NHS FS) — Sinead's single biggest failure point; no field exists.
- **Multi-year funding alignment** and **validated utilisation benchmarks** — Hashem and Joe need these for ROI/affordability; only `nhse_125k_*` and `roi_note` exist.
- **Data-return format and cadence** — Marlon's core need; not represented (and largely a post-commissioning concern, possibly out of PDP scope).
- **`contradictory_evidence[]`** and **`product_tiers[]`** are supported in the schema but unpopulated in current app JSON; empty states needed.
