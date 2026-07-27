# Task 042-04 - Fix Copy and Update Docs

Status: Done

## Spec

`docs/specs/042-planejar-quality-cleanup.md`

## Plan

`docs/plans/042-planejar-quality-cleanup-plan.md`

## Goal

Align the Planejar footer label with what it actually sums, and align the documentation with the icon the app really renders.

## Files

- Modify: `src/components/finance/MonthlyValueEditor.tsx`
- Modify: `docs/app-context.md`
- Modify: `README.md`

## Steps

- [x] **Step 1: Footer label**

`Total do ano` -> `Total dos 12 meses`. The footer sums the rolling 12-month window, which spans two calendar years.

- [x] **Step 2: `docs/app-context.md`**

- `Planejar` section: describe the adjustment control as the row's adjustment button (`Ajustar valor`) instead of a `±` button, and mention the `Total dos 12 meses` footer.
- `Pagamentos` section: same wording fix for the payment row button.
- Currency-mask paragraph: refer to the adjustment modal instead of the `±` modal.

- [x] **Step 3: `README.md`**

Same `±` wording fix in the Planejar and Pagamentos bullets.

- [x] **Step 4: Validate**

```bash
npm run check
```

## Acceptance Criteria

- The Planejar footer reads `Total dos 12 meses`.
- Neither `docs/app-context.md` nor `README.md` describes a `±` button.
- `docs/app-context.md` mentions the 12-month footer total.
- `npm run check` passes.
