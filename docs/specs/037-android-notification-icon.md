# Spec 037 - Android Notification Icon

## Goal

Configure Cycle12 Finance notifications to use a branded Android notification icon instead of relying on the platform fallback.

## Context

The app already supports optional local due-date reminders through `expo-notifications`. Android notification tray icons use a separate small icon from the launcher icon. This icon must be a monochrome white PNG with transparency; the full-color app icon is not appropriate for this use.

The project also includes a generated `android/` folder, so the Expo app config and the native Android resources must stay aligned.

## Scope

- Add a notification-specific icon asset under `assets/`.
- Configure the `expo-notifications` config plugin in `app.json`.
- Align generated Android resources and manifest metadata for the existing native project.
- Preserve the existing notification scheduling behavior and reminder copy.

## Non-goals

- Do not change reminder scheduling logic.
- Do not add push notifications, backend code, authentication, paid services, or new dependencies.
- Do not redesign the launcher icon or splash screen.
- Do not change notification text content.

## Acceptance Criteria

- `assets/notification-icon.png` exists and is suitable for Android notification small icons.
- `app.json` configures `expo-notifications` with the notification icon and tint color.
- Existing native Android resources include notification icon PNGs for density buckets.
- `AndroidManifest.xml` includes the metadata used by `expo-notifications` for local notification icon and color.
- Documentation mentions that Android notification icons use the branded monochrome notification asset.
- TypeScript validation passes.
- Unit tests pass.
