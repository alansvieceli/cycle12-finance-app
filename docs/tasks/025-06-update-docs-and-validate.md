# Task 025-06 - Update Docs and Validate

## Spec

`docs/specs/025-hide-values-toggle.md`

## Plan

`docs/plans/025-hide-values-toggle-plan.md`

## Goal

Update `docs/app-context.md` to reflect the new toggle behavior and run the full project validation.

## Steps

1. Open `docs/app-context.md`.
2. Add the hide-values toggle to the `Resumo` section (or a suitable top-level section) describing that a session-only eye icon in the greeting row hides all monetary values across all tabs.
3. Run `npm run check` (or equivalent full check).

## Acceptance Criteria

- `docs/app-context.md` documents the hide-values toggle behavior.
- `npm run lint` passes.
- `npm run typecheck` passes.
- `npm test` passes.
