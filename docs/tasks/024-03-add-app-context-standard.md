# Task 024-03 - Add App Context Standard

## Spec

`docs/specs/024-app-context-documentation.md`

## Plan

`docs/plans/024-app-context-documentation-plan.md`

## Goal

Create and wire a standard that keeps `docs/app-context.md` updated when app behavior changes.

## Steps

1. Add `docs/standards/app-context-policy.md`.
2. Define when `docs/app-context.md` must be updated.
3. Define when README should also be updated.
4. Update agent instruction files to reference the new standard.

## Acceptance Criteria

- The standard exists.
- The standard clearly lists update triggers.
- `AGENTS.md` references the standard.
- `CLAUDE.md` references the standard.

## Implementation Notes

- Added `docs/standards/app-context-policy.md`.
- Added the standard to `AGENTS.md`.
- Updated `CLAUDE.md` to include `docs/app-context.md` in the pre-implementation reading flow.
