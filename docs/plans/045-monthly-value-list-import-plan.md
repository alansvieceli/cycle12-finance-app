# Monthly Value List Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking and live in the task files under `docs/tasks/`.

**Goal:** Let the user paste sequential monthly values for the account selected in `Planejar`, preview the affected months, and replace them atomically after confirmation.

**Architecture:** A pure parser in `inputParsers.ts` converts the pasted Brazilian decimal lines into typed month/value entries and rejects the full input before any write. `useFinanceState` exposes one bulk action backed by a pure state helper, so confirmation produces one functional state update. `MonthlyValueEditor` owns the two-step modal and forwards the validated entries through `PlanningScreen`; the persisted `MonthlyValue` shape is unchanged.

**Tech Stack:** React Native + Expo, TypeScript, Jest with React Native Testing Library, Biome, Knip.

Status: Planned

## Spec

`docs/specs/045-monthly-value-list-import.md`

## Global Constraints

- Import applies only to the account currently selected in `Planejar`.
- One line maps to one displayed `projectionMonth`, starting with the current month.
- Accepted non-empty lines match digits with an optional decimal comma and one or two decimal digits.
- Internal empty lines map to zero; terminal line breaks do not add zero months.
- Completely empty input imports nothing.
- Only the displayed month count is considered; extra lines are ignored without validation or error.
- Fewer lines replace only their corresponding leading months.
- Any invalid considered line blocks the entire import and identifies its one-based line number.
- The monetary maximum remains `999999999,99`; negative values are invalid.
- The preview shows old and new values before confirmation.
- Confirmation performs one state update and never changes `isReviewed`.
- No data-model, storage-key, backup-format, backend, authentication, paid-service, or dependency change.
- Portuguese UI copy uses sentence case (`docs/standards/ui-copy-policy.md`).
- Duplicated lines in `src/` stay at or below 5% (`docs/standards/code-duplication-policy.md`).
- Close with the full gate: `npm run check`.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `src/lib/inputParsers.ts` | Shared maximum, import entry/result types, and strict sequential-list parser. |
| `src/lib/inputParsers.test.ts` | Parser format, blank-line, range, truncation, and error-line coverage. |
| `src/components/common/EditableAmountInput.tsx` | Reuses the shared currency maximum; behavior is unchanged. |
| `src/hooks/useFinanceState.ts` | Pure bulk replacement helper plus the single `replaceMonthlyValues` action. |
| `src/hooks/useFinanceState.test.ts` | Atomic replacement coverage across accounts and months. |
| `src/components/common/ActionButton.tsx` | Optional disabled state used by the empty import form. |
| `src/components/common/ActionButton.test.tsx` | Disabled buttons do not fire. |
| `src/screens/PlanningScreen.tsx` | Forwards the bulk action to the editor. |
| `src/components/finance/MonthlyValueEditor.tsx` | Import icon, paste/preview modal state, validation message, preview, and confirmation. |
| `src/components/finance/MonthlyValueEditor.test.tsx` | Import modal interaction and wiring coverage. |
| `docs/app-context.md` | Documents sequential replacement in `Planejar`. |
| `README.md` | Adds the user-facing import capability to the Planejar summary. |

## Tasks

| Task | File | Deliverable |
| --- | --- | --- |
| 045-01 | `docs/tasks/045-01-parse-monthly-value-list.md` | Strict parser and shared monetary maximum, unit tested. |
| 045-02 | `docs/tasks/045-02-replace-monthly-values-atomically.md` | Pure bulk replacement plus one hook action, unit tested. |
| 045-03 | `docs/tasks/045-03-add-planejar-import-flow.md` | Import icon and two-step modal wired to the bulk action, component tested. |
| 045-04 | `docs/tasks/045-04-update-docs-and-validate.md` | User documentation and the full project validation gate. |

Order matters: 045-01 defines the typed entries consumed by 045-02 and 045-03; 045-02 defines the action wired by 045-03; 045-04 documents only behavior already proven by the first three tasks.

## Interfaces

Produced by 045-01:

```ts
export const MAX_CURRENCY_AMOUNT = 999_999_999.99;

export type MonthlyValueImportEntry = {
  amount: number;
  month: MonthNumber;
  year: number;
};

export type MonthlyValueListParseResult =
  | { ok: true; entries: MonthlyValueImportEntry[] }
  | { ok: false; invalidLine?: number };

export function parseMonthlyValueList(
  value: string,
  projectionMonths: readonly Pick<ProjectionMonth, 'month' | 'year'>[],
): MonthlyValueListParseResult;
```

`ProjectionMonth` is imported with `import type` in `inputParsers.ts`, so this signature creates no runtime cycle.

Produced by 045-02 and consumed by 045-03:

```ts
/** @internal */
export function replaceMonthlyValuesForAccount(
  currentState: FinanceState,
  accountItemId: string,
  entries: MonthlyValueImportEntry[],
): FinanceState;

// useFinanceState().actions
replaceMonthlyValues(
  accountItemId: string,
  entries: MonthlyValueImportEntry[],
): void;
```

Added to `MonthlyValueEditor` by 045-03:

```ts
onReplaceMonthlyValues: (
  accountItemId: string,
  entries: MonthlyValueImportEntry[],
) => void;
```

## Design Notes

- `projectionMonths.length`, not `12`, limits the parser. The current screen supplies 12, but the implementation remains correct for any visible count from 1 through 12.
- Lines outside that limit are sliced off before validation, so an invalid thirteenth spreadsheet row cannot block a 12-month import.
- A copied terminal newline is removed before splitting. To intentionally zero the last supplied month, the user enters `0`; internal blank rows still map to zero.
- The parser is strict and separate from `parseCurrencyInput`, whose permissive cleanup behavior is correct for free-form legacy fields but unsafe for destructive bulk replacement.
- The bulk helper removes only values whose account and month/year keys are being replaced, then appends exactly one `MonthlyValue` per parsed entry. Other accounts and unsupplied months retain their existing object values.
- The modal shows pasted and previewed amounts even when the global hide-values toggle is active, because this is an explicit data-entry and confirmation flow; the surrounding month rows remain masked.
- No file picker and no reusable import framework. The input is one multiline `TextInput`.

## Validation

- `npx jest inputParsers`
- `npx jest useFinanceState`
- `npx jest ActionButton MonthlyValueEditor`
- `npm run check`
