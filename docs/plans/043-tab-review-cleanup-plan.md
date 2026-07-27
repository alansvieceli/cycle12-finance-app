# Plan 043 - Tab Review Cleanup

Status: Implemented, checks passing

## Spec

`docs/specs/043-tab-review-cleanup.md`

## Objective

Clear the defects found by reviewing `Resumo`, `Gráficos`, `Cadastros`, `Ajustes`, and `Pagamentos` with the spec 042 criteria: one duplicated helper, three pieces of dead code, three copy errors, and two documentation drifts.

## Tasks

| Task   | File                                                | Purpose                                                                                         |
| ------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 043-01 | `docs/tasks/043-01-share-category-name-helper.md`   | Move `getCategoryName` to `financeCalculations.ts`; delete the three component copies.            |
| 043-02 | `docs/tasks/043-02-remove-dead-ui-code.md`          | Remove `KpiCard` extras, `AccountEditor.onClose`, and `MonthlyBarChart`'s expense mode.            |
| 043-03 | `docs/tasks/043-03-fix-ui-copy.md`                  | Fix the `Cadastros` pointer, the two title-case labels, and the `Alerta` placeholder.             |
| 043-04 | `docs/tasks/043-04-update-docs-and-validate.md`     | Align `app-context.md`, `README.md`, `ui-copy-policy.md`; run the full gate.                       |

## Task Detail

### 043-01

- Add `getCategoryName(categories, categoryId)` to `src/lib/financeCalculations.ts` immediately after `getMonthlyValueAmount`, returning `'-'` for an unknown id.
- Delete the local copies in `MonthlyValueEditor.tsx`, `CurrentMonthPaymentChecklist.tsx`, and `AccountEditor.tsx` and import the shared one. `AccountEditor` gains its first import from `financeCalculations`; the other two already import from it.
- Add two cases to `financeCalculations.test.ts`.

### 043-02

- `SummaryScreen.tsx`: drop the `detail` and `subvalue` props from `KpiCard`, the JSX branches that render them, and the `kpiDetail` / `kpiSubvalue` styles.
- `AccountEditor.tsx`: drop the `onClose` prop, the `Voltar` button, and the now-unused `ActionButton` import if nothing else uses it (it does — `Adicionar` and `Excluir conta` — so the import stays).
- `MonthlyBarChart.tsx`: drop `mode`, the `LineChart` branch and import, `maxValue`, and `chartMaxValue`; the `totalAmountStyle` and value-list colors become unconditional balance colors.
- `giftedChartAdapters.ts`: delete `toGiftedExpenseLineData` and `GiftedLinePoint`; delete their cases in `giftedChartAdapters.test.ts`.
- `ChartsScreen.tsx`: drop `mode="balance"`.

### 043-03

- `CurrentMonthPaymentChecklist.tsx`: "Crie uma categoria em Contas primeiro." → "Crie uma categoria em Cadastros primeiro."
- `SettingsScreen.tsx`: `Renda Extra` → `Renda extra`; `Janela Atual` → `Janela atual`; `Alerta` placeholder `80` → `70`.

### 043-04

- `docs/app-context.md`: tab name `Cadastros` (Primary Navigation and the tab section heading/body), month count range 3 to 12.
- `README.md`: same tab name and range.
- `docs/standards/ui-copy-policy.md`: the navigation-tab example list names `Cadastros`.
- Run `npm run check`.

## Notes

- Nothing here changes calculations, stored data, or the backup shape.
- The picker range (3–12) is the intended behavior; `clampVisibleMonthCount` keeps accepting 1–12 because it normalizes loaded and restored data, not user input.
- Two items are deliberately left alone and recorded in the spec's "Accepted Debt": the hand-rolled category bottom sheet in `AccountEditor`, and the five near-identical picker modals in `Ajustes`.

## Validation

- `npm run check`
