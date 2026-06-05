# Plan 018 - Rolling Window and Category Propagation

Status: Completed

## Spec

`docs/specs/018-rolling-window-and-category-propagation.md`

## Objective

Replace the planning-month count with a 12-month rolling window starting at the current month, keep a display-only month count for summary/charts, and propagate category account values when the window advances.

## Tasks

| Task   | File                                                      | Purpose                                                            |
| ------ | --------------------------------------------------------- | ------------------------------------------------------------------ |
| 018-01 | `docs/tasks/018-01-update-finance-model-and-migration.md` | Add category propagation/window settings and migrate stored data.  |
| 018-02 | `docs/tasks/018-02-add-window-advance-helper.md`          | Add pure rolling-window helpers and unit tests.                    |
| 018-03 | `docs/tasks/018-03-wire-window-advance-state.md`          | Wire startup/manual window advance through `useFinanceState`.      |
| 018-04 | `docs/tasks/018-04-update-category-and-settings-ui.md`    | Update category propagation controls and settings window controls. |
| 018-05 | `docs/tasks/018-05-update-docs-and-validate.md`           | Update README and run validation.                                  |

## Notes

- Existing pending version changes to `1.1.0` are not part of this spec and should be preserved.
- The user also has `docs/specs/019-installment-value-entry.md` untracked; it is outside this task.
- `summaryVisibleMonthCount` keeps the old summary/chart display behavior without changing the 12-month planning window.
- Migration fills new window settings from the current calendar month.
- Existing categories default to `zero` propagation during migration to avoid silently copying historical values.

## Validation

- `npm run lint` - passed
- `npm run typecheck` - passed
- `npm test` - passed
- `npm run test:coverage` - passed
- `npm run check` - passed
- `npx expo config --type public` - passed
