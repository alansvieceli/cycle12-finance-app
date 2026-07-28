# Cycle12 Finance

Cycle12 Finance is a personal finance projection app built with React Native, Expo, and TypeScript.

The app is designed for single-user, local-first control of monthly expenses over a rolling planning window. It replaces a personal spreadsheet used to project account bills, salary commitment, and monthly surplus or shortfall.

## Product Overview

Cycle12 Finance helps one person plan recurring expenses over the next 12 months without creating an account or sending data to a server. The app starts empty, lets the user build their own categories and accounts, and keeps the monthly projection on the device.

The main areas are:

- `Resumo`: current month overview with projected balance, salary commitment, paid/pending information, an account balance indicator that turns red when negative, and access to payment tracking.
- `Gráficos`: read-only charts for commitment, category distribution, and monthly balance trends, including the total negative balance for the visible period.
- `Planejar`: monthly value planning for existing accounts across the 12-month window.
- `Cadastros`: category and account management.
- `Ajustes`: salary, extra balance, visible month count, thresholds, security, window advance, backup, restore, reset, and app version.

For the selected account, a pasted value list can replace consecutive visible months after an old-to-new confirmation preview.

For deeper project and agent context, read `docs/app-context.md`.

## App Behavior

- Starts empty so the user can fill their own categories, accounts, and values.
- Shows a rolling 12-month finance projection starting at the current month.
- Advances the planning window automatically when the calendar month changes.
- Lets the user choose how many months appear in the summary and charts, from 3 to 12.
- Shows a read-only charts tab with a per-month income commitment progress list, a paid vs pending summary for the current month, a current-month category donut chart, and positive/negative monthly balance columns with expandable values.
- Tracks fixed monthly salary and an extra balance for the current month.
- Supports categories, account items, due days, editable monthly values, and category-level value propagation rules.
- Lets the user add or subtract partial adjustments from a monthly account value without replacing the full total manually.
- Supports adding the same adjustment amount across multiple consecutive months from the adjustment modal in Planejar.
- Lets the user mark an account as reviewed for the current month in Planejar, shows that mark on each row of the Pagamentos screen, and clears every mark when the planning window advances.
- Keeps category and account lists consistently ordered across planning and summary views.
- Uses a Figma-inspired dark fintech layout with a fixed five-area bottom navigation: Resumo, Gráficos, Planejar, Cadastros, and Ajustes.
- Keeps planning focused on monthly values, with category and account management available from the dedicated Cadastros tab.
- Combines finance settings and local data actions in Ajustes.
- Shows the current app version in the Ajustes footer.
- Lets the user select a category while creating an account.
- Tracks current-month paid/unpaid status manually for each account item.
- Opens current-month payment tracking from the Resumo payment shortcut.
- Lets the user add a new account item with an optional value for the current month directly from the Pagamentos screen, without leaving the payment view.
- Lets the user adjust (add or subtract) the value of an existing account item directly from the Pagamentos screen using the adjustment button on each payment row.
- Shows compact monthly summaries with category details available on demand.
- Calculates monthly expenses, income commitment, and surplus or shortfall.
- Shows the commitment percentage in a configurable warning or danger color when it exceeds user-defined thresholds set in the Configurações tab.
- Uses a dark premium finance theme with orange navigation and action accents.
- Treats credit card bills as manually editable monthly totals.
- Uses the Cycle12 Finance `12` logo for the Android launcher icon and native splash screen.
- Offers optional biometric app lock from Ajustes, disabled by default.
- Offers optional local due-date reminder notifications from Ajustes, disabled by default.
- Uses a branded monochrome Cycle12 notification icon for Android reminders.
- Stores finance data only on the device.
- Exports local data to a JSON-based `.c12f` backup file.
- Restores `.c12f` backups only after validating format, version, SHA-256 integrity hash, data shape, and internal references.
- Can reset local data to the default state: category `Outros`, current 12-month window, 70% warning threshold, and 90% danger threshold.

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
- `docs/standards/app-context-policy.md`
- `docs/standards/readme-policy.md`
- `docs/standards/testing-policy.md`

