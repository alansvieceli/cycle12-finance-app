# Task 006-04 - Add Current Month Payment Checklist

## Plan Reference

`docs/plans/006-summary-visibility-and-payment-status-plan.md`

## Spec Reference

`docs/specs/006-summary-visibility-and-payment-status.md`

## Objective

Add a current-month paid/unpaid checklist to `Resumo`.

## Steps

1. Add a summary component for current-month payment tracking.
2. Show account name, category, due day, planned amount, and paid state.
3. Add current-month total paid and pending values.
4. Wire the checklist to the payment status toggle action.
5. Validate TypeScript and tests.

## Acceptance Criteria

- Current month has a payment checklist in `Resumo`.
- User can mark items paid or unpaid manually.
- Paid state is visually scannable.
- Payment totals use the standard theme colors: paid in green and pending in red.
- Payment checklist can be filtered by all, pending, and paid items.
- Payment status does not change planned monthly totals.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```
