# Plan 030 - Month History

Status: Pending

## Spec

`docs/specs/030-month-history.md`

## Objective

Save a snapshot of each month when the planning window advances and expose a Histórico view in the Resumo tab showing up to 12 past months with income vs expenses and a category/account breakdown.

## Tasks

| Task   | File                                                | Purpose                                                                        |
| ------ | --------------------------------------------------- | ------------------------------------------------------------------------------ |
| 030-01 | `docs/tasks/030-01-update-data-model.md`            | Add `MonthHistoryEntry` type, update `FinanceState`, and migration in storage. |
| 030-02 | `docs/tasks/030-02-add-history-capture.md`          | Capture history snapshot in `advanceWindowOneStep` and add unit tests.         |
| 030-03 | `docs/tasks/030-03-update-backup-validation.md`     | Validate and restore `monthHistory` in `financeBackup.ts`.                     |
| 030-04 | `docs/tasks/030-04-add-history-card-component.md`   | Add `HistoryCard` component with accordion and Categorias/Contas tabs.         |
| 030-05 | `docs/tasks/030-05-add-historico-pill-to-resumo.md` | Add third pill to `SummaryScreen` and render the history list.                 |
| 030-06 | `docs/tasks/030-06-update-docs-and-validate.md`     | Update `docs/app-context.md` and run full validation.                          |

## Notes

- `monthHistory` is capped at 12 entries. Oldest entry is dropped when limit is exceeded.
- Category and account names are snapshotted at advance time so renames do not corrupt historical display.
- History capture happens inside `advanceWindowOneStep` before dropping oldest month records.
- Backup validation treats invalid or missing `monthHistory` as `[]` — it is display-only data and should not block a restore.
- The eye icon (`valuesHidden`) applies to all monetary values in history cards.

## Validation

- `npx tsc --noEmit`
- `npm test`
