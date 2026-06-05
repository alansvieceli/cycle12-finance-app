# Task 018-03 - Wire Window Advance State

Status: Completed

## Spec

`docs/specs/018-rolling-window-and-category-propagation.md`

## Plan

`docs/plans/018-rolling-window-and-category-propagation-plan.md`

## Goal

Wire rolling-window behavior into the finance state hook and projection month creation.

## Steps

1. Use state window settings to build the 12 projection months.
2. Auto-advance the window after stored state loads when the calendar month is ahead.
3. Add a manual `advanceWindowMonth` action.
4. Keep direct monthly value edits and payment toggles working.

## Acceptance Criteria

- App projection months always use the current 12-month window.
- Startup can advance stale windows.
- Manual advance is exposed as a state action.
