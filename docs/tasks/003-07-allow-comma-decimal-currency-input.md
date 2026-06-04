# Task 003-07 - Allow Comma Decimal Currency Input

## Plan Reference

`docs/plans/003-tabbed-finance-workflow-plan.md`

## Spec Reference

`docs/specs/003-tabbed-finance-workflow.md`

## Objective

Fix currency inputs so users can type decimal values with a comma, such as `5474,50`.
Currency values should also display two decimal places after normalization, such as `213,30`.

## Context

Currency fields are controlled by numeric state. While typing, values are parsed and formatted immediately, which removes a trailing comma before the user can enter cents.

## Steps

1. Add a reusable editable amount input that keeps draft text while focused.
2. Use it for settings currency fields.
3. Use it for monthly value fields.
4. Format normalized editable amounts with two decimal places.
5. Validate TypeScript and tests.

## Acceptance Criteria

- Currency fields accept comma decimal input.
- Currency fields display normalized values with two decimal places.
- Existing currency parsing behavior is preserved.
- Monthly value inputs and settings currency inputs share the same behavior.
- Existing tests pass.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```
