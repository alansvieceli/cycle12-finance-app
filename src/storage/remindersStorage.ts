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
