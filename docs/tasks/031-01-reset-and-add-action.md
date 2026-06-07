# Task 031-01 - Reset Extra on Window Advance and Add Action

Status: Completed

## Spec

`docs/specs/031-quick-add-extra-balance.md`

## Plan

`docs/plans/031-quick-add-extra-balance-plan.md`

## Goal

Reset `currentMonthExtraBalance` to `0` when the month advances, and add a new `addCurrentMonthExtraBalance(amount: number)` action to `useFinanceState` that sums to the current value.

## Files

- Modify: `src/lib/windowAdvance.ts`
- Modify: `src/hooks/useFinanceState.ts`
- Test: `src/lib/windowAdvance.test.ts`

## Steps

- [ ] **Step 1: Write the failing tests**

Open `src/lib/windowAdvance.test.ts` and add two tests inside the existing `describe('windowAdvance', ...)` block, after the existing tests:

```ts
it('resets currentMonthExtraBalance to 0 when the window advances one step', () => {
  const stateWithExtra: FinanceState = {
    ...baseState,
    settings: {
      ...baseState.settings,
      currentMonthExtraBalance: 500,
    },
  };

  const advancedState = advanceWindow(stateWithExtra, 2026, 7);

  expect(advancedState.settings.currentMonthExtraBalance).toBe(0);
});

it('resets currentMonthExtraBalance to 0 even when advancing multiple steps', () => {
  const stateWithExtra: FinanceState = {
    ...baseState,
    settings: {
      ...baseState.settings,
      currentMonthExtraBalance: 1200,
    },
  };

  const advancedState = advanceWindow(stateWithExtra, 2026, 9);

  expect(advancedState.settings.currentMonthExtraBalance).toBe(0);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
npm test -- windowAdvance
```

Expected: 2 new tests FAIL with "Expected: 0 / Received: 500" (or 1200).

- [ ] **Step 3: Reset `currentMonthExtraBalance` in `advanceWindowOneStep`**

Open `src/lib/windowAdvance.ts`. In `advanceWindowOneStep`, find the `settings` block inside the returned object (around line 90) and add the reset:

```ts
settings: {
  ...state.settings,
  windowStartYear: nextWindowStart.year,
  windowStartMonth: nextWindowStart.month,
  currentMonthExtraBalance: 0,
},
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
npm test -- windowAdvance
```

Expected: all tests pass including the 2 new ones.

- [ ] **Step 5: Add `addCurrentMonthExtraBalance` to `useFinanceState`**

Open `src/hooks/useFinanceState.ts`.

After the existing `updateCurrentMonthExtraBalance` function (around line 117), add:

```ts
function addCurrentMonthExtraBalance(amount: number) {
  setFinanceState((currentState) => ({
    ...currentState,
    settings: {
      ...currentState.settings,
      currentMonthExtraBalance: currentState.settings.currentMonthExtraBalance + amount,
    },
  }));
}
```

Then add `addCurrentMonthExtraBalance` to the `actions` object in the return statement (keep alphabetical order, place it before `adjustMonthlyValue`):

```ts
actions: {
  addCurrentMonthExtraBalance,
  adjustMonthlyValue,
  // ... rest unchanged
},
```

- [ ] **Step 6: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Run all tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/lib/windowAdvance.ts src/hooks/useFinanceState.ts src/lib/windowAdvance.test.ts
git commit -m "feat: reset extra balance on window advance and add additive action"
```

## Acceptance Criteria

- `advanceWindow` sets `currentMonthExtraBalance` to `0` in the returned state regardless of the previous value.
- `addCurrentMonthExtraBalance(amount)` sums `amount` to the current value.
- Both new unit tests pass.
- TypeScript compilation passes.
- All existing tests pass.
