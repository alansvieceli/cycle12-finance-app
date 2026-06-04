# Task 006-03 - Add Payment Status Model

## Plan Reference

`docs/plans/006-summary-visibility-and-payment-status-plan.md`

## Spec Reference

`docs/specs/006-summary-visibility-and-payment-status.md`

## Objective

Add local payment status state and business logic for payment totals.

## Steps

1. Add `MonthlyPaymentStatus` to finance types.
2. Add `paymentStatuses` to finance state defaults.
3. Normalize older stored data without payment statuses.
4. Add a toggle action for paid/unpaid status.
5. Remove related payment statuses when deleting accounts or categories.
6. Add unit tests for payment total calculations.

## Acceptance Criteria

- Payment status is stored per account item, month, and year.
- Older data without payment statuses still loads.
- Deleting accounts or categories removes related payment statuses.
- Payment totals can be calculated independently from planned totals.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```

