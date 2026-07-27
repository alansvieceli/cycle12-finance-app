# Plan 042 - Planejar Quality Cleanup

Status: Implemented, checks passing

## Spec

`docs/specs/042-planejar-quality-cleanup.md`

## Objective

Clear the debt found in the `Planejar` analysis without changing behavior: reuse the shared `getMonthlyValueAmount`, simplify the installments state to a number, add the missing `MonthlyValueEditor` test suite, and fix the footer label plus the stale `±` documentation.

## Tasks

| Task   | File                                                     | Purpose                                                                                     |
| ------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 042-01 | `docs/tasks/042-01-reuse-monthly-value-helper.md`        | Delete the local `getMonthlyValueAmount` copy and import the shared helper.                  |
| 042-02 | `docs/tasks/042-02-simplify-installments-state.md`       | Store installments as a `number`; drop the unreachable sanitize/parse helpers.               |
| 042-03 | `docs/tasks/042-03-add-monthly-value-editor-tests.md`    | Add `MonthlyValueEditor.test.tsx` covering rendering, inline edit, and both adjustment modes. |
| 042-04 | `docs/tasks/042-04-fix-copy-and-update-docs.md`          | `Total do ano` -> `Total dos 12 meses`; fix `±` wording in `app-context.md` and `README.md`; validate. |

Order matters: 042-01 and 042-02 change the file the 042-03 tests exercise, so the tests are written against the cleaned-up version and act as the regression net for 042-04.

## Task Detail

### 042-01

- Remove `MonthlyValueEditor.tsx:348-361`.
- Add `getMonthlyValueAmount` to the existing `../../lib/financeCalculations` import (currently type-only for `ProjectionMonth`), so it becomes a mixed `import { getMonthlyValueAmount, type ProjectionMonth }`.
- The three call sites (`annualTotal`, the row amount, `AdjustPanel.currentAmount`) keep the same argument order — the shared signature is identical.

### 042-02

- `const [installments, setInstallments] = useState(1)`.
- `openAdjustModal` / `switchAdjustmentMode` reset to `1` instead of `'1'`.
- `confirmAdjustment` passes `adjustmentMode === 'add' ? installments : undefined`, unchanged in meaning.
- `AdjustPanel` takes `installments: number` and `onInstallmentsChange: (value: number) => void`; the `SelectField` boundary converts with `String(...)` / `Number(...)`.
- Delete `sanitizeInstallmentsInput` and `parseInstallmentsInput`.

### 042-03

- New file `src/components/finance/MonthlyValueEditor.test.tsx`.
- Local fixture: one category, two account items, 12 projection months built with `createProjectionMonths(new Date(2026, 6, 1))`, a couple of monthly values.
- The modal amount field is the last `0,00` placeholder in the tree (the 12 row inputs render before the modal); the test comments this so the index is not mistaken for an accident.
- Inline edit uses `changeText` + `blur`, which exercises the `EditableAmountInput` flush path without fake timers.

### 042-04

- Footer label in `MonthlyValueEditor.tsx`.
- `docs/app-context.md`: `Planejar` section (adjustment button + footer total), `Pagamentos` section, and the currency-mask paragraph.
- `README.md`: Planejar and Pagamentos bullets.
- Run `npm run check`.

## Notes

- No calculation, storage, or backup change — nothing to migrate.
- Component tests do not affect the coverage gate: `jest.config.js` collects coverage from `src/lib`, `src/storage`, and `src/types` only.
- The `calculator-outline` icon was a deliberate decision in commit `c153596`; this plan aligns the docs to the code, not the other way around.
- Deliberately out of scope, recorded so it is not lost: `EditableAmountInput` keeps `onChangeValue` in an always-current ref while the Planejar rows are keyed by month only, so a pending debounce could in theory flush into a newly selected account. It is not reachable today because the default `keyboardShouldPersistTaps` blurs (and flushes) on the first tap. Revisit if the debounce or tap handling changes.

## Validation

- `npm run check`
