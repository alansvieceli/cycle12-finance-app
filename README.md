# Cycle12 Finance

React Native Expo application for 12-month personal finance control.

## Requirements

- Node.js
- npm
- Android Studio with an Android emulator configured

Expo CLI can be used through `npx`, so no global install is required.

## Install

```bash
npm install
```

The app uses `@react-native-async-storage/async-storage` for local device storage.

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
