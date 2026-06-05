# Spec 018 - Rolling Window and Category Propagation

## Goal

Replace the static month list with a rolling 12-month window that always starts at the current month, and allow each category to define how its account values are propagated into new months when the window advances.

## Context

Today the app displays a fixed set of months defined by `visibleMonthCount`. When real time moves forward, the user must manually update the "visible month" setting and re-enter values for new months from scratch.

There is no mechanism to carry recurring values forward. Every new month starts empty regardless of whether the account is a fixed expense (phone, rent), a variable one (credit card), or a time-limited installment (loan).

The user currently works around this by re-entering or mentally carrying values over — which is the same overhead the app was supposed to eliminate.

## Goals

- The window always shows 12 months starting from the current calendar month.
- When the window advances (a new current month is detected), a new month is appended at the end and the oldest past month is dropped.
- Each category defines a `propagation` rule that controls how values are filled in the new month.
- The propagation rule is set in the category editor.
- No per-account override is needed.

## Non-Goals

- Do not add backend, cloud sync, or authentication.
- Do not add per-account propagation overrides.
- Do not store a history of removed months.
- Do not change the backup/restore format beyond the new fields.
- Do not change summary or chart calculations except through updated monthly values.

## Data Model

### Category gains `propagation`

```ts
type CategoryPropagation = 'fixed' | 'zero' | 'installment';

type Category = {
  id: string;
  name: string;
  sortOrder: number;
  propagation: CategoryPropagation; // new field, default: 'zero'
};
```

Propagation rules when a new month is appended:

| Rule          | Behavior                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| `fixed`       | Copies the value from the most recent existing month for each account in the category                              |
| `zero`        | New month is created with `amount: 0` for each account in the category                                             |
| `installment` | Same as `fixed`, but also requires `installmentEndDate` on the category; months past that date are filled with `0` |

### Category gains `installmentEndDate` (optional)

```ts
type Category = {
  ...
  propagation: CategoryPropagation;
  installmentEndDate?: string; // ISO date string, e.g. '2026-12-01', only used when propagation is 'installment'
};
```

### Settings: replace planning-window control, add `windowStartYear` and `windowStartMonth`

The planning window is always 12 months.

The user can still configure how many months appear in read-only summary/chart views. That display-only setting must not change the 12-month planning window or propagation logic.

`windowStartYear` and `windowStartMonth` track the first month of the current window. They are updated automatically when the window advances.

```ts
type FinanceSettings = {
  monthlySalary: number;
  currentMonthExtraBalance: number;
  summaryVisibleMonthCount: number; // 1-12, display-only for summary/charts
  commitmentWarningThreshold: number;
  commitmentDangerThreshold: number;
  windowStartYear: number; // new, replaces visibleMonthCount
  windowStartMonth: MonthNumber; // new
};
```

On first load after this update, `windowStartYear` and `windowStartMonth` are initialised from the current calendar date.

## Window Advance Logic

On app startup, the app compares the current calendar month to `windowStartMonth`/`windowStartYear`.

If the current month is ahead of the window start, the app advances the window one month at a time until the window start matches the current month. For each advance step:

1. Drop all `MonthlyValue` and `MonthlyPaymentStatus` records for the oldest month in the window.
2. Compute the new trailing month (month 12 of the new window).
3. For each category, apply its `propagation` rule to fill `MonthlyValue` records for the new month.
4. Update `windowStartMonth`/`windowStartYear` in settings.

The user can also trigger a manual advance via a "Avançar mês" button in the settings screen.

## UX Behavior

### Category Editor

Add a `Propagação` field to the category create/edit form with three options:

- `Fixo` — copies last known value each month
- `Zerado` — starts at zero each month
- `Parcelas` — copies last known value, stops after end date

When `Parcelas` is selected, a date picker for `Data de encerramento` becomes visible.

Default for new categories: `Zerado`.

### Settings Screen

- Keep a `Meses no resumo e gráficos` input from 1 to 12.
- Make clear that the planning window remains 12 months regardless of that display setting.
- Add a read-only field showing the current window range, e.g. `Jun 2026 – Mai 2027`.
- Add a `Avançar mês` button that manually triggers a one-step window advance with a confirmation dialog.

### Advance Confirmation Dialog

When the user taps `Avançar mês`:

> "Avançar para Julho 2026? Os valores de Junho 2025 serão removidos e um novo mês será gerado com base nas regras de propagação."

Actions: `Confirmar` / `Cancelar`.

## Migration

Existing installs must be migrated on first load:

- Set `windowStartYear` and `windowStartMonth` from the current calendar date.
- Set `propagation: 'zero'` on all existing categories (safe default — no values are silently copied).
- Migrate old `visibleMonthCount` into `summaryVisibleMonthCount` when available, defaulting to `12`.

## Implementation Notes

Add a pure helper `src/lib/windowAdvance.ts`:

```ts
function shouldAdvanceWindow(
  windowStartYear: number,
  windowStartMonth: MonthNumber,
  nowYear: number,
  nowMonth: MonthNumber,
): boolean;

function advanceWindow(
  state: FinanceState,
  nowYear: number,
  nowMonth: MonthNumber,
): FinanceState;
```

`advanceWindow` is pure — it receives the full state and returns an updated state. It calls itself recursively until the window is aligned with `nowYear`/`nowMonth`.

Wire through:

- `useFinanceState` — call `shouldAdvanceWindow` on mount; dispatch advance action if needed
- `useFinanceState` — add `advanceWindowMonth` action for the manual button
- `CategoryEditor` — add `propagation` field and conditional `installmentEndDate` picker
- `SettingsScreen` — replace `visibleMonthCount` input with window range display and `Avançar mês` button
- Storage migration in `src/storage/`

## Tests

Unit tests required for `windowAdvance.ts`:

- `shouldAdvanceWindow` returns false when window is current
- `shouldAdvanceWindow` returns true when current month is ahead by 1
- `shouldAdvanceWindow` returns true when current month is ahead by many months
- `advanceWindow` drops oldest month values and statuses
- `advanceWindow` fills new month with `fixed` propagation using last known value
- `advanceWindow` fills new month with `zero` propagation as zero
- `advanceWindow` fills new month with `installment` propagation using last known value before end date
- `advanceWindow` fills new month with `installment` propagation as zero after end date
- `advanceWindow` advances multiple steps correctly

## Acceptance Criteria

- App always shows 12 months starting from the current calendar month.
- On startup, if the current month is ahead of the window, the window advances automatically.
- Each category has a `Propagação` setting editable in the category editor.
- New months are filled according to the category propagation rule.
- `Parcelas` categories stop propagating values after `installmentEndDate`.
- The settings screen shows the current window range.
- The user can manually advance the window via a confirmed action.
- Existing data is migrated without data loss.
- TypeScript validation passes.
- Unit tests pass.
- README is updated if the implemented behavior is user-visible.
