# Cycle12 Finance

Cycle12 Finance is a personal finance projection app built with React Native, Expo, and TypeScript.

The app is designed for single-user, local-first control of monthly expenses over a rolling planning window. It replaces a personal spreadsheet used to project account bills, salary commitment, and monthly surplus or shortfall.

## App Behavior

- Starts empty so the user can fill their own categories, accounts, and values.
- Shows a rolling 12-month finance projection starting at the current month.
- Advances the planning window automatically when the calendar month changes.
- Lets the user choose how many months appear in the summary and charts, from 1 to 12.
- Shows a read-only charts tab with positive/negative columns, expense area line chart, current-month category donut chart, and expandable monthly values.
- Tracks fixed monthly salary and an extra balance for the current month.
- Supports categories, account items, due days, editable monthly values, and category-level value propagation rules.
- Lets the user add or subtract partial adjustments from a monthly account value without replacing the full total manually.
- Keeps category and account lists consistently ordered across planning and summary views.
- Keeps planning focused on monthly values, with account management opened from a separate panel.
- Lets the user select a category while creating an account.
- Tracks current-month paid/unpaid status manually for each account item.
- Shows compact monthly summaries with category details available on demand.
- Calculates monthly expenses, income commitment, and surplus or shortfall.
- Shows the commitment percentage in a configurable warning or danger color when it exceeds user-defined thresholds set in the Configurações tab.
- Uses a dark finance theme with orange navigation and action accents.
- Treats credit card bills as manually editable monthly totals.
- Uses a custom Cycle12 Finance splash screen while the app loads.
- Stores finance data only on the device.
- Exports local data to a JSON-based `.c12f` backup file.
- Restores `.c12f` backups only after validating format, version, SHA-256 integrity hash, data shape, and internal references.
- Can reset local data to the default state: category `Outros`, current 12-month window, 60% warning threshold, and 80% danger threshold.

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
- Expo File System, Document Picker, Sharing, and Crypto for local `.c12f` backup and restore
- Expo Splash Screen for native loading screen branding
- React Native Gifted Charts for finance visualizations
- Jest/Expo and React Native Testing Library for tests

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

The app uses `@react-native-async-storage/async-storage` for local device storage, Expo file/document/sharing/crypto modules for `.c12f` backup files, `expo-splash-screen` for native loading screen branding, `react-native-gifted-charts` for chart rendering, and Jest/Expo with React Native Testing Library for tests.

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

## Code Quality

The project uses Expo-compatible ESLint, Prettier, strict TypeScript, Jest with `jest-expo`, React Native Testing Library, Husky, and lint-staged.

Run lint:

```bash
npm run lint
```

Fix lint issues when possible:

```bash
npm run lint:fix
```

Format files:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

Run TypeScript validation:

```bash
npm run typecheck
```

Run the complete local quality check:

```bash
npm run check
```

Pre-commit hooks run `lint-staged` on staged files only. The hook formats staged JSON/Markdown/code files and runs ESLint fixes on staged JavaScript/TypeScript files. It intentionally does not run builds or full test suites.

## Test

```bash
npm test
```

Watch tests while developing:

```bash
npm run test:watch
```

## Coverage

```bash
npm run test:coverage
```

The current coverage metric focuses mainly on pure TypeScript logic under `src/lib/**/*.ts`, with a small React Native Testing Library render test to validate component test setup. It does not broadly measure screens, hooks, or local storage behavior yet.

The first recorded baseline is available in `docs/quality/coverage-baseline.md` and was recorded before the Jest migration. Generated coverage reports are written to `coverage/` and ignored by git.

## Generate APK for Android

There are two ways to generate an APK to install directly on a device.

### Option 1: EAS Build (recommended, cloud-based)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

A download link for the `.apk` is provided when the build finishes. Requires a free account at [expo.dev](https://expo.dev).

### Option 2: Local build (requires Android Studio)

```bash
npx expo run:android --variant release
```

The APK is written to:

```
android/app/build/outputs/apk/release/app-release.apk
```

Transfer it to the device via cable or cloud storage and install it. You may need to enable **Install from unknown sources** in Android settings.

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
- monthly adjustments update only the final saved monthly account value
- the rolling 12-month window start is saved locally and can advance automatically or manually
- the summary/chart visible month count is saved locally and does not change the 12-month planning window
- category propagation rules define how new months are filled when the window advances
- uninstalling the app can remove local data
- backup creates a portable `.c12f` file with the current local finance state
- restore validates the `.c12f` file before replacing local data
- changed or corrupted backup content is rejected by the SHA-256 integrity check
- reset clears local data and recreates only the default category and settings
- `.env` and local environment files are ignored by git; real secrets should not be stored in the app bundle

## Roadmap

Planned or future work is tracked through specs and tasks. Current near-term direction:

- continue improving local-first finance workflows through specs
