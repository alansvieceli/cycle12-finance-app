# Task 019-01 - Add Installment Months Helper

## Status

Completed

## Scope

- Create `src/lib/installmentMonths.ts`.
- Return consecutive target months starting from the selected month.
- Limit results to the current 12-month window.
- Add unit tests for single month, year boundary, outside-window skips, outside start, and oversized installment counts.

## Validation

- `npm test -- src/lib/installmentMonths.test.ts`
