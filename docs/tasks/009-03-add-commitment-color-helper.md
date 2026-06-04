# Task 009-03 - Add Commitment Color Helper

## Plan Reference

`docs/plans/009-commitment-color-thresholds-plan.md`

## Spec Reference

`docs/specs/009-commitment-color-thresholds.md`

## Objective

Add a pure helper function that resolves the display color for the commitment percentage based on the configured thresholds, with unit tests.

## Steps

1. Create `src/lib/commitmentColor.ts` with a single exported function:

   ```ts
   resolveCommitmentColor(
     commitment: number | null,
     warningThreshold: number,
     dangerThreshold: number,
   ): string | null
   ```

   Return values:
   - `null` when `commitment` is `null` (caller uses default color).
   - `'#d9534f'` (red) when `dangerThreshold > 0` and `commitment > dangerThreshold / 100`.
   - `'#f0a500'` (amber) when `warningThreshold > 0` and `commitment > warningThreshold / 100`.
   - `null` otherwise (no override, caller uses default color).

   Danger takes priority over warning.

2. Create `src/lib/commitmentColor.test.ts` with unit tests covering:
   - `null` commitment returns `null`.
   - Commitment above danger threshold returns red color.
   - Commitment above warning threshold but below danger returns amber color.
   - Commitment below both thresholds returns `null`.
   - Threshold of `0` is treated as disabled (does not trigger that level).
   - Warning threshold equal to danger threshold: danger takes priority.
   - Exact threshold boundary (equal, not strictly greater): returns `null` (only `>` triggers).

## Acceptance Criteria

- `resolveCommitmentColor` is a pure function with no side effects.
- All described test cases pass.
- The helper handles `null` commitment safely.

## Validation

- `npx tsc --noEmit` passes with no errors.
- `npm test` passes.
