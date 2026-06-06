# Task 020-03 - Add App Lock Hook

## Spec

`docs/specs/020-app-lock.md`

## Plan

`docs/plans/020-app-lock-plan.md`

## Goal

Add `useAppLock` to manage app-lock state, initialization, background timeout behavior, and biometric unlock.

## Steps

1. Create `src/hooks/useAppLock.ts`.
2. Load app-lock settings on mount.
3. Start locked on cold start when app lock is enabled.
4. Keep app content protected while settings are initializing.
5. Listen to `AppState` for background/foreground transitions.
6. Lock after returning from background past the configured timeout.
7. Implement `unlock()` with `LocalAuthentication.authenticateAsync`.
8. Implement enable/disable and timeout update actions for `SettingsScreen`.
9. When enabling, verify biometric hardware/enrollment and require successful authentication before saving enabled state.
10. Add hook tests where practical with mocked storage, `AppState`, and local authentication.

## Acceptance Criteria

- Enabled app lock starts locked after settings load.
- Disabled app lock does not block normal app use.
- Returning from background after timeout locks the app.
- Returning from background before timeout does not lock the app.
- Successful authentication unlocks the app.
- Failed or cancelled authentication keeps the app locked.
- Enabling app lock persists only after biometric availability/enrollment and successful authentication.
- Tests pass where practical.

## Implementation Notes

- Added `src/hooks/useAppLock.ts`.
- Implemented cold-start lock behavior when enabled.
- Implemented background/foreground timeout lock behavior.
- Implemented Opção A activation: hardware check, enrolled biometrics check, and successful authentication before persisting enabled state.
- Kept foreground interaction tracking out of scope.
