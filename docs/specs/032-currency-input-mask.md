# Spec 032 - Currency Input Mask

## Goal

Replace free-text currency typing with a cash-register style mask in every monetary input field. Digits enter from the right as cents and the display is always formatted (`0,00`, `9,41`, `9.412,34`), so the user never types comma or thousand separators manually.

## Context

Today monetary fields accept free text with `keyboardType="decimal-pad"` and rely on `parseCurrencyInput` to interpret the string on each change or on blur. This is error-prone:

- The user must type the comma manually, and forgetting it changes the value by 100x.
- `parseCurrencyInput` strips all dots, so `1234.56` becomes `123456`.
- Some Android keyboards show only a dot on `decimal-pad`, making correct input impossible.
- Fields behave inconsistently: some use `EditableAmountInput`, others use raw `TextInput` with ad-hoc parsing.

Desired behavior (example):

```
display starts at 0,00
type 9 → 0,09
type 4 → 0,94
type 1 → 9,41
type 2, 3 → 941,23
type 4 → 9.412,34
backspace → 941,23   (removes the rightmost digit)
```

> **Post-implementation adjustment (2026-06-10):** the hand-rolled mask helpers caused visible formatting lag while typing fast. At the user's explicit request, the mask is now implemented with `react-native-currency-input` (JavaScript-only, no native code) inside `EditableAmountInput`. The component API, covered fields, cap, zero-as-placeholder, and `valuesHidden` behavior below remain as specified; the `src/lib/currencyMask.ts` helpers were removed.

## Non-Goals

- Do not add new dependencies (no masked-input library). _(superseded by the adjustment note above)_
- Do not support negative amounts in the masked input. Subtraction flows keep using their existing add/subtract mode toggles.
- Do not change `parseCurrencyInput` itself; it remains for non-typing paths (backup parsing, programmatic values).
- Do not change how values are stored (numbers in reais, as today).
- Do not change the `valuesHidden` privacy behavior.

## UX Behavior

### Masked input

`EditableAmountInput` becomes a masked currency input:

- Internal state is the amount in cents (integer).
- Display is always `pt-BR` formatted: thousands with `.`, decimals with `,`, two decimal places.
- Each typed digit enters from the right (`cents = cents * 10 + digit`).
- Backspace removes the rightmost digit (`cents = floor(cents / 10)`).
- Comma, dot, and any non-digit characters typed or pasted are ignored; only digits are consumed.
- Keyboard is `number-pad` (no decimal key needed).
- Cap: digits beyond `999.999.999,99` are ignored.
- When not focused, the field syncs to the external `value` prop, as today.
- `valuesHidden` keeps showing `• • •` while unfocused.

### API change

`EditableAmountInput.onChangeValue` emits a `number` (value in reais) instead of the raw string. Callers stop calling `parseCurrencyInput` in the typing path.

### Fields covered

All monetary inputs use the masked component:

- `Planejar`: inline month value input and the `±` adjustment modal input (`MonthlyValueEditor`).
- `Ajustes`: salary and current month extra balance (`CurrencyInput`, which wraps `EditableAmountInput`).
- `Pagamentos`: new account value input and the `±` adjustment modal input (`CurrentMonthPaymentChecklist`).
- `Resumo`: quick-add extra balance modal (`SummaryScreen`).

Non-monetary numeric fields (due day, sort order, visible month count) are out of scope.

## Implementation Notes

- Extract the mask logic into pure helpers in `src/lib/` (e.g. `currencyMask.ts`): digits-to-cents reduction from a text change, cents-to-display formatting, and the cap rule. The component stays a thin wrapper.
- `useFinanceState` actions that today accept raw strings and parse them (`updateMonthlySalary`, `updateCurrentMonthExtraBalance`, monthly value updates) may change their signatures to accept `number` where it keeps the change contained; document any signature changes in the plan.
- `monthlyValueAdjustments.ts` and the `±` modal confirm-label formatting must read from the new numeric flow instead of re-parsing strings.
- Keep visual styles of each field unchanged; only the input behavior changes.

## Tests

Unit tests for the pure mask helpers:

- typing digits one by one produces the example sequence above.
- backspace removes the rightmost digit.
- pasting text with non-digit characters keeps only digits.
- the cap ignores digits beyond `999.999.999,99`.
- zero displays as `0,00`.

Update existing tests affected by the `onChangeValue` signature change.

## Acceptance Criteria

- All monetary fields listed above format automatically while typing, following the digit-from-the-right behavior.
- The user never needs to type comma or dot; typed separators are ignored.
- Backspace removes the rightmost digit and reformats.
- Keyboard shown is `number-pad` on all monetary fields.
- Values saved to state match the displayed amount exactly.
- `valuesHidden` still masks unfocused fields with `• • •`.
- Adjustment (`±`) modals in Planejar and Pagamentos use the masked input and their confirm labels update correctly.
- TypeScript validation passes.
- Unit tests pass.

## Validation

```bash
npm run check
npm test
```
