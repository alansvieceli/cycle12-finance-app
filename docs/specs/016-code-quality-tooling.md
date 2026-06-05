# Spec 016 - Code Quality Tooling

## Goal

Configure a professional baseline for code quality, formatting, typing, tests, Git hooks, and local maintenance without changing app behavior or business rules.

## Context

The project is an Expo React Native app using TypeScript. It already has pure logic tests with Vitest, but it does not yet have the standard Expo linting, Prettier formatting, Jest/Expo UI test setup, pre-commit hooks, or a complete check script.

## Initial Diagnosis

- Expo: `~56.0.8`
- React Native: `0.85.3`
- TypeScript: `~6.0.3`
- Existing TypeScript config: `tsconfig.json` extends `expo/tsconfig.base` and enables `strict`.
- Existing tests: Vitest with `vitest.config.ts`.
- Missing tooling: ESLint, Prettier, Jest, React Native Testing Library, Husky, lint-staged, EditorConfig.
- Existing scripts do not include `lint`, `lint:fix`, `format`, `format:check`, `typecheck`, `test:watch`, or `check`.
- `.gitignore` ignores `.env*.local`, but not all `.env` files.
- No obvious hardcoded secrets were found in the source/documentation scan.
- Folder structure is already reasonable for the current app size; no feature-folder migration is needed.

## Scope

### Included

- Configure ESLint with Expo-compatible recommended config.
- Add useful but moderate lint rules for React, React Hooks, TypeScript, and React Native.
- Configure Prettier and Prettier ignore rules.
- Add typecheck and quality scripts.
- Configure Jest with `jest-expo`.
- Add React Native Testing Library.
- Add one simple render test to validate component testing setup.
- Convert existing pure logic tests from Vitest imports to Jest-compatible globals.
- Configure Husky and lint-staged for lightweight pre-commit checks.
- Add `.editorconfig`.
- Tighten `.gitignore` for local env files and generated output.
- Update README with tooling commands and standards.

### Not Included

- Do not change visual behavior.
- Do not change finance business rules.
- Do not rework screen architecture.
- Do not add backend, authentication, paid services, or cloud tooling.
- Do not add heavy libraries beyond quality tooling.

## Acceptance Criteria

- `npm install` completes and updates the lockfile when dependencies change.
- `npm run lint` passes.
- `npm run format:check` passes.
- `npm run typecheck` passes.
- `npm test` passes with Jest/Expo.
- `npm run check` runs lint, format check, typecheck, and tests.
- README documents the new commands and quality standards.
