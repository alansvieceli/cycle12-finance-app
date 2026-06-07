# Task 026-03 - Add Creation Modal

## Spec

`docs/specs/026-add-account-from-payments.md`

## Plan

`docs/plans/026-add-account-from-payments-plan.md`

## Goal

Add the account creation modal to `CurrentMonthPaymentChecklist` with name input, category chip picker, due day and value fields, and save/cancel actions.

## Steps

1. Add local state variables: `isAddModalOpen`, `newName`, `newCategoryId`, `newDueDay`, `newAmount`.
2. Replace the `openAddModal` placeholder with the real implementation: resets all fields, defaults categoryId to first category and dueDay to today, then opens the modal.
3. Add `closeAddModal` and `saveNewAccount` functions. `saveNewAccount` validates name and categoryId, calls `onCreateAccountItem`, and closes the modal.
4. Add the Modal JSX (same `animationType="fade"` + transparent overlay pattern as the adjustment modal): title with month/year, name `TextInput` with `autoFocus`, horizontal `ScrollView` category chip picker, due day + value row, Cancel/Salvar buttons.
5. Add modal styles: `modalOverlay`, `modalCard`, `modalTitle`, `modalInput`, `modalFieldLabel`, `categoryScroll`, `categoryChip`, `categoryChipActive`, `categoryChipText`, `categoryChipTextActive`, `modalRow`, `modalFieldDueDay`, `modalFieldValue`, `modalActions`, `modalCancelButton`, `modalCancelButtonText`, `modalSaveButton`, `modalSaveButtonText`.
6. Run `npm run typecheck` and confirm no errors.
7. Run `npm test` and confirm all tests pass.
8. Commit.

## Acceptance Criteria

- Modal opens when `Adicionar conta` is tapped.
- Name field is auto-focused.
- Category chips are scrollable and one is always selected.
- Saving with a valid name creates the account and closes the modal.
- Cancelling discards the form.
- TypeScript validation passes.
- All tests pass.
