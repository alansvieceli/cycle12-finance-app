# Task 010-01 - Apply Dark Finance Theme

## Spec

`docs/specs/010-dark-finance-theme.md`

## Plan

`docs/plans/010-dark-finance-theme-plan.md`

## Goal

Apply the dark finance theme across the app using shared color tokens.

## Steps

1. Add a shared theme module with the Spec 010 color tokens.
2. Update common components to consume theme tokens.
3. Update app shell, screens, and finance components to use the dark theme.
4. Update commitment threshold colors to the Spec 010 warning and danger colors.
5. Update README to mention the dark theme and orange accent.
6. Run TypeScript and unit tests.

## Acceptance Criteria

- Main app background uses `#121212`.
- Cards and panels use `#1E1E1E`.
- Primary text uses `#FFFFFF`.
- Secondary labels and hints use a muted readable color.
- Active navigation and primary actions use `#F97316`.
- Inputs are readable on the dark theme.
- Commitment colors use white, yellow, and red according to thresholds.
- Positive and negative finance values remain visually distinct.
- No new dependencies are added.
- TypeScript validation passes.
- Existing tests pass.
