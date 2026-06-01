# HealthStore — Business requirements baseline (as-built / retroactive)

**Version:** 1.1 (retroactive capture + Jira Epic alignment for UCD/dev handoff)  
**Purpose:** Handoff for **UCD**, **development**, and the **BA**: a catalogue of what this prototype **implements** (REQ IDs + traceability), plus **alignment** to Jira **UX/UI Commissioner Store** (in/out of scope, Alpha DoD, dependencies, risks). **Not** a legal/IG sign-off pack; BA adds MoSCoW, releases, and stakeholder acceptance.

**How to use this document**

1. Treat each **ID** (e.g. `AUTH-004`) as a baseline “the product (prototype) does this today.”
2. Refine with stakeholders: split, merge, **accept/reject**, add **MoSCoW**, **release** (prototype / pilot / production), and **test cases**.
3. For new scope, add IDs in the same epic family (e.g. `AUTH-020`) and link to designs, IG, or epics in your ALM tool.
4. **Engineering truth** for field-level behaviour remains in the referenced files (especially [`ADDING_APPS.md`](../ADDING_APPS.md), [`docs/PDP_SECTIONS_DEV_PLAN.md`](PDP_SECTIONS_DEV_PLAN.md), [`docs/compare-page-acceptance.md`](compare-page-acceptance.md), [`docs/SHARE.md`](SHARE.md)).

### Handoff audiences

| Audience | How to use this baseline |
|----------|---------------------------|
| **UCD** (research, content design, interaction, visual design) | Use **§3** (IA/navigation), **§6–8** (catalogue, PDP, compare), **§11** (privacy/consent), and **§14** (Epic vs prototype) to understand **what exists today**; run research and design for **gaps** and **partial** areas. User and service journeys: [`docs/USER_JOURNEY_MAPS.md`](USER_JOURNEY_MAPS.md); screen-level user flows: [`docs/USER_FLOWS.md`](USER_FLOWS.md). Pair with [`docs/TYPOGRAPHY.md`](TYPOGRAPHY.md), [`docs/compare-page-acceptance.md`](compare-page-acceptance.md), and [`docs/SHARE.md`](SHARE.md) for interaction and content-detail acceptance. |
| **Development** (e.g. DTX-531 Commissioner Store Tech Build) | Use **REQ IDs** and repository links as **traceability**; feed **§14.3 Alpha Definition of Done crosswalk** into backlog and technical spikes. [`ADDING_APPS.md`](../ADDING_APPS.md) and PDP/compare docs remain the field-level spec. |
| **Business analysis** | Own **prioritisation** (MoSCoW, releases), maintain IDs under the Jira **UX/UI Commissioner Store** epic, and keep **§14** aligned with stakeholder sign-off. |

### Parent Jira Epic (programme context)

| Field | Value |
|-------|--------|
| **Epic name** | UX/UI Commissioner Store |
| **Intent (summary)** | A centralised Commissioner Store in NHS **HealthStore** so commissioners and teams can **discover, evaluate, procure, and monitor** NICE-assured digital therapeutics—with transparent evidence, licensing/tariff clarity, and reporting aligned to ICBs. |
| **This repository** | **healthstore-alpha** — an **interactive prototype**: exploratory UX/UI and technical patterns, **not** the full production capability described in the Epic. |

Sections **§1–§13** describe **as-built** behaviour. **§14** maps **Epic programme language** to this prototype and highlights **gaps** for future requirements (Jira, UCD artefacts, tech build). **§15** is the compact REQ-ID traceability matrix; **§16** lists backlog hooks.

---

## 1. Scope and positioning

| ID | Requirement (baseline) | As-built summary | Primary traceability |
|----|------------------------|------------------|----------------------|
| **SCO-001** | The system is positioned as a **commissioner decision-support prototype** for NHS digital health technology procurement, not a live transactional buying system. | Copy, badges, and disclaimers emphasise “Prototype”; content is indicative. | [`README.md`](../README.md), [`components/AppShell.tsx`](../components/AppShell.tsx) (footer, prototype badge), [`content/dashboard/dashboard.json`](../content/dashboard/dashboard.json) (`about_note`) |
| **SCO-002** | Catalogue and narrative content are **curated from structured JSON**, not a headless CMS at runtime. | Apps, funding, dashboard, enums loaded from `/content`. | [`lib/data.ts`](../lib/data.ts), [`content/`](../content/), [`ADDING_APPS.md`](../ADDING_APPS.md) |
| **SCO-003** | The service reflects **publicly available information as of March 2026** and avoids implying supplier-verified currency for formal procurement. | Editorial copy and “about this prototype” messaging. | [`content/dashboard/dashboard.json`](../content/dashboard/dashboard.json), footer strings |

