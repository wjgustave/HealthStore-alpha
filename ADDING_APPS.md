# Adding Apps to Healthstore-Alpha

This guide explains how to add a new app (and optionally a new condition area) to the NHS Commissioner DTx Store.

---

## Condition Visibility

Not all conditions are visible in the live catalogue. Visibility is controlled by the `VISIBLE_CONDITIONS` array in `lib/data.ts`:

```typescript
export const VISIBLE_CONDITIONS = ['copd', 'cardiac_rehab']
```

Apps belonging to hidden conditions still exist in the codebase (JSON files, imports, logos) but are filtered out of `getAllApps()` and `getConditionAreas()`. This means they do not appear in the catalogue, homepage, charts, or generated detail routes.

**Currently visible:** COPD, Cardiac rehabilitation
**Currently hidden:** Insomnia, Weight management, MSK / Osteoarthritis, Eating disorders

To show a hidden condition, add its id to the `VISIBLE_CONDITIONS` array. No other changes are needed — dashboard stats, condition shortcuts, catalogue filters, and charts all derive from the filtered data automatically.

### NHSE £125k funding fields (`nhse_125k_eligible`, `nhse_125k_note`)

The ICB £125k technology funding scheme referenced in the UI is **COPD-context**. For apps whose primary condition is **`cardiac_rehab`**, set **`nhse_125k_note` to `null`** (and keep `nhse_125k_eligible` as `null`) so the “NHSE £125k funding” row does not appear under Financial and commercial considerations. Use non-null `nhse_125k_note` only where the scheme is relevant (typically COPD apps).

---

## Step 1: Create the app JSON file

Create a new file at `content/apps/{slug}.json`. Use lowercase, hyphenated slugs (e.g. `my-new-app.json`).

Below is the full JSON template with every field annotated. Fields marked **(required)** must be present; fields marked **(optional)** can be omitted if information is not available.

