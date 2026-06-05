# Task 012-01 - Rename Settings Tab Label

## Spec

`docs/specs/012-settings-tab-label.md`

## Plan

`docs/plans/012-settings-tab-label-plan.md`

## Goal

Change the user-facing settings tab label and screen title from `Ajustes` to `Configurações`.

## Steps

1. Update the `settings` tab label in `FinanceApp`.
2. Update the `SettingsScreen` section title.
3. Adjust `TabBar` sizing if needed for the longer label.
4. Update README references to the settings tab label if present.
5. Run TypeScript and unit test validation.

## Acceptance Criteria

- The tab bar shows `Configurações`.
- The settings screen title shows `Configurações`.
- The label fits inside the active tab button frame.
- Existing behavior is unchanged.
- TypeScript validation passes.
- Existing tests pass.
