# Spec 039 - Biome and Knip Tooling

Status: Implemented

## Goal

Replace ESLint and Prettier with Biome, and add Knip to detect unused files, exports, and dependencies without changing app behavior.

## Scope

- Add `@biomejs/biome` and `knip` as development dependencies.
- Remove ESLint, its plugins/configs, and Prettier.
- Replace the existing lint, format, and staged-file commands with Biome equivalents.
- Add an explicit `knip` script and include it in the full quality gate.
- Preserve the existing `lint`, `lint:fix`, `format`, `format:check`, and `check` script names.
- Update project documentation and quality standards.

## Non-Goals

- Do not change runtime dependencies or application behavior.
- Do not add overlapping lint or formatting tools.
- Do not fix unrelated dead-code findings unless they block adopting Knip.

## Acceptance Criteria

- `eslint.config.js`, `.prettierrc`, and `.prettierignore` are removed.
- ESLint- and Prettier-related development dependencies are removed.
- Biome checks and formats the supported project files.
- The pre-commit hook uses Biome through lint-staged.
- `npm run knip` completes with no unhandled findings.
- `npm run check` runs Biome, TypeScript, tests with coverage, and Knip successfully.
- README and quality standards describe the new commands.

## References

- Biome migration guide: https://biomejs.dev/guides/migrate-eslint-prettier/
- Knip configuration: https://knip.dev/overview/configuration
- Knip Expo plugin: https://knip.dev/reference/plugins/expo
