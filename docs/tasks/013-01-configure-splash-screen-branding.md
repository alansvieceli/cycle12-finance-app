# Task 013-01 - Configure Splash Screen Branding

## Spec

`docs/specs/013-splash-screen-branding.md`

## Plan

`docs/plans/013-splash-screen-branding-plan.md`

## Goal

Configure Expo to use the custom finance splash image and the `Cycle12 Finance` display name.

## Steps

1. Confirm `assets/splash-finance.png` exists.
2. Update `app.json` to set the Expo display name to `Cycle12 Finance`.
3. Install and configure `expo-splash-screen` when needed for SDK-compatible native splash generation.
4. Add explicit splash configuration using `assets/splash-finance.png`, `contain`, and `#121212`.
5. Update existing Android native splash resources to use the same splash image and dark background.
6. Keep `slug`, Android package, and existing icon assets unchanged.
7. Update README to mention the custom splash branding.
8. Run TypeScript and unit test validation.
9. Validate Android resource processing when native resources are changed.

## Acceptance Criteria

- `app.json` uses `Cycle12 Finance` as the display name.
- `app.json` references `./assets/splash-finance.png` in `expo.splash.image`.
- `app.json` configures the `expo-splash-screen` plugin.
- Splash background is `#121212`.
- Android native splash resources reference the custom image and dark background.
- Existing icon assets are not overwritten.
- README reflects the custom branded splash screen.
- TypeScript validation passes.
- Existing tests pass.
