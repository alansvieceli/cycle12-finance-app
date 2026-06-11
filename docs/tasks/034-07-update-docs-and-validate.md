# Task 034-07 - Update Docs and Validate

Status: Done

## Spec

`docs/specs/034-due-date-reminders.md`

## Plan

`docs/plans/034-due-date-reminders-plan.md`

## Goal

Document the new due-date reminder feature and dependency, then run full validation.

## Files

- Modify: `docs/app-context.md`
- Modify: `README.md`

## Steps

1. In `docs/app-context.md`, document:
   - The new `Lembretes` section in `Ajustes` (toggle, days-before selector, time picker), off by default.
   - That enabling requests OS notification permission, with denial keeping the feature off and showing a hint.
   - That reminders are local-only (`expo-notifications`), bounded to a 14-day horizon, re-synced on app start/settings change/finance data change/window advance.
   - That reminder settings are device-only and excluded from `.c12f` backup, and that notification amounts always show real values regardless of the eye toggle.

2. In `README.md`, add `expo-notifications` to the list of dependencies/notable libraries (if such a list exists), with a one-line note on its purpose.

3. Run full validation:

```bash
npm run check
npm test
```

Fix any failures introduced by this spec's tasks.

## Acceptance Criteria

- `docs/app-context.md` reflects the new Lembretes feature and its behavior.
- `README.md` mentions `expo-notifications` and its purpose.
- `npm run check` passes.
- `npm test` passes (aside from the pre-existing unrelated `expo-asset` test failure noted in project memory, if still present).
