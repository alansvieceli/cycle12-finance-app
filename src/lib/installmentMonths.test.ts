import { buildInstallmentMonths } from './installmentMonths';

describe('buildInstallmentMonths', () => {
  it('returns the selected month when installments is 1', () => {
    expect(buildInstallmentMonths(2026, 7, 1, 2026, 6)).toEqual([
      { year: 2026, month: 7 },
    ]);
  });

  it('returns consecutive months across a year boundary', () => {
    expect(buildInstallmentMonths(2026, 11, 4, 2026, 6)).toEqual([
      { year: 2026, month: 11 },
      { year: 2026, month: 12 },
      { year: 2027, month: 1 },
      { year: 2027, month: 2 },
    ]);
  });

  it('skips months outside the 12-month window', () => {
    expect(buildInstallmentMonths(2027, 4, 4, 2026, 6)).toEqual([
      { year: 2027, month: 4 },
      { year: 2027, month: 5 },
    ]);
  });

  it('returns an empty array when the selected month is outside the window', () => {
    expect(buildInstallmentMonths(2027, 7, 3, 2026, 6)).toEqual([]);
  });

  it('handles installment counts larger than the remaining window months', () => {
    expect(buildInstallmentMonths(2027, 2, 12, 2026, 6)).toEqual([
      { year: 2027, month: 2 },
      { year: 2027, month: 3 },
      { year: 2027, month: 4 },
      { year: 2027, month: 5 },
    ]);
  });
});
