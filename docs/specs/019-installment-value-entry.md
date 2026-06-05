# Spec 019 - Installment Value Entry

## Goal

Allow the user to add a value across multiple consecutive months from a single entry, using the existing `+` adjustment button in the `Planejamento` tab.

## Context

Today the `+` button (spec 015) adds a value to a single month. When the user makes a credit card purchase with installments, they must manually open each month and add the installment amount one by one.

Example with current workflow:

- Purchase: R$ 250 in 5 installments of R$ 250 each
- User must tap `+` on July, enter 250, confirm — then repeat for August, September, October, November

Desired workflow:

- User taps `+` on July, enters 250, sets installments to 5, confirms
- App adds 250 to July, August, September, October, and November automatically

## Goals

- Extend the existing `+` adjustment input with an installment count field.
- Default installment count is `1` (preserves current single-month behavior).
- When installment count is greater than 1, apply the addition to N consecutive months starting from the tapped month.
- Only addition supports installments. Subtraction (`-`) remains single-month only.

## Non-Goals

- Do not divide the entered amount by the number of installments.
- Do not track installment records or purchase history.
- Do not support installments for subtraction.
- Do not change the data model beyond applying multiple `updateMonthlyValue` calls.
- Do not add backend, cloud sync, or authentication.

## UX Behavior

### Adjustment Input (addition only)

When the user taps `+` on a monthly value row, the existing adjustment input appears with one new field:

- Amount input (existing)
- Installments input: numeric stepper or small text input, default `1`, minimum `1`
- Confirm and cancel actions (existing)

The installments field should be compact — a small labeled input or a `–`/`+` stepper next to a number. Label: `Parcelas`.

When installments is `1`, behavior is identical to the current single-month addition.

When installments is greater than `1`, a short summary is shown before confirmation, e.g.:

> `+ R$ 250,00 × 5 meses → Jul, Ago, Set, Out, Nov`

The summary should list the affected month abbreviations so the user can verify before confirming.

### Month Boundary

If the installments span beyond the 12-month window, only the months within the current window receive the addition. Months outside the window are silently skipped — no error is shown.

## Calculation Rules

Given:

- `amount`: the parsed currency value entered by the user
- `installments`: integer ≥ 1
- `startMonth` / `startYear`: the month where the user tapped `+`

For each step `i` from `0` to `installments - 1`:

- Compute target month = `startMonth + i` (wrap year as needed)
- If target month is within the current window, apply `currentAmount + amount`
- If target month is outside the window, skip

The same `calculateAdjustedMonthlyValue` helper from spec 015 is used per month with operation `add`.

## Implementation Notes

Add a pure helper `src/lib/installmentMonths.ts`:

```ts
function buildInstallmentMonths(
  startYear: number,
  startMonth: MonthNumber,
  installments: number,
  windowStartYear: number,
  windowStartMonth: MonthNumber,
): Array<{ year: number; month: MonthNumber }>;
```

The helper returns only months within the 12-month window. It is pure and has no side effects.

Wire through:

- `MonthlyValueEditor` — add `Parcelas` field to the `+` adjustment form
- `PlanningScreen` / `useFinanceState` — dispatch one `updateMonthlyValue` per returned month
- Subtraction form remains unchanged

## Tests

Unit tests required for `installmentMonths.ts`:

- Returns single month when installments is 1
- Returns correct consecutive months across a year boundary (e.g. November + 3 = Nov, Dec, Jan, Feb)
- Skips months outside the 12-month window
- Returns empty array when start month is outside the window
- Handles installments count larger than remaining window months

## Acceptance Criteria

- The `+` adjustment input has a `Parcelas` field defaulting to `1`.
- When `Parcelas` is `1`, behavior is identical to the current single-month addition.
- When `Parcelas` is greater than `1`, the addition is applied to each consecutive month within the window.
- A summary of affected months is shown before the user confirms.
- Months outside the current window are silently skipped.
- The `-` adjustment input is unchanged.
- TypeScript validation passes.
- Unit tests pass.
- README is updated if the implemented behavior is user-visible.
