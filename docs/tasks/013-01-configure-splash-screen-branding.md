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
3. Add explicit splash configuration using `assets/splash-finance.png`, `contain`, and `#121212`.
4. Keep `slug`, Android package, and existing icon assets unchanged.
5. Update README to mention the custom splash branding.
6. Run TypeScript and unit test validation.
7. Attempt Expo config/start validation when applicable.

## Acceptance Criteria

- `app.json` uses `Cycle12 Finance` as the display name.
- `app.json` references `./assets/splash-finance.png` in `expo.splash.image`.
- Splash background is `#121212`.
- Existing icon assets are not overwritten.
- README reflects the custom branded splash screen.
- TypeScript validation passes.
- Existing tests pass.
