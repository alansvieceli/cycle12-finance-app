import Constants, { ExecutionEnvironment } from 'expo-constants';

// expo-notifications' push-token registration throws at import time when
// running inside Expo Go on SDK 53+ (push notifications were removed from
// Expo Go). Local notifications still work in a dev/standalone build, so we
// only load the real module outside of Expo Go and fall back to a no-op
// stub there.
export const isNotificationsAvailable =
  Constants.executionEnvironment !== ExecutionEnvironment.StoreClient;

type NotificationsModule = typeof import('expo-notifications');

const noopAsync = async () => undefined as never;

const stub = {
  setNotificationHandler: () => undefined,
  getPermissionsAsync: async () => ({ status: 'undetermined' }) as never,
  requestPermissionsAsync: async () => ({ status: 'denied' }) as never,
  cancelAllScheduledNotificationsAsync: noopAsync,
  scheduleNotificationAsync: noopAsync,
  SchedulableTriggerInputTypes: { DATE: 'date' },
} as unknown as NotificationsModule;

export const Notifications: NotificationsModule = isNotificationsAvailable
  ? // eslint-disable-next-line @typescript-eslint/no-require-imports -- conditional load to avoid Expo Go crash
    (require('expo-notifications') as NotificationsModule)
  : stub;
