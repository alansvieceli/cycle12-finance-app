# Task 048-02 - Register Subscriptions in Cadastros

## Objective

Add the `Assinaturas` section to `Cadastros`, holding only registration: create,
edit, delete, and list.

## Acceptance Criteria

- [ ] `useFinanceState` exposes `createSubscription`, `updateSubscription`, and
      `removeSubscription`.
- [ ] `createSubscription` ignores an empty name and an amount of zero or less.
- [ ] The segmented control shows `Categorias | Contas | Assinaturas`.
- [ ] Every label renders on a single line with no wrapping and no ellipsis at
      the narrowest supported width, verified on the Android emulator.
- [ ] The list is sorted by amount descending, each row showing the name, the
      formatted amount, and edit and delete actions.
- [ ] Deleting asks for confirmation.
- [ ] The create and edit modal uses `EditableAmountInput`, so the currency mask,
      the `999.999.999,99` cap, and the non-negative rule apply.
- [ ] Save stays disabled until the name is non-empty and the amount is greater
      than zero.
- [ ] The eye toggle masks every monetary value in the section.
- [ ] Registered subscriptions persist across an app restart.
- [ ] `npm run check` passes.
- [ ] `npm run dup` passes.
