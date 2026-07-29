# Task 049-04 - Grouped Subscriptions in Histórico

## Objective

Record each subscription's group in the month snapshot and show the
`Histórico` `Assinaturas` tab clustered the same way as `Cadastros`.

## Acceptance Criteria

- [x] `buildHistoryEntry` records `tag` for each subscription in the snapshot.
- [x] The `Assinaturas` tab of an expanded history card groups that month's
      subscriptions by their recorded tag, same header pattern as `Cadastros`
      (dot, name, group total).
- [x] The existing total footer row and the empty state are unchanged.
- [x] An entry recorded before this feature (no `tag` on its subscriptions)
      renders entirely under `Outros`.
- [x] `npm run check` passes.
- [x] `npm run dup` passes.
