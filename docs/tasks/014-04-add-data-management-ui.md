# Task 014-04 - Add Data Management UI

Status: Completed

## Spec

`docs/specs/014-data-backup-restore-reset.md`

## Plan

`docs/plans/014-data-backup-restore-reset-plan.md`

## Goal

Add a `Gerenciar Dados` panel in `Configurações` with backup, restore, and reset actions.

## Steps

1. Add a button below the settings inputs to open data management.
2. Add `Fazer Backup`, `Restaurar Backup`, and `Limpar Tudo` actions.
3. Export `.c12f` files through Expo file/sharing APIs.
4. Import `.c12f` files through Expo document picker/file APIs.
5. Validate restore before replacing state.
6. Confirm reset before replacing state.
7. Show success/error messages.

## Acceptance Criteria

- Backup creates a `.c12f` file with JSON content.
- Restore rejects invalid files before replacing data.
- Valid restore replaces all data.
- Reset requires confirmation and applies specified defaults.
- User can close the data management panel.
