# Spec 034 - Due Date Reminders

## Goal

Add optional local notifications that remind the user about upcoming account due dates. The user configures how many days before the due date to be warned and at what time of day. Reminders summarize the pending accounts coming due, turning the app from a passive planner into an active assistant — all on-device, with no backend.

## Context

Every `AccountItem` already has a `dueDay`. The app currently does nothing with it beyond showing "Próximo venc." in `Resumo`. Users have to open the app to remember what is coming due, so bills can slip.

A local reminder ("3 contas vencem amanhã — R$ X pendente") closes that gap. It must follow the app's principles: local-first, optional, off by default, and privacy-respecting — mirroring how the biometric app lock is modeled.

## Non-Goals

- Do not add remote/push notifications or any backend.
- Do not add a notification center or in-app reminder history.
- Do not notify about paid accounts.
- Do not include reminder settings in the `.c12f` finance backup payload (they are device settings, like app-lock settings).
- Do not change the finance data model (`FinanceState`).
- Do not add reminders for anything other than account due dates.

## Dependency

This feature requires `expo-notifications`. It is justified despite the "avoid unnecessary dependencies" constraint because it is the standard, fully local Expo API for scheduling on-device notifications and there is no other way to deliver the feature. No backend, account, or paid service is introduced. Add `expo-notifications` to the project.

## Settings

New local reminder settings, stored on-device through AsyncStorage **separately** from finance data (same separation pattern as app-lock settings — excluded from `.c12f` backup):

```ts
type ReminderSettings = {
  enabled: boolean; // default false
  daysBefore: number; // 0..7, default 1 (0 = on the due day itself)
  hour: number; // 0..23, default 9
  minute: number; // 0..59, default 0
};
```

Defaults: disabled, 1 day before, 09:00.

## UX Behavior

### Ajustes — new "Lembretes" section

A `Lembretes` section in `Ajustes` (sibling to `Segurança`) with:

- a toggle `Lembrar vencimentos` (off by default),
- a `Avisar com antecedência` selector (0–7 days; "no dia", "1 dia antes", … "7 dias antes"),
- a time picker for the reminder hour/minute.

Enabling requests OS notification permission. If permission is denied, the toggle reverts to off and a hint explains it must be granted in system settings. The `daysBefore` and time controls are disabled while reminders are off.

### Notification content

When fired, a reminder is a summary for that day's look-ahead window:

- Title: `Vencimentos próximos`.
- Body: `N conta(s) vencem em até X dia(s) — R$ Y pendente`, where N counts current-window account items with a value that are unpaid and whose due date falls within `daysBefore` days, and Y is the sum of their pending amounts.
- If no pending accounts fall in the window for a given day, no notification is shown for that day.

Monetary amounts in notifications are always real values (the in-app eye toggle is session-only and does not apply to OS notifications); this is acceptable and documented.

## Scheduling Logic

Because notification content is dynamic (counts/amounts change as data changes), reminders are scheduled ahead in a bounded horizon and re-synced whenever inputs change.

A `syncReminders` routine:

1. Cancels all previously scheduled reminders owned by the app.
2. If reminders are disabled or permission is not granted, stops (leaving none scheduled).
3. For each of the next 14 days, computes the set of unpaid current-window account items whose due date is within `daysBefore` days of that day, and the pending total.
4. For each day with at least one such account, schedules one notification at the configured hour/minute with the summary content above.

`syncReminders` runs:

- on app start (after finance data loads),
- when reminder settings change,
- when accounts, due days, monthly values, or payment statuses change,
- when the planning window advances.

Scheduling is bounded to 14 days to keep the OS queue small; re-syncing on app start keeps it rolling.

## Implementation Notes

- Add `expo-notifications` and configure the notification handler at app startup.
- Add `ReminderSettings` type and a storage module for it, persisted separately from finance data (follow the existing app-lock settings storage pattern).
- Add a pure helper, `buildDueReminders(accountItems, monthlyValues, paymentStatuses, settings, fromDate)`, that returns the per-day reminder payloads (date + count + pending total) for the 14-day horizon. Keep it pure for unit testing; the `expo-notifications` scheduling call consumes its output.
- Add a `syncReminders` side-effecting function that cancels and reschedules using the helper output and the permission state.
- Add a `Lembretes` section component in `Ajustes`, wired to the reminder settings and triggering `syncReminders` on change and on permission grant.
- Trigger `syncReminders` from the finance-state load and mutation paths and from window advance.
- The eye toggle (`valuesHidden`) does not affect OS notification content.

## Tests

Unit tests for `buildDueReminders`:

- Returns a payload only for days that have at least one pending account in the look-ahead window.
- `daysBefore = 0` produces a reminder only on the due day itself.
- `daysBefore = 1` produces a reminder the day before the due date.
- Paid accounts are excluded from counts and pending totals.
- Accounts with no value for the month are excluded.
- Pending total equals the sum of the qualifying accounts' amounts.
- Horizon is bounded to 14 days.

## Acceptance Criteria

- A `Lembretes` section appears in `Ajustes`, disabled by default.
- Enabling requests OS notification permission; denial keeps the feature off with an explanatory hint.
- The user can set days-before (0–7) and the time of day.
- When enabled and permitted, on-device notifications fire at the configured time summarizing pending accounts due within the configured window.
- No notification is shown on days with no qualifying accounts.
- Paid accounts never appear in reminders.
- Reminder settings persist locally and are excluded from `.c12f` backup/restore.
- Reminders re-sync on app start, on settings change, on relevant finance data changes, and on window advance.
- The feature adds no backend and works fully offline.
- TypeScript validation passes.
- Unit tests pass.

## Validation

```bash
npm run check
npm test
```
