# Task 008-05 - Update Docs And Validate

## Plan Reference

`docs/plans/008-finance-charts-tab-plan.md`

## Spec Reference

`docs/specs/008-finance-charts-tab.md`

## Objective

Update documentation and run final validation for Spec 008.

## Steps

1. Update README with the charts tab behavior.
2. Run TypeScript validation.
3. Run tests.
4. Run coverage.

## Acceptance Criteria

- README describes the charts tab.
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
