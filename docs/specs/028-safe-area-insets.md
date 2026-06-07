# Spec 028 - Safe Area Insets

## Goal

Replace the hardcoded `paddingTop: 58` in `FinanceApp`'s header with a dynamic value derived from the device's safe area insets, so the layout is correct on all Android devices regardless of status bar height.

## Context

`FinanceApp.tsx` uses a fixed `paddingTop: 58` for the top header area. This value was calibrated for the development emulator but is not guaranteed to be correct on devices with taller or shorter status bars, punch-hole cameras, or foldable form factors. No `SafeAreaView` or `useSafeAreaInsets()` is used anywhere in the project.

`react-native-safe-area-context` is not currently installed. It is a standard Expo-compatible library and available via `npx expo install`.

## Goals

- Install `react-native-safe-area-context` via `npx expo install react-native-safe-area-context`.
- Wrap the root view in `App.tsx` with `SafeAreaProvider`.
- Replace `paddingTop: 58` in `FinanceApp.tsx` with `insets.top` from `useSafeAreaInsets()`, adding a small base offset so the logo has breathing room.
- Validate on the emulator that the layout matches the current appearance.

## Non-Goals

- Do not add safe area padding to the bottom — the tab bar is pinned to the bottom and does not need it currently.
- Do not add safe area handling to individual screens.
- Do not change any visual spacing other than the top header padding.

## Implementation Notes

- Install: `npx expo install react-native-safe-area-context`
- Wrap root in `App.tsx`: `<SafeAreaProvider><FinanceApp /></SafeAreaProvider>`
- In `FinanceApp.tsx`, replace the static `paddingTop: 58` style with a dynamic computed value:

```ts
const insets = useSafeAreaInsets();
// in the header style:
paddingTop: insets.top + 10,
```

The `+ 10` keeps the same breathing room the current hardcoded value provides relative to the status bar on the dev emulator (where `insets.top` is typically ~48).

## Acceptance Criteria

- `react-native-safe-area-context` is listed in `dependencies`.
- `SafeAreaProvider` wraps `FinanceApp` in `App.tsx`.
- `paddingTop: 58` is gone from `FinanceApp.tsx`.
- On the development emulator the header looks identical to before.
- `npm run check` passes with no errors.

## Validation

```bash
npx expo install --check
npm run check
```

Validate on Android emulator:

- Logo position matches current layout.
- No clipping or overlap with the status bar.
