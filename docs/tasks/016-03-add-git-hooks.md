# Task 016-03 - Add Git Hooks

Status: Completed

## Spec

`docs/specs/016-code-quality-tooling.md`

## Plan

`docs/plans/016-code-quality-tooling-plan.md`

## Goal

Configure Husky and lint-staged for lightweight pre-commit quality checks.

## Steps

1. Add Husky and lint-staged dependencies.
2. Add a `prepare` script.
3. Add a pre-commit hook.
4. Configure lint-staged to lint and format staged code files.

## Acceptance Criteria

- Pre-commit does not run a full build.
- Staged source/config/docs files are formatted.
- Staged code files are linted.
