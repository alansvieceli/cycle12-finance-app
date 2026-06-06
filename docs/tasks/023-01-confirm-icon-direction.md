# Task 023-01 - Confirm Icon Direction

## Spec

`docs/specs/023-app-icon-and-splash-alignment.md`

## Plan

`docs/plans/023-app-icon-and-splash-alignment-plan.md`

## Goal

Confirm the final launcher and splash visual direction before editing assets or native resources.

## Steps

1. Review the available logo files under `assets/novo/`.
2. Confirm whether the launcher should use the recommended light direction or the alternate dark direction.
3. Confirm whether the splash should use the same `12` logo or retain a separate splash-only illustration.
4. Confirm that the selected `assets/novo` files should be renamed/promoted into `assets/`.
5. Confirm that `assets/novo/` should be removed after migration and validation.
6. Document the chosen direction in this task or the plan before implementation continues.

## Acceptance Criteria

- Launcher background direction is selected.
- Launcher foreground source asset is selected.
- Splash visual direction is selected.
- Asset promotion and cleanup decision is documented.
- No implementation files are changed in this task unless explicitly approved.

## Implementation Notes

- Selected the light launcher direction with background `#F5F7FA`.
- Selected the black/orange `12` logo from `assets/novo` as the source direction.
- Selected the same `12` logo for the splash screen.
- Confirmed the final assets should live directly under `assets/` and `assets/novo/` should be removed after promotion.
