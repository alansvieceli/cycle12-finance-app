# Task 048-01 - Add Subscription Data

## Objective

Add the `Subscription` data concept, the calculations that derive every number
the UI needs, and its inclusion in the local backup.

## Acceptance Criteria

- [ ] `Subscription` is exported from `src/types/finance.ts` with `id`, `name`,
      `amount`, and an optional `color`.
- [ ] `FinanceState` carries `subscriptions`, and `emptyFinanceState` defaults it
      to an empty list.
- [ ] `MonthHistoryEntry` gains `subscriptionsTotal` and `subscriptions` as
      optional fields, so entries stored before this feature keep parsing.
- [ ] `calculateSubscriptionsMonthlyTotal` sums every amount.
- [ ] `calculateSubscriptionsYearlyTotal` returns the monthly total times twelve.
- [ ] `calculateSubscriptionsSalaryShare` divides by the salary alone and returns
      `null` when the salary is zero or negative.
- [ ] `toSubscriptionChartPoints` sorts by amount descending and assigns a
      palette color by position, keeping a subscription's own color when set.
- [ ] The `.c12f` payload carries subscriptions, validated for shape like the
      other collections.
- [ ] A backup without the field restores as an empty list.
- [ ] Focused tests pass.
- [ ] `npm run check` passes.
- [ ] `npm run dup` passes.
