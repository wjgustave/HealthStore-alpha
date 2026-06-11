# Comparison tool content map

Status: implementation reference. Companion to [COMPARE_RESTRUCTURE_PLAN.md](COMPARE_RESTRUCTURE_PLAN.md) and [PDP_CONTENT_MAP.md](PDP_CONTENT_MAP.md).

Maps every comparison row to a PDP content group, source field/formatter, persona relevance, decision-critical flag, and persona lens tags.

## Empty-state token

All compare cells use **`Check with supplier`** when data is absent (aligned with PDP sweep via `CHECK_WITH_SUPPLIER` in `lib/data.ts`). Legacy `NOT_STATED` constant in `lib/compareFieldFormat.ts` now resolves to this string.

## Decision snapshot (persistent band / cards)

Not matrix rows — rendered by `CompareDecisionSnapshot` per product.

| Signal | PDP group | Source | Formatters |
|--------|-----------|--------|------------|
| Where it's live | Decision snapshot | `deployment_register[]` | `getWhereLiveSummary` |
| Governance | Decision snapshot | `nice_guidance_refs`, `dtac_status`, `cyber_essentials` | `getCommissioningSnapshot` → regulation card |
| Pricing model | Decision snapshot | `pricing_model`, `free_offer_flag` | `getCommissioningSnapshot` → cost card |
| Integrations | Decision snapshot | `nhs_*_integration`, `technical_integrations` | `getCommissioningSnapshot` → interop card |

## Matrix / workspace rows

### 1. Overview & local fit

| Row key | Label | Source fields | Formatter | Personas | Decision-critical | Lens tags |
|---------|-------|---------------|-----------|----------|-----------------|-----------|
| `conditions` | Conditions | `condition_tags` | `formatConditionLabels` | Marci, Maisie | **Yes** | commissioner, clinical_safety |
| `therapeutic` | Therapeutic purpose | `context_of_use.therapeutic_purpose`, `one_line_value_proposition` | `getTherapeuticPurpose` | Marci, Maisie | | commissioner, clinical_safety |
| `pathways` | Clinical pathways | `context_of_use.pathways`, `pathway_tags` | `getClinicalPathways` | Marci, Maisie | | commissioner, clinical_safety |
| `care_settings` | Care settings | `context_of_use.care_settings` | `getCareSettings` | Marci, Maisie | | commissioner, clinical_safety |

### 2. Clinical evidence & outcomes

| Row key | Label | Source fields | Formatter | Personas | Decision-critical | Lens tags |
|---------|-------|---------------|-----------|----------|-----------------|-----------|
| `evidence_excerpt` | Clinical evidence (summary) | `evidence_summary` | `getClinicalEvidenceExcerpt` | Marci, Joe, Maisie | | commissioner, clinical_safety |
| `expected_benefit` | Expected benefit | `expected_benefit_note` | `getExpectedBenefit` | Marci, Joe, Hashem | | commissioner, finance_procurement |
| `nice` | NICE guidance status | `nice_guidance_refs`, `context_of_use.nice_scope` | `getNiceGuidanceStatus` | Marci, Maisie | | commissioner, clinical_safety |
| `evidence_strength` | Evidence strength | `evidence_strength` | `getEvidenceStrength` (badge) | Marci, Joe, Maisie | **Yes** | commissioner, clinical_safety |

### 3. Deployment & adoption

| Row key | Label | Source fields | Formatter | Personas | Decision-critical | Lens tags |
|---------|-------|---------------|-----------|----------|-----------------|-----------|
| `where_live` | Where it's live | `deployment_register[]` | `getWhereLiveCompare` | Marci, Joe | **Yes** | commissioner |
| `maturity` | Deployment maturity | `maturity_level` | `MaturityBadge` | Marci, Joe | | commissioner |
| `onboarding` | Onboarding model | `onboarding_model`, `onboarding_detail` | `getOnboardingCompareLine` | Marci, Maisie | | commissioner, clinical_safety |
| `service_wrap` | Service wrap | `service_wrap_included` | `getServiceWrapYn` (badge) | Marci, Hashem | | commissioner, finance_procurement |

### 4. Safety & governance

