# Task 018-01 - Update Finance Model And Migration

Status: Completed

## Spec

`docs/specs/018-rolling-window-and-category-propagation.md`

## Plan

`docs/plans/018-rolling-window-and-category-propagation-plan.md`

## Goal

Add category propagation fields and replace `visibleMonthCount` with rolling-window settings.

## Steps

1. Update finance TypeScript types.
2. Add default window settings.
3. Normalize legacy categories with `propagation: 'zero'`.
4. Normalize legacy settings with current `windowStartYear` and `windowStartMonth`.
5. Update backup validation/reset defaults for the new shape.

## Acceptance Criteria

- Legacy states load without data loss.
- Categories always have a propagation rule after normalization.
- Settings no longer require `visibleMonthCount`.