---

## 2. Personas and roles (as implemented)

| ID | Requirement (baseline) | As-built summary | Primary traceability |
|----|------------------------|------------------|----------------------|
| **ROL-001** | **Unauthenticated** users may access **sign-in** and **cookies** information only; all other app routes redirect to login. | Middleware enforces auth except `/login`, `/cookies`, and excluded API paths. | [`middleware.ts`](../middleware.ts) |
| **ROL-002** | **Primary demo user** (env-configured username + bcrypt password) signs in and lands on **home** with a **default commissioning context label** when no ICB is stored. | Session flags; default ICB display label. | [`app/api/auth/login/route.ts`](../app/api/auth/login/route.ts), [`lib/commissioningContextDisplay.ts`](../lib/commissioningContextDisplay.ts) (`DEFAULT_PRIMARY_ICB_NAME`) |
| **ROL-003** | **Multi-organisation demo user** (optional second env user) signs in and must **select a commissioning entity** before the store. | `requiresCommissioningEntitySelection`; redirect to `/select-entity`. | [`app/api/auth/login/route.ts`](../app/api/auth/login/route.ts), [`middleware.ts`](../middleware.ts), [`app/select-entity/`](../app/select-entity/) |
| **ROL-004** | **Named demo accounts** (JSON-configured) sign in with **profile** (display name, role, organisation, email) used for **nav subheader** and **Expression of interest** read-only fields. | Profile fields stored in session after password match against `content/auth-user-accounts.json`. | [`content/auth-user-accounts.json`](../content/auth-user-accounts.json), [`lib/authUserAccounts.ts`](../lib/authUserAccounts.ts), [`lib/expressionOfInterestPrefill.ts`](../lib/expressionOfInterestPrefill.ts), [`lib/commissioningContextDisplay.ts`](../lib/commissioningContextDisplay.ts) |
| **ROL-005** | **Signed-in commissioner** can browse catalogue, PDPs, compare, funding, share/print flows per route rules. | Post-login access per middleware. | [`middleware.ts`](../middleware.ts), route tree under [`app/`](../app/) |

---

## 3. Information architecture and navigation

| ID | Requirement (baseline) | As-built summary | Primary traceability |
|----|------------------------|------------------|----------------------|
| **IA-001** | **Home** route `/` presents dashboard-style content driven by JSON. | Server page composes home layouts. | [`app/page.tsx`](../app/page.tsx), [`components/home/`](../components/home/), [`content/dashboard/`](../content/dashboard/) |
| **IA-002** | **Find apps** hub at `/apps` lets users search and jump to **condition catalogue**. | [`AppsDiscoveryClient`](../app/apps/AppsDiscoveryClient.tsx), redirects with query. | [`app/apps/page.tsx`](../app/apps/page.tsx) |
| **IA-003** | **Condition catalogue** at `/apps/condition-catalogue` lists/filter catalogue (condition, supervision, maturity, etc.). | [`CatalogueClient`](../app/apps/CatalogueClient.tsx) |
| **IA-004** | Legacy **`/apps/browse`** URLs **redirect** to condition catalogue (query preserved). | Server redirect. | [`app/apps/browse/page.tsx`](../app/apps/browse/page.tsx) |
| **IA-005** | **Product detail** at `/apps/[slug]` shows full PDP for a catalogue app. | Dynamic route; `notFound` if unknown slug. | [`app/apps/[slug]/page.tsx`](../app/apps/[slug]/page.tsx) |
| **IA-006** | **Comparison tool** at `/compare` compares selected apps (basket constraints). | Client page with basket from URL/localStorage. | [`app/compare/`](../app/compare/), [`components/CompareBasketProvider.tsx`](../components/CompareBasketProvider.tsx) |
| **IA-015** | **Saved apps** at `/saved-apps` lists account-linked saved products; nav badge shows count. | Server page + bookmark API. | [`app/saved-apps/`](../app/saved-apps/), [`app/api/bookmarks/`](../app/api/bookmarks/), [`components/BookmarkProvider.tsx`](../components/BookmarkProvider.tsx) |
| **IA-007** | **Funding directory** at `/funding` lists funding opportunities by status sections. | Server page + cards. | [`app/funding/page.tsx`](../app/funding/page.tsx), [`content/funding/`](../content/funding/) |
| **IA-008** | **Shared product excerpt** at `/apps/[slug]/shared?t=…` shows allowlisted sections for valid token + session. | Dynamic route, JWT verification, org match. | [`app/apps/[slug]/shared/page.tsx`](../app/apps/[slug]/shared/page.tsx), [`docs/SHARE.md`](SHARE.md) |
| **IA-009** | **Cookies** at `/cookies` explains storage and Hotjar; **public** (no login). | Static-ish page + reset control. | [`app/cookies/page.tsx`](../app/cookies/page.tsx), [`middleware.ts`](../middleware.ts) |
| **IA-010** | **Select entity** at `/select-entity` for multi-org flow only. | Form + API. | [`app/select-entity/`](../app/select-entity/) |
| **IA-011** | **Global nav** exposes Home, Find apps, Saved apps, Comparison tool, Funding; **Sign in / Sign out** per session; mobile menu. | [`components/Nav.tsx`](../components/Nav.tsx) |
| **IA-012** | **Breadcrumbs** follow agreed IA (Home, Find apps peers, deeper under catalogue branch). | Reusable breadcrumb component. | [`components/PageBreadcrumb.tsx`](../components/PageBreadcrumb.tsx), usage in PDP/funding/cookies/etc. |
| **IA-013** | **Footer** shows prototype note and links (Find apps, Funding, Cookies on deployments that include them). | [`components/AppShell.tsx`](../components/AppShell.tsx) |
| **IA-014** | **Skip link** to main content for accessibility. | [`components/AppShell.tsx`](../components/AppShell.tsx) |

