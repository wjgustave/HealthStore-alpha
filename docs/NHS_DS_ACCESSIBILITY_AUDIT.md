# NHS DS migration — accessibility & service-standard audit (Phase 7)

Audit of the NHS Design System migration against **WCAG 2.2 AA** and the
**NHS service standard**. Owned by the Accessibility specialist; re-run at the end
of every phase. This records the checks, the remediations already landed in this
migration, and the validation still to do with real assistive tech + users.

## Method

- Static review of migrated components + automated checks (lint, build).
- Manual keyboard + screen-reader passes (VoiceOver/Safari, NVDA/Firefox, JAWS/Chrome) — **to schedule**.
- One moderated usability round with commissioners using AT — **to schedule** (User researcher).

## WCAG 2.2 AA — status by criterion

| Criterion | Area | Status | Notes |
| --- | --- | --- | --- |
| 1.3.1 Info & relationships | Forms | ✅ | NHS `FormField` wires `label`/`for`, `nhsuk-hint`, `nhsuk-error-message`, `aria-describedby`, `aria-invalid`. |
| 1.3.1 | Tables | ✅ | NHS Table with `scope="col"`, `caption` (visually hidden where decorative). |
| 1.4.3 Contrast | Tags/Buttons | ✅ | NHS Tag + Button palettes are NHS-tested AA. Verify any remaining bespoke tints. |
| 1.4.11 Non-text contrast | Focus/borders | ✅ | NHS focus ring (yellow `#ffeb3b` + black bar) now applied globally to bespoke/native controls. |
| 2.1.1 Keyboard | Tabs | ✅ | `PdpTabs` is a full ARIA tablist with arrow/Home/End keys; roving tabindex. |
| 2.1.1 | Expander/Details | ✅ | NHS Expander uses native `<details>` (keyboard built-in), controlled for print/hash. |
| 2.1.2 No keyboard trap | Modal | ✅ | Focus trap with Escape + restore-focus (bespoke, NHS principles). |
| 2.4.1 Bypass blocks | Skip link | ✅ | NHS Skip link → `#main-content` (now `tabindex=-1`). |
| 2.4.3 Focus order | Modal/Drawer | ✅ | Focus moves into dialog on open, returns to trigger/previous on close. |
| 2.4.7 Focus visible | Global | ✅ | NHS focus ring; NHS components carry their own `:focus`. |
| 2.5.8 Target size (2.2) | Buttons/toggles | ✅ | NHS buttons + 44px bespoke toggle/segmented targets. |
| 3.3.1 Error identification | Forms | ✅ | `nhsuk-error-message` with visually-hidden "Error:" prefix, `role="alert"`. |
| 3.3.7 Redundant entry (2.2) | Forms | ⚠️ | Review multi-step flows (EOI) for re-entry; not introduced by this migration. |
| 4.1.2 Name/role/value | Tag/Status | ✅ | Tags are text; status badges convey meaning in text, not colour alone. |
| 4.1.3 Status messages (2.2) | Toasts | ✅ | Split polite (`role="status"`) / assertive (`role="alert"`) live regions. |

## NHS service standard — relevant points

- **Accessible to everyone**: NHS components inherit NHS AA contracts; bespoke components built to NHS principles and annotated in `public/DS` with provenance.
- **Consistent with NHS**: official `nhsuk-frontend` for Button, Form, Tag, Card, Tabs, Details/Expander, Table, Pagination, Breadcrumb, Back link, Skip link, Footer, Warning callout, Inset text.
- **Plain English**: content unchanged; NHS form pattern drops required asterisks in favour of marking optional fields (content-design follow-up).

## Remediations landed in this migration

- Skip link → NHS Skip link; `<main>` is focusable (`tabindex=-1`).
- Global focus ring switched to NHS yellow + black bar (`:focus-visible`).
- Forms rebuilt on NHS Label/Hint/Error message with correct ARIA wiring.
- Loading skeleton made decorative (`aria-hidden`) with a visually-hidden `role="status"` "Loading…".
- Tables given NHS semantics (`scope`, caption).
- Toast live-region split preserved and documented.

## Open items / to validate

1. Run the three screen-reader passes and log defects.
2. Verify colour contrast of any remaining bespoke tints (compare lens active state, dashboard tiles).
3. Confirm NHS Tabs behaviour on mobile (list-as-buttons) with AT; consider NHS "all panels" mobile fallback.
4. Error summary: adopt `nhsuk-error-summary` on multi-field forms (component CSS is available).
5. Moderated usability round with commissioners using AT; feed findings to the backlog.
6. Content-design pass: optional-field marking, callout voice ("Important"/"Warning").
