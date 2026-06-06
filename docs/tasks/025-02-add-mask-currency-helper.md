# Task 025-02 - Add maskCurrency Helper

## Spec

`docs/specs/025-hide-values-toggle.md`

## Plan

`docs/plans/025-hide-values-toggle-plan.md`

## Goal

Add the `maskCurrency` helper to `src/lib/formatters.ts` so all components have a single place to apply the mask.

## Steps

1. Open `src/lib/formatters.ts`.
2. Add:

   ```ts
   export function maskCurrency(value: number, hidden: boolean): string {
     return hidden ? 'R$ ••••' : currencyFormatter.format(value);
   }
   ```

3. Do not change any existing formatter.

## Acceptance Criteria

- `maskCurrency(1250, false)` returns the same string as `currencyFormatter.format(1250)`.
- `maskCurrency(1250, true)` returns `'R$ ••••'`.
- TypeScript validation passes.
- Existing formatter tests pass.
