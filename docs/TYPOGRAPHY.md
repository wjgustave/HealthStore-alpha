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

| Role | Weight | Typical use |
|------|--------|-------------|
| **Display / headings** | **700 (Bold)** | Page h1, section h2/h3, brand name, large stats |
| **Body** | **400 (Regular)** | Paragraphs, descriptions, table cell copy, inputs |
| **Labels & UI chrome** | **600 (semibold)** or **700** | Form labels, filter labels, uppercase table headers, badges |
| **Secondary / muted** | **400** or **300 (Light)** | Sublabels, helper text, captions (use Light sparingly) |

`h1`, `h2`, and `h3` in global CSS use Frutiger Bold by default.

---

## 3. Type scale (size tokens)

Assume `html` root **16px** unless you change it. All rem values below are relative to that root.

| Token | CSS variable | Value | Approx. px |
|-------|----------------|-------|------------|
| Hero title | `--text-hero` | `2.8rem` | ~45px |
| Page title | `--text-page-title` | `2rem` | 32px |
| Section heading (primary) | `--text-section` | `1.5rem` | 24px |
| Section heading (secondary) | `--text-section-alt` | `1.4rem` | ~22px |
| Card / featured title | `--text-card-title` | `1.05rem` | ~17px |
| Card title (compact) | `--text-card-title-sm` | `1rem` | 16px |
| **Body (default)** | `--text-body` | `1rem` | **16px** |
| Labels / meta | `--text-label` | `0.875rem` | **14px** |
| Badges (component) | `--text-badge` | `13px` | 13px (within 12–14px band) |

**Usage in React / inline styles:**

```tsx
style={{ fontSize: 'var(--text-body)' }}
style={{ fontSize: 'var(--text-label)' }}
style={{ fontFamily: 'Frutiger, Arial, sans-serif', fontSize: 'var(--text-page-title)', fontWeight: 700 }}
```

**Do not** hard-code sizes that fight this scale (e.g. `10px` body copy) unless there is a documented exception.

---

## 4. Usage by component

| Area | Element | Size token | Weight |
|------|---------|------------|--------|
| **Nav** | Brand text | `--text-card-title-sm`–`--text-card-title` | Bold |
| **Nav** | Links | inherits body | Medium (500) via Tailwind |
| **Hero** | Headline | `--text-hero` | Bold |
| **Hero** | Subtitle | `--text-body` | Regular |
| **Home stats** | Value | `2rem` (large numeral) | Bold |
| **Home stats** | Label | `--text-label` | Semibold |
| **Sections** | h2 | `--text-section` or `--text-section-alt` | Bold |
| **Sections** | Intro paragraph | `--text-body` | Regular |
| **App cards** | App name | `--text-card-title` | Bold |
| **App cards** | Supplier | `--text-label` | Regular |
| **App cards** | Value prop | `--text-body` | Regular |
| **Badges** | `.badge` | `--text-badge` | Semibold (600) |
| **Forms** | Labels | `--text-label` | Semibold |
| **Forms** | Inputs | `text-sm` / body | Regular |
| **Tables** | Headers | `--text-label` | Semibold, uppercase where needed |
| **Tables** | Cells | `--text-body` | Regular / medium for emphasis |
| **Modals** | Title | `--text-section-alt` | Bold |
| **Modals** | Body copy | `--text-body` | Regular |

---

## 5. CSS variables reference (`:root`)

Copy for quick reference (authoritative list is in `globals.css`):

```css
:root {
  --font-display: 'Frutiger', Arial, sans-serif;
  --font-body: 'Frutiger', Arial, sans-serif;
  --text-hero: 2.8rem;
  --text-page-title: 2rem;
  --text-section: 1.5rem;
  --text-section-alt: 1.4rem;
  --text-card-title: 1.05rem;
  --text-card-title-sm: 1rem;
  --text-body: 1rem;
  --text-label: 0.875rem;
  --text-badge: 13px;
}
```

`body` uses `font-family: 'Frutiger', Arial, sans-serif` and `font-size: var(--text-body)`.

---

## 6. Do not

- Use **DM Sans**, **DM Serif Display**, or other brand fonts for UI text.
- Use **serif system fonts** (e.g. Georgia) for headings.
- Use **`font-weight: 500`** for heading styles meant to read as Frutiger Bold — use **700** with the Bold font file.
- Use **Frutiger Light** for primary body copy.
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
