# Task 001-04 - Validate

## Plan Reference

`docs/plans/001-bootstrap-expo-project-plan.md`

## Prerequisite

Tasks `001-01`, `001-02`, and `001-03` must be complete.

## Objective

Confirm the project passes TypeScript validation and starts correctly with Expo.

## Steps

1. Run the TypeScript check:

   ```bash
   npx tsc --noEmit
   ```

   Expected: no errors.

2. Start the Expo development server:

   ```bash
   npx expo start
   ```

   Expected: server starts and QR code or Android option is shown in the terminal.

3. Open on Android emulator: press `a` in the Expo CLI terminal.

   Expected: app opens and displays `Cycle12 Finance` on screen.

## Acceptance Criteria

- `npx tsc --noEmit` exits with no errors.
- `npx expo start` launches without crashing.
- Android emulator shows the `Cycle12 Finance` screen.

## Notes

- If the TypeScript check command is not available yet (e.g., `tsc` not found), document this as a pending item rather than skipping.
- Do not mark this task complete until the app is confirmed visible on the emulator.
