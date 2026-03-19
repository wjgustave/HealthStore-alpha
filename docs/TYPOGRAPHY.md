# HealthStore Typography Design Guide

Frutiger is the primary typeface used throughout HealthStore. This guide defines how and where each weight should be used.

## Font Stack

| File | Weight | Use |
|------|--------|-----|
| Frutiger-Light.ttf | 300 | Secondary, muted, captions |
| Frutiger-Regular.ttf | 400 | Body text |
| Frutiger-Bold.ttf | 700 | Headings, titles, emphasis |

## Font Hierarchy

| Role | Font | Weight | Usage |
|------|------|--------|--------|
| **Display / headings** | Frutiger | Bold (700) | Page titles (h1), section headings (h2, h3), brand name, stats |
| **Body** | Frutiger | Regular (400) | Paragraphs, descriptions, labels, form inputs |
| **Secondary** | Frutiger | Light (300) | Optional: captions, sublabels, muted helper text |
| **Emphasis** | Frutiger | Bold (700) | Inline emphasis, table headers, badges |
| **Labels** | Frutiger | Semibold (600) or Bold | Form labels, filter labels, uppercase labels |

## Usage by Component

| Component | Element | Font | Weight |
|-----------|---------|------|--------|
| **Nav** | Brand | Frutiger | Bold |
| **Nav** | Links | Frutiger | Regular (medium) |
| **Hero** | h1 | Frutiger | Bold |
| **Hero** | Subtitle | Frutiger | Regular |
| **Stats** | Number | Frutiger | Bold |
| **Stats** | Label | Frutiger | Semibold (600) |
| **Stats** | Sublabel | Frutiger | Regular or Light |
| **Section** | h2 | Frutiger | Bold |
| **Section** | Description | Frutiger | Regular |
| **Cards** | App name | Frutiger | Bold |
| **Cards** | Supplier | Frutiger | Regular |
| **Badges** | Text | Frutiger | Semibold (600) |
| **Forms** | Labels | Frutiger | Semibold |
| **Forms** | Inputs | Frutiger | Regular |
| **Tables** | Headers | Frutiger | Semibold |
| **Tables** | Cells | Frutiger | Regular (medium for emphasis) |

## CSS Variables

Use these in `globals.css` for consistency:

```css
:root {
  --font-display: 'Frutiger', Arial, sans-serif;
  --font-body: 'Frutiger', Arial, sans-serif;
}
```

## Size Scale

- Hero h1: 2.8rem
- Page h1: 2rem
- Section h2: 1.4–1.5rem
- Card titles: 1rem–1.05rem
- Body: 0.875rem (14px)
- Labels: 0.75rem (12px)
- Badges: 10–11px

## Do Not

- Use DM Sans or DM Serif Display
- Use system serif fonts (e.g. Georgia) for headings
- Use font-weight 500 for headings (use 700 for Bold)
- Use Frutiger Light for body text (use Regular)
