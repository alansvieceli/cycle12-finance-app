# Task 029-01 - Add Adjustment UI to Payment Checklist

Status: Pending

## Spec

`docs/specs/029-adjust-account-value-from-payments.md`

## Plan

`docs/plans/029-adjust-account-value-from-payments-plan.md`

## Goal

Add a `±` button to each payment row in `CurrentMonthPaymentChecklist` and implement the inline adjustment panel that expands when tapped.

## Steps

1. Add `onAdjustMonthlyValue` prop to `CurrentMonthPaymentChecklistProps` with the same signature as `adjustMonthlyValue` in `useFinanceState`.
2. Add `expandedAccountItemId: string | null` and `adjustmentInput: string` and `adjustmentMode: 'add' | 'subtract'` to local state.
3. Add a `±` button to the right of the amount on each row with a value greater than zero.
4. Tapping `±` sets `expandedAccountItemId` to that item's id, resets `adjustmentInput` to empty and `adjustmentMode` to `'add'`. Tapping again on the same row collapses the panel.
5. When expanded, render the adjustment panel below the row top:
   - A horizontal field with `+` button on the left, currency text input in the center, and `−` button on the right.
   - `+` is active by default. Tapping the inactive button switches mode and clears the input.
   - Active mode colors: orange (`colors.accent`) for `+`, red (`colors.negative`) for `−`. The expanded row border and field border follow the active color.
   - A confirm button showing `Novo total  R$ X.XXX,XX` (label and value on the same line, same font size and weight, black text). The displayed total uses `calculateAdjustedMonthlyValue` and updates as the user types. Button background follows the active mode color.
   - A `Cancelar` button that collapses the panel without saving. Same height as the confirm button.
6. On confirm, call `onAdjustMonthlyValue` with the account item id, current projection month, the input string, and the active mode. Collapse the panel after calling.
7. Opening a new row's panel collapses any previously expanded row.

## Acceptance Criteria

- Each payment row with a value greater than zero shows a `±` button.
- Tapping `±` expands the inline adjustment panel with `+` active by default.
- The confirm button shows the computed new total and updates as the user types.
- Tapping `−` switches to subtraction mode; colors change to red.
- Tapping `+` switches back to addition mode; colors change to orange.
- Switching mode clears the input.
- Only one row is expanded at a time.
- Tapping `Cancelar` collapses without saving.
- Tapping confirm updates the value and collapses the panel.
