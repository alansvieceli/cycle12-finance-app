# Task 034-02 - Add Reminder Settings Type and Storage

Status: Done

## Spec

`docs/specs/034-due-date-reminders.md`

## Plan

`docs/plans/034-due-date-reminders-plan.md`

## Goal

Add the `ReminderSettings` type, defaults, and a normalizer in `src/lib/reminders.ts`, plus an AsyncStorage module mirroring `src/lib/appLock.ts` / `src/storage/appLockStorage.ts`. These settings are device-only and excluded from `.c12f` backup.

## Files

- Create: `src/lib/reminders.ts`
- Create: `src/storage/remindersStorage.ts`

## Steps

1. Create `src/lib/reminders.ts`:

```ts
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
```

2. Create `src/storage/remindersStorage.ts`, mirroring `src/storage/appLockStorage.ts`:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  DEFAULT_REMINDER_SETTINGS,
  normalizeReminderSettings,
  ReminderSettings,
} from '../lib/reminders';

const REMINDER_SETTINGS_STORAGE_KEY = '@cycle12-finance-app/reminders/v1';

export async function loadReminderSettings(): Promise<ReminderSettings> {
  const storedValue = await AsyncStorage.getItem(REMINDER_SETTINGS_STORAGE_KEY);

  if (!storedValue) {
    return DEFAULT_REMINDER_SETTINGS;
  }

  return normalizeReminderSettings(JSON.parse(storedValue));
}

export async function saveReminderSettings(settings: ReminderSettings): Promise<void> {
  await AsyncStorage.setItem(
    REMINDER_SETTINGS_STORAGE_KEY,
    JSON.stringify(normalizeReminderSettings(settings)),
  );
}
```

3. Run `npx tsc --noEmit` and confirm no type errors.

## Acceptance Criteria

- `ReminderSettings`, `DEFAULT_REMINDER_SETTINGS`, `REMINDER_DAYS_BEFORE_OPTIONS`, and `normalizeReminderSettings` are exported from `src/lib/reminders.ts`.
- Defaults: disabled, `daysBefore = 1`, `hour = 9`, `minute = 0`.
- `normalizeReminderSettings` clamps/falls back to defaults for invalid input.
- `remindersStorage.ts` persists settings under their own AsyncStorage key, separate from finance data and app-lock settings.
- Reminder settings are not part of `FinanceState` and are not touched by `.c12f` export/import.
- TypeScript compilation passes.
