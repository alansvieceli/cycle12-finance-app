# Plan 013 - Splash Screen Branding

## Spec

`docs/specs/013-splash-screen-branding.md`

## Objective

Configure the app to use a project-specific Cycle12 Finance splash screen and display name.

## Tasks

| Task | File | Purpose |
|---|---|---|
| 013-01 | `docs/tasks/013-01-configure-splash-screen-branding.md` | Add the splash asset, update Expo config, update documentation, and validate. |

## Notes

- Keep `slug` and Android package unchanged.
- Do not overwrite existing Expo-generated icon assets.
- Use `assets/splash-finance.png` for the custom splash image.

## Validation

- `npx tsc --noEmit`
- `npm test`
- Expo config/start validation when applicable
