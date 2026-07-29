# Task 049-03 - Two Subscription Panels in Gráficos

## Objective

Show subscriptions as two panels in `Gráficos`: one slice per group, and one
slice per subscription ordered by group.

## Acceptance Criteria

- [x] `Assinaturas por grupo` shows one slice per group, the monthly total,
      the yearly total, and the salary share footnote (unchanged formulas).
- [x] `Assinaturas por assinatura` shows one slice per subscription, ordered
      by group then amount, with only the monthly total (no secondary total,
      no footnote).
- [x] Both panels keep the existing empty state and `valuesHidden` masking.
- [x] `npm test` passes with no unrelated test changed.
- [x] `npm run check` passes.
- [x] `npm run dup` passes.
