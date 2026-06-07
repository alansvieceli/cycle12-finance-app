# Plan 029 - Adjust Account Value from Payments Screen

Status: Completed

## Spec

`docs/specs/029-adjust-account-value-from-payments.md`

## Objective

Allow the user to add or subtract an amount from an existing account item's monthly value directly from the Pagamentos screen, reusing the adjustment infrastructure already implemented in spec 015.

## Tasks

| Task   | File                                                          | Purpose                                                                        |
| ------ | ------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 029-01 | `docs/tasks/029-01-add-adjustment-ui-to-payment-checklist.md` | Add `±` button and inline adjustment panel to `CurrentMonthPaymentChecklist`.  |
| 029-02 | `docs/tasks/029-02-wire-adjust-action-in-parent.md`           | Pass `onAdjustMonthlyValue` from the parent to `CurrentMonthPaymentChecklist`. |
| 029-03 | `docs/tasks/029-03-update-docs-and-validate.md`               | Update README and run validation.                                              |

## Notes

- `calculateAdjustedMonthlyValue` and `adjustMonthlyValue` already exist from spec 015. No new helpers or state actions are required.
- No data model, storage, or backup format changes.
- Only the current month is adjustable from this screen.

## Validation

- `npx tsc --noEmit`
- `npm test`
