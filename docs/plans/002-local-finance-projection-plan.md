# Plan 002 - Local 12-Month Finance Projection

## Spec Reference

`docs/specs/002-local-finance-projection.md`

## Objective

Build the first functional finance projection experience: local data storage, editable categories/accounts/monthly values, and calculated 12-month financial summaries.

## Assumptions

- The app remains a single-device, offline-only app.
- No backend, authentication, paid service, backup, restore, import, or export is introduced in this plan.
- The projection starts at the current month and includes the next 11 months.
- Credit card bills are represented as editable monthly totals, not individual purchases.
- The `*` column from the spreadsheet is ignored.
- A simple local storage dependency may be added for persistence.
- Business calculations should live in plain TypeScript helpers so they can be unit tested.
- The UI should be practical and mobile-first, not a spreadsheet clone.

## Proposed Tasks

| #   | File                                                 | Description                                                                    |
| --- | ---------------------------------------------------- | ------------------------------------------------------------------------------ |
| 1   | `docs/tasks/002-01-add-local-storage-foundation.md`  | Add the local persistence dependency and define storage/data model foundations |
| 2   | `docs/tasks/002-02-add-finance-calculations.md`      | Add calculation helpers and focused unit tests for projection totals           |
| 3   | `docs/tasks/002-03-build-projection-overview.md`     | Build the main 12-month projection overview screen                             |
| 4   | `docs/tasks/002-04-build-settings-editor.md`         | Add editing for monthly salary and current month extra balance                 |
| 5   | `docs/tasks/002-05-build-category-account-editor.md` | Add create/edit/delete flows for categories and account items                  |
| 6   | `docs/tasks/002-06-build-monthly-value-editor.md`    | Add editing for account item values per month                                  |
| 7   | `docs/tasks/002-07-persist-and-load-finance-data.md` | Wire app state to local persistence and reload saved data on startup           |
| 8   | `docs/tasks/002-08-update-docs-and-validate.md`      | Update README and run available validation commands                            |

## Sequential Order

Tasks must be executed in order.

The calculation and persistence foundation should be completed before building editing flows, so UI work can use stable types and helper functions.

## Implementation Notes

- Prefer simple TypeScript types over complex abstractions.
- Keep storage access behind a small local adapter.
- Keep calculation functions pure.
- Use React Native components already available in the Expo project unless a dependency is clearly required.
- If tests are added, add only the minimum test tooling needed for TypeScript business logic.
- Avoid implementing future features while building this MVP.

## Validation

At the end of the plan, run:

```bash
npx tsc --noEmit
```

If test tooling is added, run the project test command.

If Expo validation is needed, run:

```bash
npx expo start
```

Expected result: the app opens on Android and allows local finance projection data to be viewed and edited.

## Documentation

Update the README when implementation changes:

- dependencies
- install instructions
- development commands
- app behavior
- local storage behavior

## Out of Scope

- Backup and restore
- Spreadsheet import/export
- Paid/unpaid tracking
- Individual credit card purchases
- Installment splitting
- Charts and advanced analytics
- Backend
- Authentication
