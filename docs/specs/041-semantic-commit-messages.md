# Spec 041 - Semantic Commit Messages

Status: Implemented

## Goal

Require semantic Git commit messages in the format `type: message` using the existing Husky setup and no additional dependency.

## Rules

- Accepted types: `feat`, `fix`, `docs`, `test`, `build`, `perf`, `style`, `refactor`, `chore`, `ci`, `raw`, `cleanup`, and `remove`.
- A colon and one space must separate the type from a non-empty message.
- Scopes such as `feat(ui): message` are not accepted because the approved format is exactly `type: message`.
- Invalid messages must stop the commit and print the expected format and accepted types.

## Acceptance Criteria

- Husky runs the validation from the `commit-msg` hook.
- `feat: add summary card` succeeds.
- `update summary card`, `feature: update summary card`, and `feat:` fail.
- No new dependency is added.
- README and app context describe the convention.
