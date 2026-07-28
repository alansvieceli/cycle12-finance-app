import { createId } from './ids';
import {
  clampVisibleMonthCount,
  parseCurrencyInput,
  parseDueDay,
  parseMonthlyValueList,
  parseSortOrder,
} from './inputParsers';

describe('input parsers', () => {
  it('parses Brazilian currency-like input', () => {
    expect(parseCurrencyInput('1.234,56')).toBe(1234.56);
    expect(parseCurrencyInput('R$ 99,90')).toBe(99.9);
    expect(parseCurrencyInput('abc')).toBe(0);
  });

  it('clamps due day to a valid day of month', () => {
    expect(parseDueDay('0')).toBe(1);
    expect(parseDueDay('15')).toBe(15);
    expect(parseDueDay('99')).toBe(31);
    expect(parseDueDay('dia 8')).toBe(8);
  });

  it('clamps visible month count from 1 to 12', () => {
    expect(clampVisibleMonthCount(undefined)).toBe(12);
    expect(clampVisibleMonthCount(0)).toBe(1);
    expect(clampVisibleMonthCount(5.4)).toBe(5);
    expect(clampVisibleMonthCount(99)).toBe(12);
  });

  it('parses sort order with zero as the fallback', () => {
    expect(parseSortOrder('7')).toBe(7);
    expect(parseSortOrder('ordem 12')).toBe(12);
    expect(parseSortOrder('')).toBe(0);
    expect(parseSortOrder('abc')).toBe(0);
  });

  it('creates ids with the requested prefix', () => {
    expect(createId('category')).toMatch(/^category-\d+-\d+$/);
  });

  const importMonths = [
    { month: 7 as const, year: 2026 },
    { month: 8 as const, year: 2026 },
    { month: 9 as const, year: 2026 },
  ];

  it('parses sequential monthly values with Brazilian decimals', () => {
    expect(parseMonthlyValueList('123\n 456,7 \n789,45', importMonths)).toEqual({
      ok: true,
      entries: [
        { amount: 123, month: 7, year: 2026 },
        { amount: 456.7, month: 8, year: 2026 },
        { amount: 789.45, month: 9, year: 2026 },
      ],
    });
  });

  it('maps internal empty lines to zero and ignores a terminal line break', () => {
    expect(parseMonthlyValueList('123,21\n\n456,70\n', importMonths)).toEqual({
      ok: true,
      entries: [
        { amount: 123.21, month: 7, year: 2026 },
        { amount: 0, month: 8, year: 2026 },
        { amount: 456.7, month: 9, year: 2026 },
      ],
    });
    expect(parseMonthlyValueList('123,21\n\n', importMonths)).toEqual({
      ok: true,
      entries: [
        { amount: 123.21, month: 7, year: 2026 },
        { amount: 0, month: 8, year: 2026 },
      ],
    });
  });

  it('rejects empty input and reports the invalid considered line', () => {
    expect(parseMonthlyValueList('   ', importMonths)).toEqual({ ok: false });
    expect(parseMonthlyValueList('123,21\nR$ 10,00', importMonths)).toEqual({
      ok: false,
      invalidLine: 2,
    });
    expect(parseMonthlyValueList('123.21', importMonths)).toEqual({
      ok: false,
      invalidLine: 1,
    });
    expect(parseMonthlyValueList('-1', importMonths)).toEqual({
      ok: false,
      invalidLine: 1,
    });
    expect(parseMonthlyValueList('1,2,3', importMonths)).toEqual({
      ok: false,
      invalidLine: 1,
    });
    expect(parseMonthlyValueList('1,234', importMonths)).toEqual({
      ok: false,
      invalidLine: 1,
    });
  });

  it('accepts the currency maximum and rejects a value above it', () => {
    expect(parseMonthlyValueList('999999999,99', importMonths)).toEqual({
      ok: true,
      entries: [{ amount: 999999999.99, month: 7, year: 2026 }],
    });
    expect(parseMonthlyValueList('1000000000,00', importMonths)).toEqual({
      ok: false,
      invalidLine: 1,
    });
  });

  it('replaces only supplied months and ignores excess lines before validation', () => {
    expect(parseMonthlyValueList('10\n20', importMonths)).toEqual({
      ok: true,
      entries: [
        { amount: 10, month: 7, year: 2026 },
        { amount: 20, month: 8, year: 2026 },
      ],
    });
    expect(
      parseMonthlyValueList('10\n20\ntexto ignorado', importMonths.slice(0, 2)),
    ).toEqual({
      ok: true,
      entries: [
        { amount: 10, month: 7, year: 2026 },
        { amount: 20, month: 8, year: 2026 },
      ],
    });
  });
});
