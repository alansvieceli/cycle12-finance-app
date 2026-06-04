# Task 005-02 - Record Coverage Baseline

## Plan Reference

`docs/plans/005-test-coverage-and-quality-metrics-plan.md`

## Spec Reference

`docs/specs/005-test-coverage-and-quality-metrics.md`

## Prerequisite

Task `005-01` must be complete.

## Objective

Record the initial coverage baseline and quality interpretation for the project.

## Steps

1. Run `npm run test:coverage`.
2. Create `docs/quality/coverage-baseline.md`.
3. Record coverage percentages for statements, branches, functions, and lines.
4. Record number of test files and tests.
5. Document what is included and excluded from the baseline.
6. Document recommended next coverage improvements.

## Acceptance Criteria

- Baseline document exists under `docs/quality/`.
- Baseline includes coverage metrics.
- Baseline explains scope and exclusions.
- Baseline avoids pretending UI/hook coverage exists.
- Coverage command still passes.

## Validation

Run:

```bash
npm run test:coverage
```
