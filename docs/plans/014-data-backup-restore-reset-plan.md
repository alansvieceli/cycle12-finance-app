# Plan 014 - Data Backup Restore Reset

Status: Completed

## Spec

`docs/specs/014-data-backup-restore-reset.md`

## Objective

Add local `.c12f` backup export, validated restore, and reset defaults from the `Configurações` tab.

## Tasks

| Task   | File                                                    | Purpose                                                                                            |
| ------ | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 014-01 | `docs/tasks/014-01-add-backup-file-dependencies.md`     | Add minimal Expo-compatible file, sharing, document picker, and crypto dependencies.               |
| 014-02 | `docs/tasks/014-02-add-backup-validation-helpers.md`    | Add backup envelope, canonical JSON, hash validation, state validation, and reset default helpers. |
| 014-03 | `docs/tasks/014-03-add-finance-state-replace-action.md` | Add state actions for validated restore and reset replacement.                                     |
| 014-04 | `docs/tasks/014-04-add-data-management-ui.md`           | Add the `Gerenciar Dados` panel with backup, restore, and reset actions.                           |
| 014-05 | `docs/tasks/014-05-update-docs-and-validate.md`         | Update README and run validation.                                                                  |

## Notes

- Restore must validate the file before replacing current data.
- A SHA-256 integrity hash detects accidental/casual file changes but is not strong anti-forgery.
- Keep implementation local-only.

## Validation

- `npx tsc --noEmit` - passed
- `npm test` - passed
- `npm run test:coverage` - passed
- `npx expo config --type public` - passed
- `android/gradlew.bat :app:processDebugResources` - passed
