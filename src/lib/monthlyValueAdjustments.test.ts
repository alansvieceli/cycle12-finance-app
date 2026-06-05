import { calculateAdjustedMonthlyValue } from './monthlyValueAdjustments';

describe('calculateAdjustedMonthlyValue', () => {
  it('adds comma decimal input correctly', () => {
    expect(calculateAdjustedMonthlyValue(1245.11, '132,45', 'add')).toBeCloseTo(
      1377.56,
    );
  });

  it('subtracts comma decimal input correctly', () => {
    expect(calculateAdjustedMonthlyValue(1245.11, '132,45', 'subtract')).toBeCloseTo(
      1112.66,
    );
  });

  it('clamps subtraction below zero to zero', () => {
    expect(calculateAdjustedMonthlyValue(100, '132,45', 'subtract')).toBe(0);
  });

  it('treats invalid input as zero', () => {
    expect(calculateAdjustedMonthlyValue(100, 'abc', 'add')).toBe(100);
  });

  it('handles direct numeric current values safely', () => {
    expect(calculateAdjustedMonthlyValue(Number.NaN, '10,00', 'add')).toBe(10);
    expect(
      calculateAdjustedMonthlyValue(Number.POSITIVE_INFINITY, '10,00', 'add'),
    ).toBe(10);
  });

  it('ignores negative adjustment direction from the input text', () => {
    expect(calculateAdjustedMonthlyValue(100, '-10,00', 'add')).toBe(100);
    expect(calculateAdjustedMonthlyValue(100, '-10,00', 'subtract')).toBe(100);
  });
});
