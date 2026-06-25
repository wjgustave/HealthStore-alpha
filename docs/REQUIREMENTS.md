# HealthStore — Basic requirements

A plain-language summary of what the HealthStore prototype does today, based on what is visible and usable in the app. It is intended as a quick reference for stakeholders, UCD, and new team members. For the full as-built traceability matrix (REQ IDs, file links, Jira/Epic alignment), see [BA_REQUIREMENTS_BASELINE.md](BA_REQUIREMENTS_BASELINE.md).

**Status:** Interactive prototype. Content is curated and indicative ("Prototype" badge shown throughout); it is not a live transactional buying system.

---

## 1. Who uses it

| Role | What they can do |
|------|------------------|
| Visitor (signed out) | View the public marketing pages: Home, News, Campaigns, Case studies, Cookies. Sign in. |
| Commissioner (signed in) | Everything above, plus the org workspace: Dashboard, Find apps, Comparison tool, Funding directory, Saved apps, EOI record, Org settings. |
| Multi-organisation user | On sign-in, must select a commissioning entity (ICB) before reaching the workspace. |

The signed-in experience is shared at organisation level — saved apps and the EOI record are visible to everyone in the same organisation.

---

## 2. Navigation and structure

- **Two-tier navigation when signed in:**
  - **Primary line (public, always visible):** Home, News, Campaigns, Case studies.
  - **Secondary bar (signed in only):** organisation name (links to Org settings) on the left; Dashboard, Find apps, Comparison tool, Funding directory on the right.
- **Signed out:** only the public primary line plus Sign in.
- A "Prototype" pill sits at the far left of the nav; the AI Advisor control (when enabled) sits at the far right.
- **Breadcrumbs** reflect the catalogue branch, e.g. Home / Find apps / Condition catalogue / [product]. Tool pages do not nest under Dashboard in the breadcrumb trail.
- **Footer** shows the prototype note and links; Find apps and Funding directory links are hidden when signed out.
- Access control: public pages are Home, News, Campaigns, Case studies, Cookies. All other pages require sign-in.

---

## 3. Pages and features

### Home (public)
- Hero banner with headline, sub-text, and a primary call to action ("Find out more" when signed out; "Go to Dashboard" / "Find apps" when signed in).
- Editorial sections: News and Campaigns (with "see all" links), a Case studies band, impact metrics, and a prototype disclaimer.

### Dashboard (signed in)
- Title "Dashboard" with the org-name subtitle ("[Organisation]'s shared space").
- **Catalogue search** plus an **Or** divider and a **Find apps** button.
- **Three stat tiles** (Saved apps, EOI record, Commissioned) linking to their pages.
- **Widgets:** Expression of interest activity, Saved apps, Commissioned apps.

### Find apps (signed in)
- Search by app name, supplier, or condition (with type-ahead suggestions).
- **Condition catalogue** grid of condition areas plus an "All apps" entry.

### Condition catalogue (signed in)
- Filterable, searchable list of digital therapeutics (condition, supervision, maturity, demo availability, price signals, related funding).
- Cards link to product detail and can be added to the compare basket or saved.

### Product detail page / PDP (signed in)
- Structured product information: clinical context, scale and maturity, where it's live, local effort, evidence, integrations, commercial model, and related funding.
- Badges (DTAC, maturity, effort, supervision, NICE types, conditions).
- Commissioning snapshot, supplier contact, save toggle, share/print, and an **Express interest** action that opens a modal.

### Comparison tool (signed in)
- Compares up to **four** apps that share a condition tag.
- Decision workspace grouped by task area, with persona lenses to emphasise relevant groups, and "Check with supplier" fallbacks for missing data.

### Funding directory (signed in)
- Funding opportunities grouped by status (open / upcoming / closed), linked to apps and conditions.

### Saved apps (signed in)
- Grid of products the organisation has saved, with remove controls and an empty state. Saved state is shared per organisation.

### EOI record (signed in)
- A shared record of submitted expressions of interest (app, who submitted, when). Reached at `/eoi-record` (the old `/express-interest` URL redirects here).

### Org settings (signed in)
- Organisation profile, persisted at organisation level.

### Cookies (public)
- Explains storage and analytics, with a consent reset control.

---

## 4. Sharing and export

- PDP sections can be **shared as a link** or **printed / saved as PDF** via a section checklist.
- Share links are signed (JWT), expire after ~14 days, and embed the product slug and commissioning entity. The recipient must be signed in and in the matching organisation to view the shared excerpt.

---

## 5. Privacy and analytics

- GOV.UK-style cookie banner with accept / reject; choice stored in the browser.
- Optional Hotjar analytics, loaded only with consent.
- An "alpha line" deployment mode can disable the cookie UI and analytics entirely.

---

## 6. Content

- All catalogue, funding, and editorial content comes from structured JSON files in `content/` (no live CMS).
- Missing fields degrade gracefully to "Not stated" / "Check with supplier" rather than blank.
- Reflects publicly available information as of March 2026.

---

## 7. Non-functional notes

- Built with Next.js (App Router), React, Tailwind, TypeScript; sessions via encrypted httpOnly cookie (iron-session); passwords hashed with bcrypt.
- Accessibility: skip link, landmarks, breadcrumb semantics, keyboard-accessible search and modals.
- NHS-oriented typography and styling.

---

## 8. Not in the prototype (known gaps)

- Real NHS authentication / enterprise role-based access (demo accounts only).
- End-to-end procurement workflow beyond the expression-of-interest modal.
- Operational reporting / MI dashboards (current metrics are illustrative).
- Live NICE / supplier data feeds and automated evidence validation.
- Persisted audit trail, share revocation, and a content authoring CMS.

---

*This is a lightweight companion to the full baseline. When behaviour changes, update this summary and the matching ID rows in [BA_REQUIREMENTS_BASELINE.md](BA_REQUIREMENTS_BASELINE.md).*
