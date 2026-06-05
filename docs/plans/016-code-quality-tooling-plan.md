# Plan 016 - Code Quality Tooling

Status: Completed

## Spec

`docs/specs/016-code-quality-tooling.md`

## Objective

Add a modern Expo-compatible quality tooling baseline without changing app behavior.

## Tasks

| Task   | File                                            | Purpose                                                         |
| ------ | ----------------------------------------------- | --------------------------------------------------------------- |
| 016-01 | `docs/tasks/016-01-add-quality-tooling.md`      | Add ESLint, Prettier, EditorConfig, scripts, ignores, and deps. |
| 016-02 | `docs/tasks/016-02-configure-jest-rntl.md`      | Configure Jest/Expo, React Native Testing Library, and tests.   |
| 016-03 | `docs/tasks/016-03-add-git-hooks.md`            | Add Husky and lint-staged with lightweight pre-commit checks.   |
| 016-04 | `docs/tasks/016-04-update-docs-and-validate.md` | Update README and run final validation.                         |

## Notes

- Existing Vitest tests will be migrated to Jest-compatible globals so the project has one primary test runner.
- The current folder structure is acceptable; no large reorganization is planned.
- The pre-commit hook should run only staged-file linting/formatting, not full app builds.

## Validation

- `npm install --save-dev eslint eslint-config-expo eslint-config-prettier eslint-plugin-prettier prettier jest jest-expo @testing-library/react-native @types/jest react-test-renderer@19.2.3 husky lint-staged` - passed
- `npm install --save-dev eslint-plugin-react-native` - passed
- `npm install --package-lock-only` - passed
- `npm run lint` - passed
- `npm run format:check` - passed
- `npm run typecheck` - passed
- `npm test` - passed
- `npm run test:coverage` - passed
- `npm run check` - passed
- `npx expo config --type public` - passed

## Pending Notes

- `npm install` reported 12 moderate npm audit findings in transitive dependencies. No automatic fix was applied because `npm audit fix --force` can introduce breaking dependency changes.
