# Task 026-02 - Redesign Payments Header

## Spec

`docs/specs/026-add-account-from-payments.md`

## Plan

`docs/plans/026-add-account-from-payments-plan.md`

## Goal

Redesign the `CurrentMonthPaymentChecklist` header to the approved layout: uppercase label, instruction hint, month/year + Voltar row, and full-width `Adicionar conta` button.

## Steps

1. Add `onCreateAccountItem` to the props type in `CurrentMonthPaymentChecklist.tsx`.
2. Add a module-level `shortMonthFormatter` and `formatPaymentMonthLabel(year, month)` function that returns `"Jun / 2026"` format.
3. Replace the existing header JSX with the new layout: `PAGAMENTOS` label, hint, `headerRow` with month/year title and secondary `Voltar` button, `Adicionar conta` full-width button, and disabled hint when no categories exist.
4. Add a temporary `openAddModal` placeholder function (implemented in task 026-03).
5. Add or update styles: `sectionLabel`, `sectionHint`, `headerRow`, `sectionTitle`, `addButton`, `addButtonDisabled`, `addButtonText`, `addButtonTextDisabled`, `addButtonHint`.
6. Run `npm run typecheck` and confirm no errors.
7. Commit.

## Acceptance Criteria

- Header shows the new layout with label, hint, month/year, Voltar button (secondary style), and Adicionar conta button.
- `Voltar` uses `variant="secondary"` on `ActionButton`.
- Button is disabled when `categories` is empty.
- TypeScript validation passes.
