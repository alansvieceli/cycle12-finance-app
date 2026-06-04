# Task 006-02 - Expose Visible Month Setting

## Plan Reference

`docs/plans/006-summary-visibility-and-payment-status-plan.md`

## Spec Reference

`docs/specs/006-summary-visibility-and-payment-status.md`

## Objective

Let the user configure how many months appear in the `Resumo` tab.

## Steps

1. Add a settings action for updating `visibleMonthCount`.
2. Add a control in `Ajustes` for values from 1 to 12.
3. Allow clearing the field while editing so the user can replace values such as `12` with `7`.
4. Keep the summary limited by `visibleMonthCount`.
5. Validate TypeScript and tests.

## Acceptance Criteria

- User can configure visible months from 1 to 12.
- User can erase and replace the visible month count without the field forcing `1` immediately.
- `Resumo` shows only the configured number of months.
- Stored values beyond the visible count remain available.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```
