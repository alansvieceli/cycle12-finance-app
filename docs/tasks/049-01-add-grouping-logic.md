# Task 049-01 - Add Grouping Logic

## Objective

Add `Subscription.tag`, the pure grouping function every screen will share, and
carry `tag` through the local backup.

## Acceptance Criteria

- [x] `Subscription` and `MonthHistoryEntry.subscriptions[]` items carry an
      optional `tag`.
- [x] `UNTAGGED_SUBSCRIPTION_GROUP` is exported as `'Outros'`.
- [x] `groupSubscriptionsByTag` buckets by trimmed `tag`, falls back to
      `UNTAGGED_SUBSCRIPTION_GROUP` when blank or missing, sorts groups by
      total descending, and sorts each group's subscriptions by amount
      descending.
- [x] `toSubscriptionChartPoints` orders by group then amount, keeping the
      existing `amount > 0` filter and the own-color-else-palette rule.
- [x] `toSubscriptionGroupChartPoints` returns one chart point per group with
      the group's total and a palette color by group position.
- [x] The `.c12f` backup preserves each subscription's `tag`, and a backup
      without the field restores subscriptions as untagged.
- [x] Focused tests pass.
- [x] `npm run check` passes.
- [x] `npm run dup` passes.
