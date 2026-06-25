# HealthStore — Requirements delta (changes vs baseline)

**Purpose:** Cross-references [BA_REQUIREMENTS_BASELINE.md](BA_REQUIREMENTS_BASELINE.md) against recent changes to the prototype and captures **what is new or changed**. Use this alongside the baseline: where a baseline ID is amended, the new behaviour below supersedes the original row; new IDs extend the same epic families.

**Status legend:** **Changed** = existing baseline ID amended · **New** = behaviour not previously captured · **Removed** = previously present, now taken out.

---

## 1. Summary of change themes

1. **Two-tier navigation** separating public destinations from the signed-in organisation workspace.
2. **Public editorial pages** (News, Campaigns, Case studies) are first-class, signed-out destinations.
3. **Dashboard** is a distinct signed-in workspace, separate from the public home page, with catalogue search and quick-stat tiles.
4. **Expressions of interest** renamed to **EOI record** with a new URL and trimmed copy.
5. **PDP "Where it's live"** and **funding** presentation refinements.
6. **Comparison tool** moved from a grouped matrix to a decision workspace with persona lenses.
7. Assorted **content and styling** updates.

---

## 2. Information architecture and navigation

| ID | Status | Baseline behaviour | New / changed behaviour | Traceability |
|----|--------|--------------------|--------------------------|--------------|
| **IA-001** | Changed | Home `/` presents dashboard-style content. | Home `/` is the **public marketing page** (hero, News, Campaigns, Case studies band, impact, disclaimer). Signed-in dashboard content moved to `/dashboard`. | [`app/page.tsx`](../app/page.tsx), [`components/home/HomePublicContent.tsx`](../components/home/HomePublicContent.tsx) |
| **IA-011** | Changed | Single global nav: Home, Find apps, Saved apps, Comparison tool, Funding; Sign in/out. | **Two-tier nav.** Primary line (public, always visible): Home, News, Campaigns, Case studies. Secondary bar (signed in only): organisation name (links to Org settings) + Dashboard, Find apps, Comparison tool, Funding directory. Prototype pill far-left; AI Advisor far-right; both rows aligned to the content grid. | [`components/Nav.tsx`](../components/Nav.tsx) |
| **IA-012** | Changed | Breadcrumbs nest deeper routes under the Find apps branch. | Confirmed pattern: tool pages use the **Find apps branch directly** (e.g. Home / Find apps / Condition catalogue / [product]); **no Dashboard crumb** is inserted on tool pages. Dashboard page itself shows Home / Dashboard. | [`components/PageBreadcrumb.tsx`](../components/PageBreadcrumb.tsx), tool page clients |
| **IA-013** | Changed | Footer links: Find apps, Funding, Cookies. | Footer **hides Find apps and Funding directory when signed out**; Cookies always shown; Manage data when signed in. Footer aligned to the content grid. | [`components/AppShell.tsx`](../components/AppShell.tsx) |
| **IA-016** | New | — | **News** page at `/news` (public). | [`app/news/page.tsx`](../app/news/page.tsx) |
| **IA-017** | New | — | **Campaigns** page at `/campaigns` (public). | [`app/campaigns/page.tsx`](../app/campaigns/page.tsx) |
| **IA-018** | New | — | **Case studies** page at `/case-studies` (public). | [`app/case-studies/page.tsx`](../app/case-studies/page.tsx) |
| **IA-019** | New | — | **Dashboard** workspace at `/dashboard` (signed in); logo links here when signed in. | [`app/dashboard/page.tsx`](../app/dashboard/page.tsx) |
| **IA-020** | New | — | **Org settings** at `/org-settings` (signed in), reached from the organisation name in the secondary bar. | [`app/org-settings/page.tsx`](../app/org-settings/page.tsx) |

---

## 3. Roles and access

