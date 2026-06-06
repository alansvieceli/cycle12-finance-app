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
- Allow the user to enable or disable the feature and configure the timeout in the existing `SettingsScreen` rendered inside the `Ajustes` tab.
- Default timeout: 3 minutes.
- Feature disabled by default on first install.

## Non-Goals

- No custom in-app PIN. Device biometrics and OS fallback are the only authentication methods.
- No per-screen locking. The lock always covers the entire app.
- No backend, cloud sync, or user account.
- No limit on authentication attempts — the user may retry indefinitely.
- No foreground interaction tracking for the first implementation. The app does not need to reset a timer on every tap, scroll, or text input.

## UX Behavior

### Lock screen

While locked, a `BlurView` (intensity 80) covers 100% of the screen at the highest z-index, hiding all content. The app logo is centered on top of the blur, with an "Unlock" (`Desbloquear`) button below it. Tapping the button triggers biometric authentication.

If authentication fails or the user cancels, the lock screen remains. No error state is shown beyond what the OS presents in its own dialog.

On success the blur disappears and the app is immediately usable.

### Inactivity timer

The first implementation uses a simple background/foreground timer:

- On cold start, if the feature is enabled, the app starts locked.
- When the app goes to background, the timestamp is recorded.
- When the app returns to foreground, elapsed time is compared to the configured timeout.
- If `elapsed >= timeoutMinutes * 60`, the app locks.
- If elapsed time is below the timeout, the app remains unlocked.

The app does not need to track every foreground interaction in this spec.

### Ajustes — Security section

A new "Segurança" section in the existing `SettingsScreen`, which is displayed from the `Ajustes` tab:

- Switch: "Bloquear com biometria" — enables or disables the feature.
- Timeout picker (visible only when enabled): "Bloquear após" — options: 1 min, 3 min, 5 min, 10 min, 15 min.

When the user enables the feature, the app checks device biometric availability and enrollment. If biometrics are unavailable or not enrolled, a message is shown and the switch reverts to off.

If biometrics are available and enrolled, the app should request authentication before saving `enabled = true`. If the authentication succeeds, the feature is enabled. If authentication fails or is cancelled, the feature remains disabled.

## Implementation Notes

### Dependencies

Install official Expo packages with:

```bash
npx expo install expo-local-authentication expo-blur
```

Do not install these packages with plain `npm install`.

### New hook: `src/hooks/useAppLock.ts`

- Loads `enabled` and `timeoutMinutes` from `AsyncStorage` on mount.
- Manages `locked: boolean` and an initialization/loading state so financial data is not briefly exposed while app-lock settings are loading.
- Listens to `AppState` changes to detect background/foreground transitions.
- On background: saves `backgroundAt` timestamp.
- On foreground: computes elapsed time; if `elapsed >= timeoutMinutes * 60`, sets `locked = true`.
- Exposes `unlock()`: calls `LocalAuthentication.authenticateAsync`; on success sets `locked = false`.
- Exposes `setEnabled(value: boolean)` and `setTimeoutMinutes(value: number)` for `SettingsScreen`.
- When enabling, checks biometric hardware/enrollment and authenticates before persisting the enabled state.

### New component: `src/components/common/AppLockOverlay.tsx`

- Receives `locked`, `enabled`, and `unlock` from `useAppLock`.
- Returns `null` when app lock is disabled and initialization is complete.
- When locked: renders `BlurView` with `position: absolute`, covering the full screen, with the app logo and an unlock button.
- While app-lock settings are initializing, keeps app content covered if needed to prevent a flash of financial data.

### `src/FinanceApp.tsx`

- Call `useAppLock` at the root.
- Render `<AppLockOverlay />` as the last child, after all navigation.

### `src/storage/financeStorage.ts`

- Evaluate whether app-lock storage should live in `src/storage/financeStorage.ts` or in a dedicated storage file such as `src/storage/appLockStorage.ts`.
- Prefer a dedicated storage file if it keeps app security settings separate from finance data while matching existing storage/test patterns.
- Add storage keys for app-lock enabled state and timeout minutes.

### Pure helper logic

Extract pure logic where useful so it can be unit tested without native modules:

- default app-lock settings.
- valid timeout options.
- elapsed-time comparison for background/foreground locking.

### New dependencies

| Package                     | Reason                    |
| --------------------------- | ------------------------- |
| `expo-local-authentication` | Biometric authentication  |
| `expo-blur`                 | Blur overlay while locked |

Both are official Expo packages, free, no external service.

## Tests

Unit tests for app-lock logic and storage:

- app-lock defaults use `enabled = false` and `timeoutMinutes = 3`.
- valid timeout options are 1, 3, 5, 10, and 15 minutes.
- foreground transition within timeout does not lock.
- foreground transition past timeout locks.
- storage helpers load defaults when no value exists.
- storage helpers persist enabled state and timeout.

Hook tests should be added where practical with mocks for `AppState`, storage, and `expo-local-authentication`:

- `locked` starts as `true` when `enabled = true` after settings load.
- `locked` stays `false` when `enabled = false`.
- `unlock()` sets `locked = false` when authentication succeeds.
- `unlock()` keeps `locked = true` when authentication fails.

## Acceptance Criteria

- The app shows the blur lock screen on cold start when the feature is enabled.
- The app locks after the configured inactivity timeout elapses in background.
- Nothing is visible or interactable below the blur while locked.
- Biometric authentication dismisses the lock.
- Cancelling or failing authentication keeps the lock screen active.
- `Ajustes` / `SettingsScreen` shows a "Segurança" section with enable toggle and timeout picker.
- Feature defaults to disabled on first install.
- If the device has no enrolled biometrics, enabling the feature shows a warning and reverts.
- Enabling the feature requires a successful biometric authentication before persisting the enabled state.
- App content is not briefly exposed while app-lock settings load.
- `README.md` is updated with the security feature.
- `docs/app-context.md` is updated with the implemented app-lock behavior.
- TypeScript validation passes.
- Unit tests pass.
