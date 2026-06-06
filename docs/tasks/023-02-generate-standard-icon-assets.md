# Task 023-02 - Generate Standard Icon Assets

## Spec

`docs/specs/023-app-icon-and-splash-alignment.md`

## Plan

`docs/plans/023-app-icon-and-splash-alignment-plan.md`

## Goal

Create standardized PNG assets for the app icon, Android adaptive foreground, and splash screen from the approved logo direction, promoting the selected source from `assets/novo/` into stable filenames under `assets/`.

## Steps

1. Use the approved source from `assets/novo/`.
2. Generate a square `assets/app-icon.png` suitable for Expo general icon usage.
3. Generate `assets/adaptive-icon-foreground.png` with transparent background and safe padding for Android adaptive masks.
4. Generate `assets/splash-logo.png` with centered logo and splash-safe sizing.
5. Use clear stable filenames under `assets/` instead of keeping final app references pointed at `assets/novo/`.
6. Visually inspect generated PNGs before configuration changes.

## Acceptance Criteria

- Generated assets are square where required.
- Android foreground asset has transparent background and sufficient padding.
- Generated assets do not contain the old calendar/coins illustration.
- Final app assets live directly under `assets/`.
- No final configuration should need to reference `assets/novo/`.

## Implementation Notes

- Generated `assets/app-icon.png`.
- Generated `assets/adaptive-icon-foreground.png`.
- Generated `assets/splash-logo.png`.
- Generated native Android launcher PNG resources for each density.
- Generated native Android splash logo PNG resources for each density.
