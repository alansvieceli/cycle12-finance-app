# Task 005-01 - Configure Vitest Coverage

## Plan Reference

`docs/plans/005-test-coverage-and-quality-metrics-plan.md`

## Spec Reference

`docs/specs/005-test-coverage-and-quality-metrics.md`

## Objective

Configure Vitest coverage reporting for the current unit test setup.

## Steps

1. Install `@vitest/coverage-v8`.
2. Add a Vitest config file if needed.
3. Add `npm run test:coverage`.
4. Configure coverage to include `src/lib/**/*.ts`.
5. Exclude test files, app root, config files, screens, hooks, storage, and visual components for the initial baseline.
6. Do not enforce global coverage thresholds yet.

## Acceptance Criteria

- Coverage dependency is installed.
- `npm run test:coverage` exists.
- Coverage config exists.
- Coverage command runs successfully.
- Initial coverage scope focuses on `src/lib`.
- Existing tests still pass.
- TypeScript validation passes.

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
