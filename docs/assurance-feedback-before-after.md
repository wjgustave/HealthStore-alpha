# Assurance feedback — before and after content

Source: `Comissioner HealthStore Demo - assurance feedback.docx` (Assurance team, reviewing an older build).
Branch: `nhs_ds`. Status: applied (24 Sep 2026) — sections 1 to 5 are now live on the branch; section 6 lists what was deliberately left alone.

Core message from Assurance: the NHS HealthStore does **not** carry out national assurance and does **not** certify products. It reviews supplier evidence to mitigate its own risk and gives commissioners access to source documents for their **local** assurance.

Replacement sentence supplied by Assurance (used verbatim wherever they asked for it):

> We make assurance easier and faster by providing access to source documents in your workspace once verified for your local assurance purposes.

Legend

- **Before** — current live copy on `nhs_ds`
- **After** — proposed copy
- **Note** — where the wording is mine rather than Assurance's, or where a judgment call was made
- *(placeholder)* — a value we do not hold; suffix kept in the UI so it is obviously not real

---

## 1. Home page

File: `components/home/HomeStorytelling.tsx`

### 1.1 Section intro under "What the NHS HealthStore addresses"

**Before**
> It reduces the burden on local teams by doing nationally what would otherwise be repeated at every Integrated Care Board (ICB). Commissioners retain all commissioning, clinical safety and deployment accountability.

**After**
> It reduces the burden on local teams by bringing supplier evidence, NICE recommendations and commercial support together in one place. Commissioners retain all commissioning, clinical safety, assurance and deployment accountability.

Note: Assurance asked for a reword but gave no text. "Assurance" added to the list of retained accountabilities.

### 1.2 Card 1 of "What the NHS HealthStore addresses"

**Before — title**
> Assurance and certification

**Before — body**
> Each product is reviewed against clinical safety, information governance, interoperability and evidence standards — national assurance that underpins your local due diligence.

**After — title**
> Assurance support

**After — body**
> We centrally hold supplier assurance evidence — completed DTAC, accessibility audit, security certifications and more - which are reviewed and monitored for expiry. We make assurance easier and faster by providing access to source documents in your workspace once verified for your local assurance purposes.

Note: body built from Assurance's own list of what the HealthStore provides (central document repository, DTAC review, WCAG 2.2 AA third-party audit, ongoing monitoring); shortened on review so the card sits level with its neighbours.

### 1.3 "How it works" step 2 title

**Before**
> Explore and compare assured products

**After**
> Explore and compare products

### 1.4 "Conditions and pathways we currently support" note

**Before**
> Condition pathways with NICE Health Technology Guidance, nationally assured products and full local opportunity data.

**After**
> Condition pathways with NICE Health Technology Guidance, verified supplier evidence and full local opportunity data.

Note: judgment call — same screen and same "nationally assured" claim, but not explicitly circled in the feedback.

---

## 2. Home page — promo card

File: `content/home/concept-grid.json` (promo `dtx-ready`)

**Before — description**
> Self-assessment themes for governance, workforce and data before scaling digital therapeutics.

**After — description**
> Self-assessment themes for governance, local assurance, workforce and data before scaling digital therapeutics.

Title "Check if your ICB is DTx delivery ready" unchanged.

Note — further iteration: Assurance asked "what will this look like?". The card currently links to england.nhs.uk; the destination page is out of scope here.

---

## 3. Product page — "Assurance and evidence" section

File: `components/product/PdpAssurancePassport.tsx`

### 3.1 Section description

**Before**
> The NHS HealthStore has reviewed this product nationally. We certify our confidence in its assurance position based on supplier-provided documentation. Your local team retains responsibility for due diligence — we make that faster by providing access to source documents in your workspace once verified.

**After**
> Your local team retains responsibility for due diligence — we make that faster by providing access to source documents in your workspace once verified.

(First two sentences removed, as requested.)

### 3.2 Speed-note block

**Before — heading**
> What our assurance pack saves you

**Before — body (Luscii)**
> The NHS HealthStore runs national assurance once and your local team reuses the passport instead of repeating supplier checks.

**Before — body (myCOPD)**
> The NHS HealthStore provides the assurance passport and local deployment safety templates — reducing duplicated local work.

**After — heading**
> How we support your local assurance

**After — body (all products)**
> We make it faster by providing access to source documents in your workspace once verified for your local assurance purposes.

Note: body is Assurance's text. Heading is mine — the old heading implied the HealthStore removes work; say if you prefer a different one.

