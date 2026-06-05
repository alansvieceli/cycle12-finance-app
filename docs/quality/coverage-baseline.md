# Coverage Baseline

This document records the first test coverage baseline for Cycle12 Finance.

## Baseline Date

2026-06-04

## Command

```bash
npm run test:coverage
```

## Result

- Test files: 2 passed
- Tests: 9 passed
- Statements: 78.57% (33/42)
- Branches: 71.42% (15/21)
- Functions: 89.47% (17/19)
- Lines: 78.04% (32/41)

## Current Result

Updated after migrating the primary test runner to Jest/Expo, adding a small React Native Testing Library render test, and covering the local storage adapter:

- Test suites: 11 passed
- Tests: 53 passed
- Statements: 88.42%
- Branches: 76.64%
- Functions: 100%
- Lines: 88.08%

## Included Scope

The current baseline primarily measures unit-test coverage for pure TypeScript logic under:

```text
src/lib/**/*.ts
```

It also includes a small component render test to validate the React Native Testing Library setup and focused storage adapter tests for AsyncStorage persistence behavior.

## Excluded Scope

The baseline does not currently measure coverage for:

- `App.tsx`
- Broad React Native screen and component coverage
- hooks
- Broad AsyncStorage persistence scenarios beyond the storage adapter
- Type-only modules
- test files

This is intentional for the first baseline. The app has UI and persistence behavior that should be covered with a dedicated testing strategy instead of being mixed into the initial pure-logic metric.

## File Summary

- `src/lib/financeCalculations.ts`: fully covered.
- `src/lib/formatters.ts`: fully covered.
- `src/lib/chartData.ts`: mostly covered, with one defensive branch remaining.
- `src/lib/ids.ts`: fully covered for executable lines.
- `src/lib/inputParsers.ts`: mostly covered, with uncovered branch behavior remaining.
- `src/lib/sorting.ts`: fully covered for executable lines.

## Recommended Next Improvements

- Add branch-focused tests for remaining parser cases.
- Define a separate strategy before adding hook, storage, or UI coverage.
- Keep coverage reports local under `coverage/`; they are generated artifacts and should not be committed.
