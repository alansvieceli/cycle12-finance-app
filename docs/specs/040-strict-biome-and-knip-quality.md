# Spec 040 - Strict Biome and Knip Quality

Status: Implemented

## Goal

Adopt the recommended Biome and Knip practices for a React Native Expo project, accepting broad mechanical source changes while preserving application behavior.

## Scope

- Enable Biome's recommended rules, React/project domains, and import organization.
- Apply Biome formatting and safe fixes across supported project files.
- Resolve remaining diagnostics deliberately; warnings must block the quality gate.
- Use `biome ci` for the non-mutating full check.
- Make Knip configuration hints fail, run both default and strict production analysis, and remove avoidable exceptions.
- Remove confirmed unused files, exports, and dependencies surfaced by Knip.
- Keep only documented exceptions required by Expo's implicit configuration behavior.
- Update scripts, README, app context, and quality policy.

## Non-Goals

- Do not enable every nursery rule.
- Do not change financial behavior, navigation, storage, or user-visible copy.
- Do not apply unsafe Biome fixes without reviewing their runtime impact.

## Acceptance Criteria

- `npm run lint` has no errors or warnings.
- `npm run format:check` passes.
- Biome organizes imports consistently and checks recommended React/project rules.
- `npm run knip` passes with configuration hints treated as errors.
- `npm run knip:production` passes in strict production mode.
- Knip exceptions are minimal and documented.
- `npm run check` uses `biome ci` and passes TypeScript, coverage, and both Knip modes.
- Existing tests pass with `src/lib` statement coverage above 80%.

## References

- Biome configuration: https://biomejs.dev/reference/configuration/
- Biome domains: https://biomejs.dev/linter/domains/
- Biome CI: https://biomejs.dev/recipes/continuous-integration/
- Knip issue handling: https://knip.dev/guides/handling-issues
- Knip production mode: https://knip.dev/features/production-mode
- Knip CI: https://knip.dev/guides/using-knip-in-ci

## Implemented Exceptions

- Knip ignores `expo-system-ui` and `expo-updates`: the Expo plugin derives these package references implicitly from `app.json`, while the app does not import them directly.
- `FinanceApp` suppresses one exhaustive-dependencies diagnostic because changing the finance window must trigger reminder resynchronization even when finance arrays retain their references.

## Pending Outside Scope

- `npx expo install --check` reports compatible patch updates for `expo`, `expo-notifications`, `expo-sharing`, and `expo-splash-screen`; dependency upgrades belong in a separate task.
