# Spec 020 - App Lock

## Goal

Display a blur overlay over the entire app on launch and after a configurable inactivity timeout, requiring biometric authentication (fingerprint or face, whichever the device supports) to unlock.

## Context

The app currently has no access protection. Any person who picks up the device can open it and see the user's financial data. Adding a local app lock with biometric authentication prevents casual snooping without requiring a backend or user account.

## Goals

- Lock the app on cold start.
- Lock the app when it returns from background after the inactivity timeout has elapsed.
- Cover all app content with a `BlurView` while locked, so nothing is readable until authenticated.
- Use `expo-local-authentication` to trigger biometric authentication. The OS handles the specific method (fingerprint, Face ID) and its own fallback (device PIN/pattern).
- Allow the user to enable or disable the feature and configure the timeout in Settings.
- Default timeout: 3 minutes.
- Feature disabled by default on first install.

## Non-Goals

- No custom in-app PIN. Device biometrics and OS fallback are the only authentication methods.
- No per-screen locking. The lock always covers the entire app.
- No backend, cloud sync, or user account.
- No limit on authentication attempts — the user may retry indefinitely.

## UX Behavior

### Lock screen

While locked, a `BlurView` (intensity 80) covers 100% of the screen at the highest z-index, hiding all content. The app logo is centered on top of the blur, with an "Unlock" (`Desbloquear`) button below it. Tapping the button triggers biometric authentication.

If authentication fails or the user cancels, the lock screen remains. No error state is shown beyond what the OS presents in its own dialog.

On success the blur disappears and the app is immediately usable.

### Inactivity timer

The timer starts when the app enters the foreground. It resets on every user interaction. If the app goes to background, the elapsed time is recorded. When the app returns to foreground, the elapsed time is compared to the configured timeout; if exceeded, the app locks.

### Settings — Security section

A new "Segurança" section in `SettingsScreen`:

- Switch: "Bloquear com biometria" — enables or disables the feature.
- Timeout picker (visible only when enabled): "Bloquear após inatividade de" — options: 1, 3, 5, 10, 15 minutes.

When the user enables the feature for the first time, the app checks device biometric availability. If no biometrics are enrolled, a message is shown and the switch reverts to off.

## Implementation Notes

### New hook: `src/hooks/useAppLock.ts`

- Loads `enabled` and `timeoutMinutes` from `AsyncStorage` on mount.
- Manages `locked: boolean` state.
- Listens to `AppState` changes to detect background/foreground transitions.
- On background: saves `backgroundAt` timestamp.
- On foreground: computes elapsed time; if `elapsed >= timeoutMinutes * 60`, sets `locked = true`.
- Exposes `unlock()`: calls `LocalAuthentication.authenticateAsync`; on success sets `locked = false`.
- Exposes `setEnabled(value: boolean)` and `setTimeoutMinutes(value: number)` for Settings.

### New component: `src/components/common/AppLockOverlay.tsx`

- Receives `locked`, `enabled`, and `unlock` from `useAppLock`.
- Returns `null` when `!enabled || !locked`.
- When locked: renders `BlurView` with `position: absolute`, covering the full screen, with the app logo and an unlock button.

### `src/FinanceApp.tsx`

- Call `useAppLock` at the root.
- Render `<AppLockOverlay />` as the last child, after all navigation.

### `src/storage/financeStorage.ts`

- Add storage keys `APP_LOCK_ENABLED` and `APP_LOCK_TIMEOUT` with read/write helpers.

### New dependencies

| Package                     | Reason                    |
| --------------------------- | ------------------------- |
| `expo-local-authentication` | Biometric authentication  |
| `expo-blur`                 | Blur overlay while locked |

Both are official Expo packages, free, no external service.

## Tests

Unit tests for `useAppLock`:

- `locked` starts as `true` when `enabled = true` (cold start).
- `locked` stays `false` when `enabled = false`.
- Foreground transition within timeout does not lock.
- Foreground transition past timeout locks.
- `unlock()` sets `locked = false` when authentication succeeds.
- `unlock()` keeps `locked = true` when authentication fails.

## Acceptance Criteria

- The app shows the blur lock screen on cold start when the feature is enabled.
- The app locks after the configured inactivity timeout elapses in background.
- Nothing is visible or interactable below the blur while locked.
- Biometric authentication dismisses the lock.
- Cancelling or failing authentication keeps the lock screen active.
- Settings shows a "Segurança" section with enable toggle and timeout picker.
- Feature defaults to disabled on first install.
- If the device has no enrolled biometrics, enabling the feature shows a warning and reverts.
- TypeScript validation passes.
- Unit tests pass.
