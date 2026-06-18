# Task 037-01 - Add Notification Icon Assets

Status: Done

## Spec

`docs/specs/037-android-notification-icon.md`

## Plan

`docs/plans/037-android-notification-icon-plan.md`

## Goal

Create Android-compatible notification icon assets derived from the current Cycle12 branding.

## Steps

1. Generate `assets/notification-icon.png` as a 96x96 white PNG with transparency.
2. Generate density-specific native Android `notification_icon.png` files under `android/app/src/main/res/drawable-*`.
3. Keep launcher and splash assets unchanged.

## Acceptance Criteria

- The app-level notification icon exists under `assets/`.
- Native Android drawable density buckets include notification icon resources.
- The generated icon is monochrome white on transparent background.

## Implementation Notes

- Added `assets/notification-icon.png`.
- Added native `notification_icon.png` resources in `drawable-mdpi`, `drawable-hdpi`, `drawable-xhdpi`, `drawable-xxhdpi`, and `drawable-xxxhdpi`.
- Derived the asset from `assets/app-icon.png` by converting the logo mark to white and the light background to transparency.
