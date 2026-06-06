# Task 020-02 - Add App Lock Storage and Helpers

## Spec

`docs/specs/020-app-lock.md`

## Plan

`docs/plans/020-app-lock-plan.md`

## Goal

Add app-lock settings persistence and pure helper logic with focused tests.

## Steps

1. Add app-lock constants and timeout options.
2. Add storage helpers, preferably in `src/storage/appLockStorage.ts`.
3. Keep app-lock settings separate from finance backup/restore data.
4. Add pure helper logic for background elapsed-time lock decisions.
5. Add unit tests for defaults, timeout options, elapsed-time decisions, and storage helpers.

## Acceptance Criteria

- App-lock defaults are `enabled = false` and `timeoutMinutes = 3`.
- Timeout options are 1, 3, 5, 10, and 15 minutes.
- Storage helpers load defaults when no stored value exists.
- Storage helpers persist enabled state and timeout.
- Pure elapsed-time lock logic is unit tested.
- Tests pass.

## Implementation Notes

- Added `src/lib/appLock.ts`.
- Added `src/storage/appLockStorage.ts`.
- Kept app-lock settings separate from finance backup/restore state.
- Added helper and storage tests.
