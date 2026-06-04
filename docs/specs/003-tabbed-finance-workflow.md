# Spec 003 - Tabbed Finance Workflow

## Objective

Improve the app experience by replacing the single long screen with a tabbed workflow focused on daily use.

## Context

Spec 002 delivered the first functional local finance projection, but the current UI places settings, category editing, account editing, monthly value editing, and calculated summaries on one screen.

The user wants the app to be easier to use and organized into tabs.

The app must continue to start empty so the user can fill their own data.

## Goals

- Split the app into clear tabs.
- Make the calculated projection the first tab.
- Move salary and current month extra balance into an adjustments/settings tab.
- Add configurable visible projection months.
- Keep the app capable of storing up to 12 projection months.
- Improve the editing flow for categories, accounts, and monthly values.
- Preserve local-only persistence.

## Non-goals

- Do not add backend code.
- Do not add authentication.
- Do not add paid services.
- Do not add backup or restore yet.
- Do not add spreadsheet import/export.
- Do not add individual credit card purchases.
- Do not add installment splitting.
- Do not add paid/unpaid tracking.

## Tab Structure

The app should use four tabs:

1. `Resumo`
2. `Planejamento`
3. `Categorias`
4. `Ajustes`

Use simple in-app tab navigation. Do not add a navigation dependency unless it becomes clearly necessary.

## Functional Requirements

### Resumo Tab

The `Resumo` tab is the default first tab.

It should be read-only and show calculated finance data:

- visible projection months
- total expenses by month
- salary commitment percentage by month
- surplus/shortfall by month
- category totals by month

It should not show category/account/settings editing controls.

### Planejamento Tab

The `Planejamento` tab is where the user edits account monthly values.

It should:

- show account items grouped or clearly associated with their categories
- allow selecting an account item
- show editable monthly values for that account item
- update totals immediately after edits

Credit card bills remain manually editable monthly totals.

### Categorias Tab

The `Categorias` tab is where the user manages categories.

It should allow:

- creating categories
- renaming categories
- deleting categories

Deleting a category should safely remove or handle its account items and values according to the existing behavior.

### Ajustes Tab

The `Ajustes` tab is where the user manages global settings.

It should allow editing:

- fixed monthly salary
- current month extra balance
- visible month count

`visibleMonthCount` must be configurable from 1 to 12.

The app may store up to 12 months of values, but the `Resumo` tab should show only the configured number of visible months.

### Account Editing

Account editing should remain available.

The preferred UX is to keep account creation/editing in `Planejamento`, because account values and account metadata are part of the same planning workflow.

Account item editing must allow:

- creating account items
- renaming account items
- deleting account items
- assigning account items to categories
- editing due day

### Month Window Behavior

The app should calculate projection months from the current month.

If the user stores values for up to 12 months and the current month changes, the visible month window should move forward.

When a new future month enters the 12-month window, it may start empty. The user can fill its values in `Planejamento`.

## Data Model Changes

Add `visibleMonthCount` to settings.

Expected settings fields:

- `monthlySalary`
- `currentMonthExtraBalance`
- `visibleMonthCount`

If existing stored data does not include `visibleMonthCount`, default it to `12`.

## Acceptance Criteria

- App opens on the `Resumo` tab.
- App starts empty when no local data exists.
- User can switch between `Resumo`, `Planejamento`, `Categorias`, and `Ajustes`.
- `Resumo` shows calculated data only.
- `Ajustes` allows editing salary, current month extra balance, and visible month count.
- Visible month count can be set from 1 to 12.
- `Resumo` displays only the configured number of visible months.
- App can still store values for up to 12 months.
- `Planejamento` allows editing monthly values for accounts.
- `Planejamento` allows creating/editing/deleting accounts and assigning categories.
- `Categorias` allows creating/editing/deleting categories.
- Local persistence still works.
- TypeScript validation passes.
- Existing finance calculation tests pass.

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

Confirm the app opens on Android and the tab workflow is usable.

## Documentation Requirements

Update README if implementation changes:

- app behavior
- local storage behavior
- test commands

Follow:

- `docs/standards/ai-workflow.md`
- `docs/standards/readme-policy.md`
- `docs/standards/testing-policy.md`