Data: `regulatory_position.assurance_speed_note` in `lib/content/productNarratives.ts` (Luscii and myCOPD).

### 3.3 Regulatory position card

**Before — rows**
- Device classification: Medical device — Class IIa SaMD (Luscii) / Medical device — documented classification on file (myCOPD)
- HIRA status: NHS HealthStore Independent Regulatory Assurance pack complete (Luscii) / HIRA evidence pack under NHS HealthStore review (myCOPD)
- Market access: Documented UK market access with classification rationale on file (Luscii) / UK market access documented (myCOPD)

**After — rows**
- Medical device status: Medical device — Class IIa SaMD (Luscii) / Medical device — Class I SaMD (myCOPD)
- Market access: unchanged

HIRA row removed entirely, as requested. myCOPD classification corrected per feedback ("myCOPD is a Class I medical device"; matches `content/apps/mycopd.json`).

### 3.4 Assurance pack list — restructure to DTAC layout

**Before — five rows**

| Row | Hint |
|---|---|
| Clinical safety | DCB0129 on file; local deployment pack provided. |
| Clinical evidence | NICE HTG736 EVA recommendations. |
| Information governance and data protection | DTAC complete and on file, DPA available, DPIA template available, ISO 27001 |
| Interoperability (blue panel) | FHIR integration available. EMIS integration available. NHS Notify supported. API integration available. Outcome data exportable for commissioner reporting. Confirm local EPR integration requirements with supplier. |
| Commercial readiness pack | Includes PA23/software route note and price schedule. |

**After — seven rows, DTAC order, each with evidence items**

Status tags stay as today: Available (green) / Review due (yellow) / Incomplete (blue).

1. **Clinical safety**
   Hint: DCB0129 clinical safety case on file; local DCB0160 template provided.
   - Medical device status — Medical device — Class IIa SaMD (Luscii) / Class I SaMD (myCOPD)
   - PAQ form — v1.0, January 2026 *(placeholder)*
   - DCB0129 hazard log — v3.2, March 2026 *(placeholder)*
   - DCB0160 local hazard log template — v1.4, March 2026 *(placeholder)*

2. **Data protection**
   Hint: DTAC data protection section complete; DPA and DPIA template available.
   - ICO registration — ZA000000, expires 14 May 2027 *(placeholder)*
   - Data processing agreement — available in workspace
   - DPIA template — available in workspace

3. **Technical security**
   Hint: Security certifications and penetration testing evidence held.
   - Cyber Essentials — Luscii: Not confirmed in reviewed sources (from app data) / myCOPD: Held, expires 30 November 2026 *(placeholder expiry)*
   - Penetration test summary — completed 12 February 2026 *(placeholder)*
   - ISO 27001 — Luscii: certified / myCOPD: not confirmed in reviewed sources (from app data)

4. **Interoperability** (keeps the blue panel treatment)
   Body unchanged from today.

5. **Usability and accessibility**
   Hint: User journeys and accessibility evidence held.
   - User journeys — provided by supplier
   - WCAG 2.2 AA third-party audit — completed 20 January 2026 *(placeholder)*

6. **NICE recommendation** (renamed from "Clinical evidence")
   Hint: NICE HTG736 EVA recommendations. (unchanged)

7. **Completed DTAC form**
   Hint: Luscii — DTAC completed April 2024 (Available). myCOPD — central DTAC over 3 years old; updated form applies from April 2026 (Review due).
   - DTAC version — v2.0, February 2026 *(placeholder)*

**Removed from the pack:** "Commercial readiness pack" (Assurance: to be reviewed by the commercial team). Route note and price schedule still appear in the "How to buy" section.

Note — further iteration: every *(placeholder)* value needs the real version / date from the supplier or Assurance.

**Also applied to myHeart and Joint Academy.** Both carried the same old five-domain pack, so they now use the same DTAC layout. Their medical device status reads "Classification to be confirmed with supplier" because the classification is not held in their data. Joint Academy's DTAC row is "Review due" (its old IG row was already review due).

**Compare page.** The compare table looks assurance rows up by domain name, so its "Assurance" section now lists the same seven DTAC rows (Commercial readiness removed there too). Without this the compare page would have shown "Not stated" for every row.

Files: `lib/content/productModel.ts` (new optional `items` on `AssuranceDomain`; `hira_status` becomes optional), `lib/content/assuranceDomains.ts` (shared `dtacPack()` builder, placeholder items, derived domains), `lib/content/productNarratives.ts` (all four curated narratives), `lib/compareNarrativeContent.ts` (compare rows).

