import { describe, expect, it } from 'vitest';

import {
  clampVisibleMonthCount,
  parseCurrencyInput,
  parseDueDay,
  parseSortOrder,
} from './inputParsers';
import { createId } from './ids';

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
});
