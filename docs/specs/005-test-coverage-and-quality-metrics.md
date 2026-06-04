# Spec 005 - Test Coverage And Quality Metrics

## Objective

Add test coverage reporting and define practical quality metrics for `cycle12-finance-app`.

## Context

The project currently uses Vitest and has unit tests for pure business logic and input parsing helpers.

The project does not yet generate an official coverage report, so there is no measured percentage for:

- statements
- branches
- functions
- lines

The app is a React Native Expo app with local-only data, finance calculations, local storage, and user-facing form flows.

## Goals

- Enable coverage reporting for the existing Vitest setup.
- Add a repeatable coverage command.
- Define which source areas should be included in coverage.
- Define which files should be excluded from coverage.
- Establish initial coverage expectations for the current maturity of the project.
- Document how to interpret coverage for this project.

## Non-goals

- Do not add end-to-end test tooling yet.
- Do not add UI component testing unless the project is ready for it.
- Do not require full coverage for React Native screens yet.
- Do not add paid services.
- Do not add CI/CD yet unless requested separately.
- Do not block development on high coverage thresholds before the baseline is known.

## Coverage Tooling

Use Vitest coverage.

Recommended provider:

- `@vitest/coverage-v8`

Add a script:

```bash
npm run test:coverage
```

The command should generate a terminal summary and a local coverage report.

## Metrics To Track

Track these coverage metrics:

- statements
- branches
- functions
- lines

Also track:

- number of test files
- number of tests
- uncovered critical modules

## Coverage Scope

Include:

- `src/lib/**/*.ts`
- `src/storage/**/*.ts` where practical
- `src/hooks/**/*.ts` where practical
- pure logic extracted from UI components

Exclude:

- `App.tsx`
- Expo/native generated files
- config files
- test files
- type-only files when they contain no runtime logic
- purely visual React Native components until UI testing is introduced

## Initial Quality Bar

The first goal is to establish a measured baseline, not to force high thresholds immediately.

Recommended initial expectations:

- finance calculations should stay well covered
- input parsing and formatting helpers should stay well covered
- storage normalization should be covered if exposed as a testable pure function
- hooks and UI can be measured later after suitable testing strategy exists

Do not fail tests on global coverage thresholds in the first implementation unless the baseline is already healthy and documented.

## Future Quality Targets

After baseline measurement, consider gradual targets:

- `src/lib`: high coverage target, around 80% or higher
- storage normalization: high coverage target
- hooks: add focused tests when hook testing setup exists
- UI components: add tests only after selecting a React Native testing strategy

## Acceptance Criteria

- Coverage dependency is installed if needed.
- `npm run test:coverage` exists.
- Coverage command runs successfully.
- Coverage report includes the relevant source files.
- Coverage report excludes test files and generated/config files.
- README documents how to run coverage.
- A short baseline summary is added to project documentation.
- Existing tests still pass.
- TypeScript validation passes.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```

Run:

```bash
npm run test:coverage
```

## Documentation Requirements

Update README with:

- coverage command
- what coverage means in this project
- current baseline or where to find it

If a separate metrics document is useful, create it under:

```text
docs/quality/
```

Follow:

- `docs/standards/ai-workflow.md`
- `docs/standards/readme-policy.md`
- `docs/standards/testing-policy.md`
