# Task 023-03 - Update Expo Branding Config

## Spec

`docs/specs/023-app-icon-and-splash-alignment.md`

## Plan

`docs/plans/023-app-icon-and-splash-alignment-plan.md`

## Goal

Update Expo configuration to reference the approved launcher and splash assets.

## Steps

1. Update `app.json` `expo.icon` to the approved app icon asset.
2. Update `app.json` `android.adaptiveIcon.foregroundImage` to the approved adaptive foreground asset.
3. Update `app.json` `android.adaptiveIcon.backgroundColor` to the approved background color.
4. Update the `expo-splash-screen` plugin configuration to the approved splash image, background color, resize mode, and image width.
5. Confirm no `app.json` icon or splash reference points to `assets/novo/`.
6. Keep app name, slug, Android package, and runtime behavior unchanged.

## Acceptance Criteria

- `app.json` references current Cycle12 Finance logo assets.
- Adaptive icon foreground and background are configured separately.
- Splash plugin configuration matches the selected visual direction.
- No stale calendar/coins asset is referenced from `app.json`.
- No final icon or splash configuration references `assets/novo/`.

## Implementation Notes

- Updated `android.adaptiveIcon.foregroundImage` to `./assets/adaptive-icon-foreground.png`.
- Updated adaptive icon background to `#F5F7FA`.
- Updated splash plugin background to `#F5F7FA`.
- Updated splash plugin image width to `180`.
