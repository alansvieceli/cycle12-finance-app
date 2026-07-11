# Task 039-01 - Migrate to Biome and Knip

Status: Implemented

## Spec

`docs/specs/039-biome-and-knip-tooling.md`

## Plan

`docs/plans/039-biome-and-knip-tooling-plan.md`

## Steps

- [x] Replace ESLint/Prettier dependencies with `@biomejs/biome` and `knip`.
- [x] Add Biome configuration and update package scripts/lint-staged.
- [x] Run Knip zero-config and add only the configuration needed for this Expo entry point.
- [x] Remove obsolete ESLint/Prettier configuration files.
- [x] Update README and quality standards.
- [x] Run `npm run check` and record the result.

## Validation Result

- `npm run check` passed.
- 172 tests passed; `src/lib` statement coverage is 91.8%.
- Biome reported two non-blocking pre-existing React hook dependency warnings.

## Acceptance Criteria

- Spec 039 acceptance criteria pass.
- No runtime or app behavior changes.
