# Cycle12 Finance

Cycle12 Finance is a personal finance projection app built with React Native, Expo, and TypeScript.

The app is designed for single-user, local-first control of monthly expenses over a rolling planning window. It replaces a personal spreadsheet used to project account bills, salary commitment, and monthly surplus or shortfall.

## App Behavior

- Starts empty so the user can fill their own categories, accounts, and values.
- Shows a finance projection for up to 12 months.
- Lets the user choose how many months appear in the summary, from 1 to 12.
- Shows a read-only charts tab for monthly trends and current-month category totals.
- Tracks fixed monthly salary and an extra balance for the current month.
- Supports categories, account items, due days, and editable monthly values.
- Keeps category and account lists consistently ordered across planning and summary views.
- Keeps planning focused on monthly values, with account management opened from a separate panel.
- Lets the user select a category while creating an account.
- Tracks current-month paid/unpaid status manually for each account item.
- Shows compact monthly summaries with category details available on demand.
- Calculates monthly expenses, income commitment, and surplus or shortfall.
- Shows the commitment percentage in a configurable warning or danger color when it exceeds user-defined thresholds set in the Settings tab.
- Treats credit card bills as manually editable monthly totals.
- Stores finance data only on the device.

Backup and restore are not implemented yet.

## Current Workflow

The project follows a spec-first workflow:

1. Write or update a spec in `docs/specs/`.
2. Create a plan in `docs/plans/`.
3. Break the work into tasks in `docs/tasks/`.
4. Execute approved tasks one at a time.
5. Validate and update documentation after changes.

Important project rules live in:

- `AGENTS.md`
- `CLAUDE.md`
- `docs/standards/ai-workflow.md`
- `docs/standards/readme-policy.md`
- `docs/standards/testing-policy.md`

## Tech Stack

- Expo
- React Native
- TypeScript
- AsyncStorage for local device persistence
- Vitest for unit tests

## Source Structure

```text
src/
  components/
    common/   reusable UI pieces
    finance/  finance-specific UI pieces
  hooks/      app state and persistence hooks
  lib/        calculations, formatters, parsers, and utilities
  screens/    tab-level screens
  storage/    local persistence adapter
  types/      shared TypeScript types
```

`App.tsx` is intentionally small and only renders the root finance app.

## Requirements

- Node.js
- npm
- Android Studio with an Android emulator configured

Expo CLI can be used through `npx`, so no global install is required.

## Install

```bash
npm install
```

The app uses `@react-native-async-storage/async-storage` for local device storage and `vitest` for unit tests.

Finance data is stored only on the device. There is no backend, account, or cloud sync.

## Development

```bash
npx expo start
```

Useful shortcuts in the Expo terminal:

- Press `a` to open on Android emulator.
- Press `r` to reload the app.

You can also run Android directly:

```bash
npm run android
```

## Test

```bash
npm test
```

## Coverage

```bash
npm run test:coverage
```

The current coverage metric focuses on pure TypeScript logic under `src/lib/**/*.ts`.
It does not measure screens, React Native components, hooks, or local storage behavior yet.

The first recorded baseline is available in `docs/quality/coverage-baseline.md`.
Generated coverage reports are written to `coverage/` and ignored by git.

## TypeScript Check

```bash
npx tsc --noEmit
```

## Open on Android

Start an Android emulator from Android Studio, then press `a` in the Expo CLI terminal.

You can also open the app with Expo Go when using a compatible Expo workflow.

## Local Data

All finance data is saved locally with AsyncStorage.

This means:

- there is no login
- there is no remote sync
- payment status is saved only on this device
- uninstalling the app can remove local data
- backup and restore will be a future feature

## Roadmap

Planned or future work is tracked through specs and tasks. Current near-term direction:

- keep backup and restore for a later spec
