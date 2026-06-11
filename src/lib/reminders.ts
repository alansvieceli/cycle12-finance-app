import {
  AccountItem,
  MonthlyPaymentStatus,
  MonthlyValue,
  MonthNumber,
} from '../types/finance';
import { getMonthlyValueAmount, isAccountItemPaid } from './financeCalculations';

export type ReminderSettings = {
  enabled: boolean;
  daysBefore: number;
  hour: number;
  minute: number;
};

export const REMINDER_DAYS_BEFORE_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7] as const;

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  enabled: false,
  daysBefore: 1,
  hour: 9,
  minute: 0,
};

const REMINDER_HORIZON_DAYS = 14;

export function isValidReminderDaysBefore(
  daysBefore: number,
): daysBefore is (typeof REMINDER_DAYS_BEFORE_OPTIONS)[number] {
  return REMINDER_DAYS_BEFORE_OPTIONS.includes(
    daysBefore as (typeof REMINDER_DAYS_BEFORE_OPTIONS)[number],
  );
}

export function normalizeReminderSettings(
  settings: Partial<ReminderSettings> | undefined,
): ReminderSettings {
  const daysBefore = Number(settings?.daysBefore);
  const hour = Number(settings?.hour);
  const minute = Number(settings?.minute);

  return {
    enabled:
      typeof settings?.enabled === 'boolean'
        ? settings.enabled
        : DEFAULT_REMINDER_SETTINGS.enabled,
    daysBefore: isValidReminderDaysBefore(daysBefore)
      ? daysBefore
      : DEFAULT_REMINDER_SETTINGS.daysBefore,
    hour:
      Number.isInteger(hour) && hour >= 0 && hour <= 23
        ? hour
        : DEFAULT_REMINDER_SETTINGS.hour,
    minute:
      Number.isInteger(minute) && minute >= 0 && minute <= 59
        ? minute
        : DEFAULT_REMINDER_SETTINGS.minute,
  };
}

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
      let isQualifying = false;

      // The due date is reachable from `day` by waiting up to `daysBefore`
      // days, i.e. dueDate is in [day, day + daysBefore].
      for (let lead = 0; lead <= settings.daysBefore; lead += 1) {
        const dueDate = new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate() + lead,
        );

        if (dueDate.getDate() === accountItem.dueDay) {
          isQualifying = true;
          break;
        }
      }

      if (!isQualifying) {
        continue;
      }

      // dueDate's month/year is the same as `day`'s for the matching lead
      // (recompute using the matching lead to get the right projection month).
      let matchedDueDate: Date | null = null;
      for (let lead = 0; lead <= settings.daysBefore; lead += 1) {
        const dueDate = new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate() + lead,
        );

        if (dueDate.getDate() === accountItem.dueDay) {
          matchedDueDate = dueDate;
          break;
        }
      }

      if (!matchedDueDate) {
        continue;
      }

      const projectionMonth = {
        month: (matchedDueDate.getMonth() + 1) as MonthNumber,
        year: matchedDueDate.getFullYear(),
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
    }

    if (count > 0) {
      payloads.push({ date: day, count, pendingTotal });
    }
  }

  return payloads;
}