| ID | Status | Baseline behaviour | New / changed behaviour | Traceability |
|----|--------|--------------------|--------------------------|--------------|
| **ROL-001** | Changed | Unauthenticated users may access sign-in and cookies only. | Public (no login) now includes **Home, News, Campaigns, Case studies, Cookies**. All other routes still redirect to login. | [`middleware.ts`](../middleware.ts) (`publicPaths`) |
| **ROL-002** | Changed | Primary demo user lands on **home** after login. | After login the user lands on **`/dashboard`** (multi-org users still routed to `/select-entity` first). | [`middleware.ts`](../middleware.ts), [`app/dashboard/page.tsx`](../app/dashboard/page.tsx) |

---

## 4. Dashboard (new section — DSH)

| ID | Status | Behaviour | Traceability |
|----|--------|-----------|--------------|
| **DSH-001** | New | Dashboard heading is **"Dashboard"** with subtitle **"[Organisation]'s shared space"** derived from the session commissioning context. | [`components/home/dashboard/DashboardWelcome.tsx`](../components/home/dashboard/DashboardWelcome.tsx) |
| **DSH-002** | New | Dashboard provides a **catalogue search** (reusing the home hero search), an **Or** divider, and a **Find apps** button. | [`components/home/dashboard/DashboardV4.tsx`](../components/home/dashboard/DashboardV4.tsx), [`components/home/HomeHeroSearch.tsx`](../components/home/HomeHeroSearch.tsx) |
| **DSH-003** | New | **Three quick-stat tiles** — Saved apps, EOI record, Commissioned — link to their pages. Tiles use a tinted background, white icon chips (max 32x32), and darker-grey labels; the row is capped at half width on larger screens. | [`components/home/dashboard/widgets/DashboardStatTiles.tsx`](../components/home/dashboard/widgets/DashboardStatTiles.tsx) |
| **DSH-004** | New | Dashboard widgets: **EOI activity**, **Saved apps**, **Commissioned apps**. Empty states are concise ("No expressions of interest yet.", "You have not saved any apps yet."). | [`components/home/dashboard/widgets/`](../components/home/dashboard/widgets/) |
| **DSH-005** | Removed | The **Dataset overview** band was removed from both the dashboard and the public home page. | [`components/home/dashboard/DashboardV4.tsx`](../components/home/dashboard/DashboardV4.tsx), [`components/home/HomePublicContent.tsx`](../components/home/HomePublicContent.tsx) |

---

## 5. Expression of interest / EOI record

| ID | Status | Baseline behaviour | New / changed behaviour | Traceability |
|----|--------|--------------------|--------------------------|--------------|
| **PDP-005** | Unchanged | Express interest modal on PDP. | Modal trigger and behaviour unchanged; API stays at `/api/express-interest`. | [`app/apps/[slug]/AppDetailClient.tsx`](../app/apps/[slug]/AppDetailClient.tsx) |
| **EOI-001** | New | — | **EOI record** page at `/eoi-record` lists submitted expressions of interest (app, submitter, timestamp). Title and breadcrumb read "EOI record". Intro: "A shared record of submitted expression of interest." | [`app/eoi-record/page.tsx`](../app/eoi-record/page.tsx), [`app/eoi-record/EoiRecordClient.tsx`](../app/eoi-record/EoiRecordClient.tsx) |
| **EOI-002** | New | — | Legacy `/express-interest` **redirects** to `/eoi-record`. | [`app/express-interest/page.tsx`](../app/express-interest/page.tsx) |
| **EOI-003** | Changed | Nav/dashboard label "Expressions of interest". | Dashboard stat tile, EOI activity widget link ("View EOI record"), and Clear-data label all use **"EOI record"** and the `/eoi-record` route. | [`components/home/dashboard/widgets/DashboardStatTiles.tsx`](../components/home/dashboard/widgets/DashboardStatTiles.tsx), [`components/home/dashboard/widgets/EoiActivityWidget.tsx`](../components/home/dashboard/widgets/EoiActivityWidget.tsx), [`components/ClearDataModal.tsx`](../components/ClearDataModal.tsx) |

