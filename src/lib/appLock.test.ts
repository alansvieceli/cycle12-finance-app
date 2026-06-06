import {
  APP_LOCK_TIMEOUT_OPTIONS,
  DEFAULT_APP_LOCK_SETTINGS,
  normalizeAppLockSettings,
  shouldLockAfterBackground,
} from './appLock';

describe('appLock helpers', () => {
  it('uses disabled app lock with a 3 minute timeout by default', () => {
    expect(DEFAULT_APP_LOCK_SETTINGS).toEqual({
      enabled: false,
      timeoutMinutes: 3,
    });
  });

  it('exposes the supported timeout options', () => {
    expect(APP_LOCK_TIMEOUT_OPTIONS).toEqual([1, 3, 5, 10, 15]);
  });

  it('normalizes invalid settings to defaults', () => {
    expect(
      normalizeAppLockSettings({
        enabled: true,
        timeoutMinutes: 99,
      }),
    ).toEqual({
      enabled: true,
      timeoutMinutes: 3,
    });
  });

  it('does not lock when returning before the timeout', () => {
    expect(
      shouldLockAfterBackground({
        backgroundAt: 1_000,
        now: 60_999,
        timeoutMinutes: 1,
      }),
    ).toBe(false);
  });

  it('locks when returning after the timeout', () => {
    expect(
      shouldLockAfterBackground({
        backgroundAt: 1_000,
        now: 61_000,
        timeoutMinutes: 1,
      }),
    ).toBe(true);
  });

  it('does not lock without a background timestamp', () => {
    expect(
      shouldLockAfterBackground({
        backgroundAt: null,
        now: 61_000,
        timeoutMinutes: 1,
      }),
    ).toBe(false);
  });
});