---

## 4. Authentication and session

| ID | Requirement (baseline) | As-built summary | Primary traceability |
|----|------------------------|------------------|----------------------|
| **AUTH-001** | Session is held in an **httpOnly encrypted cookie** (`dtx-store-session`) using **iron-session**. | Cookie name and options in session config. | [`lib/session.ts`](../lib/session.ts) |
| **AUTH-002** | **Login API** validates credentials (bcrypt); supports primary user, named accounts, optional multi user; sets **`accountKey`** for saved-apps persistence. | POST `/api/auth/login`. | [`app/api/auth/login/route.ts`](../app/api/auth/login/route.ts) |
| **AUTH-003** | **Logout API** destroys session. | POST `/api/auth/logout`. | [`app/api/auth/logout/route.ts`](../app/api/auth/logout/route.ts) |
| **AUTH-004** | **Select commissioning entity API** updates session for multi-org user. | POST `/api/auth/select-commissioning-entity`. | [`app/api/auth/select-commissioning-entity/route.ts`](../app/api/auth/select-commissioning-entity/route.ts) |
| **AUTH-005** | **Middleware** evaluates session on each matched request; **excludes** `api/auth` and `api/apps` from redirect matcher where documented so share API returns JSON errors. | Matcher + iron-session in middleware. | [`middleware.ts`](../middleware.ts), [`docs/SHARE.md`](SHARE.md) |
| **AUTH-006** | **Server misconfiguration** (e.g. missing `SESSION_SECRET`) causes middleware/runtime failure in deployment. | Non-functional risk; ops requirement. | [`middleware.ts`](../middleware.ts), [`README.md`](../README.md) |

---

## 5. Commissioning organisation context

| ID | Requirement (baseline) | As-built summary | Primary traceability |
|----|------------------------|------------------|----------------------|
| **ORG-001** | Canonical list of **selectable ICBs** for multi-org flow. | JSON-derived or static list in code. | [`lib/commissioningEntities.ts`](../lib/commissioningEntities.ts) |
| **ORG-002** | **Nav subheader** shows commissioning context label when user is signed in (named profile org, selected entity, “select ICB” placeholder, or default primary ICB). | `getCommissioningContextLabel`. | [`lib/commissioningContextDisplay.ts`](../lib/commissioningContextDisplay.ts), [`components/Nav.tsx`](../components/Nav.tsx) |

---

## 6. Catalogue and discovery

