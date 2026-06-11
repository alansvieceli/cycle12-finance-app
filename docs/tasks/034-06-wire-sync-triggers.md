# Task 034-06 - Wire syncReminders Triggers

Status: Done

## Spec

`docs/specs/034-due-date-reminders.md`

## Plan

`docs/plans/034-due-date-reminders-plan.md`

## Goal

Wire `useReminders` and `syncReminders` into `src/FinanceApp.tsx` so reminders re-sync on app start, on settings changes, on relevant finance data changes, and on window advance.

## Files

- Modify: `src/FinanceApp.tsx`
- Modify: `src/screens/SettingsScreen.tsx` (pass the `reminders` prop, if not already wired in 034-05)

## Steps

1. In `src/FinanceApp.tsx`, instantiate `const reminders = useReminders();` alongside `appLock` and `finance`.

2. Add an effect that calls `syncReminders` whenever the relevant inputs change:

```ts
useEffect(() => {
  if (reminders.isInitializing) {
    return;
  }

  let isCancelled = false;

  async function sync() {
    const { status } = await Notifications.getPermissionsAsync();
    if (isCancelled) return;

    await syncReminders(
      finance.financeState.accountItems,
      finance.financeState.monthlyValues,
      finance.financeState.paymentStatuses,
      reminders.settings,
      status === 'granted',
    );
  }

  void sync();

  return () => {
    isCancelled = true;
  };
}, [
  reminders.isInitializing,
  reminders.settings,
  finance.financeState.accountItems,
  finance.financeState.monthlyValues,
  finance.financeState.paymentStatuses,
  finance.financeState.settings.windowStartMonth,
  finance.financeState.settings.windowStartYear,
]);
```

This single effect covers: app start (runs once data + settings are loaded), settings changes (`reminders.settings`), finance data changes (`accountItems`, `monthlyValues`, `paymentStatuses`), and window advance (`windowStartMonth`/`windowStartYear`).

3. Pass `reminders={reminders}` to `<SettingsScreen />`.

4. Run `npx tsc --noEmit` and confirm no type errors.

## Acceptance Criteria

- `syncReminders` runs after finance data and reminder settings finish loading.
- `syncReminders` re-runs when reminder settings change, when `accountItems`, `monthlyValues`, `dueDay`-affecting edits, or `paymentStatuses` change, and when the planning window advances.
- `SettingsScreen` receives a working `reminders` prop and the `Lembretes` section is fully functional end to end.
- TypeScript compilation passes.
