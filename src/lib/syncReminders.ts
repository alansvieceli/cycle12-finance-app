import type { AccountItem, MonthlyPaymentStatus, MonthlyValue } from '../types/finance';
import { Notifications } from './notifications';
import { buildDueReminders, type ReminderSettings } from './reminders';

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
