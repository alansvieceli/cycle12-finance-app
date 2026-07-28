import type { MonthNumber } from '../types/finance';
import type { ProjectionMonth } from './financeCalculations';

export const MAX_CURRENCY_AMOUNT = 999_999_999.99;

export type MonthlyValueImportEntry = {
  amount: number;
  month: MonthNumber;
  year: number;
};

export type MonthlyValueListParseResult =
  | { ok: true; entries: MonthlyValueImportEntry[] }
  | { ok: false; invalidLine?: number };

const monthlyValuePattern = /^\d+(?:,\d{1,2})?$/;

export function parseMonthlyValueList(
  value: string,
  projectionMonths: readonly Pick<ProjectionMonth, 'month' | 'year'>[],
): MonthlyValueListParseResult {
  if (!value.trim()) {
    return { ok: false };
  }

  const lines = value
    .replace(/\r\n?/g, '\n')
    .replace(/\n$/, '')
    .split('\n')
    .slice(0, projectionMonths.length);
  const entries: MonthlyValueImportEntry[] = [];

  for (const [index, projectionMonth] of projectionMonths
    .slice(0, lines.length)
    .entries()) {
    const line = lines[index]?.trim() ?? '';

    if (!line) {
      entries.push({ ...projectionMonth, amount: 0 });
      continue;
    }

    if (!monthlyValuePattern.test(line)) {
      return { ok: false, invalidLine: index + 1 };
    }

    const amount = Number(line.replace(',', '.'));

    if (amount > MAX_CURRENCY_AMOUNT) {
      return { ok: false, invalidLine: index + 1 };
    }

    entries.push({ ...projectionMonth, amount });
  }

  return { ok: true, entries };
}

/** @internal */
export function parseCurrencyInput(value: string) {
  const normalizedValue = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function parseDueDay(value: string) {
  const parsedValue = Number(value.replace(/\D/g, ''));

  if (!Number.isFinite(parsedValue)) {
    return 1;
  }

  return Math.max(1, Math.min(31, parsedValue));
}

export function parseSortOrder(value: string) {
  const parsedValue = Number(value.replace(/\D/g, ''));

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export function clampVisibleMonthCount(value: number | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 12;
  }

  return Math.max(1, Math.min(12, Math.round(value)));
}
