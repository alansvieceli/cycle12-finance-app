# Spec 013 - Splash Screen Branding

## Objective

Replace the default Expo loading screen branding with a project-specific Cycle12 Finance splash screen.

## Context

The app currently shows the default Expo-style splash/loading screen with the generated app icon and the raw app name `cycle12-finance-app`. The user wants to change this first loading screen and asked for a finance-themed image.

This change should make the app feel more intentional before the first screen loads, especially when paired with the planned dark finance theme from Spec 010.

## Goals

- Configure a custom Expo splash screen.
- Use the official `expo-splash-screen` config plugin for SDK 52+ splash configuration.
- Update generated Android splash resources when the native `android/` project already exists.
- Use a finance-themed splash image created for this project.
- Prefer the display name `Cycle12 Finance` instead of the raw package-style name.
- Use a dark splash background that can align with the planned dark theme.
- Keep the splash simple, readable, and Android-first.
- Save new image assets under `assets/` without overwriting existing assets unless explicitly requested.

## Non-goals

- Do not change app navigation or runtime behavior.
- Do not add backend code.
- Do not add authentication.
- Do not add paid services.
- Do not add unnecessary dependencies.
- Do not redesign the full app icon in this spec unless explicitly requested.
- Do not implement a custom animated splash screen.

## Proposed Branding Direction

Recommended splash direction:

- Background: `#121212`
- Main visual: clean finance illustration with calendar/month planning, upward/downward chart motion, and coin/card details
- Accent color: `#F97316`
- Supporting colors: white, muted gray, small green/red finance accents
- Text: avoid embedding text inside the image unless needed; let app metadata handle the display name

## Asset Rules

- Create a new splash image asset under `assets/`.
- Suggested filename: `splash-finance.png`.
- Keep the source visually centered with generous padding.
- Avoid tiny text in the image because splash assets are shown at different sizes.
- Avoid using the default Expo icon artwork.
- Keep the image suitable for `resizeMode: "contain"`.

## App Configuration

Implementation should update `app.json` to include an explicit Expo splash configuration:

```json
"splash": {
  "image": "./assets/splash-finance.png",
  "resizeMode": "contain",
  "backgroundColor": "#121212"
}
```

Implementation should also configure the `expo-splash-screen` plugin:

```json
"plugins": [
  [
    "expo-splash-screen",
    {
      "image": "./assets/splash-finance.png",
      "backgroundColor": "#121212",
      "resizeMode": "contain",
      "imageWidth": 280
    }
  ]
]
```

Implementation should also evaluate changing:

```json
"name": "Cycle12 Finance"
```

The `slug`, Android package name, and internal code identifiers should remain unchanged unless separately requested.

Because this repository includes a generated `android/` project, implementation must also keep the Android native resources aligned with the Expo config:

- `android/app/src/main/res/values/colors.xml`
- `android/app/src/main/res/values/strings.xml`
- `android/app/src/main/res/drawable-*/splashscreen_logo.png`
- Android 12+ splash style resources when needed

## Acceptance Criteria

- A finance-themed splash image exists in `assets/`.
- `app.json` uses the custom splash image.
- `app.json` configures the `expo-splash-screen` plugin with the custom image.
- Android native splash resources use the custom splash image.
- Splash background uses `#121212`.
- The visible app display name is `Cycle12 Finance` if supported by the Expo configuration.
- Existing icon assets are not overwritten without explicit approval.
- TypeScript validation passes.
- Existing tests pass.
- Expo start validation is attempted when applicable.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```

When applicable, validate manually on Android through Expo:

```bash
npx expo start
```

Confirm:

- the loading screen no longer shows the default Expo visual
- the splash background is dark
- the finance image is centered and not cropped
- the app still opens normally after loading

## Documentation Requirements

Update `README.md` after implementation if app branding or setup behavior changes.

Follow:

- `docs/standards/ai-workflow.md`
- `docs/standards/readme-policy.md`
- `docs/standards/testing-policy.md`
