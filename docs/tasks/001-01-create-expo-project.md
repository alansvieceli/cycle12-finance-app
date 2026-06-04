# Task 001-01 - Create Expo Project

## Plan Reference

`docs/plans/001-bootstrap-expo-project-plan.md`

## Objective

Scaffold the React Native Expo project with TypeScript in the repository root.

## Steps

1. Run `create-expo-app` in the current directory using the blank TypeScript template:

   ```bash
   npx create-expo-app@latest . --template blank-typescript
   ```

2. Confirm the following files were created:
   - `package.json`
   - `tsconfig.json`
   - `app.json`
   - `App.tsx`
   - `babel.config.js`

3. Confirm `node_modules/` is present after the install step (create-expo-app installs dependencies automatically).

## Acceptance Criteria

- Project scaffolded successfully.
- TypeScript template applied (`tsconfig.json` exists).
- No additional dependencies added beyond what the template provides.

## Notes

- Do not add navigation, storage, or any business logic in this task.
- If `create-expo-app` asks for a project name, use `cycle12-finance-app`.
