# Task 006-05 - Update Docs And Validate

## Plan Reference

`docs/plans/006-summary-visibility-and-payment-status-plan.md`

## Spec Reference

`docs/specs/006-summary-visibility-and-payment-status.md`

## Objective

Update documentation and run final validation for Spec 006.

## Steps

1. Update README with the new visible month and payment tracking behavior.
2. Run TypeScript validation.
3. Run unit tests.
4. Run coverage.

## Acceptance Criteria

- README describes the implemented behavior.
- TypeScript validation passes.
- Unit tests pass.
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
