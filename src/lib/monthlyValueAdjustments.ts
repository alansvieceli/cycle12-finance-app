import { parseCurrencyInput } from './inputParsers';

export type MonthlyValueAdjustmentOperation = 'add' | 'subtract';

export function calculateAdjustedMonthlyValue(
  currentAmount: number,
  adjustmentInput: string,
  operation: MonthlyValueAdjustmentOperation,
) {
  const safeCurrentAmount =
    typeof currentAmount === 'number' && Number.isFinite(currentAmount)
      ? currentAmount
      : 0;
  const adjustmentAmount = Math.max(0, parseCurrencyInput(adjustmentInput));
  const nextAmount =
    operation === 'add'
      ? safeCurrentAmount + adjustmentAmount
      : safeCurrentAmount - adjustmentAmount;

  if (!Number.isFinite(nextAmount)) {
    return 0;
  }

  return Math.max(0, nextAmount);
}
