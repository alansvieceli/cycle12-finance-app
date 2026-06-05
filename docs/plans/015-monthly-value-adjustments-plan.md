# Plan 015 - Monthly Value Adjustments

Status: Completed

## Spec

`docs/specs/015-monthly-value-adjustments.md`

## Objective

Allow users to add or subtract an adjustment from an existing monthly account value while keeping direct total editing and storing only the final monthly amount.

## Tasks

| Task   | File                                                       | Purpose                                                       |
| ------ | ---------------------------------------------------------- | ------------------------------------------------------------- |
| 015-01 | `docs/tasks/015-01-add-adjustment-helper.md`               | Add the pure monthly value adjustment helper and unit tests.  |
| 015-02 | `docs/tasks/015-02-add-finance-state-adjustment-action.md` | Add a finance state action that applies monthly adjustments.  |
| 015-03 | `docs/tasks/015-03-add-monthly-adjustment-ui.md`           | Add compact `+` and `-` adjustment controls to the editor UI. |
| 015-04 | `docs/tasks/015-04-update-docs-and-validate.md`            | Update README and run validation.                             |

## Notes

- No persistent data model change is required.
- Invalid or empty adjustment input is treated as zero.
- Subtraction clamps the resulting amount to zero.
- Direct monthly value editing remains available.

## Validation

- `npx tsc --noEmit` - passed
- `npm test` - passed
- `npm run test:coverage` - passed
- `npx expo config --type public` - passed
