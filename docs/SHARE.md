# PDP share: selective PDF, section-only links, and full-page copy

**Scope:** Product detail page (`/apps/[slug]`) and server-rendered shared excerpt (`/apps/[slug]/shared`).

## Implementation

| Piece | Location / behaviour |
|-------|----------------------|
| UI | `components/SharePagePanel.tsx` — **Share** opens a **two-step modal** (portal): (1) choose **Share as link** or **Print or save as a PDF**; (2a) link step — **same section checklist as PDF**, **Create link and copy** (POST signed token), optional **Copy full product page address**; (2b) PDF step — checkboxes per block, **Select all** / **Clear**, **Print or save as a PDF** |
| Context | `components/PdpSharePrintContext.tsx` — `PdpSharePrintProvider`, `PdpShareRegion`, `printLayout` (`none` \| `all` \| `include` + key set), `registerBlock`, `beginModalPrint` |
| Expanders | `components/ProductPageExpander.tsx` — optional `shareKey`; registers with provider; expands for print when included; `pdp-share-excluded-print` when excluded in `include` mode |
| Placement | `app/apps/[slug]/page.tsx` — `PdpSharePrintProvider` wraps browse trail, hero, optional `alerts`, grid (main column + sidebar + express CTA). **Browse trail, alerts, and Express interest callout** use `PdpShareRegion` with `excludeFromShareUi`: omitted from Share checklist and share-link allowlist; hidden in **all** print/PDF (`include` and Cmd/Ctrl+P `all`). |
| PDF | After choosing **Print or save as a PDF**, user picks sections; **Print or save as a PDF** runs `beginModalPrint(selectedKeys)` → `window.print()`; user selects **Save as PDF** in the system dialog |
| Section-only link | `POST /api/apps/[slug]/share` with `{ keys: string[] }` (allowlisted share keys). Returns `{ shareUrl }` pointing to `/apps/[slug]/shared?t=<JWT>`. **Track A:** stateless signed JWT (`jose`), **14-day** expiry, **no revocation** until expiry. Secret: `PRODUCT_SHARE_SECRET` or fallback `SESSION_SECRET`. |
| Shared view | `app/apps/[slug]/shared/page.tsx` — verifies JWT + slug + **commissioning entity** matches session; renders **only** allowed sections via `PdpSharedProductBody` (no excluded HTML). Banner + “Open full product page”; empty state if selected sections have no content for that product. |
| Key allowlist | `lib/pdpShareKeys.ts` — allowlisted keys for links/API; must match every **registered** `shareKey` / `PdpShareRegion` (excluding `excludeFromShareUi` regions). |
| PDP blocks | `app/apps/[slug]/pdpBlocks.tsx` — shared `EvidenceCard`, `ContextOfUseGrid`, `NhsIntegrationBadges` for full PDP and shared view. |
| Back-compat | `PdpPrintExpandProvider` is re-exported as an alias for `PdpSharePrintProvider` from `ProductPageExpander.tsx`. |

## Authentication caveat

`middleware.ts` sends unauthenticated users to `/login` for app pages. **Shared excerpt URLs** require a **valid session** and the **same commissioning entity** (or both empty) as encoded in the token. **PDF export** is a static file and can be shared offline without the recipient logging in.

## Copy link behaviour

- **Create link and copy:** Server-enforced excerpt only; excluded sections are **not** rendered or delivered for that URL.
- **Copy full product page address:** Copies the canonical PDP URL (full page for anyone who can access the store).

## Print / PDF behaviour

- **Share modal → Print or save as a PDF:** `printLayout` is set to `{ mode: 'include', keys }`. Unchecked blocks get `.pdp-share-excluded-print` (`display: none` in `@media print`). Checked **expanders** show open bodies for that print job.
- **Keyboard Cmd/Ctrl+P (no modal):** `beforeprint` sets `{ mode: 'all' }` so registered expanders open; regions with `excludeFromShareUi` stay hidden from print.
- **`afterprint`:** Resets to `{ mode: 'none' }`; on-screen expand/collapse state is unchanged.

## Print CSS

`app/globals.css` `@media print` hides navigation, footer, `button`, `[data-express-interest]`, and `.pdp-share-excluded-print`.

## API / middleware note

`middleware.ts` excludes `api/apps` from the auth redirect matcher so `POST .../share` can return **401 JSON** for unauthenticated clients instead of an HTML redirect.

## QA checklist

- [ ] **Share** opens step 1 with two choices (**Share as link** / **Print or save as a PDF**); **Cancel** closes; **Back** returns from step 2 to step 1.
- [ ] **PDF** path: checklist lists hero, sidebar bundle, express CTA, and each visible main-column section only.
- [ ] Uncheck several items → print preview shows only selected regions; included expanders show full body text.
- [ ] **Select all** then print ≈ full dossier; **Clear** disables primary action until at least one box is checked.
- [ ] **Cmd/Ctrl+P** without opening Share: full page prints with all sections expanded.
- [ ] **Link** path: checklist matches PDF; **Create link and copy** returns a URL; opening it (signed in, same org) shows **only** selected sections + banner; wrong org or expired token shows clear error.
- [ ] **Copy full product page address** copies the canonical PDP URL.
- [ ] **Escape** closes modal; focus returns to **Share**.
- [ ] Clipboard failure shows the fallback message.

## Follow-up (Track B)

Persisted shares (database/KV) for **revocation**, shorter opaque URLs, audit, and rate limits — see product/security backlog.
