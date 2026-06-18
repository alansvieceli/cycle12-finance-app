# Plan 037 - Android Notification Icon

## Objective

Add a branded Android notification small icon for the existing local due-date reminders without changing runtime reminder behavior.

## Implementation Plan

1. Generate `assets/notification-icon.png` from the current Cycle12 launcher logo as a white transparent Android notification asset.
2. Add the `expo-notifications` plugin entry to `app.json`, using the notification icon and the app accent color.
3. Mirror the Expo plugin output in the committed Android project:
   - density-specific `notification_icon.png` resources under `android/app/src/main/res/drawable-*`.
   - `notification_icon_color` in Android colors.
   - notification icon/color metadata in `AndroidManifest.xml`.
4. Update `docs/app-context.md` and `README.md` with the implemented branding behavior.
5. Validate with TypeScript and unit tests.

## Assumptions

- The notification small icon should use the existing Cycle12 `12` mark rather than a new visual direction.
- Android notification icon tint should use the existing orange brand accent.
- This is a native configuration and asset change only; no new business-logic tests are required.

## Tasks

- `037-01-add-notification-icon-assets.md`
- `037-02-configure-notification-icon.md`
- `037-03-update-docs-and-validate.md`