## Tech Stack

- Expo
- React Native
- TypeScript
- AsyncStorage for local device persistence
- Expo File System, Document Picker, Sharing, and Crypto for local `.c12f` backup and restore
- Expo Local Authentication and Blur for optional biometric app lock
- Expo Notifications for optional local due-date reminders
- Expo Asset and Expo Splash Screen for bundled assets and native loading screen branding
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

The app uses `@react-native-async-storage/async-storage` for local device storage, Expo file/document/sharing/crypto modules for `.c12f` backup files, Expo Local Authentication and Blur for optional app lock, Expo Asset and Splash Screen for bundled assets and native loading screen branding, React Native Gifted Charts for chart rendering, and Jest/Expo with React Native Testing Library for tests.

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

The project uses Biome for linting and formatting, Knip for unused code and dependency checks, strict TypeScript, Jest with `jest-expo`, React Native Testing Library, Husky, and lint-staged.

Run lint:

```bash
npm run lint
```

Fix lint issues when possible:

```bash
npm run lint:fix
```

Apply all safe Biome formatting, lint, and import-organization fixes:

```bash
npm run fix
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

Check for unused files, exports, and dependencies:

```bash
npm run knip
```

Check only shipped code and production dependencies in strict mode:

```bash
npm run knip:production
```

Knip intentionally ignores `expo-system-ui` and `expo-updates` because the Expo plugin extracts them implicitly from `app.json`; neither package is directly imported by this app.

Run the complete local quality check:

```bash
npm run check
```

Pre-commit hooks run `lint-staged` on staged files only. Biome checks, formats, and organizes imports in supported staged code and JSON files using safe fixes. The hook intentionally does not run builds, Knip, or full test suites.

Commit messages are validated by Husky's `commit-msg` hook and must use `type: message`. Accepted types are `feat`, `fix`, `docs`, `test`, `build`, `perf`, `style`, `refactor`, `chore`, `ci`, `raw`, `cleanup`, and `remove`.

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

## Release Builds

### Android

There are two ways to generate an Android build.

#### Option 1: EAS Build (recommended, cloud-based)

Produces an `.apk` (sideload) or `.aab` (Google Play). Works on any OS.

```bash
npm install -g eas-cli
eas login
eas build:configure

# APK for direct install
eas build -p android --profile preview

# AAB for Google Play
eas build -p android --profile production
```

A download link is provided when the build finishes. Requires a free account at [expo.dev](https://expo.dev).

#### Option 2: Local build (requires Android Studio)

```bash
npx expo run:android --variant release
```

The APK is written to:

```
android/app/build/outputs/apk/release/app-release.apk
```

Transfer it to the device via cable or cloud storage and install it. You may need to enable **Install from unknown sources** in Android settings.

---

### iOS

> **Requires a Mac with Xcode installed.** iOS builds cannot be produced on Windows or Linux.

There are two ways to generate an iOS build.

#### Option 1: EAS Build (recommended, cloud-based)

Produces an `.ipa` ready for TestFlight or App Store submission. Runs on Expo's servers — you still need a Mac to configure signing credentials the first time.

```bash
npm install -g eas-cli
eas login
eas build:configure

# IPA for TestFlight / Ad Hoc
eas build -p ios --profile preview

# IPA for App Store submission
eas build -p ios --profile production
```

A download link is provided when the build finishes. Requires a free account at [expo.dev](https://expo.dev) and an Apple Developer account for distribution.

#### Option 2: Local build (requires Xcode on macOS)

```bash
npx expo run:ios --configuration Release
```

The app opens in the iOS Simulator or on a connected device. To archive for distribution, open the generated `ios/` project in Xcode and use **Product → Archive**.

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
- addition adjustments can apply the same entered amount to multiple consecutive months inside the current 12-month planning window
- the rolling 12-month window start is saved locally and can advance automatically or manually
- the summary/chart visible month count is saved locally and does not change the 12-month planning window
- optional app lock settings are saved locally and are not included in finance backup files
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
