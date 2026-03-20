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
| **Body (default)** | **300 (Light)** | Paragraphs, descriptions, inherited copy, inputs — `body` uses `--font-body-weight: 300` |
| **Labels & UI chrome** | **600 (semibold)** or **700** | Form labels, filter labels, uppercase table headers, badges |
| **Stronger than body** | **400 (Regular)** or **700** | Use `font-medium` / `font-semibold` / `font-bold` where you need more weight than Light |

`h1`, `h2`, and `h3` in global CSS use Frutiger Bold by default and override body weight.

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
| **Body (default)** | `--text-body` | `1rem` | **16px** at weight **300** (Frutiger Light) |
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
  --font-body-weight: 300;
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

`body` uses `font-family: 'Frutiger', Arial, sans-serif`, `font-size: var(--text-body)`, and `font-weight: var(--font-body-weight)` (**300** = Frutiger Light).

---

## 6. Do not

- Use **DM Sans**, **DM Serif Display**, or other brand fonts for UI text.
- Use **serif system fonts** (e.g. Georgia) for headings.
- Use **`font-weight: 500`** for heading styles meant to read as Frutiger Bold — use **700** with the Bold font file.
- Switch **body** back to Regular (400) without updating `--font-body-weight` and this guide.
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
