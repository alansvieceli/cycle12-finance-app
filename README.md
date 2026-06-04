# Cycle12 Finance

React Native Expo application for 12-month personal finance control.

## App Behavior

- Shows a finance projection for up to 12 months.
- Tracks fixed monthly salary and extra balance for the current month.
- Supports local categories, account items, due days, and editable monthly values.
- Calculates monthly expenses, salary commitment, and surplus or shortfall.
- Treats credit card bills as manually editable monthly totals.
- Stores data only on the device.

Backup and restore are not implemented yet.

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

## Run

```bash
npx expo start
```

## Test

```bash
npm test
```

## Open on Android

Start an Android emulator from Android Studio, then press `a` in the Expo CLI terminal.

You can also open the app with Expo Go when using a compatible Expo workflow.
