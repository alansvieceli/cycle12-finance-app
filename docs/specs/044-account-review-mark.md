# Spec 044 - Account Review Mark

## Goal

Let the user mark, in `Planejar`, that an account's current-month value was checked and scheduled, and see that mark on each account row in `Pagamentos`. The mark resets by itself when the planning window advances, so every month starts with nothing reviewed.

## Context

Every month the user opens `Planejar`, goes account by account, schedules the payment at the bank, and confirms the value for the current month. Nothing in the app records that pass, so there is no way to tell which accounts were already handled — the user has to cycle through the account selector and remember.

`Pagamentos` (reached from the `Detalhes` button on the `Pagamentos do mês` card in `Resumo`) is the only screen that already lists current-month accounts one per row, which makes it the natural place to see the result of that pass.

The app already stores a per-account, per-month record: `MonthlyPaymentStatus` (`accountItemId`, `month`, `year`, `isPaid`). `advanceWindow` already drops the records of the month leaving the window, one step per month advanced.

## Non-Goals

- No month-level "everything reviewed" check and no "8 of 12" counter. Only the per-account mark.
- The mark does not appear in Projeção, the month `Detalhes` panel, Histórico, or Gráficos.
- The mark changes no calculation: expenses, commitment, surplus, paid/pending, account balance, and due-date reminders all behave exactly as today.
- `Pagamentos` shows the mark but cannot change it. `Planejar` is the only place that toggles it.
- Editing a value does not clear the mark.
- No new setting, no new screen, no backup format version bump.

## UX Behavior

### Planejar

The account selector row becomes a horizontal row: the existing `SelectField` takes the remaining width and a 44x44 review button sits at its right.

- Not reviewed: `surfaceMuted` background, `borderStrong` border, `checkmark` icon in `textSecondary`.
- Reviewed: `info` background and border, `checkmark` icon in `accentText`.
- Tapping toggles the mark for the selected account in the current month. Tapping again clears it.
- `accessibilityLabel`: `Marcar conta como revisada` when unmarked, `Desmarcar conta revisada` when marked.

The account list inside the selector shows the same blue mark on the accounts already reviewed, so the user can see what is left without opening each account. Every other `SelectField` usage (category pickers, installments) renders exactly as today.

The mark applies to the current month only — the month with the `Atual` badge, which is always the first row of the planning window. The 12-month list itself does not change.

### Pagamentos

Each payment row gains a fixed 24px column between the account name block and the amount, so the amounts stay aligned with each other:

- Reviewed: 24x24 rounded square filled with `info`, `checkmark` icon in `accentText`.
- Not reviewed: 24x24 rounded square with a dashed `border` outline and nothing inside.

The column is present on every row, reviewed or not, so the eye can scan straight down it and the missing ones read as gaps. It is display-only — no press handler.

Blue (`info`) instead of green because green already means **paid** on that screen (row border and amount color), and the two states are independent: an account can be paid and not reviewed, or reviewed and not paid.

### Reset

When the planning window advances, the records of the month that left the window are discarded, which clears every review mark. Advancing several months at once behaves the same, since `advanceWindow` runs one step per month. This needs no new code — it is what `advanceWindow` already does with `paymentStatuses`.

## Implementation Notes

### Data

`MonthlyPaymentStatus` gains an optional field:

```ts
/** Monthly status of an account: paid state and whether its value was reviewed. */
export type MonthlyPaymentStatus = {
  accountItemId: string;
  month: MonthNumber;
  year: number;
  isPaid: boolean;
  isReviewed?: boolean;
};
```

The record is the per-account, per-month status of an account, not payment alone. The comment on the type says so, and `docs/app-context.md` is updated to match. The storage key and `BACKUP_FORMAT_VERSION` do not change.

Absent `isReviewed` means not reviewed, so existing stored state and existing `.c12f` backups keep working untouched.

### Helpers

Two pure functions in `src/lib/financeCalculations.ts`, next to `isAccountItemPaid`:

```ts
export function isAccountItemReviewed(
  paymentStatuses: MonthlyPaymentStatus[],
  accountItemId: string,
  projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
): boolean;

export function toggleAccountReview(
  paymentStatuses: MonthlyPaymentStatus[],
  accountItemId: string,
  projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
): MonthlyPaymentStatus[];
```

`toggleAccountReview` is pure and returns a new array so its two branches — create a record with `isPaid: false, isReviewed: true` when none exists, flip `isReviewed` when one does — are unit tested. That is the branch the existing inline `toggleMonthlyPaymentStatus` has never had covered.

`useFinanceState` exposes `toggleMonthlyReviewStatus(accountItemId, projectionMonth)`, which is a `setFinanceState` call delegating to the helper.

### Wiring

- `PlanningScreen` already receives the whole `finance` object and the full window, so it forwards `financeState.paymentStatuses` and `actions.toggleMonthlyReviewStatus` without any new prop from `FinanceApp`.
- `MonthlyValueEditor` gains `paymentStatuses` and `onToggleReview`, and renders the button beside the selector. It derives the current month from the `projectionMonths` it already receives (the entry flagged `isCurrentMonth`, which is also the row it already badges as `Atual`) — no extra prop for the month.
- `SelectField`'s `SelectOption` gains an optional `marked?: boolean` that renders the blue mark at the start of the option row, before the existing color dot. Options without it render as today.
- `CurrentMonthPaymentChecklist` already receives `paymentStatuses` and `projectionMonth`; it only needs the new column in the row.

### Backup

`validatePaymentStatuses` accepts `isReviewed` when it is a boolean and drops it otherwise, mirroring how `dueDay` is handled in `validateMonthHistory`. A backup written by an older build has no field and restores as not reviewed.

### Documentation

`docs/app-context.md` gets: the review mark in the `Planejar` and `Pagamentos` sections, and the "Payment status" data concept reworded to cover both flags and to state that the review mark resets when the window advances.

## Tests

- `isAccountItemReviewed`: true for a record with `isReviewed: true`; false when the field is absent, when the record belongs to another month, and when it belongs to another account.
- `toggleAccountReview`: creates a record with `isPaid: false, isReviewed: true` when none exists; flips an existing record without touching its `isPaid`; leaves other accounts and months untouched.
- `windowAdvance.test.ts`: a review mark on the month leaving the window is gone after advancing, and a mark on a later month survives.
- `financeBackup.test.ts`: a round trip preserves `isReviewed`; a payload without the field restores as not reviewed.
- `MonthlyValueEditor.test.tsx`: pressing the review button calls `onToggleReview` with the selected account and the current month, and the button's accessibility label reflects the current state.

## Acceptance Criteria

- In `Planejar`, a 44x44 button beside the account selector toggles the review mark for the selected account in the current month, and shows blue when marked.
- The account list inside the selector shows the mark on already-reviewed accounts.
- In `Pagamentos`, every row shows a fixed-width column before the amount: a filled blue mark when reviewed, a dashed empty square when not. It is not tappable.
- Marking or unmarking changes no value, no total, no paid/pending state, and no reminder.
- Editing a monthly value leaves the mark as it is.
- After the planning window advances, every account reads as not reviewed.
- Existing stored state and existing `.c12f` backups load without error and read as not reviewed.
- `docs/app-context.md` describes the mark.
- `npm run check` passes.

## Validation

```bash
npm run check
```