---

## 6. Product detail page

| ID | Status | Baseline behaviour | New / changed behaviour | Traceability |
|----|--------|--------------------|--------------------------|--------------|
| **PDP-007** | Changed | Live sites list with structured contact behaviour. | **"Where it's live"** callout now shows the site count as a larger, bold figure (e.g. "5 sites") with inline pilot/research status; the "Live at" prefix and the "Across X ICBs" subline were removed. | [`lib/whereLiveSummary.ts`](../lib/whereLiveSummary.ts), [`components/PdpWhereLive.tsx`](../components/PdpWhereLive.tsx) |
| **PDP-003** | Changed | Commissioning snapshot ties product to funding posture. | Funding callout heading hidden (screen-reader text retained); "Related funding opportunities" link left-aligned in the snapshot strip. | [`components/PdpCommissioningSnapshot.tsx`](../components/PdpCommissioningSnapshot.tsx), [`lib/commissioningSnapshot.ts`](../lib/commissioningSnapshot.ts) |

---

## 7. Catalogue and comparison

| ID | Status | Baseline behaviour | New / changed behaviour | Traceability |
|----|--------|--------------------|--------------------------|--------------|
| **CAT-005** | New/Changed | Catalogue card signals. | Catalogue card funding signal relabelled from "Funding opportunities" to **"Related funding"** (applies to Find apps results and condition catalogue). | [`app/apps/CatalogueClient.tsx`](../app/apps/CatalogueClient.tsx) |
| **CMP-001** | Changed | Summary strip + grouped matrix (three groups). | Comparison now renders a **decision workspace** of fixed task groups with **persona lenses** (All, Clinical safety, Finance & procurement, IG & assurance) that emphasise — but do not reorder — matching groups. The legacy matrix view is built but not surfaced. | [`app/compare/CompareClient.tsx`](../app/compare/CompareClient.tsx), [`components/compare/CompareWorkspaceView.tsx`](../components/compare/CompareWorkspaceView.tsx), [`lib/compareConfig.ts`](../lib/compareConfig.ts) |
| **CMP-002** | Changed | Formatting helpers with "Not stated" fallbacks. | Empty values now fall back to **"Check with supplier"**; where-it's-live cells reuse the structured summary. | [`lib/compareFieldFormat.ts`](../lib/compareFieldFormat.ts) |

---

## 8. Content and styling

| ID | Status | New / changed behaviour | Traceability |
|----|--------|--------------------------|--------------|
| **SCO-001** | Changed | Prototype pill restyled to a light grey-blue (`#EDF1F6` background, slate text) and relocated to the far left of the nav. | [`app/globals.css`](../app/globals.css) (`.badge-prototype`), [`components/Nav.tsx`](../components/Nav.tsx) |
| **CNT-004** | Changed | Home hero signed-out CTA now reads **"Find out more"**. Commissioned metrics note shortened to "Illustrative metrics for prototype demonstration." | [`app/page.tsx`](../app/page.tsx), [`content/home/concept-grid.json`](../content/home/concept-grid.json) |

---

## 9. Open questions for BA / UCD

- Should tool pages (Find apps, Compare, Funding) reflect the Dashboard nesting anywhere (e.g. an explicit "back to dashboard" affordance), given breadcrumbs no longer include it?
- Confirm whether the shared product excerpt (`/apps/[slug]/shared`) breadcrumbs should also drop any Dashboard reference (currently unchanged).
- Confirm the legacy `/express-interest` redirect can be retired once external links are updated.
- Confirm whether the hidden compare matrix view should be removed or retained as a toggle.

---

*Companion to [BA_REQUIREMENTS_BASELINE.md](BA_REQUIREMENTS_BASELINE.md). When these deltas are accepted, fold them into the baseline ID rows and retire this file or restart it for the next change set.*
