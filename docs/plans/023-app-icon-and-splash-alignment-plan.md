# Plan 023 - App Icon and Splash Alignment

## Objective

Replace stale Android launcher and splash branding with the current Cycle12 Finance logo assets while keeping the app behavior unchanged.

## Audit Summary

- The current Expo config references `assets/app-icon.png` for both the general app icon and Android adaptive icon foreground.
- `assets/app-icon.png` matches the white `12` logo from `assets/novo`.
- Native Android launcher foreground resources still show the old calendar/coins illustration.
- Native Android splash resources still show the old calendar/coins illustration.
- The Android adaptive icon background is dark, which contributes to the black launcher result seen in the emulator.
- `npx expo run:android` can preserve stale native resources when the generated `android/` project is already present, so native resource alignment is required.

## Recommended Direction

Use a light Android adaptive icon:

- background: `#F5F7FA`
- foreground: padded `12` logo derived from `assets/novo/Icone do logo preto.svg`
- splash: same `12` logo centered on the same or compatible light background
- final files: renamed/promoted into stable filenames directly under `assets/`
- cleanup: remove `assets/novo/` after the promoted files are configured and validated

This direction best addresses the request for the icon to fit the phone's standard visual pattern and avoids the current black launcher result.

## Implementation Plan

1. Confirm the final visual direction before editing runtime files.
2. Generate standardized PNG assets from the selected `assets/novo` source:
   - `assets/app-icon.png`
   - `assets/adaptive-icon-foreground.png`
   - `assets/splash-logo.png`
3. Update `app.json` icon, adaptive icon, and splash plugin configuration.
4. Refresh or align native Android launcher resources so they no longer contain the old calendar/coins illustration.
5. Refresh or align native Android splash resources so the startup screen matches the selected direction.
6. Remove `assets/novo/` after confirming the promoted files under `assets/` are used.
7. Update README only if the branding or validation instructions change.
8. Validate TypeScript, unit tests, and Android installation.

## Task Breakdown

- `023-01-confirm-icon-direction.md`
- `023-02-generate-standard-icon-assets.md`
- `023-03-update-expo-branding-config.md`
- `023-04-align-android-native-resources.md`
- `023-05-validate-icon-and-splash.md`

## Assumptions

- The app should use the `12` logo as the launcher icon, not the old calendar/coins illustration.
- The selected `assets/novo` files may be renamed/promoted into `assets/`, and the temporary `assets/novo` folder should be deleted after migration.
- A light launcher background is preferred unless the user explicitly chooses the dark variant.
- This is a visual branding/configuration change and does not require new unit tests.
- Existing TypeScript and unit test validations should still run because native resource and config changes can affect the build.

## Validation

Run:

- `npm run typecheck`
- `npm test`
- `npx expo run:android`

Manual validation should use a fresh Android emulator install after uninstalling the existing app.
