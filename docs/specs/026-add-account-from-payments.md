# Spec 026 - Add Account from Payments Screen

## Goal

Allow the user to create a new account item for the current month directly from the Pagamentos do Mês screen, without navigating to the Contas tab.

## Context

The Pagamentos screen is a secondary view opened from Resumo. It is used to track paid and pending items for the current month. When a user is reviewing payments and realizes they are missing an account, the current workflow requires leaving Pagamentos, going to Contas to create the account, going to Planejar to set the value, and then returning to Pagamentos. This spec adds a shortcut for that common case.

## Goals

- Add an `Adicionar conta` button to the Pagamentos header.
- When tapped, open a modal to create an account item with an optional value for the current month.
- The modal requires: account name (required), category (required), due day (defaults to today), and value (optional, defaults to 0).
- The new account appears immediately in the Pagamentos checklist.
- If no categories exist, the button is disabled with a hint to create one in Contas first.

## Non-Goals

- Do not allow editing or deleting accounts from this screen.
- Do not allow setting values for future months from this screen.
- Do not allow creating categories from this screen.
- Do not add navigation to Contas from this modal.

## UX Behavior

### Header layout

The header of `CurrentMonthPaymentChecklist` is redesigned:

```
PAGAMENTOS
Marque o que já foi pago.
Jun / 2026                    [Voltar]
[        Adicionar conta        ]
```

- `PAGAMENTOS` — uppercase label in `textSecondary`
- `Marque o que já foi pago.` — hint in `textSecondary`, below the label
- Month/year — large title on the left of the next row
- `Voltar` — secondary button on the right, same row as the month/year
- `Adicionar conta` — full-width accent button below

### No-categories state

If `categories` is empty, `Adicionar conta` is disabled and a hint is shown: `Crie uma categoria em Contas primeiro.`

### Creation modal

Title: `Nova conta — Jun / 2026`

Fields:

| Field                 | Default        | Required |
| --------------------- | -------------- | -------- |
| Nome da conta         | empty          | yes      |
| Categoria             | first category | yes      |
| Dia de vencimento     | today          | no       |
| Valor (current month) | 0,00           | no       |

Actions: `Cancelar` / `Salvar`

`Salvar` is always tappable; validation prevents saving if name or category is empty.

### On save

1. A new `AccountItem` is created with the given name, categoryId, dueDay, and `sortOrder: 0`.
2. If the entered value is greater than 0, a `MonthlyValue` is created for the current month.
3. The modal closes and the new item appears in the checklist.
4. Future months follow the category's propagation rule.

## Implementation Notes

- A new pure helper `buildAccountItemWithValueState` in `useFinanceState.ts` handles the atomic state transition for creating an `AccountItem` + optional `MonthlyValue`.
- A new action `createAccountItemAndSetValue` in `useFinanceState` calls the helper and selects the new item.
- `CurrentMonthPaymentChecklist` receives `onCreateAccountItem` as a prop and owns all local modal/form state.
- The modal uses the same `Modal` + transparent overlay pattern as the adjustment modal in Planejar.

## Acceptance Criteria

- The Pagamentos header shows the new layout on all screen sizes.
- Tapping `Adicionar conta` opens the modal.
- The modal saves a new account and closes on `Salvar`.
- The new account appears immediately in the checklist.
- The button is disabled when no categories exist.
- The value is optional; saving with value 0 creates the account without a `MonthlyValue`.
- TypeScript validation passes.
- Existing tests pass.

## Validation

```bash
npm run check
npm test
```
