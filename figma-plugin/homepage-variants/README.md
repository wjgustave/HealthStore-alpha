# HealthStore homepage — Figma wireframes (V1 / V2 / V3)

## Why not the REST API?

Figma’s **REST API** can read files, export images, manage comments, and dev resources — it **cannot** create or edit frames, text, or shapes in a design file.

To generate layout structure programmatically you must use the **Plugin API** (runs inside Figma). This folder contains a **development plugin** that builds three wireframe frames aligned with the app’s `HomeLayoutV1`, `HomeLayoutV2`, and `HomeLayoutV3` (below hero / stats).

## Install and run

1. Open **Figma Desktop** (recommended for dev plugins).
2. Menu: **Plugins → Development → Import plugin from manifest…**
3. Choose `figma-plugin/homepage-variants/manifest.json` in this repo.
4. **Plugins → Development → HealthStore homepage V1–V3 wireframes**

The plugin creates three frames on the **current page**, selects them, and zooms the viewport.

## What you get

- **V1** — Stacked sections; news / evidence / campaigns as single-column editorial blocks (left accent indicates editorial treatment in the app).
- **V2** — Featured news + list split; evidence | campaigns two-column band; then shared tail (dataset, impact, funding, removals, disclaimer).
- **V3** — Same section order; news / evidence / campaigns called out as compact/table-style blocks.

Hero and stats strip are **not** included (unchanged in product; focus is “below the fold”).

## Optional: REST API for read/export only

If you need automation **out** of Figma (e.g. pull component metadata, export PNGs):

1. Create a **personal access token** in Figma → Settings → Security.
2. Use `GET https://api.figma.com/v1/files/:file_key` with `Authorization: Bearer <token>`.

That still won’t **write** layouts; use this plugin or manual design for that.

## Customising

Edit `code.js` — block sizes, colours, and labels map to [`components/home/HomeFragments.tsx`](../../components/home/HomeFragments.tsx) section order.
