# Task 007-05 - Update Current Month Commitment

## Plan Reference

`docs/plans/007-sorting-and-compact-management-panels-plan.md`

## Spec Reference

`docs/specs/007-sorting-and-compact-management-panels.md`

## Objective

Use current-month extra balance when calculating current-month commitment percentage.

## Steps

1. Add or update a calculation helper for available income.
2. Use salary plus current-month extra balance for current-month commitment.
3. Use salary only for future-month commitment.
4. Add unit tests.

## Acceptance Criteria

- Current-month commitment uses salary plus extra balance.
- Future-month commitment uses salary only.
- Zero or negative available income returns unavailable/null.
- Existing surplus and total calculations remain unchanged.

## Validation

Run:

```bash
npm test
```
