# Task 016-01 - Add Quality Tooling

Status: Completed

## Spec

`docs/specs/016-code-quality-tooling.md`

## Plan

`docs/plans/016-code-quality-tooling-plan.md`

## Goal

Add ESLint, Prettier, EditorConfig, quality scripts, and safer ignore rules.

## Steps

1. Install lightweight quality tooling dependencies.
2. Add Expo-compatible ESLint config.
3. Add Prettier config and ignore file.
4. Add `.editorconfig`.
5. Add scripts for lint, format, typecheck, and check.
6. Tighten `.gitignore` for environment files and generated artifacts.

## Acceptance Criteria

- Lint and format commands exist.
- ESLint ignores generated/build folders.
- Prettier ignores generated/build folders and assets.
- Typecheck command exists.
