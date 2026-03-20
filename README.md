# NHS Commissioner DTx Store

A commissioner decision-support tool for NHS digital health technology procurement. Built on Next.js with a full static export.

## What's included

- **Homepage** — hero, condition browser, NICE HTE19 COPD app grid, real-world impact metrics
- **App catalogue** (`/apps`) — filterable by condition, supervision model, local effort, DTAC status
- **App detail pages** (`/apps/[slug]`) — commissioner assessment: why it matters, scale and maturity, what it takes locally, expected impact and case studies, clinical evidence, NICE guidance, demo access, NHS/system integrations, indicative cost and commercial detail, related funding (see `ADDING_APPS.md` for field mapping)
- **Funding directory** (`/funding`) — 5 funding opportunities with condition/app links

## Apps in catalogue

**NICE HTE19 COPD (HTG736):** myCOPD · Clinitouch · COPDhub · Luscii  
**Other conditions:** Sleepio (insomnia) · Oviva · Second Nature (weight management) · getUBetter (MSK) · Overcoming Bulimia Online (eating disorders)

## Quick start

```bash
# Install dependencies
npm install

# Development server
npm run dev
# → http://localhost:3000

# Production build + static export
npm run build
# → generates /out directory

# Serve the static export
cd out && npx serve -s .
# → http://localhost:3000
```

## Tech stack

- **Next.js 16** (App Router, static export)
- **Tailwind CSS v4** 
- **TypeScript**
- **Frutiger** (Light, Regular, Bold — local font files)

## Content

All content lives in `/content/` as JSON files:

```
content/
  apps/          # One JSON per app (mycopd.json, clinitouch.json, etc.)
  conditions/    # Condition metadata
  funding/       # Funding opportunities
  dashboard/     # Homepage content
  common/        # Enums and labels
```

To add or update an app, edit the relevant JSON file and run `npm run build`.

## Important note

This is a prototype based on publicly available information as of March 2026. It is not a procurement framework, national endorsement list, or live assurance database. All information should be verified with suppliers before use in formal commissioning or procurement processes.

## CSS note

This project uses **Tailwind CSS v4**. The `globals.css` uses the v4 syntax:
```css
@import "tailwindcss";
@source "../app/**/*.tsx";
@source "../components/**/*.tsx";
```
Frutiger is loaded via `@font-face` in `globals.css` from `public/fonts/`.
