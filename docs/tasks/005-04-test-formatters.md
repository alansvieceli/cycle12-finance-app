# Task 005-04 - Test Formatters

## Plan Reference

`docs/plans/005-test-coverage-and-quality-metrics-plan.md`

## Spec Reference

`docs/specs/005-test-coverage-and-quality-metrics.md`

## Prerequisite

Tasks `005-01`, `005-02`, and `005-03` must be complete.

## Objective

Add unit tests for formatting helpers so `src/lib/formatters.ts` is covered by the coverage report.

## Steps

1. Add a focused unit test file for `src/lib/formatters.ts`.
2. Cover currency, percentage, editable amount, and month label formatting.
3. Run tests.
4. Run coverage.
5. Update coverage documentation with the new current metrics.

## Acceptance Criteria

- Formatter tests exist.
- `formatters.ts` no longer shows 0% coverage.
- Unit tests pass.
- Coverage command passes.
- Coverage documentation reflects the updated current result.

## Validation

Run:

```bash
npm test
```

Run:

```bash
npm run test:coverage
```
