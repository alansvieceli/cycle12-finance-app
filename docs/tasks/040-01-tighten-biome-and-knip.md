# Task 040-01 - Tighten Biome and Knip

Status: Implemented

## Spec

`docs/specs/040-strict-biome-and-knip-quality.md`

## Plan

`docs/plans/040-strict-biome-and-knip-quality-plan.md`

## Steps

- [x] Enable recommended Biome rules/domains and import organization.
- [x] Apply formatting and safe fixes; review remaining diagnostics.
- [x] Remove avoidable Knip exceptions and resolve real findings.
- [x] Add strict production and configuration-hint Knip checks.
- [x] Update scripts and documentation.
- [x] Run `npm run check` and record the result.

## Validation Result

- `npm run check` passed with zero Biome or Knip diagnostics.
- 172 tests passed; `src/lib` statement coverage is 91.81%.
- `npm run dup` passed at 0.31% duplicated lines.
- `npx expo install --check` found four unrelated compatible patch updates, recorded in the spec as pending outside scope.

## Acceptance Criteria

- Spec 040 acceptance criteria pass.
- No application behavior changes are introduced.