| Row key | Label | Source fields | Formatter | Personas | Decision-critical | Lens tags |
|---------|-------|---------------|-----------|----------|-----------------|-----------|
| `dtac` | DTAC status | `dtac_status` | `DtacBadge` | Maisie, Deb, Sinead | **Yes** | clinical_safety, finance_procurement |
| `dcb0129` | DCB0129 (manufacturer) | `dcb0129_status` | `pickStr` | Maisie, Deb | | clinical_safety |
| `device_class` | Device class | `device_class` | `pickStr` | Maisie | | clinical_safety |
| `assurance` | Cyber / ISO / DSPT | `cyber_essentials`, `iso27001`, `dspt_status` | `getAssuranceSummary` | Deb, Sinead | | clinical_safety, finance_procurement |

### 5. Commercial, cost & funding

| Row key | Label | Source fields | Formatter | Personas | Decision-critical | Lens tags |
|---------|-------|---------------|-----------|----------|-----------------|-----------|
| `pricing_model` | Pricing model | `pricing_model` | `getPricingModelDisplay` | Hashem, Marci | **Yes** | finance_procurement, commissioner |
| `indicative_price` | Indicative price | `indicative_price_text` | `getIndicativePriceShort` | Hashem | | finance_procurement |
| `funding` | Funding eligibility | `nhse_125k_eligible`, `nhse_125k_note` | `getFundingEligibility` | Joe, Hashem | | finance_procurement, commissioner |

### 6. Technical & integration

| Row key | Label | Source fields | Formatter | Personas | Decision-critical | Lens tags |
|---------|-------|---------------|-----------|----------|-----------------|-----------|
| `nhs_integrations` | NHS integrations | `nhs_app_integration`, `nhs_login_integration`, `nhs_notify_integration` | `getNhsIntegrationsSummary` | Deb, Maisie | | clinical_safety |
| `integrations` | FHIR / EMIS / hosting | `technical_integrations` | `getIntegrationsSummary` | Deb, Maisie | | clinical_safety |
| `data_hosting` | Data hosting | `technical_integrations.data_hosting` | `getDataHosting` | Deb | | clinical_safety |

## Decision-critical set

Highlighted in Variant A (left border + label marker). Default-open groups in Variant B:

- Conditions
- Where it's live
- Evidence strength
- DTAC status
- Pricing model

## Persona group priority (default / Commissioner lens)

Order groups for Marci (primary commissioner):

1. Overview & local fit
2. Clinical evidence & outcomes
3. Deployment & adoption
4. Commercial, cost & funding
5. Safety & governance
6. Technical & integration

## Persona lens definitions

| Lens id | Persona | Label | Emphasised groups (reordered to top) |
|---------|---------|-------|--------------------------------------|
| `all` | Marci (commissioner) | Show all | Overview → Clinical → Deployment → Commercial → Safety → Technical |
| `clinical_safety` | Maisie (clinical lead / safety) | Clinical safety | Clinical → Safety → Deployment → Technical → Overview → Commercial |
| `finance_procurement` | Hashem / Sinead (finance, procurement) | Finance & procurement | Commercial → Safety → Deployment → Clinical → Overview → Technical |
| `ig_assurance` | Deb (IG / DPO) | Information governance & assurance | Safety → Technical → Deployment → Commercial → Clinical → Overview |

The `ig_assurance` lens reflects Deb's job: validate DTAC, Cyber Essentials, DSPT, ISO 27001, and GDPR (Safety & governance) plus data hosting and integration surface (Technical & integration) before sign-off. Tagged rows: `dtac`, `dcb0129`, `assurance` (Cyber / ISO / DSPT), `nhs_integrations`, `integrations` (FHIR / EMIS / hosting), `data_hosting`.

Rows outside the lens still render when lens is not filtering — lens only **reorders and visually emphasises** groups (does not hide content).

## Terminology alignment

| Old (compare) | New (aligned with PDP) |
|---------------|------------------------|
| Adoption & assurance | Split into Deployment & adoption + Safety & governance |
| Clinical context | Overview & local fit + Clinical evidence & outcomes |
| Commercial & delivery | Commercial, cost & funding + Technical & integration |
| Live ICB sites | Where it's live (`deployment_register`) |
| Not stated | Check with supplier |
| Interoperability (implicit) | Integrations (NHS + FHIR/EMIS) |

## Mapping from old compare sections

| Old section | New group(s) |
|-------------|--------------|
| Clinical context | Overview & local fit + Clinical evidence & outcomes |
| Adoption & assurance | Deployment & adoption + Safety & governance |
| Commercial & delivery | Commercial, cost & funding + Technical & integration |
