# NHS Commissioner DTx Store

A commissioner decision-support tool for NHS digital health technology procurement. Built on Next.js with a full static export.

## What's included

- **Homepage** — hero, condition browser, NICE HTE19 COPD app grid, real-world impact metrics
- **App catalogue** (`/apps`, `/apps/condition-catalogue`) — search hub and filterable listing by condition, supervision model, local effort, DTAC status
- **App detail pages** (`/apps/[slug]`) — commissioner assessment: why it matters, scale and maturity, what it takes locally, expected impact and case studies, clinical evidence, NICE guidance, demo access, NHS/system integrations, indicative cost and commercial detail, related funding (see `ADDING_APPS.md` for field mapping; `docs/PDP_SECTIONS_DEV_PLAN.md` for implementation spec)
- **Funding directory** (`/funding`) — 5 funding opportunities with condition/app links

## Apps in catalogue

**NICE HTE19 COPD (HTG736):** myCOPD · Clinitouch · COPDhub · Luscii  
**Other conditions:** Sleepio (insomnia) · Oviva · Second Nature (weight management) · getUBetter (MSK) · Overcoming Bulimia Online (eating disorders)

## Authentication (prototype)

**Local development:** generate a working `.env.local` (session secret + bcrypt hash) in one step:

```bash
npm run auth:setup
# default: username `dev` / password `dev` — then restart `npm run dev`

# custom password (and optional username as third arg):
# npm run auth:setup "your-secure-password" "yourname"
```

Access is gated by middleware. You can also set variables manually in `.env.local` (see [`.env.example`](.env.example)):

| Variable | Purpose |
|----------|---------|
| `SESSION_SECRET` | Secret for encrypted session cookies (iron-session) |
| `AUTH_USERNAME` / `AUTH_PASSWORD_HASH` | Primary user — bcrypt hash of the password (sign in → home). Prefer **base64** of the bcrypt string in `.env` (what `auth:setup` writes) so `$` is not mangled by env parsers. Plain bcrypt (`$2b$…`) also works if the value is **quoted** in `.env`. |
| `AUTH_MULTI_USERNAME` / `AUTH_MULTI_PASSWORD_HASH` | Optional second user — after sign in they must choose a commissioning entity on `/select-entity` (same hash format as above) |

### Named demo users (Marie / Rachel–style accounts)

Additional sign-ins are defined in [`content/auth-user-accounts.json`](content/auth-user-accounts.json). Each entry has `username` (email), `passwordHashB64` (bcrypt of the password, **base64-encoded** — same format as `AUTH_PASSWORD_HASH`), `displayName`, `role`, and `organisationName`.

After sign-in, that data is stored in the session and used for:

- The commissioning organisation line in the nav (subheader)
- The read-only name / role / organisation / email fields on the **Expression of interest** modal on product pages

**Add another user**

1. Generate a hash:  
   `node -e "const b=require('bcryptjs');const h=b.hashSync('YOUR_PASSWORD',10);console.log(Buffer.from(h,'utf8').toString('base64'))"`
2. Append an object to `content/auth-user-accounts.json` with the fields above (use the printed `passwordHashB64`).
3. Redeploy (e.g. push to Git and let Vercel build).

No new environment variables are required for these accounts **unless** you choose to keep them out of the repo and load them another way.

**Vercel:** Use the same flow as the rest of the app — ensure `SESSION_SECRET`, `AUTH_USERNAME`, and `AUTH_PASSWORD_HASH` are set for your environment. Commit and deploy the JSON file (or your branch); named accounts work as soon as the new build is live. Rotating a named user’s password means regenerating `passwordHashB64` and redeploying.

```bash
node -e "const b=require('bcryptjs');const h=b.hashSync('your-password',10);console.log(Buffer.from(h,'utf8').toString('base64'))"
```

On **Vercel**, add the same variables under Project → Settings → Environment Variables. `SESSION_SECRET` must be set for production (at least **32 characters** — `npm run auth:setup` generates a valid value).

Auth API routes use **iron-session** with an explicit response object so the session cookie is set correctly in the App Router after sign-in.

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

This is a prototype based on publicly available information as of March 2026. All information should be verified with suppliers before use in formal commissioning or procurement processes.

## CSS note

This project uses **Tailwind CSS v4**. The `globals.css` uses the v4 syntax:
```css
@import "tailwindcss";
@source "../app/**/*.tsx";
@source "../components/**/*.tsx";
```
Frutiger is loaded via `@font-face` in `globals.css` from `public/fonts/`.
