# Spec 042 - Planejar Quality Cleanup

## Goal

Remove the technical debt found in the `Planejar` tab analysis: a duplicated helper, an over-defensive string state, a missing test suite for the app's most stateful component, and copy/documentation that no longer matches the implementation.

## Context

`Planejar` is `FinanceApp` (tab `planning`) -> `PlanningScreen` (prop forwarding only) -> `MonthlyValueEditor` (507 lines, all behavior). The analysis of the tab found:

1. `MonthlyValueEditor.tsx:348-361` reimplements `getMonthlyValueAmount`, which is already exported from `src/lib/financeCalculations.ts:180` and imported by `SummaryScreen`, `ChartsScreen`, `CurrentMonthPaymentChecklist`, and `reminders`. The two versions are identical.
2. The installments value is stored as a string (`installmentsInput`) with `sanitizeInstallmentsInput` (a `\D` regex) and a `< 1` guard, even though the only writer is a `SelectField` whose options are generated in the same file as `'1'`..`'12'`. Both defenses are unreachable — leftovers from when the field was free-text.
3. `MonthlyValueEditor` has no test at all, while the pure helpers it orchestrates (`installmentMonths`, `monthlyValueAdjustments`) are covered. The uncovered logic is the wiring: which months an adjustment hits, and whether `subtract` leaks an installment count.
4. `docs/app-context.md` and `README.md` describe a `±` button on the Planejar month rows and Pagamentos payment rows. Commit `c153596` ("replace text symbols with @expo/vector-icons") intentionally replaced that symbol with a `calculator-outline` icon; the code is the source of truth and the docs are stale.
5. The Planejar footer reads `Total do ano`, but it sums the 12-month rolling window, which spans two calendar years (in July 2026 it is jul/26 -> jun/27). The number is correct; the label implies something else.

## Non-Goals

- Do not change any calculation, stored data, or backup shape.
- Do not change the adjustment/installment behavior — same months affected, same values written.
- Do not redesign the tab, extract new components, or split `MonthlyValueEditor`.
- Do not change the `calculator-outline` icon itself; only the documentation that describes it.
- Do not touch the `Pagamentos` adjustment flow beyond the documentation wording it shares.

## Behavior Changes

Only one user-visible change:

- The Planejar footer label changes from `Total do ano` to `Total dos 12 meses`. The value is unchanged.

Everything else is internal (helper reuse, state type) or documentation.

## Implementation Notes

### Helper reuse

- Delete the local `getMonthlyValueAmount` from `MonthlyValueEditor.tsx` and import the shared one from `../../lib/financeCalculations`.

### Installments state

- Replace `useState('1')` with `useState(1)`.
- Delete `sanitizeInstallmentsInput` and `parseInstallmentsInput`.
- `SelectField` keeps its string contract: `value={String(installments)}` and `onChange={(id) => setInstallments(Number(id))}`.

### Copy and docs

- `MonthlyValueEditor.tsx`: `Total do ano` -> `Total dos 12 meses` (sentence case, per `docs/standards/ui-copy-policy.md`).
- `docs/app-context.md`: describe the adjustment control as the row's adjustment button (`Ajustar valor`) instead of a `±` button, in the `Planejar` section, the `Pagamentos` section, and the currency-mask paragraph. Update the `Planejar` section to mention the `Total dos 12 meses` footer.
- `README.md`: same `±` wording fix in the Planejar and Pagamentos bullets.

## Tests

New `src/components/finance/MonthlyValueEditor.test.tsx` (React Native Testing Library, following `ActionButton.test.tsx`):

- Renders the empty-state message when there is no selected account item.
- Renders one row per projection month and the summed footer total.
- Inline edit: changing a month input and blurring it calls `onChangeMonthlyValue` with that month and amount (covers the debounce flush on blur).
- Adjustment modal, `add` mode with 3 installments: confirming calls `onAdjustMonthlyValue` with the pressed month, the amount, `'add'`, and `3`.
- Adjustment modal, `subtract` mode: confirming calls `onAdjustMonthlyValue` with `'subtract'` and no installment count.

## Acceptance Criteria

- `MonthlyValueEditor.tsx` imports `getMonthlyValueAmount` from `src/lib/financeCalculations.ts` and defines no local copy.
- The installments state is a `number`; `sanitizeInstallmentsInput` and `parseInstallmentsInput` no longer exist.
- Installment behavior is unchanged: `add` applies to the selected month plus the following `N-1` months inside the window, `subtract` applies only to the selected month.
- `src/components/finance/MonthlyValueEditor.test.tsx` exists and covers the five cases above.
- The Planejar footer reads `Total dos 12 meses`.
- `docs/app-context.md` and `README.md` no longer describe a `±` button, and `docs/app-context.md` mentions the footer total.
- `npm run check` passes.

## Validation

```bash
npm run check
```
