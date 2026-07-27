# Spec 043 - Tab Review Cleanup

## Goal

Apply to `Resumo`, `Gráficos`, `Cadastros`, `Ajustes`, and the `Pagamentos` secondary view the same review that produced spec 042 for `Planejar`: remove duplicated helpers and dead code, fix copy that contradicts the UI, and align the documentation with what the app actually does.

## Context

The `Planejar` review (spec 042) found four defect classes: a helper duplicated from `src/lib/`, unreachable defensive code, missing tests, and documentation describing a UI that no longer exists. Reviewing the remaining tabs with the same criteria surfaced the same classes elsewhere.

## Findings

### Duplication

1. `getCategoryName(categories, categoryId)` is declared verbatim — same body, same `'-'` fallback — in `MonthlyValueEditor.tsx`, `CurrentMonthPaymentChecklist.tsx`, and `AccountEditor.tsx`. It belongs next to the other finance-state lookups (`getMonthlyValueAmount`, `isAccountItemPaid`) in `src/lib/financeCalculations.ts`.

### Dead code

2. `SummaryScreen.KpiCard` still accepts `detail` and `subvalue` props, with matching `kpiDetail` / `kpiSubvalue` styles. Spec 038 replaced the only card that used them (`Próximo venc.`); no caller passes either prop today.
3. `AccountEditor` declares an optional `onClose` prop and renders a `Voltar` button when it is set. Its only caller, `AccountsScreen`, never passes it — the button can never appear.
4. `MonthlyBarChart` has a `mode` prop defaulting to `'expense'`, which renders a `LineChart` fed by `toGiftedExpenseLineData`. The component's only caller (`ChartsScreen`) passes `mode="balance"`, so the default branch, the `LineChart` import, the `maxValue` / `chartMaxValue` computations, and the `toGiftedExpenseLineData` adapter plus its `GiftedLinePoint` type are all unreachable.

### Copy that contradicts the UI

5. `CurrentMonthPaymentChecklist` tells the user "Crie uma categoria em Contas primeiro." when no category exists. There is no `Contas` tab — the bottom navigation labels it `Cadastros`, and `Contas` is a section *inside* it, next to `Categorias`. The message sends the user to a tab name that does not exist.
6. `Ajustes` uses `Renda Extra` and `Janela Atual`, both English-style title case, which `docs/standards/ui-copy-policy.md` explicitly forbids for Portuguese UI copy.
7. The `Alerta` threshold field shows placeholder `80`, but the app's default warning threshold is `70` (`createDefaultFinanceSettings` in `src/types/finance.ts`). The `Perigo` (`90`) and `Meta` (`70`) placeholders match their defaults; only `Alerta` is wrong.

### Documentation drift

8. `docs/app-context.md`, `README.md`, and `docs/standards/ui-copy-policy.md` all name the fourth tab `Contas`. The app labels it `Cadastros` (`FinanceApp.tsx`).
9. `docs/app-context.md` and `README.md` say the visible month count goes "from 1 to 12". The `Ajustes` picker offers 3 to 12; only the storage-level clamp (`clampVisibleMonthCount`, used when normalizing loaded or restored data) still accepts 1.
10. `README.md` says reset recreates a "60% warning threshold, and 80% danger threshold". `buildResetFinanceState` uses `createDefaultFinanceSettings`, which sets 70% and 90%.

## Non-Goals

- Do not change any calculation, stored data, or backup shape.
- Do not change chart appearance, layout, or navigation.
- Do not widen the visible month count picker back to 1 — the picker range is the intended behavior; the documentation is what is wrong.
- Do not refactor the `AccountEditor` category bottom sheet into `SelectField`, and do not extract the five near-identical `Ajustes` picker modals. Both are recorded below as known, accepted debt.

## Behavior Changes

User-visible changes are limited to text:

- "Crie uma categoria em Contas primeiro." → "Crie uma categoria em Cadastros primeiro."
- `Renda Extra` → `Renda extra`; `Janela Atual` → `Janela atual`.
- The `Alerta` placeholder reads `70` instead of `80`.

The removed `mode="expense"` chart, the `Voltar` button in `Cadastros`, and the `KpiCard` extras were already unreachable, so nothing on screen changes.

## Implementation Notes

- `getCategoryName` goes into `src/lib/financeCalculations.ts` right after `getMonthlyValueAmount`, keeping the `(collection, id)` argument order used by its neighbors, and returns `'-'` when the category is missing, exactly as the three copies did.
- Removing `MonthlyBarChart`'s expense mode also removes `toGiftedExpenseLineData` and `GiftedLinePoint` from `src/lib/giftedChartAdapters.ts` and their cases from `giftedChartAdapters.test.ts`.
- With the `mode` prop gone, the `mode="balance"` attribute is removed from the `ChartsScreen` call site too.

## Tests

- `financeCalculations.test.ts`: `getCategoryName` returns the matching category name, and `'-'` when the id is unknown.
- `giftedChartAdapters.test.ts`: drop the `toGiftedExpenseLineData` cases along with the function.

## Acceptance Criteria

- `getCategoryName` is exported from `src/lib/financeCalculations.ts` and no component declares its own copy.
- `KpiCard` has no `detail` / `subvalue` props and no `kpiDetail` / `kpiSubvalue` styles.
- `AccountEditor` has no `onClose` prop and no `Voltar` button.
- `MonthlyBarChart` renders only the balance bar chart; `mode`, the `LineChart` import, `toGiftedExpenseLineData`, and `GiftedLinePoint` no longer exist.
- The three copy fixes are applied.
- `docs/app-context.md`, `README.md`, and `docs/standards/ui-copy-policy.md` name the tab `Cadastros`, the month-count range reads 3 to 12, and the documented reset thresholds match `createDefaultFinanceSettings` (70% / 90%).
- `npm run check` passes.

## Accepted Debt

Recorded so it is not rediscovered as new:

- `AccountEditor` hand-rolls a category bottom sheet (`Modal` + overlay + option rows) that duplicates `SelectField`, which two other screens already use. Replacing it changes the visual design of `Cadastros`, so it needs its own spec.
- `Ajustes` contains five near-identical option-picker modals (~35 lines each). `npm run dup` reports 0.31% duplication overall, well under the 5% limit in `docs/standards/code-duplication-policy.md`, so this stays as-is until a sixth picker appears.

## Validation

```bash
npm run check
```
