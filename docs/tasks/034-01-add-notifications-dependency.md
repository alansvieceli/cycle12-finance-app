# Task 034-01 - Add Notifications Dependency

Status: Done

## Spec

`docs/specs/034-due-date-reminders.md`

## Plan

`docs/plans/034-due-date-reminders-plan.md`

## Goal

Add the `expo-notifications` dependency and configure the notification handler at app startup so locally scheduled notifications are shown while the app is foregrounded/backgrounded as expected.

## Files

- Modify: `package.json` (and lockfile, via install)
- Modify: `App.tsx` (or `src/FinanceApp.tsx`, whichever runs once at startup)

## Steps

1. Install the dependency with the Expo-managed installer so the version matches the project's Expo SDK:

```bash
npx expo install expo-notifications
```

2. At app startup (top-level module scope of `App.tsx`), configure the notification handler:

```ts
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
```

Use whichever handler shape is current for the installed `expo-notifications` version (check the installed types if `shouldShowBanner`/`shouldShowList` are not recognized — older versions use `shouldShowAlert`).

3. Run `npx tsc --noEmit` and confirm no type errors.

## Acceptance Criteria

- `expo-notifications` is added as a dependency at a version compatible with the project's Expo SDK.
- The notification handler is configured once at startup.
- TypeScript compilation passes.
