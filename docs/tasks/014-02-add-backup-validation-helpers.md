# Task 014-02 - Add Backup Validation Helpers

Status: Completed

## Spec

`docs/specs/014-data-backup-restore-reset.md`

## Plan

`docs/plans/014-data-backup-restore-reset-plan.md`

## Goal

Add testable backup helpers for `.c12f` creation, validation, and reset defaults.

## Steps

1. Add backup envelope types and constants.
2. Add canonical JSON serialization with sorted object keys.
3. Add helper to build the protected payload.
4. Add helpers to create and parse backup envelopes with injected hash functions.
5. Validate state shape and references before returning restored data.
6. Add reset default state helper.
7. Add unit tests for valid backup, invalid JSON, invalid format, unsupported version, hash mismatch, bad references, and reset defaults.

## Acceptance Criteria

- Backup validation helpers are pure except for injected hash calculation.
- Hash mismatch rejects restore data.
- Invalid references reject restore data.
- Reset helper returns the specified default state.
- Unit tests pass.
