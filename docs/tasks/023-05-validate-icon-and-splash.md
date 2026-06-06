# Task 023-05 - Validate Icon and Splash

## Spec

`docs/specs/023-app-icon-and-splash-alignment.md`

## Plan

`docs/plans/023-app-icon-and-splash-alignment-plan.md`

## Goal

Validate the branding change through automated checks and Android emulator inspection.

## Steps

1. Run TypeScript validation.
2. Run unit tests.
3. Uninstall the existing app from the Android emulator.
4. Reinstall through `npx expo run:android`.
5. Inspect the launcher icon in the emulator app drawer.
6. Inspect the splash screen during app startup.
7. Update README if branding or validation guidance changed.

## Acceptance Criteria

- `npm run typecheck` passes.
- `npm test` passes.
- Android run validation is attempted.
- Launcher icon is not the stale calendar/coins illustration.
- Launcher icon follows the approved light or dark direction.
- Splash screen uses the approved visual direction and is centered.
- App opens normally after the splash.
- Any validation limitation is documented.

## Implementation Notes

- `npm run typecheck` passed.
- `npm test` passed with 13 test suites and 73 tests passing.
- Android emulator validation was completed manually after the app was already uninstalled.
- Additional `npx expo run:android` execution was intentionally stopped because the user had already validated the installed app and the command was taking too long.
