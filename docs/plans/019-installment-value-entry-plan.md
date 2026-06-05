# Plan 019 - Installment Value Entry

## Objective

Allow the existing monthly `+` adjustment flow in `Planejamento` to add the same entered amount across multiple consecutive months inside the current 12-month planning window.

## Assumptions

- The installment amount entered by the user is the amount applied to each month; it is not divided by the installment count.
- The existing `adjustMonthlyValue` behavior remains the single-month path for subtraction and for additions with one installment.
- The current projection window is represented by the 12 `projectionMonths` passed to `PlanningScreen`.
- Months beyond the current 12-month window are ignored without user-facing errors, as specified.

## Steps

1. Add a pure `installmentMonths` helper and unit tests for 12-month window calculations.
2. Extend state actions so additions can apply the same adjustment to multiple returned months.
3. Update `MonthlyValueEditor` to show a compact `Parcelas` field only for additions, defaulting to `1`, with an affected-month summary.
4. Update README for the new user-visible installment adjustment behavior.
5. Run validation with the project quality commands.

## Out of Scope

- No purchase/installment history.
- No new storage model.
- No installments for subtraction.
- No large layout rewrite outside the existing adjustment modal.
