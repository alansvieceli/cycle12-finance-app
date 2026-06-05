# Spec 015 - Monthly Value Adjustments

## Goal

Improve the `Planejamento` monthly value editor so the user can add or subtract a value from an existing account/month total without manually calculating and replacing the full amount.

## Context

Today, when editing an account value for a month, the user must type the final total directly.

Example:

- Current value: `1.245,11`
- New extra amount to include: `132,45`
- Current workflow: user calculates `1.377,56` manually and replaces the whole field
- Desired workflow: user taps `+`, enters `132,45`, and the app updates the month to `1.377,56`

The same should work for subtraction:

- Current value: `1.245,11`
- Amount to remove: `132,45`
- User taps `-`, enters `132,45`, and the app updates the month to `1.112,66`

## Recommendation

Keep the current total field as the primary editable value, and add two compact adjustment actions next to each monthly value:

- `+` opens an add adjustment input
- `-` opens a subtract adjustment input

This keeps the screen flexible:

- Direct editing still works for users who know the final total.
- Adjustment editing works for users who are adding/removing partial charges.
- The stored data remains simple because the app still persists only the final monthly total.

## Scope

### Included

- Add `+` and `-` controls to each monthly value row in `Planejamento`.
- Let the user enter an adjustment amount using the same currency parsing rules as existing currency inputs.
- Apply addition or subtraction to the current stored month value.
- Format the resulting total using the existing editable amount format.
- Keep direct editing of the monthly total available.
- Prevent accidental layout overflow on mobile.
- Add focused unit tests for the pure adjustment calculation helper.

### Not Included

- Do not store a history of adjustments.
- Do not create transaction-level records.
- Do not change backup/restore format.
- Do not change summary or chart calculations except through the updated monthly total.
- Do not add backend, cloud sync, or authentication.

## UX Behavior

### Monthly Row

Each monthly value row should keep:

- month label
- category/account context
- editable total value field

Each row should add compact controls:

- `+` action for adding a value
- `-` action for subtracting a value

Preferred mobile layout:

- Put the total input and `+`/`-` actions in a compact horizontal group.
- If space is tight, place `+` and `-` as small square buttons beside or below the total input.
- Buttons should use familiar symbols, not verbose text labels.
- Use app theme colors:
  - `+` can use the orange accent or positive styling
  - `-` should use a danger/negative style

### Adjustment Entry

When the user taps `+` or `-`, the app should show a small adjustment entry area for that row.

Suggested behavior:

1. User taps `+` or `-`.
2. A compact input appears for that row with focus.
3. User types the adjustment amount, such as `132,45`.
4. User confirms with an action button.
5. The app applies the adjustment and hides the adjustment input.

The adjustment entry should also include a cancel action.

### Calculation Rules

Given:

- current total
- adjustment amount
- operation: add or subtract

Rules:

- Add: `nextTotal = currentTotal + adjustmentAmount`
- Subtract: `nextTotal = currentTotal - adjustmentAmount`
- Empty or invalid adjustment input is treated as `0`
- Result should never become negative by accident

Recommended subtraction behavior:

- If subtraction would go below `0`, clamp the result to `0`.
- This is safer than storing negative account values, because monthly account values represent expected expenses.

## Data Model

No persistent data model change is required.

The app should continue storing:

```ts
type MonthlyValue = {
  accountItemId: string;
  month: MonthNumber;
  year: number;
  amount: number;
};
```

Only `amount` changes after an adjustment is applied.

## Implementation Notes

Add a pure helper under `src/lib/`, for example:

```ts
type MonthlyValueAdjustmentOperation = 'add' | 'subtract';

function calculateAdjustedMonthlyValue(
  currentAmount: number,
  adjustmentInput: string,
  operation: MonthlyValueAdjustmentOperation,
): number;
```

The helper should:

- use existing currency parsing logic
- add or subtract based on operation
- clamp subtraction results to `0`
- return a finite number

Then wire it through:

- `useFinanceState`
- `MonthlyValueEditor`
- `PlanningScreen`

The existing `updateMonthlyValue` action should remain available for direct edits.

## Tests

Unit tests are required for the pure helper:

- adds comma decimal input correctly
- subtracts comma decimal input correctly
- clamps subtraction below zero to zero
- treats invalid input as zero
- handles direct numeric current values safely

Existing finance calculation tests should continue to pass.

## Acceptance Criteria

- User can still directly edit a monthly account total.
- User can tap `+`, enter an amount, and add it to the current month value.
- User can tap `-`, enter an amount, and subtract it from the current month value.
- Subtraction does not produce a negative expense value.
- The UI remains usable on a narrow Android phone viewport.
- Stored finance state still contains only the final monthly total.
- TypeScript validation passes.
- Unit tests pass.
- README is updated if the implemented behavior is user-visible.
