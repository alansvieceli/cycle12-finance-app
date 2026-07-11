import { useCallback, useEffect, useState } from 'react';

import { Notifications } from '../lib/notifications';
import { DEFAULT_REMINDER_SETTINGS, type ReminderSettings } from '../lib/reminders';
import {
  loadReminderSettings,
  saveReminderSettings,
} from '../storage/remindersStorage';

type SetEnabledResult =
  | { success: true }
  | { success: false; reason: 'permission_denied' };

export type RemindersState = {
  settings: ReminderSettings;
  isInitializing: boolean;
  setEnabled: (enabled: boolean) => Promise<SetEnabledResult>;
  setDaysBefore: (daysBefore: number) => Promise<void>;
  setTime: (hour: number, minute: number) => Promise<void>;
};

export function useReminders(): RemindersState {
  const [settings, setSettings] = useState<ReminderSettings>(DEFAULT_REMINDER_SETTINGS);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const loaded = await loadReminderSettings();

      if (!isMounted) {
        return;
      }

      setSettings(loaded);
      setIsInitializing(false);
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const persist = useCallback(async (next: ReminderSettings) => {
    await saveReminderSettings(next);
    setSettings(next);
  }, []);

  const setEnabled = useCallback(
    async (enabled: boolean): Promise<SetEnabledResult> => {
      if (!enabled) {
        await persist({ ...settings, enabled: false });
        return { success: true };
      }

      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== 'granted') {
        await persist({ ...settings, enabled: false });
        return { success: false, reason: 'permission_denied' };
      }

      await persist({ ...settings, enabled: true });
      return { success: true };
    },
    [persist, settings],
  );

  const setDaysBefore = useCallback(
    async (daysBefore: number) => {
      await persist({ ...settings, daysBefore });
    },
    [persist, settings],
  );

  const setTime = useCallback(
    async (hour: number, minute: number) => {
      await persist({ ...settings, hour, minute });
    },
    [persist, settings],
  );

  return { settings, isInitializing, setEnabled, setDaysBefore, setTime };
}
