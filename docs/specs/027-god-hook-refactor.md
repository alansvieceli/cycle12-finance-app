# Spec 027 - God Hook Refactor

## Goal

Split `useFinanceState` into focused units so each piece of state lives as close as possible to where it is used, reducing the hook's size and coupling to screen components.

## Context

`useFinanceState` currently manages three distinct responsibilities in ~700 lines:

1. **Finance state** — the core data model, CRUD actions, and persistence.
2. **Form state for creation** — `newCategoryName`, `newCategorySortOrder`, `newCategoryPropagation`, `newCategoryInstallmentEndDate`, `newCategoryColor`, `newAccountName`, `newAccountDueDay`, `newAccountCategoryId`.
3. **Selection state** — `selectedAccountItemId`.

This makes the hook hard to test, couples every consumer to its full return type, and means unrelated state changes can trigger re-renders in components that don't need them.

## Goals

- Move the new-category form state (`newCategory*`) into `CategoriesScreen` or its child `CategoryEditor`.
- Move the new-account form state (`newAccount*`) into `AccountsScreen` or its child `AccountEditor`.
- Move `selectedAccountItemId` / `selectedAccountItem` into `AccountsScreen`, which is the only consumer.
- Keep `useFinanceState` focused on finance data state and persistence actions only.
- Allow each screen to type its own props precisely instead of accepting `ReturnType<typeof useFinanceState>`.

## Non-Goals

- Do not change any finance data logic or CRUD actions.
- Do not change any visual layout or user-visible behavior.
- Do not introduce React Context — continue passing props explicitly.

## UX Behavior Impact

**Breaking change in form persistence:** today, if the user types a category name in Contas and switches to another tab, the draft survives. After this refactor, switching tabs will unmount `CategoriesScreen`/`AccountsScreen` and reset the draft. This is the correct behavior (drafts should not survive navigation), but it must be documented as an intentional change.

## Implementation Notes

- Extract a `useNewCategoryForm` hook (or inline state in `CategoryEditor`) that owns `newCategory*` fields and the `createCategory` call.
- Extract a `useNewAccountForm` hook (or inline state in `AccountEditor`) that owns `newAccount*` fields and the `createAccountItem` call. `selectedAccountItemId` and `setSelectedAccountItemId` move here too.
- `useFinanceState` returns only: `financeState`, `actions` (data mutations only), and `storageMessage` if re-introduced.
- Screen prop types become precise: `financeState: FinanceState` + specific action callbacks, not the full hook return.
- The `formState` field is removed from the hook's public API.

## Acceptance Criteria

- `useFinanceState` is under 400 lines.
- No screen uses `ReturnType<typeof useFinanceState>` as a prop type.
- All existing CRUD operations work identically.
- `npm run check` passes with no errors.
- All tests pass.

## Validation

```bash
npm run check
npm test
```

Validate on Android emulator:

- Creating a category works end-to-end.
- Creating an account works end-to-end.
- Editing and deleting accounts/categories works.
- Switching tabs resets in-progress drafts (intentional behavior change).
