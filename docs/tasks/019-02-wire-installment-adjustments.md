# Task 019-02 - Wire Installment Adjustments

## Status

Completed

## Scope

- Extend the monthly adjustment action to receive an optional installment count.
- For additions, apply the existing adjustment calculation to each returned installment month.
- Preserve existing subtraction behavior as single-month only.
- Keep direct monthly value edits unchanged.

## Validation

- `npm run typecheck`
- `npm test`
