# Task 033-03 - Wire Salary Distribution Panel into Summary

Status: Pending

## Spec

`docs/specs/033-salary-distribution-panel.md`

## Plan

`docs/plans/033-salary-distribution-panel-plan.md`

## Goal

Compute the `SalaryDistribution` for the current projection month in `SummaryScreen` and render `SalaryDistributionPanel` in the current-month view, between the balance panel and the KPI grid.

## Files

- Modify: `src/screens/SummaryScreen.tsx`

## Steps

1. Add the new imports near the other `lib`/component imports in `src/screens/SummaryScreen.tsx`:

```ts
import { SalaryDistributionPanel } from '../components/finance/SalaryDistributionPanel';
import { buildSalaryDistribution } from '../lib/salaryDistribution';
```

2. Compute the distribution alongside the other `currentProjectionMonth`-derived values (near `currentMonthlyTotalExpenses`):

```ts
const salaryDistribution = currentProjectionMonth
  ? buildSalaryDistribution(financeState, currentProjectionMonth)
  : null;
```

3. In the `activeView === 'current'` block, render the panel right after the closing `</View>` of `styles.balancePanel` and before `<View style={styles.kpiGrid}>`:

```tsx
              </View>

              {salaryDistribution ? (
                <SalaryDistributionPanel
                  distribution={salaryDistribution}
                  valuesHidden={valuesHidden}
                />
              ) : null}

              <View style={styles.kpiGrid}>
```

4. Run `npx tsc --noEmit` and confirm no type errors.

5. Run `npm test` and confirm no regressions (the pre-existing `expo-asset` failure in `ActionButton.test.tsx` is expected and unrelated).

## Acceptance Criteria

- `SalaryDistributionPanel` is rendered in `Resumo`'s current-month view, below the balance panel and above the KPI grid.
- The panel receives `distribution` from `buildSalaryDistribution(financeState, currentProjectionMonth)` and `valuesHidden` from the existing screen state.
- No changes to the "Projeção" or "Histórico" views, `Gráficos`, or any other screen.
- TypeScript compilation passes.
- `npm test` shows no new failures beyond the pre-existing `expo-asset` issue.
