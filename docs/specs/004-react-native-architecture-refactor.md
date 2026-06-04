# Spec 004 - React Native Architecture Refactor

## Objective

Refactor the app architecture so the React Native codebase is easier to maintain, test, and extend.

## Context

The current implementation has grown quickly from a bootstrap screen into a functional finance app.

`App.tsx` now contains too many responsibilities:

- app state
- local persistence loading/saving
- tab state
- finance settings editing
- category editing
- account editing
- monthly value editing
- summary rendering
- formatting helpers
- input parsing helpers
- styles for every screen section

This makes future work harder and increases the risk of regressions.

The app should be reorganized before continuing significant UI work.

## Goals

- Reduce `App.tsx` to a small app composition/root component.
- Split UI into focused React Native components.
- Move reusable hooks and state logic out of `App.tsx`.
- Move formatting and parsing utilities out of `App.tsx`.
- Keep business calculations in pure TypeScript helpers.
- Keep persistence behind a small storage adapter.
- Make the tabbed workflow easier to implement and maintain.
- Keep the app simple and dependency-light.

## Non-goals

- Do not add backend code.
- Do not add authentication.
- Do not add paid services.
- Do not add a navigation dependency unless clearly justified.
- Do not change finance business rules in this refactor.
- Do not implement backup/restore.
- Do not redesign the product scope.

## Target Architecture

Use a simple feature-oriented structure:

```text
src/
  components/
    common/
    finance/
  data/
  hooks/
  lib/
  screens/
  storage/
  styles/
  types/
```

## Proposed Responsibilities

### `App.tsx`

`App.tsx` should only:

- render the root app shell
- wire top-level providers if needed
- import the main finance app component

Expected size target: under 80 lines.

### `src/screens/`

Screen-level components should represent major app areas:

- `SummaryScreen`
- `PlanningScreen`
- `CategoriesScreen`
- `SettingsScreen`

Each screen should receive data and callbacks through props or a small app state hook.

### `src/components/common/`

Reusable UI components:

- tab button
- primary button
- danger button
- field/input wrappers
- empty state
- section/panel layout

### `src/components/finance/`

Finance-specific components:

- month summary card
- category total list
- category editor row
- account editor row
- monthly value editor
- account selector
- settings form

### `src/hooks/`

Hooks for app state and persistence:

- `useFinanceState`

This hook should:

- initialize empty finance state
- load stored finance state
- save changes after load
- expose finance state and update actions
- expose storage status/message

### `src/lib/`

Pure business and utility logic:

- finance calculations
- currency parsing
- currency formatting
- month formatting
- due day parsing/clamping
- visible month count clamping
- id creation

### `src/storage/`

Storage remains isolated here:

- load finance state
- save finance state
- clear finance state
- normalize older stored data

### `src/styles/`

Shared design tokens or common style constants may live here if they reduce duplication.

Do not create excessive style abstraction. Prefer local styles when they are specific to one component.

## State Management

Use React state and custom hooks for now.

Do not add Redux, Zustand, React Navigation, or another state/navigation dependency unless a future spec requires it.

## Testing Requirements

Preserve existing finance calculation tests.

Add or update tests for pure logic moved out of `App.tsx`, especially:

- currency parsing
- due day clamping
- visible month count clamping
- storage normalization when practical

UI component tests are not required in this refactor unless test tooling already supports them cleanly.

## Acceptance Criteria

- `App.tsx` is reduced to a small root component.
- Tab-related UI is not implemented directly in `App.tsx`.
- Settings UI is not implemented directly in `App.tsx`.
- Category/account/monthly value editing UI is not implemented directly in `App.tsx`.
- Formatting and parsing helpers are moved out of `App.tsx`.
- Local storage load/save state logic is moved into a hook.
- Existing behavior remains intact.
- App still starts empty when no local data exists.
- Local persistence still works.
- TypeScript validation passes.
- Existing tests pass.
- New tests are added for moved pure utilities where appropriate.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```

When applicable, run:

```bash
npx expo start
```

Confirm the app still opens on Android.

## Documentation Requirements

Update README if the project structure changes enough that documentation should mention it.

Follow:

- `docs/standards/ai-workflow.md`
- `docs/standards/readme-policy.md`
- `docs/standards/testing-policy.md`
