# Scratchpad — Commissioner service redesign (Jun 2026)

## Completed (Executor)
- Slice 0: NHS.UK frontend CSS integrated; NhsHeader/NhsFooter/AppShell; component decision log
- Slice 0: Commissioner context model (role, place, priority, scenario) with URL + cookie persistence
- Slice 0: Product narrative types + Luscii/myCOPD narratives in `lib/content/productNarratives.ts`
- Slice 0: Routes `/products`, `/start`, `/opportunities`, `/workspace` + redirects from legacy paths
- Slice 1: Service proposition homepage, 4-question guided journey, COPD opportunity page
- Slice 2: Product narrative pages (Luscii, myCOPD), custom components, COPD ROI scenario engine + tests
- Slice 3: LocalContextSelector + synthetic ICB reference data (West Yorkshire, Frimley)
- Slice 4: OTP support funnel, `/api/cases`, workspace + case detail, account verify

## Run locally
- `npm run db:migrate` for `0004_commissioning_cases.sql` before case persistence
- Prototype OTP: `123456`

## Code review: 8/10 | Security: Low (prototype OTP, no PII in forms by design)

## Visual Refresh (June 25)
- Replaced broken NHS.UK blue header with white NHS-style service header + sticky tab navigation
- Navigation now works (Next.js Link components, no NHS JS dependency for menu toggle)
- Removed excessive NHS Design System class reliance from all key pages
- Added HealthStore Visual System CSS: KPI tiles, pathway diagrams, impact bars, step cards, card grids
- Homepage rebuilt with visual storytelling: KPI headline, pathway before/after, impact bars
- COPD opportunity page: KPI cards for local data, impact bars, scenario controls as pill buttons
- Product narrative page: evidence cards, assurance passport with status colours, KPI financial grid
- Scenario controls changed from huge NHS radio buttons to compact pill-style selectors
- Fixed margin issues by removing nhsuk-main-wrapper padding override and adding hs-main-content container

### Lessons
- NHS Design System is a forms CSS library — use it for base fonts/headers but create custom visuals for data
- Always browser-test navigation changes
- The reporting service mockup is the reference for visual quality

## Visual Storytelling Redesign (June 25 — completed)
- SVG chart library: HorizontalBarChart, RetentionCurve, CoverageFunnel, BenchmarkRange, MiniBarTrack, InsightCallout
- Synthetic workspace datasets in `content/local/workspace-deployments.json` + `lib/localData/workspaceData.ts`
- Homepage: animated hero pathway, general DTx impact story (not leading with £ figures)
- Workspace: new-onboard vs mature-deployment toggle, expandable deployment table, retention/benchmark charts
- Product pages: impact at a glance section with charts + "So what?" callouts
- Visual consistency: guided start, support funnel, login AuthCard, catalogue, PdpTabs, account verify → `hs-` system
- Tests: `workspaceData.test.ts`, `charts.test.tsx`
- Build verified with `npx next build`

## Product Page v2 + Compare Reconnect (June 25 — completed)

### Impact section pre-buy/post-buy split
- Added `isProductDeployedForContext()` helper to detect live deployments per product per context
- Pre-buy: clinical evidence bars + unmet need KPIs + peer range (no "You" marker)
- Post-buy: full coverage funnel + benchmark with position marker
- Deployment status callout with contextual CTAs
- Fixed myCOPD claim matching bug (substring "admission" in "readmissions")
- BenchmarkRange now accepts optional `you` prop (null = range-only mode)
- Fixed national workspace-deployments.json: removed contradictory you/percentile/funnel data when no deployments exist

### Richer storytelling from product JSON
- "Where it's already live" section: deployment_register → site cards with ICB, count summary
- "What other sites found" section: case_studies → cards sorted by sample size (top 3)
- "Patient uptake signals" section: new `engagement_signals` field on ProductNarrative model, populated for Luscii (retention 98%, 6000+ enrolled, iPad inclusion) and myCOPD (78.8% activation, 60% daily login, doubled PR capacity, PAM OR 1.65)
- "On this page" nav moved above content sections with links to all new sections

### Compare tool reconnected
- `/compare` added to PUBLIC_PREFIXES (no login required)
- "Compare" link with basket count badge added to NhsHeader primary nav
- Opportunity page compare link now pre-populates product IDs
- CompareClient empty-state CTA → `/products` with "Browse products" label
- Summary card product links → `/products/[slug]`
- Pre-existing chart test import bug fixed

### Lessons
- Workspace data structure allows contradictory state (deployments:[] but benchmark "you" values) — validate at data level
- Substring matching for evidence claims is brittle — use claim_id or word-boundary regex
- `BenchmarkRange` should be designed for optional data from the start (nullable props)

## Spec v2 Correction — Immediate Fixes (June 26)

### Breadcrumb numbered list bug (FIXED)
- Root cause: NHS frontend CSS applies `ol { list-style-type: decimal; padding-left: 1.25rem }` globally
- Tailwind's `list-none` utility has lower cascade priority (inside `@layer utilities`)
- Fix: Added `nav[aria-label="Breadcrumb"] ol { list-style-type: none !important }` override in globals.css

