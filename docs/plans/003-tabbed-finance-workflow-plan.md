# Plan 003 - Tabbed Finance Workflow

## Spec Reference

`docs/specs/003-tabbed-finance-workflow.md`

## Objective

Refactor the current single-screen finance app into a clearer four-tab workflow with configurable visible months.

## Assumptions

- Use simple local tab state instead of adding a navigation dependency.
- Keep the app local-only and offline.
- Keep storage compatible with existing saved data where possible.
- Store up to 12 months, but display only `visibleMonthCount` months in the summary.
- Move account editing and monthly value editing into `Planejamento`.
- Keep category editing in `Categorias`.
- Keep salary, current month extra balance, and visible month count in `Ajustes`.

## Tasks

| # | File | Description |
|---|------|-------------|
| 1 | `docs/tasks/003-01-add-visible-month-setting.md` | Add `visibleMonthCount` to settings, defaults, storage normalization, and calculation usage |
| 2 | `docs/tasks/003-02-add-tab-shell.md` | Add the four-tab app shell and move existing sections into tab-specific views |
| 3 | `docs/tasks/003-03-refine-summary-tab.md` | Make `Resumo` read-only and focused on calculated monthly/category totals |
| 4 | `docs/tasks/003-04-refine-planning-tab.md` | Improve account and monthly value editing in `Planejamento` |
| 5 | `docs/tasks/003-05-refine-categories-and-settings-tabs.md` | Improve `Categorias` and `Ajustes`, including visible month controls |
| 6 | `docs/tasks/003-06-update-docs-and-validate.md` | Update README and run final validation |

## Sequential Order

Tasks must be executed in order.

## Validation

After each implementation task:

```bash
npx tsc --noEmit
```

When tests are affected or available:

```bash
npm test
```

At the end:

```bash
npx expo start
```

## Out of Scope

- Backend
- Authentication
- Backup/restore
- Spreadsheet import/export
- Installment logic
- Paid/unpaid tracking
