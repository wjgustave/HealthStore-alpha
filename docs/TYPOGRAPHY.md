# Design Guide: Frutiger Typography (HealthStore)

Frutiger is the **only** brand typeface for HealthStore. This document is the single source of truth for font files, weights, size scale, and how to apply them in code.

---

## 1. Font files

| File | Weight | CSS `font-weight` | Location |
|------|--------|-------------------|----------|
| `Frutiger-Light.ttf` | Light | `300` | `public/fonts/Frutiger-Light.ttf` |
| `Frutiger-Regular.ttf` | Regular | `400` | `public/fonts/Frutiger-Regular.ttf` |
| `Frutiger-Bold.ttf` | Bold | `700` | `public/fonts/Frutiger-Bold.ttf` |

`@font-face` rules and global typography live in [`app/globals.css`](../app/globals.css). Fonts are **not** loaded from Google Fonts.

**Fallback stack:** `'Frutiger', Arial, sans-serif`

---

## 2. Font hierarchy (role → weight)

Weights follow the **NHS Design System**: body is **400 (Regular)**, bold/headings are **600**.
(In this project both `600` and `700` resolve to `Frutiger-Bold.ttf`, so legacy inline `700`
renders identically to NHS `600`.)

| Role | Weight | Typical use |
|------|--------|-------------|
| **Display / headings** | **600 (Bold)** — NHS | Page h1, section h2/h3, brand name, large stats |
| **Body (default)** | **400 (Regular)** — NHS | Paragraphs, descriptions, inherited copy, inputs — `body` uses `--font-body-weight: 400` |
| **Labels & UI chrome** | **600** | Form labels, filter labels, uppercase table headers, badges |

`h1`–`h4` in global CSS use Frutiger Bold (`600`) by default and override body weight, with NHS heading line-heights.

---

## 3. Type scale (size tokens)

Matches the **nhsuk-frontend responsive type scale** (`core/settings/_typography.scss`).
Tokens are **responsive**: the mobile size is declared in `:root`, and the tablet/desktop step
is re-declared in a `@media (min-width: 641px)` block (the NHS tablet breakpoint). Each token is
mapped to an NHS scale point. Assume `html` root **16px**.

| Token | CSS variable | Mobile → Desktop | NHS point |
|-------|----------------|------------------|-----------|
| Hero title | `--text-hero` | 48 → 64px | 64 |
| Page title | `--text-page-title` | 32 → 48px | 48 (heading-xl) |
| Section heading (primary) | `--text-section` | 27 → 36px | 36 (heading-m) |
| Section heading (secondary) | `--text-section-alt` | 22 → 26px | 26 (heading-s) |
| Lede / intro | `--text-lede` | 20 → 24px | 24 (body-l) |
| Card / featured title | `--text-card-title` | 19 → 22px | 22 |
| Card title (compact) | `--text-card-title-sm` | 16 → 19px | 19 |
| **Body (default)** | `--text-body` | **16 → 19px** at weight **400** | 19 (body) |
| Extra small / labels | `--text-xs` | 14 → 16px | 16 (body-s) |
| Labels / meta | `--text-label` | `var(--text-xs)` | Same as **`--text-xs`** |
| Caption (smallest) | `--text-caption` | 12 → 14px | 14 |
| Badges (component) | `--text-badge` | 14 → 16px | 16 |

### Utility classes

Prefer `.hs-text-*` utilities over Tailwind `text-xs`/`text-sm`/`text-lg` etc. They bind to the responsive NHS tokens:

| Class | Token | Replaces |
|-------|-------|----------|
| `.hs-text-caption` | `--text-caption` | `text-xs` |
| `.hs-text-label` | `--text-label` | `text-sm` |
| `.hs-text-body` | `--text-body` | `text-base` |
| `.hs-text-lede` | `--text-lede` | `text-xl` |
| `.hs-text-card-title-sm` | `--text-card-title-sm` | `text-lg` |
| `.hs-text-section-alt` | `--text-section-alt` | `text-2xl` |
| `.hs-text-section` | `--text-section` | `text-3xl` / `text-4xl` |
| `.hs-font-bold` | weight 600 | `font-bold` / `font-semibold` |
| `.hs-font-normal` | weight 400 | body / link copy |

Line-heights also follow NHS: body `1.5` (mobile) → `1.47` (≥641px); headings ~`1.12`–`1.19`
(`--leading-body`, `--leading-heading`, `--leading-hero`).

**Usage in React / inline styles:**

