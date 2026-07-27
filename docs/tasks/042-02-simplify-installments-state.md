# Task 042-02 - Simplify Installments State

Status: Done

## Spec

`docs/specs/042-planejar-quality-cleanup.md`

## Plan

`docs/plans/042-planejar-quality-cleanup-plan.md`

## Goal

Store the installment count as a `number` instead of a string, removing the `sanitizeInstallmentsInput` / `parseInstallmentsInput` pair whose defenses are unreachable: the only writer is a `SelectField` whose options are generated in the same file as `'1'`..`'12'`.

## Files

- Modify: `src/components/finance/MonthlyValueEditor.tsx`

## Steps

- [x] **Step 1: Change the state**

```ts
const [installments, setInstallments] = useState(1);
```

Reset it to `1` in `openAdjustModal` and `switchAdjustmentMode`.

- [x] **Step 2: Pass it through**

- `confirmAdjustment`: `adjustmentMode === 'add' ? installments : undefined` (unchanged meaning).
- `AdjustPanel` props: `installments: number` and `onInstallmentsChange: (value: number) => void`.
- The `SelectField` boundary converts: `value={String(installments)}` and `onChange={(id) => onInstallmentsChange(Number(id))}`.
- `affectedInstallmentMonths` and `shouldShowInstallmentSummary` use `installments` directly instead of `parsedInstallments`.

- [x] **Step 3: Delete the helpers**

Remove `sanitizeInstallmentsInput` and `parseInstallmentsInput`.

- [x] **Step 4: Validate**

```bash
npm run typecheck && npm run lint
```

## Acceptance Criteria

- The installments state is a `number`.
- `sanitizeInstallmentsInput` and `parseInstallmentsInput` no longer exist in the file.
- Behavior is unchanged: `add` applies to the selected month plus the following `N-1` months inside the window; `subtract` applies only to the selected month and passes no installment count.
- `npm run typecheck` and `npm run lint` pass.