| ID | Requirement (baseline) | As-built summary | Primary traceability |
|----|------------------------|------------------|----------------------|
| **CAT-001** | Only apps in **visible condition areas** appear in filtered catalogue datasets used for home/charts/PDP list. | `VISIBLE_CONDITIONS` gates `getAllApps`. | [`lib/visibleConditions.ts`](../lib/visibleConditions.ts), [`ADDING_APPS.md`](../ADDING_APPS.md) |
| **CAT-002** | Catalogue supports **text search** and filters (e.g. condition, supervision, maturity, demo-only). | Client state + URL sync patterns. | [`app/apps/CatalogueClient.tsx`](../app/apps/CatalogueClient.tsx), [`lib/catalogueSearch.ts`](../lib/catalogueSearch.ts) |
| **CAT-003** | **Compare basket** persists up to **four** app IDs in **localStorage** and enforces **shared condition tag** across selection. | `sanitizeIdsForCompare`, `canAddToSelection`. | [`lib/compareConditions.ts`](../lib/compareConditions.ts), [`components/CompareBasketProvider.tsx`](../components/CompareBasketProvider.tsx) |
| **CAT-004** | Compare toggle communicates **max four** and **same condition** constraints to the user. | Tooltip / messaging. | [`components/CompareToggleButton.tsx`](../components/CompareToggleButton.tsx), [`app/compare/CompareClient.tsx`](../app/compare/CompareClient.tsx) |

---

## 7. Product detail page (PDP)

| ID | Requirement (baseline) | As-built summary | Primary traceability |
|----|------------------------|------------------|----------------------|
| **PDP-001** | PDP renders **structured sections** from app JSON (clinical context, scale/maturity, local effort, impact, evidence, integrations, commercial, funding links, etc.). | Large server page + section components. | [`app/apps/[slug]/page.tsx`](../app/apps/[slug]/page.tsx), [`components/AppDetailSections.tsx`](../components/AppDetailSections.tsx), [`docs/PDP_SECTIONS_DEV_PLAN.md`](PDP_SECTIONS_DEV_PLAN.md) |
| **PDP-002** | PDP shows **badges** for DTAC, maturity, effort, supervision, NICE types, conditions, alerts where data present. | [`components/Badges.tsx`](../components/Badges.tsx), PDP blocks |
| **PDP-003** | **Commissioning snapshot** cards tie product to funding posture where content supports it. | [`lib/commissioningSnapshot.ts`](../lib/commissioningSnapshot.ts), [`components/PdpCommissioningSnapshot.tsx`](../components/PdpCommissioningSnapshot.tsx) |
| **PDP-004** | **Supplier contact** surface (e.g. email-focused card) appears per content rules. | [`components/PdpSupplierContactCard.tsx`](../components/PdpSupplierContactCard.tsx) |
| **PDP-005** | **Expression of interest** is triggered from in-page controls; **modal** collects further fields with **read-only** contact block prefilled from session rules. | Client wrapper + modal. | [`app/apps/[slug]/AppDetailClient.tsx`](../app/apps/[slug]/AppDetailClient.tsx), [`components/ExpressInterestModal.tsx`](../components/ExpressInterestModal.tsx) |
| **PDP-006** | **Share** and **print/PDF** flows register page regions and support selective export. | Provider + regions + modal. | [`docs/SHARE.md`](SHARE.md), [`components/PdpSharePrintContext.tsx`](../components/PdpSharePrintContext.tsx), [`components/SharePagePanel.tsx`](../components/SharePagePanel.tsx) |
| **PDP-007** | **Live sites** list may show structured contact/tooltip behaviour where implemented. | [`components/LiveSitesStructuredList.tsx`](../components/LiveSitesStructuredList.tsx), [`lib/liveSiteContact.ts`](../lib/liveSiteContact.ts) |

---

## 8. Comparison tool

| ID | Requirement (baseline) | As-built summary | Primary traceability |
|----|------------------------|------------------|----------------------|
| **CMP-001** | Compare page shows **summary strip** and **grouped matrix** (clinical context, adoption & assurance, commercial & delivery) with defined row catalogue. | Hybrid layout implementation. | [`app/compare/CompareClient.tsx`](../app/compare/CompareClient.tsx), [`docs/compare-page-acceptance.md`](compare-page-acceptance.md) |
| **CMP-002** | Cell content uses **formatting helpers** with **“Not stated”** fallbacks when JSON fields missing. | [`lib/compareFieldFormat.ts`](../lib/compareFieldFormat.ts) |
| **CMP-003** | Empty compare basket shows **empty state** with CTA back to catalogue. | UX requirement; see acceptance doc checklist. | [`docs/compare-page-acceptance.md`](compare-page-acceptance.md) |
| **CMP-004** | Table supports **accessibility** expectations (caption, section semantics, remove labels). | Documented in acceptance criteria. | [`docs/compare-page-acceptance.md`](compare-page-acceptance.md) |

