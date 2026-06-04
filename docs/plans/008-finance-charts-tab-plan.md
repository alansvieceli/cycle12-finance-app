# Plan 008 - Finance Charts Tab

## Spec Reference

`docs/specs/008-finance-charts-tab.md`

## Objective

Add a read-only charts tab with simple React Native bar charts for monthly trends and current-month category totals.

## Assumptions

- Use simple `View`-based bars instead of adding a chart dependency.
- Use the same visible projection months as `Resumo`.
- Keep charts read-only.
- Use existing finance calculations and formatting helpers.

## Tasks

| # | File | Description |
|---|------|-------------|
| 1 | `docs/tasks/008-01-add-plan-and-tasks.md` | Create plan and task breakdown |
| 2 | `docs/tasks/008-02-add-chart-data-helpers.md` | Add pure chart data helpers and tests |
| 3 | `docs/tasks/008-03-add-chart-components.md` | Add reusable chart UI components |
| 4 | `docs/tasks/008-04-add-charts-screen-and-tab.md` | Add `Gráficos` screen and tab after `Resumo` |
| 5 | `docs/tasks/008-05-update-docs-and-validate.md` | Update README and run final validation |

## Sequential Order

Tasks must be executed in order.

## Validation

After implementation tasks:

```bash
npx tsc --noEmit
```

When tests are affected or available:

```bash
npm test
```

At the end:

```bash
npm run test:coverage
```

## Out of Scope

- Backend
- Authentication
- Chart libraries
- Animated charts
- Export/share
