# Task 014-03 - Add Finance State Replace Action

Status: Completed

## Spec

`docs/specs/014-data-backup-restore-reset.md`

## Plan

`docs/plans/014-data-backup-restore-reset-plan.md`

## Goal

Add state actions that can replace the entire finance state after validation or reset.

## Steps

1. Expose an action to replace the current `FinanceState`.
2. Ensure selected account/category UI state is realigned after replacement.
3. Use the existing save effect to persist the replacement.

## Acceptance Criteria

- Valid restore can replace the entire finance state.
- Reset can replace the entire finance state.
- Current state is not replaced by invalid restore helpers.