```json
{
  "id": "my-new-app",
  "slug": "my-new-app",
  "app_name": "My New App",
  "supplier_name": "Supplier Ltd",
  "short_name": "My New App",
  "logo_path": "/logos/my-new-app.svg",

  "condition_tags": ["copd"],
  "pathway_tags": ["self-management", "remote-monitoring"],
  "outcome_tags": ["symptom-reduction", "self-management"],

  "supervision_model": "guided_self_help",
  "referral_modes": ["clinician_referral", "self_referral"],

  "one_line_value_proposition": "A single sentence summarising the app's unique value for commissioners.",
  "why_it_matters_locally": "2-3 sentences on why this app matters for local NHS commissioning.",
  "target_problem_statement": "The specific NHS problem this app addresses.",

  "nice_guidance_refs": [
    {
      "ref": "NICE HTG000",
      "url": "https://www.nice.org.uk/guidance/htg000",
      "type": "HTG",
      "date": "2025",
      "note": "Optional context note"
    }
  ],

  "evidence_summary": "Summary of the evidence base — RCTs, service evaluations, NICE assessments.",
  "evidence_strength": "established",

  "case_studies": [
    {
      "title": "Study title",
      "setting": "NHS Trust, duration",
      "sample_size": 100,
      "outcome": "Key results.",
      "caveat": "Any limitations or caveats.",
      "source": "Author et al., Journal Year"
    }
  ],

  "clinical_evidence_detailed": [
    {
      "id": "study-id",
      "ref": "Study reference label",
      "type": "RCT",
      "type_label": "Randomised controlled trial",
      "authors": "Author A et al.",
      "journal": "Journal Name",
      "year": 2024,
      "month": "March",
      "volume_issue": "10(2):e12345",
      "doi": "10.1234/example",
      "pmid": "12345678",
      "pmc": null,
      "trial_reg": null,
      "url_doi": "https://doi.org/10.1234/example",
      "url_pubmed": "https://pubmed.ncbi.nlm.nih.gov/12345678/",
      "url_full_text": null,
      "n": 100,
      "setting": "NHS Trust name, duration",
      "key_results": "Summary of key results.",
      "study_limitation": "Key limitation.",
      "peer_reviewed": true,
      "coi": false,
      "data_quality_flag": false,
      "data_quality_note": null
    }
  ],

  "maturity_level": "scaled",
  "live_sites": "NHS Trust A, NHS Trust B",
  "live_icbs": 5,
  "patients_covered_note": "Number of patients or deployments.",

  "dtac_status": "passed",
  "dtac_note": "Any notes about DTAC status.",
  "device_class": "Class I SaMD",
  "dcb0129_status": "Confirmed",
  "dcb0160_boilerplate_available": true,
  "dspt_status": "Compliant",
  "iso27001": "Certified",
  "cyber_essentials": "Held",
  "cyber_notes": "Additional security context.",
  "gdpr_note": "Data hosting and DPA terms.",

  "target_patients": "Who the app is for.",
  "exclusions": "Who should not use it.",

  "onboarding_model": "clinician_led",
  "onboarding_detail": "How patients get started.",
  "supplier_wrap": "What the supplier provides.",
  "local_wraparound": "medium",
  "local_wraparound_detail": "What the local NHS team needs to do.",
  "training_required": true,
  "training_note": "Training details.",
  "monitoring_model": "Description of monitoring approach.",
  "monitoring_note": "Monitoring caveats.",
  "escalation_note": "Escalation pathways.",
  "operating_hours_caveat": "Not a 24/7 service.",
  "implementation_prerequisites": [
    "Prerequisite 1",
    "Prerequisite 2"
  ],

  "pricing_model": "local_licence",
  "national_price_available": false,
  "indicative_price_text": "Contact supplier for NHS pricing.",
  "pricing_confidence": "not_stated",
  "free_offer_flag": false,
  "service_wrap_included": true,
  "service_wrap_note": "What is included in the service.",
  "contract_note": "Procurement routes.",
  "expected_benefit_note": "Expected clinical and financial benefits.",
  "tariff_considerations": "Tariff context for commissioners.",
  "provider_income_note": "Not stated.",
  "roi_note": "ROI drivers and evidence.",

  "funding_ids": [],
  "nhse_125k_eligible": null,
  "nhse_125k_note": "Not applicable.",

  "nhs_app_integration": false,
  "nhs_login_integration": false,
  "nhs_notify_integration": false,
  "minimum_conditions_for_success": "What must be in place for deployment to succeed.",
  "procurement_notes": "Procurement route guidance.",
  "content_confidence": "Supplier-reported",
  "linked_funding_ids": [],

  "technical_integrations": {
    "fhir": "Not confirmed",
    "emis": "Not confirmed",
    "nhs_app": false,
    "population_health_dashboard": false,
    "device_integration": "Description of device connectivity",
    "languages": ["English"],
    "data_hosting": "UK-based servers"
  },

  "context_of_use": {
    "population": "Target population description",
    "pathways": ["Pathway 1", "Pathway 2"],
    "care_settings": ["Primary care", "Secondary care"],
    "therapeutic_purpose": "What the app does therapeutically",
    "hcp_involvement": "Level of HCP involvement required",
    "nice_scope": "NICE guidance reference and scope"
  },

  "demo_variants": [
    { "label": "Product website", "url": "https://example.com", "type": "website" }
  ],
  "demo_notes": "Contact supplier for a demonstration.",
  "supplier_contact_email": "nhs@example.com",
  "supplier_contact_name": "Supplier NHS team",
  "last_reviewed_date": "2026-03-17",
  "source_summary": "Sources used to compile this entry.",
  "confidence_note": "Verify all information with the supplier before procurement."
}
```

### Allowed enum values

