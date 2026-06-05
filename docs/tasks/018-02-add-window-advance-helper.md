# Task 018-02 - Add Window Advance Helper

Status: Completed

## Spec

`docs/specs/018-rolling-window-and-category-propagation.md`

## Plan

`docs/plans/018-rolling-window-and-category-propagation-plan.md`

## Goal

Add pure helper logic for detecting and advancing the rolling month window.

## Steps

1. Add `src/lib/windowAdvance.ts`.
2. Implement `shouldAdvanceWindow`.
3. Implement one-step and multi-step `advanceWindow`.
4. Add unit tests for fixed, zero, installment, drop, and multi-step behavior.

## Acceptance Criteria

- Helper tests cover the spec scenarios.
- No UI or storage code is needed to test the core logic.
