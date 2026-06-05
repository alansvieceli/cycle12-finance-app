# Spec 001 - Bootstrap Expo Project

## Objective

Create the initial React Native Expo project for `cycle12-finance-app`.

## Context

The repository is currently empty.

The first implementation step is to create the base Expo project using TypeScript, prepared to run on Android emulator on Windows.

## Goals

- Create a React Native Expo project.
- Use TypeScript.
- Prepare the project to run on Android emulator.
- Keep the initial setup simple.
- Add a minimal home screen showing the app name.
- Update the README with setup and run instructions.

## Non-goals

- Do not implement financial features yet.
- Do not implement navigation yet unless the Expo template requires it.
- Do not implement storage yet.
- Do not implement forms yet.
- Do not add backend code.
- Do not add authentication.
- Do not add unnecessary dependencies.

## Technical Requirements

- Project name: `cycle12-finance-app`
- Framework: React Native with Expo
- Language: TypeScript
- Target for now: Android emulator
- Development OS: Windows
- Editor: VS Code

## Expected Result

After this spec is implemented, the project should:

- Start with Expo.
- Open on Android emulator.
- Show a simple initial screen with the text `Cycle12 Finance`.
- Have a README explaining how to install dependencies and start the app.

## Acceptance Criteria

- Expo project is created successfully.
- TypeScript is configured.
- App starts with `npx expo start`.
- App can be opened on Android emulator.
- Initial screen displays `Cycle12 Finance`.
- README is updated with:
  - project description
  - installation command
  - development command
  - Android emulator instructions
- No financial business logic is implemented yet.

## Validation Commands

Use these commands when available:

```bash
npm install
```

```bash
npx expo start
```

If TypeScript validation is available:

```bash
npx tsc --noEmit
```

## Documentation Requirements

Follow:

- `docs/standards/readme-policy.md`
- `docs/standards/testing-policy.md`
- `docs/standards/ai-workflow.md`