---

## 8a. Saved apps

| ID | Requirement (baseline) | As-built summary | Primary traceability |
|----|------------------------|------------------|----------------------|
| **SAV-001** | User can **Save / Saved** toggle on PDP hero and catalogue cards. | Toggle mirrors compare styling; `wa-icon` bookmark. | [`components/SaveToggleButton.tsx`](../components/SaveToggleButton.tsx), [`app/apps/[slug]/page.tsx`](../app/apps/[slug]/page.tsx), [`app/apps/CatalogueClient.tsx`](../app/apps/CatalogueClient.tsx) |
| **SAV-002** | **Saved apps** page at `/saved-apps` shows card grid, empty state, remove control, sorted by most recently saved. | Client page driven by bookmark provider. | [`app/saved-apps/SavedAppsClient.tsx`](../app/saved-apps/SavedAppsClient.tsx) |
| **SAV-003** | **Nav** shows **Saved apps** link with count badge (desktop + mobile). | [`components/Nav.tsx`](../components/Nav.tsx) |
| **SAV-004** | Bookmarks persist **per account** via server API (`GET`/`POST`/`DELETE` `/api/bookmarks`); prototype uses JSON file store keyed by `session.accountKey`. | [`lib/bookmarksStore.ts`](../lib/bookmarksStore.ts), [`app/api/bookmarks/`](../app/api/bookmarks/) |

**Prototype caveat:** File-based store (`.data/bookmarks.json`) is suitable for local/`next start`; production serverless deploys should use KV or a database via the same store interface.

---

## 9. Funding

| ID | Requirement (baseline) | As-built summary | Primary traceability |
|----|------------------------|------------------|----------------------|
| **FUND-001** | **Funding directory** groups opportunities (e.g. open / upcoming / closed) and links to apps/conditions. | [`app/funding/page.tsx`](../app/funding/page.tsx), [`content/funding/funding.json`](../content/funding/funding.json) |
| **FUND-002** | **PDP “related funding”** only surfaces commissioner-facing funding rows per `commissioner_display` and linking rules. | [`ADDING_APPS.md`](../ADDING_APPS.md) (`linked_funding_ids`, `commissioner_display`) |
| **FUND-003** | **NHSE £125k** row suppressed for non-COPD contexts per content rules. | [`ADDING_APPS.md`](../ADDING_APPS.md) |

---

## 10. Share, print, and product excerpts

| ID | Requirement (baseline) | As-built summary | Primary traceability |
|----|------------------------|------------------|----------------------|
| **SHR-001** | User can open **Share** modal: **share as link** or **print/save PDF** with **section checklist**. | Two-step modal. | [`docs/SHARE.md`](SHARE.md), [`components/SharePagePanel.tsx`](../components/SharePagePanel.tsx) |
| **SHR-002** | **Create link** POSTs allowlisted section keys; server returns signed URL with **JWT**, **~14 day expiry**, **slug + commissioning entity** embedded. | [`app/api/apps/[slug]/share/route.ts`](../app/api/apps/[slug]/share/route.ts), [`lib/productShareToken.ts`](../lib/productShareToken.ts), [`lib/pdpShareKeys.ts`](../lib/pdpShareKeys.ts) |
| **SHR-003** | **Shared page** verifies token, session login, commissioning entity match; renders subset via `PdpSharedProductBody`. | [`app/apps/[slug]/shared/page.tsx`](../app/apps/[slug]/shared/page.tsx) |
| **SHR-004** | **Browser print** path hides chrome and excluded regions per print CSS. | [`app/globals.css`](../app/globals.css) `@media print`, [`docs/SHARE.md`](SHARE.md) |
| **SHR-005** | **Track B backlog**: persisted shares, revocation, opaque URLs, audit — **not implemented** (documented future). | [`docs/SHARE.md`](SHARE.md) “Follow-up (Track B)” |

---

## 11. Privacy, cookies, and analytics

