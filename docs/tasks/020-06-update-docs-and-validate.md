# Task 020-06 - Update Docs and Validate App Lock

## Spec

`docs/specs/020-app-lock.md`

## Plan

`docs/plans/020-app-lock-plan.md`

## Goal

Update documentation and validate the completed app-lock implementation.

## Steps

1. Update `README.md` with the security feature and any dependency/setup notes.
2. Update `docs/app-context.md` with implemented app-lock behavior.
3. Run lint.
4. Run TypeScript validation.
5. Run unit tests.
6. Validate manually on Android emulator when practical.
7. Record validation notes in this task.

## Acceptance Criteria

- README reflects app-lock behavior.
- `docs/app-context.md` reflects app-lock behavior.
- `npm run lint` passes.
- `npm run typecheck` passes.
- `npm test` passes.
- Android manual validation is attempted or a limitation is documented.

## Implementation Notes

- Updated `README.md` with optional biometric app lock behavior and dependencies.
- Updated `docs/app-context.md` with app-lock behavior.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test` passed with 15 test suites and 83 tests.
- `npm run format:check` passed.
- Android manual validation was not run in this task because `npx expo run:android` is slow in the current environment; validate manually on the emulator/device before release.
