# Plan 026 - Add Account from Payments Screen

## Objective

Allow the user to create a new account item directly from the Pagamentos do Mês screen. A pure state helper encapsulates the atomic transition of creating an `AccountItem` and an optional `MonthlyValue`. The Pagamentos header is redesigned with the approved layout and a creation modal is added inline with local form state.

## Implementation Plan

1. Add `buildAccountItemWithValueState` pure helper to `useFinanceState.ts` and add the `createAccountItemAndSetValue` action. Write unit tests for the helper.
2. Redesign the `CurrentMonthPaymentChecklist` header with the new layout: uppercase label, instruction hint, month/year + Voltar row, and full-width `Adicionar conta` button.
3. Add the creation modal to `CurrentMonthPaymentChecklist` with name, category picker, due day, and value fields. Wire `openAddModal`, `closeAddModal`, and `saveNewAccount` functions.
4. Pass `onCreateAccountItem={finance.actions.createAccountItemAndSetValue}` in `FinanceApp.tsx` and validate with `npm run check`.
5. Update `docs/app-context.md` and `README.md` to reflect the new feature.

## Task Breakdown

- `026-01-add-state-helper-and-action.md`
- `026-02-redesign-payments-header.md`
- `026-03-add-creation-modal.md`
- `026-04-wire-finance-app.md`
- `026-05-update-docs-and-validate.md`

## Assumptions

- No new dependencies required.
- `parseCurrencyInput` and `parseDueDay` from `src/lib/inputParsers.ts` are used for input parsing.
- `sortOrder: 0` is acceptable for new accounts created from this screen; the user can reorder from Contas.
- Value 0 means no `MonthlyValue` is created for the current month.
- Future months follow the category's propagation rule — no special handling is needed here.

## Validation

- `npm run lint`
- `npm run typecheck`
- `npm test`

When practical, validate on Android emulator:

- Pagamentos header shows the new layout.
- Tapping `Adicionar conta` opens the modal.
- Saving with a name and value creates the account and closes the modal.
- The new account appears immediately in the checklist.
- The button is disabled when no categories exist.
- Cancelling the modal discards the form.
