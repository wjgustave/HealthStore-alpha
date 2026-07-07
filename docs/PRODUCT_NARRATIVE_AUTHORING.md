# Authoring a product narrative (hybrid PDP)

How to bring a product onto the hybrid PDP (`/apps/{slug}`): the narrative spine
(problem -> how it helps -> local value -> how to buy -> assurance) layered on top of the
existing reference tabs. Distilled from the Luscii pilot (content migration Rounds 1-3, see
`/DS/Audits/Luscii-Content-Mig-1..4`).

## How gating works

A product lights up the spine when it has a **curated narrative**. The page uses data-driven
gating (decision R3-4 D):

```ts
// app/apps/[slug]/page.tsx
const showNarrativeSpine = getProductNarrative(slug) != null
```

- **Spine + assurance passport** render for any product returned by `getProductNarrative`.
- **Local-value block** (`PdpLocalValue`) self-gates to COPD (`app.condition_tags.includes('copd')`)
  because that is the only condition with local reference and ROI data today.
- Products with no curated narrative keep the reference-only layout (they fall back to
  `buildNarrativeFromApp` for the hero proposition only).

So authoring = adding a `ProductNarrative` to `lib/content/productNarratives.ts` and wiring it into
`getProductNarrative`.

## The content model

Defined in `lib/content/productModel.ts` as `ProductNarrative`. All fields are optional; the spine
renders only the sections it has data for.

| Field | Renders as | Notes |
| --- | --- | --- |
| `decision_summary.one_line_proposition` | Hero proposition | Overrides `app.one_line_value_proposition` |
| `decision_summary.pathway_problem` / `why_relevant` | "The problem this addresses" | |
| `what_it_does_bullets` | "How {product} helps" bullets | |
| `pathway_model.current_steps` / `future_steps` | Pathway change visual | `change: 'added' \| 'changed' \| 'removed' \| 'unchanged'` |
| `commercial_readiness` | "How to buy locally" | `proposition_type`, `route_status`, `buyer_pack_status`, `healthstore_role`, `price_summary` |
| `regulatory_position.assurance_speed_note` | Assurance passport intro | The "national once, reuse it" message |
| `commissioner_economics` | (dormant) | Not rendered by the current spine; local value comes from `PdpLocalValue` |
| `assurance_domains` | (not rendered) | Superseded by R3-3 C — see below |

### Assurance is derived, not authored (R3-3 C)

Do **not** rely on hand-authored `assurance_domains` for the passport. As of Round 3 the passport
domains are **derived from the granular JSON** in `content/apps/{slug}.json` by
`deriveAssuranceDomains` (`lib/content/assuranceDomains.ts`), so the summary can never read richer
than the detail in the Safety and governance tab. To get an accurate passport, make the JSON
governance fields correct:

- `dtac_status`, `dtac_note`
- `dcb0129_status`, `dcb0160_boilerplate_available`
- `device_class`, `device_class_note`
- `dspt_status`, `iso27001`, `cyber_essentials`, `gdpr_note`
- `nice_guidance_refs`, `clinical_evidence_detailed`

Values matching "not confirmed / unknown / pending" resolve to weaker statuses; a missing DTAC
(`required_not_confirmed`) surfaces a **material assurance gap** callout.

## The seven-step process

1. **Map the source.** List every field in `content/apps/{slug}.json` and whether it renders today.
2. **Curate the spine.** Write the `ProductNarrative`: problem, how-it-helps bullets, pathway model,
   how-to-buy framing. Keep the pathway moment distinct from sibling products.
3. **Reuse facts.** Point assurance, evidence and commercial detail at the existing JSON. Do not
   duplicate governance into the narrative.
4. **Reconcile conflicts.** Check the summary against the detail (price, device class, proposition,
   IG). Fix the JSON so the derived passport is correct. Run the reconcile checklist below.
5. **Layer personalisation.** COPD products get `PdpLocalValue` automatically. Other conditions need
   local reference data (`content/local/`) and an ROI model before the value block can turn on.
6. **Protect detail.** Confirm nothing rich in the reference tabs is dropped by the spine.
7. **Confirm parity.** Share/PDF, Express interest, print and a11y all still work.

## Reconcile checklist

- [ ] Price: no unverified figure published (use "pricing on application" if unconfirmed).
- [ ] Device class: narrative and `device_class` agree; caveats in `device_class_note`.
- [ ] Proposition: hero, snapshot and narrative say the same thing.
- [ ] IG: DTAC/DSPT vs ISO 27001/Cyber Essentials — the derived passport should show "review due"
      with a residual action when the latter are unconfirmed (it does this automatically).
- [ ] Material gaps: any `incomplete`/`expired` domain shows the warning callout and is intended.

## Wiring a new product

```ts
// lib/content/productNarratives.ts
const ACME_NARRATIVE: ProductNarrative = { /* ... */ }

export function getProductNarrative(slug: string): ProductNarrative | null {
  if (slug === 'luscii') return LUSCII_NARRATIVE
  // ...
  if (slug === 'acme') return ACME_NARRATIVE
  return null
}
```

That is all that is needed — the spine, assurance passport and (for COPD) the local-value block
pick it up automatically.