```tsx
style={{ fontSize: 'var(--text-body)' }}
style={{ fontSize: 'var(--text-xs)' }}
style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-page-title)', fontWeight: 600 }}
```

`--text-label` is an alias: `var(--text-xs)`.

**Do not** hard-code sizes that fight this scale (e.g. `10px` body copy) unless there is a documented exception.

---

## 4. Usage by component

| Area | Element | Size token | Weight |
|------|---------|------------|--------|
| **Nav** | Brand text | `--text-card-title-sm`–`--text-card-title` | Bold |
| **Nav** | Links | inherits body | Medium (500) via Tailwind |
| **Hero** | Headline | `--text-hero` | Bold |
| **Hero** | Subtitle | `--text-body` | Light (inherits body) |
| **Home stats** | Value | `2rem` (large numeral) | Bold |
| **Home stats** | Label | `--text-label` | Semibold |
| **Sections** | h2 | `--text-section` or `--text-section-alt` | Bold |
| **Sections** | Intro paragraph | `--text-body` | Light (inherits body) |
| **App cards** | App name | `--text-card-title` | Bold |
| **App cards** | Supplier | `--text-label` | Light unless `font-semibold` |
| **App cards** | Value prop | `--text-body` | Light (inherits body) |
| **Badges** | `.badge` | `--text-badge` | Semibold (600) |
| **Forms** | Labels | `--text-label` | Semibold |
| **Forms** | Inputs | `text-sm` / body | Light (inherits body) |
| **Tables** | Headers | `--text-label` | Semibold, uppercase where needed |
| **Tables** | Cells | `--text-body` | Light unless `font-medium` / semibold |
| **Modals** | Title | `--text-section-alt` | Bold |
| **Modals** | Body copy | `--text-body` | Light (inherits body) |

---

## 5. CSS variables reference (`:root`)

Copy for quick reference (authoritative list is in `globals.css`):

```css
:root {
  --font-display: 'Frutiger', Arial, sans-serif;
  --font-body: 'Frutiger', Arial, sans-serif;
  --font-body-weight: 400;          /* NHS Regular */
  /* Mobile step (tablet/desktop re-declared at min-width: 641px) */
  --text-hero: 3rem;                /* 48 → 64px */
  --text-page-title: 2rem;          /* 32 → 48px */
  --text-section: 1.6875rem;        /* 27 → 36px */
  --text-section-alt: 1.375rem;     /* 22 → 26px */
  --text-lede: 1.25rem;             /* 20 → 24px */
  --text-card-title: 1.1875rem;     /* 19 → 22px */
  --text-card-title-sm: 1rem;       /* 16 → 19px */
  --text-body: 1rem;                /* 16 → 19px */
  --text-xs: 0.875rem;              /* 14 → 16px */
  --text-caption: 0.75rem;          /* 12 → 14px */
  --text-label: var(--text-xs);
  --text-badge: 0.875rem;           /* 14 → 16px */
  --leading-hero: 1.125;
  --leading-heading: 1.1875;
  --leading-body: 1.5;              /* → 1.47368 at ≥641px */
}
```

`body` uses `font-family: 'Frutiger', Arial, sans-serif`, `font-size: var(--text-body)`,
`font-weight: var(--font-body-weight)` (**400** = Frutiger Regular, NHS), and
`line-height: var(--leading-body)`.

---

## 6. Do not

- Use **DM Sans**, **DM Serif Display**, or other brand fonts for UI text.
- Use **serif system fonts** (e.g. Georgia) for headings.
- Use **`font-weight: 500`** for heading styles meant to read as Frutiger Bold — use **600** (NHS bold) with the Bold font file.
- Switch **body** back to Light (300) — NHS body is **400 (Regular)**; changing it diverges from NHS.
- Replace the responsive `--text-*` tokens with fixed sizes — they intentionally step at the NHS 641px breakpoint.
- Override **`.badge`** with a font size smaller than **12px** without design sign-off.
- Add **inline `fontSize` on badges** unless necessary; prefer the global `.badge` rule.

---

## 7. Related files

| File | Purpose |
|------|---------|
| `app/globals.css` | `@font-face`, `:root` tokens, `body`, `h1–h3`, `.badge` |
| `app/layout.tsx` | No Google Fonts links |
| `docs/TYPOGRAPHY.md` | This design guide |

When adding new screens, reuse **`var(--text-*)`** for sizes and **Frutiger + weight** for hierarchy before introducing new magic numbers.
