export type MonthlyValueAdjustmentOperation = 'add' | 'subtract';

export function calculateAdjustedMonthlyValue(
  currentAmount: number,
  adjustmentAmount: number,
  operation: MonthlyValueAdjustmentOperation,
) {
  const safeCurrentAmount =
    typeof currentAmount === 'number' && Number.isFinite(currentAmount)
      ? currentAmount
      : 0;
  const safeAdjustmentAmount = Number.isFinite(adjustmentAmount)
    ? Math.max(0, adjustmentAmount)
    : 0;
  const nextAmount =
    operation === 'add'
      ? safeCurrentAmount + safeAdjustmentAmount
      : safeCurrentAmount - safeAdjustmentAmount;

  if (!Number.isFinite(nextAmount)) {
    return 0;
  }

  return Math.max(0, nextAmount);
}
