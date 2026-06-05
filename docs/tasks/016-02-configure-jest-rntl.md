# Task 016-02 - Configure Jest RNTL

Status: Completed

## Spec

`docs/specs/016-code-quality-tooling.md`

## Plan

`docs/plans/016-code-quality-tooling-plan.md`

## Goal

Configure Jest with Expo and React Native Testing Library.

## Steps

1. Add Jest/Expo and React Native Testing Library dependencies.
2. Add Jest config and setup file.
3. Migrate existing test imports away from Vitest.
4. Add one simple render test.
5. Add `test` and `test:watch` scripts.

## Acceptance Criteria

- `npm test` runs with Jest.
- Existing pure logic tests pass.
- A simple React Native component render test passes.
