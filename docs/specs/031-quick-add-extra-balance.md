# Spec 031 - Quick Add Extra Balance

## Goal

Add a "+" button to the balance panel in the Resumo tab that lets the user quickly add an extra amount to the current month without navigating to Ajustes. The extra resets to zero automatically when the month advances.

## Context

`currentMonthExtraBalance` is a settings field editable only in `Ajustes` → "Renda Extra". The use case is ad-hoc: the user receives unexpected income (freelance, repayment, bonus) and wants to see the impact on the projected balance immediately.

Today two problems exist:

1. The only entry point is `Ajustes`, several taps away from the balance view.
2. The value never resets — it silently persists into future months, causing stale projections.

This spec adds a fast entry point in `Resumo` and fixes the persistence bug.

## Non-Goals

- Do not remove the existing `CurrencyInput` for this field in `Ajustes` ("Renda Extra"). It stays as the manual override / clear path.
- Do not add a subtraction flow to the quick modal. Reducing the value is done via `Ajustes`.
- Do not show a history of extra entries.
- Do not show the accumulated extra visually in the balance panel (no badge, no label).
- Do not add new dependencies.

## UX Behavior

### "+" button on the balance panel

Inside the `balancePanel` card on `SummaryScreen` (active view `current`), the projected balance row becomes a horizontal row:

```
[Saldo projetado]
[R$ 1.240         ] [+]    ← value left, button right, both vertically centered
[Comprometimento 62%]
[progress bar]
```

- The "+" button is a circular orange button (`colors.accent`), fixed to the right.
- It is aligned vertically with the balance amount (same flex row, `align-items: center`).
- The value grows to the left; the button never shifts.
- The button is always visible on the current month view, regardless of whether extra is already set.

### Quick add modal

Tapping "+" opens a `Modal` (transparent overlay, same pattern as the existing add-account modal in `CurrentMonthPaymentChecklist`).

Modal layout:

```
Adicionar extra do mês     ← title
[ 0,00                  ]  ← CurrencyInput, auto-focused
[ Cancelar ] [ Nova extra R$ 800,00 ]
```

- Title: `"Adicionar extra do mês"`
- Input: numeric currency input, starts at `0,00`, auto-focused on open.
- Confirm button label: `"Nova extra R$ <total>"` where `<total>` is `currentMonthExtraBalance + enteredAmount`, formatted with `maskCurrency`.
- Confirm button is always enabled (adding zero is a no-op).
- Tapping confirm calls `onAddExtra(enteredAmount)` and closes the modal.
- Tapping Cancelar or the overlay background closes the modal without saving.
- `valuesHidden` applies: when active, the confirm button shows `"Nova extra ••••"`.

## State Changes

### New action: `addCurrentMonthExtraBalance`

Add to `useFinanceState`:

```ts
addCurrentMonthExtraBalance: (amount: number) => void
```

Internally: `updateCurrentMonthExtraBalance(current + amount)`.

This keeps the additive logic out of the UI layer.

### Reset on window advance

In `advanceWindowOneStep` in `src/lib/windowAdvance.ts`, reset `currentMonthExtraBalance` to `0` when building the new settings:

```ts
settings: {
  ...state.settings,
  windowStartYear: nextWindowStart.year,
  windowStartMonth: nextWindowStart.month,
  currentMonthExtraBalance: 0,
},
```

### `SummaryScreen` new prop

```ts
onAddExtra: (amount: number) => void
```

Wired in `FinanceApp.tsx` to `finance.actions.addCurrentMonthExtraBalance`.

## Implementation Notes

- The modal state (`isExtraModalOpen`, `extraInput`) lives inside `SummaryScreen`.
- Reuse `CurrencyInput` for the input field and `parseCurrencyInput` to parse the value before calling `onAddExtra`.
- Reuse `maskCurrency` for the confirm button label.
- Modal uses the same `Modal` + overlay pattern as the existing add-account modal in `CurrentMonthPaymentChecklist.tsx`.
- The "+" button only appears in the `activeView === 'current'` branch.

## Tests

Unit tests required in `windowAdvance.test.ts`:

- `advanceWindowOneStep` resets `currentMonthExtraBalance` to `0` in the returned state.
- An existing non-zero extra is zeroed after a single advance step.

## Acceptance Criteria

- A circular orange "+" button appears to the right of the projected balance value in the Resumo current month view.
- The button is vertically aligned with the balance value and does not shift as the value changes.
- Tapping "+" opens a modal titled "Adicionar extra do mês".
- The modal has a currency input starting at `0,00` and auto-focuses on open.
- The confirm button shows "Nova extra R$ X,00" updating in real time as the user types.
- Confirming adds the entered amount to `currentMonthExtraBalance` and closes the modal.
- Cancelling closes the modal without any change.
- When `valuesHidden` is active, the confirm button label shows `"Nova extra ••••"`.
- `currentMonthExtraBalance` resets to `0` automatically when the month advances.
- The existing `CurrencyInput` for this field in `Ajustes` continues to work as before.
- TypeScript validation passes.
- Unit tests pass.

## Validation

```bash
npm run check
npm test
```
