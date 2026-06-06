# Task 020-05 - Add Security Settings UI

## Spec

`docs/specs/020-app-lock.md`

## Plan

`docs/plans/020-app-lock-plan.md`

## Goal

Add the app-lock controls to the existing `SettingsScreen` inside the `Ajustes` tab.

## Steps

1. Add a `Segurança` card/section in `SettingsScreen`.
2. Add a switch or switch-like control labeled `Bloquear com biometria`.
3. Add a timeout picker labeled `Bloquear após`, visible only when app lock is enabled.
4. Use timeout labels `1 min`, `3 min`, `5 min`, `10 min`, and `15 min`.
5. Show a clear message if biometrics are unavailable or not enrolled.
6. Keep Portuguese UI copy aligned with `docs/standards/ui-copy-policy.md`.

## Acceptance Criteria

- `Ajustes` shows a `Segurança` section.
- The feature can be enabled only after successful biometric authentication.
- Disabling the feature turns off the overlay behavior.
- Timeout can be changed among the approved options.
- Timeout picker is hidden when app lock is disabled.
- UI copy uses concise Brazilian Portuguese.

## Implementation Notes

- Added `Segurança` controls to the existing `SettingsScreen`.
- Added `Bloquear com biometria` switch.
- Added `Bloquear após` timeout picker with 1, 3, 5, 10, and 15 minute options.
- Added messages for unavailable or unenrolled biometrics.
