# Task 020-01 - Install App Lock Dependencies

## Spec

`docs/specs/020-app-lock.md`

## Plan

`docs/plans/020-app-lock-plan.md`

## Goal

Install the official Expo packages required for app lock biometrics and blur overlay.

## Steps

1. Install dependencies with:

   ```bash
   npx expo install expo-local-authentication expo-blur
   ```

2. Confirm `package.json` and lockfile are updated.
3. Do not add non-Expo biometric or blur dependencies.

## Acceptance Criteria

- `expo-local-authentication` is installed.
- `expo-blur` is installed.
- Dependency versions are compatible with the current Expo SDK.
- No unrelated dependency changes are made.

## Implementation Notes

- Installed dependencies with `npx expo install expo-local-authentication expo-blur`.
- Added the `expo-local-authentication` config plugin to `app.json` with a Face ID permission message.
