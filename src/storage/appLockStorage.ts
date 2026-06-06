import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  AppLockSettings,
  DEFAULT_APP_LOCK_SETTINGS,
  normalizeAppLockSettings,
} from '../lib/appLock';

const APP_LOCK_SETTINGS_STORAGE_KEY = '@cycle12-finance-app/app-lock/v1';

export async function loadAppLockSettings(): Promise<AppLockSettings> {
  const storedValue = await AsyncStorage.getItem(APP_LOCK_SETTINGS_STORAGE_KEY);

  if (!storedValue) {
    return DEFAULT_APP_LOCK_SETTINGS;
  }

  return normalizeAppLockSettings(JSON.parse(storedValue));
}

export async function saveAppLockSettings(settings: AppLockSettings): Promise<void> {
  await AsyncStorage.setItem(
    APP_LOCK_SETTINGS_STORAGE_KEY,
    JSON.stringify(normalizeAppLockSettings(settings)),
  );
}

export async function clearAppLockSettings(): Promise<void> {
  await AsyncStorage.removeItem(APP_LOCK_SETTINGS_STORAGE_KEY);
}
