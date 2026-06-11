# Task 034-05 - Add useReminders Hook and Lembretes Section

Status: Done

## Spec

`docs/specs/034-due-date-reminders.md`

## Plan

`docs/plans/034-due-date-reminders-plan.md`

## Goal

Add a `useReminders` hook (mirroring `useAppLock`) that loads/persists `ReminderSettings`, manages OS notification permission, and exposes setters. Add a `Lembretes` section to `SettingsScreen.tsx`, sibling to `Segurança`, wired to the hook.

## Files

- Create: `src/hooks/useReminders.ts`
- Modify: `src/screens/SettingsScreen.tsx`

## Steps

1. Create `src/hooks/useReminders.ts`:

```ts
import { useCallback, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';

import { DEFAULT_REMINDER_SETTINGS, ReminderSettings } from '../lib/reminders';
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
      if (!isMounted) return;
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
```

2. In `src/screens/SettingsScreen.tsx`, add a `reminders: RemindersState` prop and a `Lembretes` card sibling to `Segurança` (around line 212-213, after the `Segurança` card closes):

- A `Switch` row "Lembrar vencimentos" bound to `reminders.settings.enabled`, calling `reminders.setEnabled`. If the result has `success: false`, show an `Alert` explaining permission must be granted in system settings (the toggle stays off because `setEnabled` already persisted `enabled: false`).
- When `reminders.settings.enabled` is true, show:
  - An "Avisar com antecedência" combo button opening a `ModalShell` picker over `REMINDER_DAYS_BEFORE_OPTIONS` from `src/lib/reminders.ts`, labeled "no dia" for 0 and "N dia(s) antes" otherwise, calling `reminders.setDaysBefore`.
  - A time picker/combo for hour/minute calling `reminders.setTime`. Reuse the existing combo-button + `ModalShell` grid pattern used for `summaryVisibleMonthCount` / `appLock.timeoutMinutes` (lines ~222-292) — present hour:minute as a formatted string (e.g. `09:00`) and let the user pick from a simple grid (e.g. hours 0-23 in one picker, minutes in 5-minute steps in another), or a single combined list if simpler. Follow whichever is less code while staying consistent with the existing picker style.
- Both the days-before and time controls are only rendered/enabled while `reminders.settings.enabled` is true (per spec).

3. Add `reminders` to the props of whichever component renders `SettingsScreen` so it compiles (the wiring of the actual hook instance happens in task 034-06).

4. Run `npx tsc --noEmit` and confirm no type errors (it's fine if `reminders` prop isn't passed yet — task 034-06 wires it; if TS errors on a missing required prop at the call site, make the prop required and accept that the call site needs the next task, OR temporarily wire a minimal `useReminders()` call in `FinanceApp.tsx` now if that's simpler — pick whichever keeps `tsc` green at the end of this task).

## Acceptance Criteria

- `useReminders` loads persisted settings, exposes `setEnabled`/`setDaysBefore`/`setTime`, and requests OS permission on enable.
- If permission is denied, settings remain `enabled: false` and the caller is informed so it can show an explanatory hint.
- `Lembretes` section appears in `Ajustes`, sibling to `Segurança`, off by default.
- `daysBefore` (0-7) and time controls are only shown/enabled while reminders are enabled.
- TypeScript compilation passes.
