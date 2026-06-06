import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

import {
  AppLockSettings,
  DEFAULT_APP_LOCK_SETTINGS,
  shouldLockAfterBackground,
} from '../lib/appLock';
import { loadAppLockSettings, saveAppLockSettings } from '../storage/appLockStorage';

type EnableAppLockResult =
  | { success: true }
  | {
      reason: 'not_available' | 'not_enrolled' | 'authentication_failed' | 'unknown';
      success: false;
    };

export type AppLockState = {
  enabled: boolean;
  isInitializing: boolean;
  locked: boolean;
  setEnabled: (enabled: boolean) => Promise<EnableAppLockResult>;
  setTimeoutMinutes: (timeoutMinutes: number) => Promise<void>;
  timeoutMinutes: number;
  unlock: () => Promise<boolean>;
};

const AUTH_PROMPT_OPTIONS: LocalAuthentication.LocalAuthenticationOptions = {
  cancelLabel: 'Cancelar',
  fallbackLabel: 'Usar senha',
  promptDescription: 'Confirme sua identidade para acessar o Cycle12 Finance.',
  promptMessage: 'Desbloquear Cycle12 Finance',
  promptSubtitle: 'Use a biometria do aparelho',
};

export function useAppLock(): AppLockState {
  const [settings, setSettings] = useState<AppLockSettings>(DEFAULT_APP_LOCK_SETTINGS);
  const [isInitializing, setIsInitializing] = useState(true);
  const [locked, setLocked] = useState(false);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const backgroundAtRef = useRef<number | null>(null);
  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      const loadedSettings = await loadAppLockSettings();

      if (!isMounted) {
        return;
      }

      setSettings(loadedSettings);
      setLocked(loadedSettings.enabled);
      setIsInitializing(false);
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const previousAppState = appStateRef.current;

      if (nextAppState === 'background' || nextAppState === 'inactive') {
        backgroundAtRef.current = Date.now();
      }

      if (
        nextAppState === 'active' &&
        (previousAppState === 'background' || previousAppState === 'inactive')
      ) {
        const currentSettings = settingsRef.current;

        if (
          currentSettings.enabled &&
          shouldLockAfterBackground({
            backgroundAt: backgroundAtRef.current,
            now: Date.now(),
            timeoutMinutes: currentSettings.timeoutMinutes,
          })
        ) {
          setLocked(true);
        }

        backgroundAtRef.current = null;
      }

      appStateRef.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  const unlock = useCallback(async () => {
    const result = await LocalAuthentication.authenticateAsync(AUTH_PROMPT_OPTIONS);

    if (result.success) {
      setLocked(false);
      return true;
    }

    return false;
  }, []);

  const setEnabled = useCallback(
    async (enabled: boolean): Promise<EnableAppLockResult> => {
      if (!enabled) {
        const nextSettings = {
          ...settingsRef.current,
          enabled: false,
        };

        await saveAppLockSettings(nextSettings);
        setSettings(nextSettings);
        setLocked(false);
        return { success: true };
      }

      const hasHardware = await LocalAuthentication.hasHardwareAsync();

      if (!hasHardware) {
        return { reason: 'not_available', success: false };
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!isEnrolled) {
        return { reason: 'not_enrolled', success: false };
      }

      const result = await LocalAuthentication.authenticateAsync(AUTH_PROMPT_OPTIONS);

      if (!result.success) {
        return {
          reason:
            result.error === 'not_available' ||
            result.error === 'not_enrolled' ||
            result.error === 'authentication_failed'
              ? result.error
              : 'authentication_failed',
          success: false,
        };
      }

      const nextSettings = {
        ...settingsRef.current,
        enabled: true,
      };

      await saveAppLockSettings(nextSettings);
      setSettings(nextSettings);
      setLocked(false);

      return { success: true };
    },
    [],
  );

  const setTimeoutMinutes = useCallback(async (timeoutMinutes: number) => {
    const nextSettings = {
      ...settingsRef.current,
      timeoutMinutes,
    };

    await saveAppLockSettings(nextSettings);
    setSettings(nextSettings);
  }, []);

  return {
    enabled: settings.enabled,
    isInitializing,
    locked,
    setEnabled,
    setTimeoutMinutes,
    timeoutMinutes: settings.timeoutMinutes,
    unlock,
  };
}
