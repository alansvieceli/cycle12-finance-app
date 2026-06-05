# Plan 001 - Bootstrap Expo Project

## Spec Reference

`docs/specs/001-bootstrap-expo-project.md`

## Objective

Scaffold the initial React Native Expo project with TypeScript inside the existing repository, add a minimal home screen, and document setup instructions in the README.

## Assumptions

- The repository root (`cycle12-finance-app/`) is the Expo project root. No nested folder will be created.
- `npx create-expo-app@latest` will be used with the `blank-typescript` template, which includes TypeScript configuration out of the box.
- No navigation library is added — the blank template does not require it.
- No financial logic, storage, forms, or authentication will be introduced in this spec.
- The app will be validated by running `npx tsc --noEmit` and confirming `npx expo start` launches without errors.

## Tasks

| #   | File                                       | Description                                                   |
| --- | ------------------------------------------ | ------------------------------------------------------------- |
| 1   | `docs/tasks/001-01-create-expo-project.md` | Scaffold the Expo project using the blank TypeScript template |
| 2   | `docs/tasks/001-02-create-home-screen.md`  | Replace default screen content with "Cycle12 Finance" text    |
| 3   | `docs/tasks/001-03-update-readme.md`       | Write README with description, install, and run instructions  |
| 4   | `docs/tasks/001-04-validate.md`            | Run TypeScript check and confirm Expo start works             |

## Sequential Order

Tasks must be executed in the order listed. Each task depends on the previous one completing successfully.

## Validation

After all tasks are complete:

```bash
npx tsc --noEmit
```

```bash
npx expo start
```

Expected result: no TypeScript errors, app opens on Android emulator showing "Cycle12 Finance".

## Documentation

After implementation, update the README per `docs/standards/readme-policy.md`.

## Out of Scope

- Financial features
- Navigation (unless forced by template)
- Storage
- Forms
- Backend
- Authentication
- Paid services