---

## 4. Product page — "How to buy" blue panel

Panel heading "The NHS HealthStore's role in procurement" unchanged.
File: `lib/content/productNarratives.ts` (`commercial_readiness.healthstore_role`), rendered by `components/product/PdpNarrativeSpine.tsx`.

### 4.1 Luscii

**Before**
> The NHS HealthStore supports you through the purchase — from buyer pack and pricing to introductions and contract support. We handle the upfront assurance work so you can move faster.

**After**
> The NHS HealthStore supports you through the purchase — from buyer pack and pricing to introductions and contract support. We make assurance easier and faster by providing access to source documents in your workspace once verified for your local assurance purposes.

### 4.2 myCOPD

**Before**
> The NHS HealthStore provides your buyer pack, pricing transparency, contract templates and hands-on support through the purchase process.

**After**
> The NHS HealthStore provides your buyer pack, pricing transparency, contract templates and hands-on support through the purchase process. We make assurance easier and faster by providing access to source documents in your workspace once verified for your local assurance purposes.

Note: no assurance claim before; sentence added so all products carry the same position.

### 4.3 myHeart

**Before**
> The NHS HealthStore provides the buyer pack, pricing, introductions and hands-on support through the purchase. We handle the national assurance so your local process is faster.

**After**
> The NHS HealthStore provides the buyer pack, pricing, introductions and hands-on support through the purchase. We make assurance easier and faster by providing access to source documents in your workspace once verified for your local assurance purposes.

### 4.4 Joint Academy

No assurance claim today — unchanged.

---

## 5. Data-only changes (not currently rendered on live screens)

File: `lib/content/productNarratives.ts`

### 5.1 `commercial_status` (Luscii and myCOPD)

**Before**
> NHS HealthStore assurance complete; buyer selection pack ready

**After**
> Buyer selection pack ready

Note: only rendered by `components/product/ProductNarrativeView.tsx`, which is not used on `nhs_ds`. Changed so the old claim cannot resurface.

### 5.2 `hira_status` (Luscii and myCOPD)

Removed. Field becomes optional in the type; the unused `ProductNarrativeView` reference is guarded so the build passes.

---

## 6. Not changed in this iteration

Left as-is because they are outside the screens Assurance reviewed (per your decision), or need information we do not have.

- Product hero (`components/product/ProductHero.tsx`): "The NHS HealthStore has nationally assured this product. Your local team still makes the procurement decision — we provide the evidence pack and route guidance." — on the same PDP as section 3; say if you want it included.
- Catalogue meta description: "Browse clinically assured digital therapeutics…"
- Opportunity detail heading: "Assured products for this pathway" and "assured product mapping"
- Workspace assurance tab: "The NHS HealthStore has nationally reviewed the assurance position of each product in your estate…" and "…certified by the NHS HealthStore as current at the time of review…"
- ~~About page~~ — treated in this iteration (see section 7).
- Guided start hint: "…assured digital therapeutics…"
- Resource page "What the NHS HealthStore is": "makes clinically assured DTx easier to find"
- Local opportunity data: "Fully assured; buyer pack and implementation guide available", "HTG-assured product (getUMobile)", "Product assured. Procurement in progress…"
- Commercial readiness — awaiting commercial team review.
- Real versions and expiry dates for all *(placeholder)* items.
- "Check if your ICB is DTx delivery ready" destination content.
- `docs/*.md` and `public/DS/Audits/*.html` — historical artefacts containing old copy.

---

## 7. About page (`/about`)

File: `app/about/page.tsx`

### 7.1 Intro lede

**Before**
> A nationally governed assurance and commercial-readiness layer with local commissioning accountability.

**After**
> We bring supplier evidence, NICE recommendations and commercial support together in one place. Commissioners retain all commissioning, clinical safety, assurance and deployment accountability.

### 7.2 First section

**Before — title / body**
> Assurance Pack
> Evidence, device regulation, IG assessment — maintained centrally so you don't duplicate work.

**After — title / body**
> Assurance support
> We centrally hold supplier assurance evidence — completed DTAC, accessibility audit, security certifications and more - which are reviewed and monitored for expiry. We make assurance easier and faster by providing access to source documents in your workspace once verified for your local assurance purposes.

### 7.3 Accountability section

**Before**
> Clinical safety, procurement, deployment and governance remain your responsibility.

**After**
> Clinical safety, local assurance, procurement, deployment and governance remain your responsibility.
