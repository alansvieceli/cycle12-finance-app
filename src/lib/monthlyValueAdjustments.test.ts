import { calculateAdjustedMonthlyValue } from './monthlyValueAdjustments';

describe('calculateAdjustedMonthlyValue', () => {
  it('adds the adjustment amount', () => {
    expect(calculateAdjustedMonthlyValue(1245.11, 132.45, 'add')).toBeCloseTo(1377.56);
  });

  it('subtracts the adjustment amount', () => {
    expect(calculateAdjustedMonthlyValue(1245.11, 132.45, 'subtract')).toBeCloseTo(
      1112.66,
    );
  });

  it('clamps subtraction below zero to zero', () => {
    expect(calculateAdjustedMonthlyValue(100, 132.45, 'subtract')).toBe(0);
  });

  it('treats invalid adjustment amounts as zero', () => {
    expect(calculateAdjustedMonthlyValue(100, Number.NaN, 'add')).toBe(100);
  });

  it('treats invalid current amounts as zero', () => {
    expect(calculateAdjustedMonthlyValue(Number.NaN, 10, 'add')).toBe(10);
    expect(calculateAdjustedMonthlyValue(Number.POSITIVE_INFINITY, 10, 'add')).toBe(10);
  });

  it('ignores negative adjustment amounts', () => {
    expect(calculateAdjustedMonthlyValue(100, -10, 'add')).toBe(100);
    expect(calculateAdjustedMonthlyValue(100, -10, 'subtract')).toBe(100);
  });
});
