# Plan 023 - Gráficos Tab Revision

## Objective

Revise the `Gráficos` tab to improve usefulness and visual hierarchy: replace the "Despesas por mês" line chart with a per-month commitment progress list, add a paid vs pending summary panel for the current month, reorder all panels so current-month data appears first, and standardize titles.

## Assumptions

- No spec required — this is an adjustment to existing behavior, not a new feature.
- No changes to finance calculations, navigation, or stored data.
- No new dependencies.
- The `Resumo` tab must remain untouched.
- Reuse existing calculation helpers (`calculatePaymentSummary`, `calculateIncomeCommitmentPercentage`).

## Tasks

| Task   | File                                               | Purpose                                                                                  |
| ------ | -------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 023-01 | `docs/tasks/023-01-add-commitment-chart-helper.md` | Add `CommitmentChartPoint` type and `buildMonthlyCommitmentChartData` helper with tests. |
| 023-02 | `docs/tasks/023-02-add-monthly-commitment-list.md` | Add `MonthlyCommitmentList` component with per-month progress rows.                      |
| 023-03 | `docs/tasks/023-03-add-payment-summary-panel.md`   | Add `PaymentSummaryPanel` component with paid/pending cards and progress bar.            |
| 023-04 | `docs/tasks/023-04-revise-charts-screen.md`        | Reorder panels, add new components, update title in `ChartsScreen`.                      |
| 023-05 | `docs/tasks/023-05-validate.md`                    | Run validation and confirm manual behavior on device.                                    |

## Sequential Order

Tasks must be executed in order.

## Validation

```bash
npx tsc --noEmit
```

```bash
npm test
```

```bash
npx expo start
```

## Out of Scope

- Backend
- Authentication
- Navigation changes
- New chart library
- Drill-downs or interactivity
- Changes to the `Resumo` tab
