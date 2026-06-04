# Spec 007 - Sorting And Compact Management Panels

## Objective

Improve scanability and daily-use ergonomics by adding consistent ordering, moving dense management forms into dedicated panels, adding category selection during account creation, and correcting current-month commitment calculations to use the current month's available income.

## Context

The app now has separate tabs for summary, planning, categories, and settings. However, some screens still mix daily actions with management forms.

`Planejamento` currently shows account management and monthly value editing together, which consumes a lot of vertical space. `Resumo` also shows current-month payments and monthly summaries together, which can become hard to scan as categories and accounts grow.

The user also needs consistent ordering across screens and faster account creation by selecting a category immediately when creating an account.

## Goals

- Apply consistent ordering across all finance views.
- Keep daily-use screens focused and compact.
- Move account management out of the default `Planejamento` view into a dedicated management panel.
- Let the user select a category when creating a new account.
- Make `Resumo` easier to scan by moving dense month/category details into a details panel.
- Move current-month payment tracking into a dedicated summary panel opened by an action.
- Use current-month extra balance when calculating current-month salary commitment.
- Preserve local-only persistence.
- Avoid adding unnecessary dependencies.

## Non-goals

- Do not add backend code.
- Do not add authentication.
- Do not add paid services.
- Do not add a navigation dependency unless a simple local panel proves insufficient.
- Do not add drag-and-drop sorting.
- Do not add automatic bank/payment integration.
- Do not change planned monthly expense totals because of paid/unpaid status.

## Global Ordering

Ordering should be consistent anywhere categories and accounts appear.

Default order:

1. category `sortOrder`
2. category name
3. account due day
4. account name

If category `sortOrder` is missing, null, or invalid, treat it as `0`.

Account order fields are not available yet, so account lists should use due day from lowest to highest before falling back to name.

This should apply to:

- summary month/category details
- planning account selector
- account management panel
- category lists
- monthly value editing context

Exception:

- The current-month payment checklist should ignore category ordering and use only due day, then account name, because payment checking is a sequential due-date workflow.

Recommended implementation:

- Add reusable sorting helpers for categories and accounts.
- Keep sorting logic out of UI components where practical.
- Add a category ordering field in the category management screen.
- Do not add account ordering fields yet.
- Add unit tests for sorting helpers.

## Planning UX

`Planejamento` should focus on editing planned monthly values.

Default view should show:

- selected account context
- compact account selector
- monthly values for the selected account
- a clear action to open account management

Account management should move into a dedicated panel/screen-like section opened from `Planejamento`.

Recommended behavior:

- Add a `Gerenciar contas` action in `Planejamento`.
- When opened, show account creation and account editing controls.
- Allow closing the panel and returning to monthly value editing.
- Keep the panel local to the current screen; do not add a navigation library.

Panel can be implemented as:

- conditional full-width section inside the current scroll, or
- modal-like overlay if it remains simple and works well on Android.

Preferred first implementation:

- Use a full-width in-screen management panel with a close/back action.
- This is simpler, testable, and avoids native modal edge cases.

## Account Creation UX

When creating a new account, the user should be able to choose the category immediately.

Current creation fields:

- account name
- due day

Expected creation fields:

- account name
- category
- due day

Behavior:

- If categories exist, default the selected category to the first sorted category.
- If no categories exist, explain that a category must be created first.
- Category selection should use a compact combo/dropdown-style control, not a row of category chips.
- The category combo should visually align with the account name field width to keep the form clean.
- New accounts should use the selected category instead of always using the first raw category.
- Existing account category change behavior can remain available.

## Summary UX

`Resumo` should be easier to scan.

Default summary should show compact month cards with the most important values:

- month
- surplus/shortfall
- total expenses
- commitment percentage

Dense details should move into a month details panel.

Details panel should show:

- category totals for the selected month
- enough month context to understand the calculation
- a close/back action

Current-month payment tracking should remain easy to access, but should not make the whole summary feel overloaded.

Recommended behavior:

- Add a `Pagamentos do mês` action in `Resumo`.
- When opened, show the current-month payment checklist in a dedicated panel.
- Allow closing the panel and returning to the monthly summary list.
- For this spec, prioritize moving category totals out of every month card.

## Current-Month Commitment Calculation

The commitment percentage should use the income available for that month.

For the current month:

```text
availableIncome = monthlySalary + currentMonthExtraBalance
commitment = monthlyTotalExpenses / availableIncome
```

For future months:

```text
availableIncome = monthlySalary
commitment = monthlyTotalExpenses / availableIncome
```

If available income is zero or negative, commitment should remain unavailable/null.

This should affect only the commitment percentage display. It should not change:

- monthly total expenses
- category totals
- paid/unpaid status
- surplus/shortfall rules

## Data Model And Persistence

No required schema change is expected for the management panels.

If sorting helpers reveal older data with missing or invalid `sortOrder`, storage normalization may normalize those values to `0`, but this is optional if all sorting helpers already handle invalid values safely.

If account creation needs a new transient selected category field, keep it in local hook/form state and do not persist it as finance data.

## Acceptance Criteria

- Categories and accounts are displayed with consistent ordering across all relevant screens.
- Missing or invalid `sortOrder` behaves as `0`.
- Accounts without explicit ordering use due day from lowest to highest.
- Current-month payment checklist ignores category ordering and sorts only by due day, then account name.
- Category management allows editing category order.
- Account management does not need an account order field yet.
- `Planejamento` default view focuses on monthly value editing.
- Account creation/editing is available through a dedicated management panel from `Planejamento`.
- New account creation includes category selection.
- New account category selection uses a compact combo/dropdown-style control.
- New accounts are created in the selected category.
- `Resumo` is more compact and no longer expands category totals in every month card by default.
- Current-month payment tracking opens from a dedicated summary action instead of always occupying the summary screen.
- Month/category details are available through a details panel.
- Current-month commitment percentage uses monthly salary plus current month extra balance.
- Future-month commitment percentage uses only monthly salary.
- Existing finance totals and paid/unpaid status behavior remain unchanged.
- TypeScript validation passes.
- Existing tests pass.
- Unit tests cover sorting helpers and current-month commitment behavior where practical.

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
npm run test:coverage
```

When applicable, validate manually on Android through Expo:

```bash
npx expo start
```

Confirm:

- planning opens in the compact value-editing view
- account management opens and closes cleanly
- account creation allows choosing a category
- summary month details open and close cleanly
- current-month payment panel opens and closes cleanly
- ordering is consistent in summary, planning, account management, and payments
- current-month commitment reflects extra balance

## Documentation Requirements

Update README if implementation changes:

- app behavior
- local data behavior
- validation/test commands

Follow:

- `docs/standards/ai-workflow.md`
- `docs/standards/readme-policy.md`
- `docs/standards/testing-policy.md`
