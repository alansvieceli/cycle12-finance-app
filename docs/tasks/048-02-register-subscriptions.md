# Task 048-02 - Register Subscriptions in Cadastros

## Objective

Add the `Assinaturas` section to `Cadastros`, holding only registration: create,
edit, delete, and list.

## Acceptance Criteria

- [x] `useFinanceState` exposes `createSubscription`, `updateSubscriptionName`,
      `updateSubscriptionAmount`, and `deleteSubscription`. Name and amount are
      separate setters to match how the category and account editors already
      update a single field per input.
- [x] `createSubscription` ignores an empty name and an amount of zero or less.
- [x] The segmented control shows `Categorias | Contas | Assinaturas`.
- [ ] Every label renders on a single line with no wrapping and no ellipsis at
      the narrowest supported width, verified on the Android emulator.
- [x] The list is sorted by amount descending, each row showing the name, the
      formatted amount, and edit and delete actions.
- [x] Deleting asks for confirmation.
- [x] Creating and editing follow the collapsible-form and expandable-row pattern
      the other editors in this tab already use, not a modal, and both use
      `EditableAmountInput`, so the currency mask, the `999.999.999,99` cap, and
      the non-negative rule apply.
- [x] `Adicionar` stays disabled until the name is non-empty and the amount is
      greater than zero.
- [x] The eye toggle masks every monetary value in the section.
- [x] Registered subscriptions persist across an app restart.
- [x] `npm run check` passes.
- [x] `npm run dup` passes.
