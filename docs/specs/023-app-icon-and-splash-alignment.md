# Spec 023 - App Icon and Splash Alignment

## Objective

Align the Android launcher icon and splash screen with the current Cycle12 Finance logo assets, removing the stale calendar/coins illustration from native Android resources.

## Context

Manual Android emulator testing found two branding inconsistencies after uninstalling the app and running:

```bash
npx expo run:android
```

Observed behavior:

- The Android launcher shows the old finance illustration with calendar, coins, chart, and card.
- The launcher icon appears inside a dark/black adaptive icon background and does not match the phone icon style.
- The initial splash/loading screen also shows the old illustration.
- The expected logo assets exist under `assets/novo/`.
- The `assets/novo/` folder is temporary and should not remain after the approved logo files are promoted into `assets/`.

Current audit:

- `app.json` points `expo.icon` to `./assets/app-icon.png`.
- `app.json` points `android.adaptiveIcon.foregroundImage` to `./assets/app-icon.png`.
- `app.json` uses a dark adaptive icon background.
- `assets/app-icon.png` currently matches `assets/novo/Icone do logo branco.png`.
- Native Android launcher resources still contain the old illustration in `android/app/src/main/res/mipmap-*/ic_launcher_foreground.webp`.
- Native Android splash resources still contain the old illustration in `android/app/src/main/res/drawable-*/splashscreen_logo.png`.

Because the repository includes a generated `android/` project, updating only `app.json` is not enough. Native resources must be kept aligned with Expo configuration.

## Goals

- Use the current Cycle12 Finance `12` logo as the Android launcher identity.
- Use the logo files currently under `assets/novo/` as the source assets.
- Rename/promote the selected logo outputs into stable filenames directly under `assets/`.
- Remove `assets/novo/` after the promoted assets are referenced and validated.
- Prefer an Android-standard adaptive icon setup:
  - separate foreground image
  - solid background color
  - sufficient padding/safe area
  - no baked-in square background inside the foreground asset
- Replace stale native launcher resources that still show the old finance illustration.
- Replace stale native splash resources or intentionally align them with the selected splash direction.
- Keep the icon legible on the Android launcher at small sizes.
- Keep the launcher icon closer to the phone's standard visual pattern than the current dark/black result.
- Preserve app name, slug, Android package, navigation, and runtime behavior.

## Non-goals

- Do not redesign app screens.
- Do not change business logic.
- Do not add backend code.
- Do not add authentication.
- Do not add paid services.
- Do not add unnecessary dependencies.
- Do not create an animated splash screen.
- Do not replace the app brand name.
- Do not rely on the old calendar/coins illustration for the launcher icon.

## Proposed Visual Direction

Recommended direction:

- Launcher background: white or near-white, such as `#F5F7FA`.
- Launcher foreground: current `12` logo with orange/gray circular arrow and dark `12` mark.
- Source candidate: `assets/novo/Icone do logo preto.svg` or a generated PNG derived from it.
- Foreground canvas: square, high resolution, transparent, with padding so Android masks do not crop the circular arrow.
- Splash screen: use the same `12` logo for consistency, centered on a simple background.

Alternative direction:

- Launcher background: dark finance color, such as `#121212`.
- Launcher foreground: `assets/novo/Icone do logo branco.svg` or derived PNG.
- This keeps the dark fintech identity but is less aligned with the user's request to avoid the black launcher result.

## Asset Requirements

Create or update app-level assets only after task approval.

Recommended output assets:

- `assets/app-icon.png`
  - 1024x1024 PNG for Expo general icon usage.
  - Should not include the stale finance illustration.
- `assets/adaptive-icon-foreground.png`
  - 1024x1024 transparent PNG.
  - Contains only the padded foreground logo.
  - Leaves enough safe area for Android adaptive masks.
- `assets/splash-logo.png`
  - PNG suitable for `expo-splash-screen`.
  - Uses the same brand direction as the launcher.

After these files exist and are referenced from configuration, delete the temporary source folder:

- `assets/novo/`

Do not delete `assets/novo/` before confirming the promoted files in `assets/` are correct and no project file still references the temporary folder.

Native Android generated resources must be refreshed or manually aligned:

- `android/app/src/main/res/mipmap-*/ic_launcher_foreground.webp`
- `android/app/src/main/res/mipmap-*/ic_launcher.webp`
- `android/app/src/main/res/mipmap-*/ic_launcher_round.webp`
- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml`
- `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml`
- `android/app/src/main/res/drawable-*/splashscreen_logo.png`
- `android/app/src/main/res/values/colors.xml`
- Android 12+ splash style resources when affected

## App Configuration Requirements

`app.json` should be aligned with the selected assets.

Recommended launcher configuration:

```json
"icon": "./assets/app-icon.png",
"android": {
  "adaptiveIcon": {
    "backgroundColor": "#F5F7FA",
    "foregroundImage": "./assets/adaptive-icon-foreground.png"
  }
}
```

Recommended splash plugin configuration:

```json
[
  "expo-splash-screen",
  {
    "image": "./assets/splash-logo.png",
    "backgroundColor": "#F5F7FA",
    "resizeMode": "contain",
    "imageWidth": 180
  }
]
```

Exact colors and splash size can be adjusted during implementation if visual QA shows clipping, weak contrast, or poor Android launcher fit.

## Acceptance Criteria

- A clear launcher visual direction is selected and documented in the plan or task notes.
- Selected files from `assets/novo/` are promoted into stable filenames under `assets/`.
- `assets/novo/` is removed after promotion and validation.
- `app.json` references current icon assets, not the stale calendar/coins illustration.
- Android adaptive icon uses a separate foreground image and background color.
- Native Android launcher resources no longer show the old calendar/coins illustration.
- Native Android splash resources no longer show the old calendar/coins illustration unless a task explicitly keeps it for splash only.
- The launcher icon is legible in the Android emulator app drawer.
- The icon does not appear as a small old illustration inside a black square/circle.
- The splash screen shows the selected logo centered and uncropped.
- No app runtime behavior changes.
- README is updated if branding, build, or validation behavior changes.
- TypeScript validation passes.
- Unit tests pass.
- Android run validation is attempted.

## Validation

Run:

```bash
npm run typecheck
```

Run:

```bash
npm test
```

When implementation changes native Android resources, validate on Android:

```bash
npx expo run:android
```

Manual Android validation:

- Uninstall the app from the emulator before reinstalling.
- Confirm the launcher icon uses the selected `12` logo.
- Confirm the launcher icon is not the old calendar/coins illustration.
- Confirm the icon background follows the selected light or dark direction.
- Confirm the splash screen uses the selected logo and is centered.
- Confirm the app opens normally after the splash.
