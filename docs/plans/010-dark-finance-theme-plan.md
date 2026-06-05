# Plan 010 - Dark Finance Theme

## Spec

`docs/specs/010-dark-finance-theme.md`

## Objective

Replace the current light green visual style with a dark finance-focused theme using shared color tokens.

## Tasks

| Task   | File                                            | Purpose                                                                 |
| ------ | ----------------------------------------------- | ----------------------------------------------------------------------- |
| 010-01 | `docs/tasks/010-01-apply-dark-finance-theme.md` | Add theme tokens, update components/screens, update docs, and validate. |

## Notes

- Keep this change visual-only.
- Do not add dependencies.
- Do not change finance calculations, persistence, navigation, or data models.
- Do not commit until the user evaluates the result.

## Validation

- `npx tsc --noEmit`
- `npm test`
