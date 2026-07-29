# Task 048-04 - Record Subscriptions in the Month History

## Objective

Snapshot the subscriptions of a month leaving the planning window and show them
in the history card.

## Acceptance Criteria

- [ ] `buildHistoryEntry` records `subscriptionsTotal` and one entry per
      subscription for the month leaving the window.
- [ ] An empty subscription list records a zero total.
- [ ] Editing or deleting a subscription never alters a month already recorded.
- [ ] Each expanded history card offers `Categorias | Contas | Assinaturas`.
- [ ] The new tab lists that month's subscriptions sorted by amount descending
      with the recorded total in a footer row.
- [ ] The tab shows an empty state for months recorded before this feature.
- [ ] `RECEBIDO` and `PAGO` remain the only headline figures on the card.
- [ ] Every label in the control renders on a single line, legible, at the
      narrowest supported width, verified on the Android emulator.
- [ ] The eye toggle masks every monetary value in the tab.
- [ ] Focused tests pass.
- [ ] `npm run check` passes.
- [ ] `npm run dup` passes.
