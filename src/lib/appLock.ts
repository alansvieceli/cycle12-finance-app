export type AppLockSettings = {
  enabled: boolean;
  timeoutMinutes: number;
};

export const APP_LOCK_TIMEOUT_OPTIONS = [1, 3, 5, 10, 15] as const;

export const DEFAULT_APP_LOCK_SETTINGS: AppLockSettings = {
  enabled: false,
  timeoutMinutes: 3,
};

export function isValidAppLockTimeout(
  timeoutMinutes: number,
): timeoutMinutes is (typeof APP_LOCK_TIMEOUT_OPTIONS)[number] {
  return APP_LOCK_TIMEOUT_OPTIONS.includes(
    timeoutMinutes as (typeof APP_LOCK_TIMEOUT_OPTIONS)[number],
  );
}

export function normalizeAppLockSettings(
  settings: Partial<AppLockSettings> | undefined,
): AppLockSettings {
  return {
    enabled:
      typeof settings?.enabled === 'boolean'
        ? settings.enabled
        : DEFAULT_APP_LOCK_SETTINGS.enabled,
    timeoutMinutes: isValidAppLockTimeout(Number(settings?.timeoutMinutes))
      ? Number(settings?.timeoutMinutes)
      : DEFAULT_APP_LOCK_SETTINGS.timeoutMinutes,
  };
}

export function shouldLockAfterBackground({
  backgroundAt,
  now,
  timeoutMinutes,
}: {
  backgroundAt: number | null;
  now: number;
  timeoutMinutes: number;
}): boolean {
  if (backgroundAt === null || now < backgroundAt) {
    return false;
  }

  return now - backgroundAt >= timeoutMinutes * 60 * 1000;
}
