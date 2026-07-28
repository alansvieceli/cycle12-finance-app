# Task 045-01 - Parse the Monthly Value List

Status: Done

## Spec

`docs/specs/045-monthly-value-list-import.md`

## Plan

`docs/plans/045-monthly-value-list-import-plan.md`

## Goal

Add the strict pure parser that maps pasted lines to displayed projection months, and share the existing monetary maximum with the masked input.

## Files

- Modify: `src/lib/inputParsers.ts`
- Modify: `src/lib/inputParsers.test.ts`
- Modify: `src/components/common/EditableAmountInput.tsx`

## Interfaces

- Consumes: `ProjectionMonth` from `src/lib/financeCalculations.ts` and `MonthNumber` from `src/types/finance.ts`.
- Produces: `MAX_CURRENCY_AMOUNT`, `MonthlyValueImportEntry`, `MonthlyValueListParseResult`, and `parseMonthlyValueList`.

## Steps

- [x] **Step 1: Write the failing parser tests**

In `src/lib/inputParsers.test.ts`, add `parseMonthlyValueList` to the existing import and append this block inside `describe('input parsers', ...)`:

```ts
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
```

- [x] **Step 2: Run the tests to verify they fail**

Run: `npx jest inputParsers`

Expected: FAIL because `parseMonthlyValueList` is not exported.

- [x] **Step 3: Add the parser and its types**

At the top of `src/lib/inputParsers.ts`, add:

```ts
import type { ProjectionMonth } from './financeCalculations';
import type { MonthNumber } from '../types/finance';

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
    .replace(/\r\n/g, '\n')
    .replace(/\n+$/, '')
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
```

Keep `ProjectionMonth` as a type-only import. Run `npm run lint` after the tests so Biome can enforce the repository's import order.

- [x] **Step 4: Reuse the shared maximum**

In `src/components/common/EditableAmountInput.tsx`, import the new constant:

```ts
import { MAX_CURRENCY_AMOUNT } from '../../lib/inputParsers';
```

Delete the local `const MAX_AMOUNT = 999_999_999.99;`, then replace:

```tsx
      maxValue={MAX_AMOUNT}
```

with:

```tsx
      maxValue={MAX_CURRENCY_AMOUNT}
```

No masked-input behavior changes.

- [x] **Step 5: Run the focused tests**

Run: `npx jest inputParsers`

Expected: PASS, including all existing parser cases.

- [x] **Step 6: Run typecheck and lint**

Run: `npm run typecheck && npm run lint`

Expected: both commands pass with no warnings.

- [x] **Step 7: Commit**

```bash
git add src/lib/inputParsers.ts src/lib/inputParsers.test.ts src/components/common/EditableAmountInput.tsx
git commit -m "feat: parse monthly value import lists"
```

## Acceptance Criteria

- Strict numeric lines parse into month/year/amount entries in screen order.
- Internal blank lines become zero.
- Empty input and invalid considered lines produce no entries.
- Extra lines are ignored before validation.
- The existing monetary input and the parser share the same maximum.
- `npx jest inputParsers`, `npm run typecheck`, and `npm run lint` pass.