### Chart sizing (FIXED per spec section 8.1)
- All SVG charts increased: viewBox widths to 680-720px, font sizes to 16-18px
- HorizontalBarChart: labels 16px, values 18px bold, row height 44px
- BenchmarkRange: labels 16px, "You" marker 18px bold, viewBox 680x140
- CoverageFunnel: labels 16px, bar height 38px, viewBox 720x280
- RetentionCurve: labels 16px, viewBox 700x300
- `.hs-chart-section` grid now uses `minmax(min(720px, 100%), 1fr)` — enforces half-width minimum

### Homepage rewrite (per spec section 3)
- Removed three-up impact charts and COPD pathway example from homepage
- Replaced with: DTx definition block, five-step journey, four impact lenses (text not charts), value exchange, pathway breadth (10 conditions with status labels), operating model section
- No condition-specific content above the fold; no charts on homepage
- Hero: spec-exact H1 and lead paragraph

### Favicon (per spec section 10.3)
- Deleted old `app/icon.png` (low-res blue square)
- Copied official assets from nhsuk-frontend: `favicon.ico`, `favicon.svg`, `apple-icon.png`
- Added explicit `metadata.icons` in layout.tsx

### Generic domain model (P0 — spec section 9.1)
- Created `lib/domain/types.ts` with MetricValue, PathwayOpportunity, DeploymentRecord, ConditionDomain, BenefitRecord, BenefitCategory
- Every metric carries basis/source/date/confidence/suppression — no naked numbers
- Priority bands are transparent rules: high/medium/watch/insufficient_data

### Condition taxonomy (P0)
- `content/reference/conditions.json` with 10 pathway domains
- contentStatus: fully_populated → deployment_fixtures → reporting_fixtures → opportunity_shell
- Only conditions with data beyond "shell" appear in priority selector

### Multi-pathway opportunity data (P0)
- `content/local/opportunity-overview.json` — Greater Manchester (QOP) as demonstration geography
- 6 pathways with opportunity data, 4 others as shells in taxonomy
- Each opportunity carries need, coverage, gap, deployments, evidence, readiness, impact (4 lenses), priority band + rationale

### Generic opportunity routing (P0)
- check-answers always routes to /opportunities (no COPD-specific fork)
- /opportunities is now area-wide overview with ranked pathway table, priority actions, and method notes
- /opportunities/[condition] dynamic route handles all conditions
- Deleted bespoke /opportunities/copd route
- Removed "unsupported" state from contextPersonalisationState

### Route-neutral deployment register (P1)
- QOP workspace data now includes 6 deployments across COPD, insomnia, depression, diabetes, cardiac rehab
- GlucoGuide recorded as `route: "other_route"` (non-HealthStore) with lower data completeness
- Workspace table shows Route column with visual tagging

### Workspace restructure (P1)
- 6 tabs: Overview, Need & Coverage, Deployments, Performance, Benefits, Cases
- CoverageSankey replaces old CoverageFunnel in Overview and Need tabs
- Deployments tab shows all-route table with expandable detail cards
- Performance tab filters by data quality threshold (≥80% completeness, ≥90 days)
- Benefits tab separates: observed activity, evaluated outcome, capacity released, modelled opportunity, cash releasing

### CoverageSankey component (P1)
- SVG Sankey-style flow: eligible → invited → registered → active
- Explicit red drop-off labels between each stage
- Accessible HTML table fallback via `<details>`

### Priority selector uses taxonomy
- StartPriorityClient now loads conditions from conditions.json
- Shows conditions with data (fully_populated, deployment_fixtures, reporting_fixtures) plus service pressure options
- "Something else" routes to area overview with no condition filter

### Greater Manchester as selectable geography
- Added QOP to copd-reference.json ICBs list
- Also present in workspace-deployments.json with full deployment fixture

### Quality pass — storytelling, data depth, deployment clarity (Jun 26)
**User feedback addressed:**
1. Story: Pages now lead with narrative, not cold KPIs. Opportunity overview opens with a
   one-paragraph summary of GM, then each pathway tells: problem → gap → evidence → state → action.
2. Population data: Each of the 3 supported pathways now has 6 health metrics (prevalence,
   high-risk cohort, admissions, readmissions/waits, cost burden, waiting list) with source attribution.
3. Deployments: Workspace overview shows portfolio-level aggregate (total active, % reached,
   on-track count, one-line narrative assessment). Drill-down per-product is in Deployments tab.
4. Visual: `hs-card-grid` changed to `auto-fill` so single cards don't stretch full width.
   Products grid uses `repeat(N, 1fr)` capped at actual product count.
5. Focus: Taxonomy narrowed to 3 NICE HTG supported pathways (COPD, cardiac rehab, MSK).
   Others moved to `horizon` array — shown as future pipeline, not active opportunities.

### Lessons
- NHS CSS global `ol` styling is aggressive — always check for specificity conflicts
- Chart readability requires minimum 720px rendered width per spec; never put substantive charts in 3-up card grids
- Homepage must explain the service, not demonstrate a single product
- Generic routing: always go to area overview; highlight the user's selected priority but show everything
- Benefit separation is a UX principle: observed ≠ modelled; never conflate them visually
- Lead with narrative, not numbers. KPIs support a story — they don't replace one.
- Portfolio view first, product drill-down second. Commissioners think in programmes, not products.
- Focus beats breadth: 3 deep conditions > 10 shells
