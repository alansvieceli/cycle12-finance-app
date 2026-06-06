# Plan 020 - App Lock

## Objective

Add an optional local biometric app lock that covers the full app on cold start and after returning from background past a configurable timeout.

## Updated Scope

The implementation should follow the revised spec 020:

- Keep the UI in the existing `SettingsScreen`, shown from the `Ajustes` tab.
- Use a simple background/foreground timeout model.
- Do not track every foreground user interaction in this first implementation.
- Keep the feature disabled by default.
- Require successful biometric authentication before enabling the feature.
- Prevent a brief flash of finance data while app-lock settings are loading.
- Install official Expo dependencies with `npx expo install`.

## Implementation Plan

1. Install Expo dependencies:
   - `expo-local-authentication`
   - `expo-blur`
2. Add app-lock constants, pure helpers, storage helpers, and tests.
3. Add `useAppLock` with initialization, cold-start lock behavior, background/foreground timeout behavior, enable/disable handling, and biometric unlock.
4. Add `AppLockOverlay` to cover the app with blur, logo, and `Desbloquear` action.
5. Wire app lock at the `FinanceApp` root and expose security controls in `SettingsScreen`.
6. Update README and `docs/app-context.md`.
7. Validate TypeScript, lint, tests, and Android run/start when practical.

## Storage Direction

Prefer `src/storage/appLockStorage.ts` unless implementation reveals a strong reason to keep helpers inside `financeStorage.ts`.

Rationale:

- app lock is an app security setting, not finance data.
- separate storage keeps backup/restore finance data unaffected.
- tests can remain focused and small.

## Task Breakdown

- `020-01-install-app-lock-dependencies.md`
- `020-02-add-app-lock-storage-and-helpers.md`
- `020-03-add-app-lock-hook.md`
- `020-04-add-app-lock-overlay.md`
- `020-05-add-security-settings-ui.md`
- `020-06-update-docs-and-validate.md`

## Assumptions

- OS biometric fallback behavior is owned by `expo-local-authentication`.
- The app lock does not protect exported backup files outside the app.
- The app lock settings are local-only and not part of `.c12f` backup/restore.
- If biometric support is unavailable or no biometric is enrolled, the feature remains disabled.
- The app may show the same lock overlay during app-lock initialization to avoid data flash.

## Validation

Run:

- `npm run lint`
- `npm run typecheck`
- `npm test`

When practical, validate on Android emulator:

- install/open app
- enable app lock from `Ajustes`
- confirm authentication is required before enabling
- close/reopen app
- background/foreground past timeout
- confirm app remains usable after successful unlock