| ID | Requirement (baseline) | As-built summary | Primary traceability |
|----|------------------------|------------------|----------------------|
| **PRIV-001** | **Cookie banner** follows GOV.UK-style accept/reject + link to cookies page (when consent UI enabled). | [`components/CookieBanner.tsx`](../components/CookieBanner.tsx) |
| **PRIV-002** | **Consent root** persists choice in **localStorage**; default behaviour loads **Hotjar** unless user rejected (prototype policy). | [`components/CookieConsentRoot.tsx`](../components/CookieConsentRoot.tsx), [`lib/cookieConsentStorage.ts`](../lib/cookieConsentStorage.ts) |
| **PRIV-003** | **Cookies page** explains browser storage choice, analytics line, reset button. | [`app/cookies/page.tsx`](../app/cookies/page.tsx), [`components/ResetCookieConsentButton.tsx`](../components/ResetCookieConsentButton.tsx) |
| **PRIV-004** | **Hotjar** loader + **SPA route** `stateChange` when analytics enabled. | [`components/HotjarWhenConsented.tsx`](../components/HotjarWhenConsented.tsx), [`components/HotjarRouteTracker.tsx`](../components/HotjarRouteTracker.tsx), [`lib/hotjarSite.ts`](../lib/hotjarSite.ts) |
| **PRIV-005** | **Alpha line** deployment can **skip** cookie UI and **Hotjar** entirely via `NEXT_PUBLIC_ALPHA_LINE`. | [`app/layout.tsx`](../app/layout.tsx), [`lib/alphaLine.ts`](../lib/alphaLine.ts), [`README.md`](../README.md) |

---

## 12. Content operations

| ID | Requirement (baseline) | As-built summary | Primary traceability |
|----|------------------------|------------------|----------------------|
| **CNT-001** | **Per-app JSON** is the source of truth for catalogue and PDP fields; editors follow field mapping guide. | [`ADDING_APPS.md`](../ADDING_APPS.md), [`content/apps/*.json`](../content/apps/) |
| **CNT-002** | **Shared enums/labels** live under `content/common`. | [`content/common/`](../content/common/) |
| **CNT-003** | **Funding content** maintained in `content/funding/funding.json` with commissioner display classes. | [`ADDING_APPS.md`](../ADDING_APPS.md), [`content/funding/`](../content/funding/) |
| **CNT-004** | **Dashboard/home** editorial content in `content/dashboard`. | [`content/dashboard/`](../content/dashboard/) |

---

## 13. Non-functional and operational

| ID | Requirement (baseline) | As-built summary | Primary traceability |
|----|------------------------|------------------|----------------------|
| **NFR-001** | **Stack:** Next.js App Router, React, Tailwind v4, TypeScript, iron-session, bcryptjs, Hotjar (optional). | [`README.md`](../README.md), [`package.json`](../package.json) |
| **NFR-002** | **Environment variables** documented for session, auth hashes, optional share secret, alpha line, etc. | [`README.md`](../README.md), [`.env.example`](../.env.example) |
| **NFR-003** | **Accessibility:** skip link, landmarks, breadcrumb nav semantics, modal/print considerations per components and docs. | [`components/AppShell.tsx`](../components/AppShell.tsx), [`docs/compare-page-acceptance.md`](compare-page-acceptance.md), [`docs/SHARE.md`](SHARE.md) |
| **NFR-004** | **Typography / NHS-oriented styling** documented separately. | [`docs/TYPOGRAPHY.md`](TYPOGRAPHY.md) |
| **NFR-005** | **Prototype data quality:** missing JSON yields **Not stated** or shorter excerpts in compare and PDP. | [`docs/compare-page-acceptance.md`](compare-page-acceptance.md) “Content backlog” |

---

## 14. Jira Epic alignment (UX/UI Commissioner Store)

Use this section to bridge **programme intent** (Epic) and **this prototype**. Status legend: **Met (prototype)** = meaningful UX exists in repo; **Partial** = subset or static/indicative only; **Not in prototype** = requires future build / other systems; **N/A** = explicitly out of Epic scope for physical build here.

### 14.1 Epic “In scope” vs this prototype

