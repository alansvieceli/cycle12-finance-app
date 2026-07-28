# Negative Balance Total Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the current-month payment chart and show the sum of only negative monthly balances in the balance chart summary.

**Architecture:** Keep `buildSurplusShortfallChartData` as the source of monthly balances. Add one pure reducer beside the chart data helpers, use it in `MonthlyBarChart`, and delete the now-unused payment-summary calculations from `ChartsScreen`.

**Tech Stack:** React Native, Expo, TypeScript, Jest, react-native-gifted-charts.

## Global Constraints

- No new dependencies.
- No stored finance data changes.
- Keep the existing monthly balance chart and value list.
- Hidden values continue to use the existing privacy mask.
- Visible UI copy follows Brazilian Portuguese sentence case.

---

### Task 1: Negative Balance Summary

**Files:**
- Modify: `src/lib/chartData.ts`
- Test: `src/lib/chartData.test.ts`
- Modify: `src/components/finance/MonthlyBarChart.tsx`
- Modify: `src/screens/ChartsScreen.tsx`
- Delete: `src/components/finance/PaymentSummaryPanel.tsx`
- Modify: `README.md`
- Modify: `docs/app-context.md`
- Modify: `docs/tasks/046-01-update-negative-balance-summary.md`

**Interfaces:**
- Consumes: `MonthlyChartPoint[]` from `buildSurplusShortfallChartData`.
- Produces: `calculateNegativeBalanceTotal(points: MonthlyChartPoint[]): number`.

- [x] **Step 1: Write the failing unit test**

```ts
it('adds only negative monthly balances', () => {
  expect(
    calculateNegativeBalanceTotal([
      { key: '2026-08', label: 'Ago', value: -10 },
      { key: '2026-09', label: 'Set', value: -45 },
      { key: '2026-10', label: 'Out', value: 40 },
      { key: '2026-11', label: 'Nov', value: 60 },
      { key: '2026-12', label: 'Dez', value: 0 },
    ]),
  ).toBe(-55);
});
```

- [x] **Step 2: Verify the test fails for the missing export**

Run: `npm test -- --runTestsByPath src/lib/chartData.test.ts`

Expected: FAIL because `calculateNegativeBalanceTotal` is not exported.

- [x] **Step 3: Add the minimum reducer**

```ts
export function calculateNegativeBalanceTotal(points: MonthlyChartPoint[]) {
  return points.reduce(
    (total, point) => total + Math.min(point.value, 0),
    0,
  );
}
```

- [x] **Step 4: Use the reducer in the balance chart**

Import `calculateNegativeBalanceTotal` in `MonthlyBarChart.tsx`, replace the all-values total reducer with it, and keep `maskCurrency(total, valuesHidden)` unchanged.

- [x] **Step 5: Remove the payment panel**

Delete `PaymentSummaryPanel`, its component file, and its payment-only imports, derived values, and JSX from `ChartsScreen.tsx`. Change the balance summary label to `Total negativo no período`.

- [x] **Step 6: Update user-facing documentation**

Update README and app context so `Gráficos` documents commitment, category distribution, monthly balances, and the negative-only period total without paid/pending information.

- [x] **Step 7: Verify the focused test passes**

Run: `npm test -- --runTestsByPath src/lib/chartData.test.ts`

Expected: PASS.

- [x] **Step 8: Run project validation**

Run: `npm run check`

Run: `npm run dup`

Expected: both commands exit successfully.

- [x] **Step 9: Complete the task record and commit**

Mark every acceptance criterion in `docs/tasks/046-01-update-negative-balance-summary.md` complete.

```bash
git add src/lib/chartData.ts src/lib/chartData.test.ts src/components/finance/MonthlyBarChart.tsx src/screens/ChartsScreen.tsx README.md docs/app-context.md docs/plans/046-negative-balance-total-plan.md docs/tasks/046-01-update-negative-balance-summary.md
git commit -m "feat: total negative monthly balances"
```

### Task 2: Restore Period Total

**Files:**
- Modify: `src/lib/chartData.ts`
- Test: `src/lib/chartData.test.ts`
- Modify: `src/components/finance/ChartPanel.tsx`
- Modify: `src/components/finance/MonthlyBarChart.tsx`
- Modify: `README.md`
- Modify: `docs/app-context.md`
- Create: `docs/tasks/046-02-add-period-total.md`

**Interfaces:**
- Consumes: the same `MonthlyChartPoint[]` used by the balance chart.
- Produces: `calculateBalanceTotal(points: MonthlyChartPoint[]): number`.
- Extends: `ChartPanel` with an optional second total label, text, and amount style.

- [x] **Step 1: Write the failing period-total test**

```ts
it('adds every monthly balance for the period total', () => {
  expect(
    calculateBalanceTotal([
      { key: '2026-08', label: 'Ago', value: -10 },
      { key: '2026-09', label: 'Set', value: -45 },
      { key: '2026-10', label: 'Out', value: 40 },
      { key: '2026-11', label: 'Nov', value: 60 },
    ]),
  ).toBe(45);
});
```

- [x] **Step 2: Verify the test fails for the missing export**

Run: `npm test -- src/lib/chartData.test.ts`

Expected: FAIL because `calculateBalanceTotal` is not exported.

- [x] **Step 3: Add the period-total reducer**

```ts
export function calculateBalanceTotal(points: MonthlyChartPoint[]) {
  return points.reduce((total, point) => total + point.value, 0);
}
```

- [x] **Step 4: Render both totals**

Use `calculateBalanceTotal` for `Total do período`. Pass the existing
negative-only total to the optional second summary in `ChartPanel` with the
label `Total negativo no período`.

- [x] **Step 5: Update documentation**

Document both period totals in README and app context.

- [x] **Step 6: Validate and commit**

Run: `npm test -- src/lib/chartData.test.ts`

Run: `npm run check`

Run: `npm run dup`

Expected: every command exits successfully.

```bash
git add src/lib/chartData.ts src/lib/chartData.test.ts src/components/finance/ChartPanel.tsx src/components/finance/MonthlyBarChart.tsx README.md docs/app-context.md docs/specs/046-negative-balance-total.md docs/plans/046-negative-balance-total-plan.md docs/tasks/046-02-add-period-total.md
git commit -m "fix: restore period balance total"
```
