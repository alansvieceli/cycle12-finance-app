# Spec 006 - Summary Visibility And Payment Status

## Objective

Improve monthly finance tracking by making the summary respect the configured visible month count and by adding a manual paid status for current-month account values.

## Context

The app already stores up to 12 projection months and has `visibleMonthCount` in settings, but the summary still shows the full projection window. The user needs to configure how many months are visible in the summary, with a maximum of 12.

The user also needs to manually mark current-month account values as already paid. This is for personal tracking and should make the current month easier to manage without changing the planned amount itself.

## Goals

- Let the user configure how many months appear in the `Resumo` tab.
- Keep the maximum visible month count at 12.
- Keep stored monthly values available for up to 12 months even when fewer months are shown.
- Add manual paid/unpaid tracking for account values in the current month.
- Make paid status easy to scan in the current-month experience.
- Preserve local-only persistence.
- Keep the app simple and maintainable.

## Non-goals

- Do not add backend code.
- Do not add authentication.
- Do not add paid services.
- Do not add automatic bank reconciliation.
- Do not infer payment status automatically from due dates.
- Do not change planned monthly values when marking something as paid.
- Do not add credit card purchase-level tracking.
- Do not add installment tracking.

## Visible Month Count

The app should continue generating and storing data for up to 12 projection months.

The user-facing summary should show only the configured number of visible months.

Expected behavior:

- `visibleMonthCount` can be configured from 1 to 12.
- The default remains 12 for empty or older stored data.
- `Resumo` displays only the first `visibleMonthCount` projection months.
- `Planejamento` may continue allowing editing across the full 12-month planning window unless a future UX decision changes that.
- If the user configures 5 months, the summary shows 5 months.
- If the user configures 7 months, the summary shows 7 months.
- Values beyond the visible summary window remain stored and can be used later.

## Payment Status

Payment status should be manual and tied to an account item for a specific month and year.

Recommended data model:

```ts
type MonthlyPaymentStatus = {
  accountItemId: string;
  month: MonthNumber;
  year: number;
  isPaid: boolean;
};
```

Expected finance state addition:

```ts
paymentStatuses: MonthlyPaymentStatus[];
```

If older stored data does not include payment statuses, default to an empty list.

## Payment UX

The best initial experience should focus on the current month because that is where the user needs day-to-day payment tracking.

Recommended UX:

- Add a current-month payment checklist in `Resumo`.
- Show each account item for the current month with:
  - account name
  - category name
  - due day
  - planned amount
  - paid/unpaid control
- Use a clear checkbox or compact toggle for the paid state.
- Visually separate paid items from pending items.
- Show simple current-month totals:
  - total planned
  - total paid
  - total pending
- Keep the paid status independent from planned expense totals.

Rationale:

- The user can quickly open the app and see what is still pending this month.
- Paid status does not rewrite the financial plan.
- The same data model can support future month payment status later if needed.

## Calculation Rules

Marking an item as paid should not change:

- monthly total expenses
- category totals
- salary commitment percentage
- projected surplus or shortfall

Paid status should affect only payment tracking views and payment-specific totals.

Payment-specific totals:

- `totalPaid`: sum of current-month account values marked as paid.
- `totalPending`: sum of current-month account values not marked as paid.

If an account item has no current-month value, treat its amount as 0 for payment totals.

## Persistence Rules

Payment statuses must be saved locally with the rest of the finance state.

When deleting an account item, remove its related payment statuses.

When deleting a category, remove payment statuses for account items deleted with that category.

Stored data migration must tolerate missing `paymentStatuses`.

## Acceptance Criteria

- `Resumo` respects `visibleMonthCount`.
- The user can configure visible month count from 1 to 12.
- Stored values outside the visible summary window are preserved.
- The current month shows a payment checklist or equivalent payment tracking view.
- The user can manually mark current-month account values as paid or unpaid.
- Paid/unpaid state persists locally.
- Paid status does not change planned totals or surplus/shortfall calculations.
- Deleting account items or categories removes related payment statuses.
- Older stored data without payment status still loads.
- TypeScript validation passes.
- Existing tests pass.
- New business logic tests are added for payment totals or status handling where practical.

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

Confirm on Android emulator:

- `Resumo` shows only the configured number of months.
- Current-month paid/unpaid controls are usable.
- Payment status remains after app reload.

## Documentation Requirements

Update README if implementation changes:

- app behavior
- local storage behavior
- validation/test commands

Follow:

- `docs/standards/ai-workflow.md`
- `docs/standards/readme-policy.md`
- `docs/standards/testing-policy.md`
