# Task 015-01 - Add Adjustment Helper

Status: Completed

## Spec

`docs/specs/015-monthly-value-adjustments.md`

## Plan

`docs/plans/015-monthly-value-adjustments-plan.md`

## Goal

Add a pure helper that calculates adjusted monthly values using the existing currency parser.

## Steps

1. Create a helper under `src/lib/`.
2. Support `add` and `subtract` operations.
3. Treat invalid adjustment input as zero.
4. Clamp subtraction results below zero to zero.
5. Add focused unit tests.

## Acceptance Criteria

- The helper returns finite numbers.
- Comma decimal additions and subtractions work.
- Subtraction below zero returns zero.
- Unit tests cover the required cases.
