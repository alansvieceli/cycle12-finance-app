# Task 034-03 - Add buildDueReminders Helper with Tests

Status: Done

## Spec

`docs/specs/034-due-date-reminders.md`

## Plan

`docs/plans/034-due-date-reminders-plan.md`

## Goal

Add a pure `buildDueReminders(accountItems, monthlyValues, paymentStatuses, settings, fromDate)` helper in `src/lib/reminders.ts` that, for each of the next 14 days from `fromDate`, returns a payload (date, count, pendingTotal) for days with at least one unpaid current-window account item with a value whose due date is within `daysBefore` days.

## Files

- Modify: `src/lib/reminders.ts`
- Create: `src/lib/reminders.test.ts`

## Steps

1. In `src/lib/reminders.ts`, add the helper. Reuse `getMonthlyValueAmount` and `isAccountItemPaid` from `src/lib/financeCalculations.ts`.

```ts
import { AccountItem, MonthlyPaymentStatus, MonthlyValue } from '../types/finance';
import { getMonthlyValueAmount, isAccountItemPaid } from './financeCalculations';

const REMINDER_HORIZON_DAYS = 14;

export type DueReminderPayload = {
  date: Date;
  count: number;
  pendingTotal: number;
};

export function buildDueReminders(
  accountItems: AccountItem[],
  monthlyValues: MonthlyValue[],
  paymentStatuses: MonthlyPaymentStatus[],
  settings: ReminderSettings,
  fromDate: Date,
): DueReminderPayload[] {
  const payloads: DueReminderPayload[] = [];

  for (let offset = 0; offset < REMINDER_HORIZON_DAYS; offset += 1) {
    const day = new Date(
      fromDate.getFullYear(),
      fromDate.getMonth(),
      fromDate.getDate() + offset,
    );

    let count = 0;
    let pendingTotal = 0;

    for (const accountItem of accountItems) {
      // A due date "falls within daysBefore days of `day`" when the due date
      // is between `day` and `day + daysBefore` (inclusive).
      for (let lead = 0; lead <= settings.daysBefore; lead += 1) {
        const dueDate = new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate() + lead,
        );

        if (dueDate.getDate() !== accountItem.dueDay) {
          continue;
        }

        const projectionMonth = {
          month: dueDate.getMonth() + 1,
          year: dueDate.getFullYear(),
        };
        const amount = getMonthlyValueAmount(
          monthlyValues,
          accountItem.id,
          projectionMonth,
        );

        if (amount <= 0) {
          continue;
        }

        if (isAccountItemPaid(paymentStatuses, accountItem.id, projectionMonth)) {
          continue;
        }

        count += 1;
        pendingTotal += amount;
        break;
      }
    }

    if (count > 0) {
      payloads.push({ date: day, count, pendingTotal });
    }
  }

  return payloads;
}
```

Note: re-derive the exact "within `daysBefore` days" semantics from the spec's tests (item 2) — `daysBefore = 0` must produce a reminder only on the due day itself, and `daysBefore = 1` must produce a reminder the day before the due date. Adjust the loop bounds/direction above if needed to satisfy both cases; write the tests first if that helps pin down the semantics (TDD).

2. Create `src/lib/reminders.test.ts` covering:

- Returns a payload only for days that have at least one pending account in the look-ahead window.
- `daysBefore = 0` produces a reminder only on the due day itself.
- `daysBefore = 1` produces a reminder the day before the due date.
- Paid accounts are excluded from counts and pending totals.
- Accounts with no value for the month are excluded.
- Pending total equals the sum of the qualifying accounts' amounts.
- Horizon is bounded to 14 days (no payloads beyond day 13).

3. Run `npm test -- reminders` and confirm all tests pass.

4. Run `npx tsc --noEmit` and confirm no type errors.

## Acceptance Criteria

- `buildDueReminders` is pure and reuses `getMonthlyValueAmount` / `isAccountItemPaid`.
- All cases from the spec's "Tests" section are covered and pass.
- TypeScript compilation passes.
