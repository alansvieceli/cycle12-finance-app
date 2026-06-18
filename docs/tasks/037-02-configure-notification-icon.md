# Task 037-02 - Configure Notification Icon

Status: Done

## Spec

`docs/specs/037-android-notification-icon.md`

## Plan

`docs/plans/037-android-notification-icon-plan.md`

## Goal

Configure Expo and Android native metadata to use the notification icon.

## Steps

1. Add `expo-notifications` to `app.json` plugins with `icon`, `color`, and `defaultChannel`.
2. Add Android color resource `notification_icon_color`.
3. Add Android manifest metadata for local and FCM notification icon/color defaults.
4. Preserve existing app name, Android package, launcher icon, splash screen, and reminder behavior.

## Acceptance Criteria

- Expo config includes `expo-notifications` plugin configuration.
- Android manifest metadata points to `@drawable/notification_icon` and `@color/notification_icon_color`.
- No reminder behavior or UI copy changes.

## Implementation Notes

- Added `expo-notifications` plugin configuration to `app.json`.
- Added `notification_icon_color` with the Cycle12 orange accent.
- Added Expo Notifications and FCM default notification icon/color metadata to `AndroidManifest.xml`.
