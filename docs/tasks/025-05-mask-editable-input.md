# Task 025-05 - Mask Editable Input

## Spec

`docs/specs/025-hide-values-toggle.md`

## Plan

`docs/plans/025-hide-values-toggle-plan.md`

## Goal

Update `EditableAmountInput` to show `• • •` at rest when `valuesHidden` is true, and the real value when the field is focused.

## Steps

1. Open `src/components/common/EditableAmountInput.tsx`.
2. Add `valuesHidden?: boolean` to `EditableAmountInputProps` (optional, defaults to `false`).
3. The component already tracks `isFocused`. Use it:
   - The `value` prop passed to `TextInput` becomes:
     ```ts
     valuesHidden && !isFocused ? '• • •' : draftValue;
     ```
4. When the field receives focus (`onFocus`), the real `draftValue` is already in state — no change needed. The mask is removed simply by `isFocused` becoming `true`.
5. Do not use `secureTextEntry`.
6. Do not mask the value while the user is typing.
7. Open `src/components/finance/MonthlyValueEditor.tsx`.
8. Add `valuesHidden?: boolean` to its props and pass it through to each `EditableAmountInput`.
9. Open `src/screens/PlanningScreen.tsx`.
10. Add `valuesHidden?: boolean` to its props and pass it to `MonthlyValueEditor`.

## Acceptance Criteria

- When `valuesHidden` is `true` and no field is focused, all month value inputs show `• • •`.
- Tapping a field reveals the real value and allows normal editing.
- On blur, the field returns to `• • •` if `valuesHidden` is still `true`.
- The adjustment modal (+/–) is unaffected and always shows real values.
- TypeScript validation passes.
- Existing tests pass.
