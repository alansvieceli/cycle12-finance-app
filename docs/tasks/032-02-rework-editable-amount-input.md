# Task 032-02 - Rework EditableAmountInput

Status: Completed

## Spec

`docs/specs/032-currency-input-mask.md`

## Plan

`docs/plans/032-currency-input-mask-plan.md`

## Goal

Turn `EditableAmountInput` into a masked currency input that uses the 032-01 helpers and emits numeric values.

## Steps

1. Hold the draft amount in cents (integer) as internal state.
2. On every text change, derive the new cents from the helpers and render the formatted display.
3. Change `onChangeValue` to emit a `number` (value in reais).
4. Switch `keyboardType` to `number-pad`.
5. Keep the unfocused sync with the external `value` prop.
6. Keep the `valuesHidden` behavior (`• • •` while unfocused).
7. Update `CurrencyInput` to the new `onChangeValue` signature.

## Acceptance Criteria

- The field always displays a formatted amount while typing; no free text is possible.
- Typed commas, dots, and other non-digit characters are ignored.
- `onChangeValue` reports the exact displayed amount as a number.
- Unfocused fields resync when the external `value` changes.
- `valuesHidden` still masks unfocused fields with `• • •`.
- TypeScript validation passes for the component and `CurrencyInput`.
