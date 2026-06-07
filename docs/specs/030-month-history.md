# Spec 030 - Month History

## Goal

Save a snapshot of each month when the planning window advances, and expose a Histórico view in the Resumo tab that shows up to 12 past months with income vs expenses and a category/account breakdown.

## Context

Spec 018 introduced a rolling 12-month window. When the window advances — automatically on startup or manually via "Avançar mês" — the oldest month's `MonthlyValue` and `MonthlyPaymentStatus` records are dropped. Once dropped, that data is gone.

Users need to look back at past months to understand their financial history: how much came in, how much went out, and where the money went. Without history, every past month is permanently lost.

## Non-Goals

- Do not allow editing past months.
- Do not store payment status history (paid/unpaid per account).
- Do not add charts or trend analysis across history entries.
- Do not add a separate navigation tab for history.
- Do not change the backup/restore format beyond the new field.
- Do not add new dependencies.

## Data Model

### New type: `MonthHistoryEntry`

```ts
type MonthHistoryEntry = {
  month: MonthNumber;
  year: number;
  totalIncome: number; // monthlySalary + currentMonthExtraBalance at advance time
  totalExpenses: number; // sum of all MonthlyValue amounts for this month
  categories: {
    id: string;
    name: string; // snapshot of name at advance time
    color?: string;
    total: number; // sum of all account amounts in this category for this month
  }[];
  accounts: {
    id: string;
    name: string; // snapshot of name at advance time
    categoryId: string;
    amount: number; // MonthlyValue amount for this month
  }[];
};
```

Names are captured as snapshots so renames after the fact do not corrupt historical display.

### `FinanceState` gains `monthHistory`

```ts
type FinanceState = {
  ...
  monthHistory: MonthHistoryEntry[];
};
```

- Maximum 12 entries. When a new entry is added and the list exceeds 12, the oldest entry (lowest year/month) is removed.
- Sorted most-recent first for display; insertion order can be any order since display always sorts.
- Included in backup and restore.

### Migration

Existing installs receive `monthHistory: []` on first load after this update.

## Capture Logic

History is captured inside `advanceWindow` in `src/lib/windowAdvance.ts`, before the oldest month's records are dropped.

Steps when capturing a month:

1. Identify the month/year being dropped (current `windowStartMonth` / `windowStartYear`).
2. Read `monthlySalary + currentMonthExtraBalance` from settings as `totalIncome`.
3. For each account item, read its `MonthlyValue` amount for the dropping month. Default to `0` if no record exists.
4. Group account amounts by category to compute per-category totals.
5. Compute `totalExpenses` as the sum of all account amounts.
6. Build the `MonthHistoryEntry` with name snapshots from current categories and accounts.
7. Prepend the entry to `state.monthHistory`.
8. If `monthHistory.length > 12`, drop the last entry (oldest).

This happens for every advance step when the window is caught up by multiple months.

## UX Behavior

### Resumo pill row

A third pill `Histórico` is added to the existing month pill row:

```
[Jun/2026]   [Outros meses]   [Histórico]
```

The pill uses the same styling as the existing pills. When active, it uses the orange accent background.

### History list (Histórico pill selected)

Displays a scrollable vertical list of `MonthHistoryEntry` cards, ordered most-recent to oldest.

**Empty state:** When `monthHistory` is empty, shows the message:

> "Nenhum mês registrado ainda. O histórico é salvo automaticamente quando o mês avança."

### History card — collapsed state

Each card shows:

- Month and year label (e.g., `Maio 2026`)
- Two columns: `RECEBIDO` in green / `PAGO` in red
- Progress bar showing `totalExpenses / totalIncome` ratio, colored by commitment thresholds using the existing `resolveCommitmentColor` helper and the current settings thresholds
- A percentage label next to the bar
- A chevron `›` to indicate it is expandable

### History card — expanded state (accordion)

Tapping a card expands it inline. Only one card can be expanded at a time; expanding a new one collapses the previous.

The expanded section shows two tabs:

- `Categorias` (default): list of category name + total, sorted by total descending
- `Contas`: list of account name + amount, sorted by amount descending, grouped under their category name

Tabs use the same pill style as other selectors in the app.

Zero-amount accounts are hidden from the Contas tab to reduce noise.

### Eye icon

All monetary values in history cards respect the `valuesHidden` session toggle. Values display as `••••` when hidden.

## Implementation Notes

- Add `monthHistory: MonthHistoryEntry[]` to `FinanceState` and `emptyFinanceState` in `src/types/finance.ts`.
- Update `advanceWindow` in `src/lib/windowAdvance.ts` to capture history before dropping the month.
- Update `useFinanceState` to pass `valuesHidden` down to the history view.
- Add `HistoryCard` component in `src/components/finance/HistoryCard.tsx` — handles collapsed/expanded state and the Categorias/Contas tab.
- Update `SummaryScreen` to render the third pill and the history list when `Histórico` is active.
- Update storage migration in `src/storage/` to add `monthHistory: []` for existing installs.
- Update backup/restore helpers to include `monthHistory` in the payload and validation.

## Tests

Unit tests required in `windowAdvance.test.ts`:

- `advanceWindow` captures a `MonthHistoryEntry` before dropping the oldest month
- Captured entry has correct `totalIncome` (salary + extra)
- Captured entry has correct `totalExpenses` (sum of all account values)
- Captured entry has correct per-category totals
- Captured entry snapshots category and account names
- `monthHistory` is capped at 12 entries after multiple advances
- When `monthHistory` exceeds 12, the oldest entry is dropped

## Acceptance Criteria

- A third pill `Histórico` appears in the Resumo pill row.
- Selecting it shows a list of past month cards, most-recent first.
- Each card shows RECEBIDO (green), PAGO (red), and a colored progress bar.
- Tapping a card expands it with `Categorias` and `Contas` tabs.
- `Categorias` tab shows per-category totals sorted by total descending.
- `Contas` tab shows per-account amounts grouped by category, hiding zero-value accounts.
- Only one card is expanded at a time.
- All monetary values respect the eye icon toggle.
- History is automatically saved when the window advances (auto or manual).
- A maximum of 12 entries are kept; older entries beyond 12 are dropped.
- Empty state message is shown when no history exists.
- Existing installs migrate without data loss (`monthHistory: []`).
- History is included in backup and restore.
- TypeScript validation passes.
- Unit tests pass.

## Validation

```bash
npm run check
npm test
```