| Epic in-scope theme | Prototype status | Notes / relevant REQ IDs |
|---------------------|------------------|---------------------------|
| Centralised catalogue of NICE-assured digital therapeutics | Partial | Curated per-app JSON; condition **visibility** gated in code (`VISIBLE_CONDITIONS`). Not a live NICE feed. **CAT-001**, **CNT-001**, **IA-003**. |
| Clinical evidence, NICE guidance, validation / assurance display | Partial | PDP + compare matrix surface evidence and DTAC/NICE-style badges from **content**; not verified supplier APIs. **PDP-001**, **PDP-002**, **CMP-001**, **CMP-002**. |
| Transparent pricing (license fees, tariffs) | Partial | **Indicative** commercial text and models in JSON; depends on **DTX-533** and content for national consistency. **PDP-001**, **FUND-**\*, [`ADDING_APPS.md`](../ADDING_APPS.md). |
| Procurement workflows | Minimal | **Expression of interest** modal only (no case tracking, approvals, or HS-hosted procurement). **PDP-005**. |
| Role-based access (ICB / commissioning staff) | Prototype / demo | Env + JSON **demo** users; optional **multi-org** entity pick. Not NHS Login / enterprise RBAC. **ROL-**\*, **AUTH-**\*, **ORG-**\*. |
| Reporting dashboards (uptake, outcomes, cost-effectiveness) | Not in prototype | Homepage / dashboard bands use **editorial JSON** and charts over **catalogue data**—not operational MI/BI or supplier feeds (**DTX-530**). **IA-001**, gap vs Epic. |
| Integration with NHS systems (auth / reporting) | Not in prototype | **iron-session** cookie auth only; PDP may describe **product** integrations as text. **AUTH-**\*, **PDP-001**. |
| Audit trail of procurement decisions | Not in prototype | No persisted procurement log; share links are JWT-based without audit DB (**SHR-005**). |
| Supplier onboarding (governance) | Not in prototype | Process lives under programme (**DTX-557**); codebase = content editing guides only. **CNT-**\*. |
| Data validation for evidence / metrics | Partial | Editorial discipline + “Not stated” patterns; no automated certification pipeline. **NFR-005**, **CNT-001**. |

### 14.2 Epic “Out of scope” (confirmed for this codebase)

These remain **out of scope** for this repo, consistent with the Epic: clinical validation of DTx products themselves; **patient-facing** onboarding; **payment processing**; **non–NICE-assured** products unless future content explicitly adds them; **detailed contract negotiation** workflows beyond structured commercial fields in JSON.

### 14.3 Alpha Definition of Done — crosswalk

Crosswalk from Epic **Definition of Done — Alpha** to this prototype. “Feeds DTX-531” = this doc + REQ IDs can seed tech-build stories; **UCD** should own UI/permissions documentation called for below.

| Alpha DoD item (paraphrased from Epic) | Status in healthstore-alpha | Notes |
|----------------------------------------|----------------------------|--------|
| Requirements feed **DTX-531** Tech Build | Partial | This baseline + engineering docs provide **as-is** scope; BA must raise **delta** reqs for production. |
| Commissioner Store **UI documented** with **RBAC** (at appropriate scale) | Partial | **UCD** should produce formal pattern library + role matrix; prototype shows **demo** roles only. **ROL-**\*, **Nav**, **AppShell**. |
| NICE-assured products **listed** with **verified clinical evidence** | Partial | **Listed** from JSON; **verification** is programme/content responsibility, not automated. **CAT-001**, **PDP-001**. |
| **Clear pricing** (license + tariff) | Partial | **Indicative** only; clarity depends on **DTX-533** + content model. |
| **Search, filter, compare** | Met (prototype) | **CAT-002**, **CMP-**\*, **IA-003**, **IA-006**. |
| **Initiate / complete procurement workflows** | Minimal | **PDP-005** UX only; “complete” workflow **not** in HS env per Epic caveat. |
| **Reporting dashboards**: utilisation, outcomes, cost insights | Not in prototype | Align to **DTX-530**; prototype has **static** dashboard-style UI only. |
| **NHS authentication** functional | Not in prototype | Replace demo auth; feed requirements into **DTX-531** / IdP programme work. **AUTH-**\*. |
| **Audit logs** for procurement activities | Not in prototype | **SHR-005**; MI activity for Beta is out-of-repo unless specified. |
| **Supplier onboarding process defined** | Programme | **DTX-557**; document referenced from Jira, not this repo. |
| **Data validation** for evidence / metrics | Partial | Content + engineering patterns; full validation TBD with suppliers/IG. |
| **Documentation and training** (Beta) | Partial | README + `docs/` + this baseline; **end-user** training packs are programme deliverables. |
| **Stakeholder sign-off** (commissioning / governance) | Programme | BA/governance owns; prototype supports **demos** only. |

### 14.4 Programme dependencies (from Epic)

