# Task 034-04 - Add syncReminders Side-Effecting Function

Status: Done

## Spec

`docs/specs/034-due-date-reminders.md`

## Plan

`docs/plans/034-due-date-reminders-plan.md`

## Goal

Add a `syncReminders` function that cancels all previously scheduled app reminders and, if reminders are enabled and permission is granted, reschedules one notification per day returned by `buildDueReminders`.

## Files

- Create: `src/lib/syncReminders.ts`

## Steps

1. Create `src/lib/syncReminders.ts`:

```ts
import * as Notifications from 'expo-notifications';

import { AccountItem, MonthlyPaymentStatus, MonthlyValue } from '../types/finance';
import { buildDueReminders } from './reminders';
import { ReminderSettings } from './reminders';

export async function syncReminders(
  accountItems: AccountItem[],
  monthlyValues: MonthlyValue[],
  paymentStatuses: MonthlyPaymentStatus[],
  settings: ReminderSettings,
  hasPermission: boolean,
  fromDate: Date = new Date(),
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!settings.enabled || !hasPermission) {
    return;
  }

  const reminders = buildDueReminders(
    accountItems,
    monthlyValues,
    paymentStatuses,
    settings,
    fromDate,
  );

  for (const reminder of reminders) {
    const triggerDate = new Date(
      reminder.date.getFullYear(),
      reminder.date.getMonth(),
      reminder.date.getDate(),
      settings.hour,
      settings.minute,
      0,
      0,
    );

    if (triggerDate.getTime() <= Date.now()) {
      continue;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Vencimentos próximos',
        body: `${reminder.count} conta(s) vencem em até ${settings.daysBefore} dia(s) — R$ ${reminder.pendingTotal.toFixed(2)} pendente`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });
  }
}
```

Adjust the `Notifications.scheduleNotificationAsync` trigger shape to match the installed `expo-notifications` version's types (check `Notifications.SchedulableTriggerInputTypes` exists; if not, use the date-trigger shape documented for the installed version).

Note: `Notifications.cancelAllScheduledNotificationsAsync()` cancels every notification scheduled by this app (the app schedules nothing else), satisfying "cancels all previously scheduled reminders owned by the app".

2. Run `npx tsc --noEmit` and confirm no type errors.

## Acceptance Criteria

- `syncReminders` always cancels previously scheduled notifications first.
- If `settings.enabled` is false or `hasPermission` is false, no notifications remain scheduled after the call.
- Otherwise, one notification is scheduled per day returned by `buildDueReminders`, at the configured hour/minute, with title `Vencimentos próximos` and the specified body format.
- Notifications whose trigger time has already passed for `fromDate`'s day are not scheduled.
- TypeScript compilation passes.