| Field | Allowed values |
|-------|---------------|
| `supervision_model` | `self_management_only`, `guided_self_help`, `non_continuous_review`, `active_remote_management` |
| `maturity_level` | `scaled`, `multi_site_live`, `limited_live`, `pilot` |
| `evidence_strength` | `established`, `promising`, `emerging`, `scaled` |
| `dtac_status` | `passed`, `passed_refresh_required`, `required_not_confirmed`, `not_applicable` |
| `local_wraparound` | `low`, `medium`, `high` |
| `content_confidence` | `Confirmed`, `Supplier-reported`, `Illustrative` |
| `condition_tags` | Must match an `id` in `content/conditions/conditions.json` |
| `clinical_evidence_detailed[].type` | `RCT`, `observational`, `service_eval`, `grey_lit`, `nice_assessment`, `real_world`, `implementation_science`, `evidence_gap` |

---

## Step 2: Add a logo

Place an SVG logo at `public/logos/{slug}.svg`. The recommended format is 40x40px with an 8px border-radius. If no logo is available, create a placeholder:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
  <rect width="40" height="40" rx="8" fill="#005EB8"/>
  <text x="20" y="27" text-anchor="middle" font-family="Arial,sans-serif"
        font-size="20" font-weight="700" fill="white">X</text>
</svg>
```

Replace `X` with the first letter of the app name, and the fill colour with the condition accent colour.

---

## Step 3: Register the app in `lib/data.ts`

1. Add an import at the top of the file:

```typescript
import myNewApp from '@/content/apps/my-new-app.json'
```

2. Add the variable to the `allAppsUnfiltered` array in `lib/data.ts`:

```typescript
const allAppsUnfiltered: App[] = [myCOPD, clinitouch, /* ...existing... */, myNewApp]
```

The app will only appear in the live catalogue if its `condition_tags` include a condition listed in `VISIBLE_CONDITIONS`. See the **Condition Visibility** section above.

---

## Step 4: (If adding a new condition area)

If the app belongs to a condition that does not yet exist, you must update these files:

### 4a. `content/conditions/conditions.json`

Add a new entry:

```json
{
  "id": "new_condition",
  "label": "New Condition",
  "description": "Description for the condition area",
  "icon": "heart",
  "app_count": 1,
  "colour": "#HexColour"
}
```

### 4b. Condition colour maps (5 files)

Add the new condition id and hex colour to the `conditionColours` object in each file:

- `components/AppCard.tsx`
- `app/apps/[slug]/page.tsx`
- `app/apps/CatalogueClient.tsx` (also add to `conditionOptions` if the condition is visible)
- `app/page.tsx`

### 4c. `components/Badges.tsx`

Add the display label to the `labels` map in the `ConditionTag` component:

```typescript
const labels: Record<string, string> = {
  // ...existing...
  new_condition: 'New Condition',
}
```

### 4d. `components/HealthIcons.tsx`

1. Create a new SVG icon component
2. Add it to the `conditionIcons` map

---

## Step 5: Verify

Run the build and check:

```bash
npm run build
```

Confirm:
- The new app appears at `/apps/{slug}`
- The app shows in the catalogue at `/apps`
- Condition shortcut counts on the homepage update
- The detail page renders all sections correctly

---

## File checklist

| Step | File | Action |
|------|------|--------|
| 1 | `content/apps/{slug}.json` | Create from template |
| 2 | `public/logos/{slug}.svg` | Add logo SVG |
| 3 | `lib/data.ts` | Add import + register in `getAllApps()` |
| 4a | `content/conditions/conditions.json` | Add condition (new condition only) |
| 4b | `components/AppCard.tsx` | Add colour (new condition only) |
| 4b | `app/apps/[slug]/page.tsx` | Add colour (new condition only) |
| 4b | `app/apps/CatalogueClient.tsx` | Add colour + filter option (new condition only) |
| 4b | `app/page.tsx` | Add colour (new condition only) |
| 4c | `components/Badges.tsx` | Add label (new condition only) |
| 4d | `components/HealthIcons.tsx` | Add icon (new condition only) |
