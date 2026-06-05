# Plan 005 - Test Coverage And Quality Metrics

## Spec Reference

`docs/specs/005-test-coverage-and-quality-metrics.md`

## Objective

Enable Vitest coverage reporting, establish an initial quality baseline, and document the metrics that matter for the project.

## Assumptions

- Use Vitest with the V8 coverage provider.
- Do not add UI component testing in this plan.
- Do not enforce global coverage thresholds until the baseline is known.
- Focus current coverage scope on pure TypeScript logic in `src/lib`.
- Storage and hooks can be added to coverage later after test strategy improves.

## Tasks

| #   | File                                             | Description                                                           |
| --- | ------------------------------------------------ | --------------------------------------------------------------------- |
| 1   | `docs/tasks/005-01-configure-vitest-coverage.md` | Install coverage tooling, add config, and add `npm run test:coverage` |
| 2   | `docs/tasks/005-02-record-coverage-baseline.md`  | Run coverage and record the initial baseline under `docs/quality/`    |
| 3   | `docs/tasks/005-03-update-docs-and-validate.md`  | Update README and run final validation commands                       |

## Sequential Order

Tasks must be executed in order.

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

## Out of Scope

- UI component testing
- End-to-end testing
- CI/CD
- Coverage threshold enforcement
