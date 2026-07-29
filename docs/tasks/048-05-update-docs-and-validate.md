# Task 048-05 - Update Documentation and Validate

## Objective

Document the subscriptions feature and run the full validation for spec 048.

## Acceptance Criteria

- [x] `docs/app-context.md` describes `Assinatura` in `Core Data Concepts`,
      including why it stays outside every expense, payment, and balance
      calculation.
- [x] `docs/app-context.md` describes the `Cadastros` third section, the
      `Gráficos` panel, the third tab in the history card, and the inclusion of
      subscriptions in the `.c12f` backup.
- [x] `README.md` describes the section and the panel in the tab list and the
      feature list.
- [x] `npm test` passes.
- [x] `npm run check` passes.
- [x] `npm run dup` passes.
- [ ] On the emulator, registering a subscription updates the `Gráficos` panel
      and leaves the projected balance, monthly expenses, income commitment, and
      paid/pending totals unchanged.
- [ ] On the emulator, exporting and restoring a backup preserves the
      subscriptions.
