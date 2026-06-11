# Plan 034 - Due Date Reminders

Status: Done

## Spec

`docs/specs/034-due-date-reminders.md`

## Objective

Add optional, fully-local due-date reminders. The user configures days-before and time of day in a new `Lembretes` section in `Ajustes`; on-device notifications summarize pending accounts coming due. Settings persist separately from finance data (like app-lock) and are excluded from `.c12f` backup. Scheduling is bounded to a 14-day horizon and re-synced on relevant changes.

## Tasks

| Task   | File                                                  | Purpose                                                                                                    |
| ------ | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 034-01 | `docs/tasks/034-01-add-notifications-dependency.md`   | Add `expo-notifications`, configure the notification handler at app startup.                               |
| 034-02 | `docs/tasks/034-02-add-reminder-settings-storage.md`  | Add `ReminderSettings` type/normalizer (`src/lib/reminders.ts`) and AsyncStorage module, app-lock pattern. |
| 034-03 | `docs/tasks/034-03-add-build-due-reminders.md`        | Add pure `buildDueReminders` helper with unit tests.                                                       |
| 034-04 | `docs/tasks/034-04-add-sync-reminders.md`             | Add side-effecting `syncReminders` (cancel + reschedule using helper output and permission state).         |
| 034-05 | `docs/tasks/034-05-add-reminders-hook-and-section.md` | Add `useReminders` hook and a `Lembretes` section in `Ajustes` wired to settings + permission flow.        |
| 034-06 | `docs/tasks/034-06-wire-sync-triggers.md`             | Trigger `syncReminders` on app start, settings change, finance data changes, and window advance.           |
| 034-07 | `docs/tasks/034-07-update-docs-and-validate.md`       | Update `docs/app-context.md` and `README.md` (new dependency + behavior), run full validation.             |

## Settings (034-02)

`src/lib/reminders.ts` exports the type, defaults, and normalizer (mirror `src/lib/appLock.ts`); storage module mirrors `src/storage/appLockStorage.ts` with its own AsyncStorage key (e.g. `@cycle12-finance-app/reminders/v1`):

```ts
type ReminderSettings = {
  enabled: boolean; // default false
  daysBefore: number; // 0..7, default 1 (0 = on the due day)
  hour: number; // 0..23, default 9
  minute: number; // 0..59, default 0
};
```

## Helper Shape (034-03)

```ts
buildDueReminders(
  accountItems: AccountItem[],
  monthlyValues: MonthlyValue[],
  paymentStatuses: MonthlyPaymentStatus[],
  settings: ReminderSettings,
  fromDate: Date,
): { date: Date; count: number; pendingTotal: number }[];
```

- For each of the next 14 days from `fromDate`, count unpaid current-window account items with a value whose due date is within `daysBefore` days of that day; sum their pending amounts. Emit a payload only for days with at least one qualifying account.
- Reuse `getMonthlyValueAmount` / `isAccountItemPaid` from `src/lib/financeCalculations.ts`; account `dueDay` maps onto each candidate day's month.

## syncReminders (034-04)

1. Cancel all app-scheduled reminders.
2. If disabled or permission not granted, stop (leave none scheduled).
3. Call `buildDueReminders` for the 14-day horizon.
4. Schedule one notification per returned day at the configured hour/minute, title `Vencimentos próximos`, body `N conta(s) vencem em até X dia(s) — R$ Y pendente`.

## Notes

- `expo-notifications` is the justified single new dependency (no backend/account/paid service). Configure the handler once at startup (in `App.tsx` or `FinanceApp.tsx`).
- `useReminders` hook mirrors `useAppLock`: loads settings, exposes `enabled` / `daysBefore` / `hour` / `minute` setters, requests OS permission on enable, and reverts to off with an explanatory hint when permission is denied. `daysBefore` and time controls are disabled while reminders are off.
- Wire `Lembretes` as a sibling section to `Segurança` in `SettingsScreen.tsx`; the section triggers `syncReminders` on change and on permission grant.
- Trigger `syncReminders` from the finance-state load and mutation paths and on window advance — the hook subscribes to the relevant finance inputs (`accountItems`, due days, `monthlyValues`, `paymentStatuses`, window start) and re-syncs when they change.
- Notification monetary amounts are always real values; the `valuesHidden` eye toggle is session-only and does not affect OS notifications (documented behavior).
- No backend, no notification center/history, no paid-account notifications. Reminder settings are **not** part of `FinanceState` and are excluded from `.c12f` backup. No finance data-model change.

## Tests (034-03)

- Payload only for days with at least one pending account in the look-ahead window.
- `daysBefore = 0` → reminder only on the due day itself.
- `daysBefore = 1` → reminder the day before the due date.
- Paid accounts excluded from counts and totals.
- Accounts with no value for the month excluded.
- Pending total equals the sum of qualifying accounts' amounts.
- Horizon bounded to 14 days.

## Validation

- `npm run check`
- `npm test`
