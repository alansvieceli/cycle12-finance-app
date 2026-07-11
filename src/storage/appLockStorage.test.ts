import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_APP_LOCK_SETTINGS } from '../lib/appLock';
import {
  clearAppLockSettings,
  loadAppLockSettings,
  saveAppLockSettings,
} from './appLockStorage';

describe('appLockStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('loads default app lock settings when storage has no value', async () => {
    await expect(loadAppLockSettings()).resolves.toEqual(DEFAULT_APP_LOCK_SETTINGS);
  });

  it('saves and loads app lock settings', async () => {
    const settings = {
      enabled: true,
      timeoutMinutes: 5,
    };

    await saveAppLockSettings(settings);

    await expect(loadAppLockSettings()).resolves.toEqual(settings);
  });

  it('normalizes invalid saved timeout values', async () => {
    await AsyncStorage.setItem(
      '@cycle12-finance-app/app-lock/v1',
      JSON.stringify({
        enabled: true,
        timeoutMinutes: 99,
      }),
    );

    await expect(loadAppLockSettings()).resolves.toEqual({
      enabled: true,
      timeoutMinutes: 3,
    });
  });

  it('clears app lock settings', async () => {
    await saveAppLockSettings({
      enabled: true,
      timeoutMinutes: 10,
    });

    await clearAppLockSettings();

    await expect(loadAppLockSettings()).resolves.toEqual(DEFAULT_APP_LOCK_SETTINGS);
  });
});
