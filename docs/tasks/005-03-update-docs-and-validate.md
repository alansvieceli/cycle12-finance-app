# Task 005-03 - Update Docs And Validate

## Plan Reference

`docs/plans/005-test-coverage-and-quality-metrics-plan.md`

## Spec Reference

`docs/specs/005-test-coverage-and-quality-metrics.md`

## Prerequisite

Tasks `005-01` and `005-02` must be complete.

## Objective

Update README and run final validation for coverage reporting.

## Steps

1. Update README with the coverage command.
2. Explain what coverage currently measures.
3. Link or reference the baseline document.
4. Run TypeScript validation.
5. Run tests.
6. Run coverage.

## Acceptance Criteria

- README documents `npm run test:coverage`.
- README references the coverage baseline.
- TypeScript validation passes.
- Tests pass.
- Coverage command passes.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```

Run:

```bash
npm run test:coverage
```
