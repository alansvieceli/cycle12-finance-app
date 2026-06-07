# Spec 029 - Adjust Account Value from Payments Screen

## Goal

Allow the user to add or subtract an amount from an existing account item's monthly value directly from the Pagamentos screen, without navigating to Planejar.

## Context

The Pagamentos screen shows all account items for the current month. The user can mark items as paid or unpaid and add new accounts. However, if a value is wrong — for example, the Santander card is at R$ 7.000,00 and a new charge of R$ 500,00 arrived — the user must leave Pagamentos, go to Planejar, find the account, and apply the adjustment there.

Spec 015 already implemented `+`/`−` adjustment controls in Planejar, along with the `calculateAdjustedMonthlyValue` helper and the `adjustMonthlyValue` action in `useFinanceState`. This spec reuses that infrastructure to expose the same capability on the Pagamentos screen.

## Non-Goals

- Do not store a history of adjustments.
- Do not allow editing account name, category, or due day from this screen.
- Do not allow adjusting values for months other than the current month.
- Do not change the backup/restore format.
- Do not add new dependencies.

## UX Behavior

### Payment row — normal state

Each payment row keeps its existing layout:

```
[checkbox] [name / meta]  [amount]  [±]
```

The `±` button is a small square (30×30) with a muted border, placed to the right of the amount. It is visible on every row where a value exists.

### Payment row — expanded state

Tapping `±` expands that row inline. Only one row can be expanded at a time; opening a new one closes the previous.

The expanded row shows:

```
[checkbox] [name / meta — atual: R$ X.XXX,XX]

─────────────────────────────────────────────
[ + | input field                         | − ]
[Cancelar]  [Novo total  R$ X.XXX,XX      ]
```

### Adjustment field behavior

The adjustment field is a single horizontal group:

- `+` button on the left — active by default (addition mode)
- Currency input in the center
- `−` button on the right — tapping switches to subtraction mode

Active mode styling:

- `+` active: field border and input text in orange (`colors.accent`)
- `−` active: field border and input text in red (`colors.negative`)

Inactive mode buttons use a muted color to show they are tappable but not selected. Tapping the inactive button switches the active mode and clears the input.

The expanded row border follows the active mode color (orange for `+`, red for `−`).

### Confirm button

The confirm button shows the computed new total inline, on a single row:

```
Novo total  R$ 7.500,00
```

Both texts use the same font size and weight (no bold hierarchy). Button background matches the active mode color (orange for `+`, red for `−`). Text color is black for contrast against the colored background.

The displayed total updates as the user types. If the input is empty or invalid, it shows the current total unchanged.

### Calculation rules

Reuses `calculateAdjustedMonthlyValue` from `src/lib/monthlyValueAdjustments.ts`:

- Empty or invalid input is treated as `0`.
- Subtraction result is clamped to `0`.

### Cancel

Tapping `Cancelar` collapses the row without saving. Tapping `±` on the same row again while it is already expanded also collapses it.

## Implementation Notes

- `CurrentMonthPaymentChecklist` tracks `expandedAccountItemId: string | null` in local state.
- Opening `±` sets `expandedAccountItemId` to that item's id and resets the input to empty and mode to `add`.
- Switching mode clears the input.
- On confirm, calls the existing `onAdjustMonthlyValue` prop (same signature as `adjustMonthlyValue` in `useFinanceState`).
- `CurrentMonthPaymentChecklist` receives a new prop `onAdjustMonthlyValue`.
- The parent (`App.tsx` or equivalent scroll view host) passes `finance.actions.adjustMonthlyValue`.
- No changes to data model, storage, or backup format.

## Acceptance Criteria

- Each payment row with a value shows a `±` button.
- Tapping `±` expands that row with the adjustment field, `+` active by default.
- Typing an amount confirms via the button showing `Novo total  R$ X.XXX,XX`; tapping it updates the value and collapses the row.
- The new total on the confirm button updates as the user types.
- Tapping `−` switches to subtraction mode; the field and row border turn red.
- Tapping `+` switches back to addition mode.
- Switching mode clears the input.
- Subtraction never produces a negative value.
- Only one row is expanded at a time.
- Tapping `Cancelar` collapses the row without saving.
- TypeScript validation passes.
- Existing tests pass.

## Validation

```bash
npm run check
npm test
```
