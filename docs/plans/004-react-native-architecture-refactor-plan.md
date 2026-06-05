# Plan 004 - React Native Architecture Refactor

## Spec Reference

`docs/specs/004-react-native-architecture-refactor.md`

## Objective

Refactor the React Native app into focused modules so `App.tsx` becomes a small root component and future tab workflow work is easier to maintain.

## Assumptions

- Existing product behavior should remain intact.
- The app continues to start empty when no local data exists.
- No backend, authentication, paid service, backup, restore, or new navigation/state dependency will be added.
- Simple React state plus custom hooks are enough for now.
- Pure utilities should be testable with Vitest.

## Tasks

| #   | File                                                      | Description                                                                |
| --- | --------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1   | `docs/tasks/004-01-extract-formatting-and-input-utils.md` | Move formatting, parsing, clamping, and id helpers out of `App.tsx`        |
| 2   | `docs/tasks/004-02-extract-finance-state-hook.md`         | Move finance state, persistence, and update actions into `useFinanceState` |
| 3   | `docs/tasks/004-03-extract-common-components.md`          | Extract reusable common UI components                                      |
| 4   | `docs/tasks/004-04-extract-finance-components.md`         | Extract finance-specific display/editor components                         |
| 5   | `docs/tasks/004-05-extract-screens-and-app-shell.md`      | Extract screen components and reduce `App.tsx` to a small root             |
| 6   | `docs/tasks/004-06-update-docs-and-validate.md`           | Update README and run final validation                                     |

## Sequential Order

Tasks must be executed in order.

Start with pure utilities and hooks before splitting UI. This keeps later component extraction smaller and safer.

## Validation

After each task:

```bash
npx tsc --noEmit
```

Run tests after tasks that affect utilities, state, or calculations:

```bash
npm test
```

At the end, run Expo when applicable:

```bash
npx expo start
```

## Documentation

Update README when the source structure changes.

## Out of Scope

- Feature redesign
- New business rules
- Backend
- Authentication
- Backup/restore
- New navigation or state dependency