| Dependency (Epic reference) | Implication for UCD / dev |
|----------------------------|---------------------------|
| NICE assurance **data / APIs** (e.g. **DTX-562** Content Design & Management) | Prototype uses **manual JSON**; production catalogue needs **source-of-truth** contracts and content workflow. |
| **NHS procurement / commercial** alignment (**DTX-533**) | Pricing/tariff **schema** and display rules should replace purely indicative copy when available. |
| **NHS identity / access** (e.g. NHS Login for **staff**) | Replace **AUTH-** demo implementation; UCD: journeys per role; Dev: integration spikes. |
| **Supplier data feeds** for reporting (**DTX-557** 3rd party engagement) | Reporting dashboards (**DTX-530**) depend on feeds; none in this prototype. |
| **Governance** for supplier onboarding | Process + approvals outside this repo. |
| **ICB reporting / data standards** (**DTX-261**) | Future MI/BI and audit must align; not implemented here. |
| **Clinical, Assurance & IG** (**DTX-262**) | Affects assurance display and validation rules; cookies/analytics already **PRIV-**\*. |

### 14.5 Programme risks (from Epic; prototype angle)

| Risk (Epic) | Mitigation (Epic) | Relevance to prototype |
|-------------|-------------------|------------------------|
| Incomplete evidence | Standardised submission + ICB engagement | UCD/content: stress-test **PDP/compare** with sparse data (**NFR-005**). |
| Pricing / tariff complexity | Normalised pricing schema | BA/Dev: extend JSON + **PDP/CMP** when **DTX-533** lands. |
| Low commissioner adoption | Training, workflow fit | UCD: research against **IA** and procurement **gap** (**PDP-005** only). |
| Reporting data quality | Validation + supplier certification | Not addressed in code until **DTX-530** + feeds. |
| NHS **integration** challenges | Standards, phased rollout | Prototype shows **integration as copy** only on PDP. |
| Regulatory / NICE assurance change | Flexible data models | **CNT-001** / enums evolution; IG epic **DTX-262**. |

---

## 15. Traceability matrix (appendix)

Compact index for test / IG / Jira linking. Expand per ID in sections **§1–§13**.

| ID | Epic area | Primary code / doc |
|----|-----------|---------------------|
| SCO-* | Scope | README, dashboard.json, AppShell |
| ROL-* | Roles | middleware, login route, auth-user-accounts, expressionOfInterestPrefill |
| IA-* | Information architecture | `app/**/page.tsx`, Nav, AppShell, PageBreadcrumb |
| AUTH-* | Authentication | session.ts, api/auth/*, middleware |
| ORG-* | Organisation | commissioningEntities, commissioningContextDisplay |
| CAT-* | Catalogue | visibleConditions, CatalogueClient, compareConditions, CompareBasketProvider |
| PDP-* | Product detail | page.tsx App slug, AppDetailSections, Share docs, ExpressInterestModal |
| CMP-* | Compare | CompareClient, compareFieldFormat, compare-page-acceptance |
| FUND-* | Funding | funding page, funding.json, ADDING_APPS |
| SHR-* | Share / print | SHARE.md, SharePagePanel, shared page, share API |
| PRIV-* | Privacy / analytics | Cookie*, Hotjar*, alphaLine, layout |
| CNT-* | Content | content/*, ADDING_APPS |
| NFR-* | Non-functional | README, TYPOGRAPHY, acceptance docs |

---

## 16. Gaps and explicit backlog hooks (for BA prioritisation)

| Theme | Notes |
|-------|--------|
| **Share Track B** | Revocation, persistence, audit, shorter URLs ([`docs/SHARE.md`](SHARE.md)). |
| **Compare QA** | Several acceptance checkboxes remain **unchecked** in [`docs/compare-page-acceptance.md`](compare-page-acceptance.md); BA can convert to formal UAT. |
| **Legal / IG** | Cookies copy is prototype-level; production needs DPO sign-off. |
| **Auth model** | Password-in-env / JSON is demo-only; production needs IdP, MFA, account lifecycle. |
| **Content completeness** | Backfill `context_of_use`, `technical_integrations`, `evidence_summary` per compare doc to reduce “Not stated”. |
| **CMS** | No authoring workflow; all changes are Git JSON edits. |

---

## Document control

| | |
|--|--|
| **Maintainer** | BA (refinement); engineering updates when behaviour changes. |
| **Change process** | When code changes, update the affected **ID** row or add a new ID; bump **Version** footer or use Git history. |

*End of baseline v1.1 — mirrors repository at time of writing; sync with linked engineering docs when behaviour changes.*
