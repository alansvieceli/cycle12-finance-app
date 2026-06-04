# Plan 006 - Summary Visibility And Payment Status

## Spec Reference

`docs/specs/006-summary-visibility-and-payment-status.md`

## Objective

Make the summary month count configurable from the app and add manual paid/unpaid tracking for current-month account values.

## Assumptions

- Keep the app local-only and offline.
- Keep `Resumo` focused on read-only calculated information plus current-month payment tracking.
- Keep planned financial totals independent from paid/unpaid status.
- Use simple React Native controls without adding navigation or UI dependencies.
- Preserve compatibility with stored data that does not have `paymentStatuses`.

## Tasks

| # | File | Description |
|---|------|-------------|
| 1 | `docs/tasks/006-01-add-plan-and-tasks.md` | Create the implementation plan and task breakdown |
| 2 | `docs/tasks/006-02-expose-visible-month-setting.md` | Add the visible month count control to Ajustes and keep Resumo limited |
| 3 | `docs/tasks/006-03-add-payment-status-model.md` | Add payment status data model, persistence normalization, deletion cleanup, and payment total logic |
| 4 | `docs/tasks/006-04-add-current-month-payment-checklist.md` | Add current-month paid/unpaid checklist to Resumo |
| 5 | `docs/tasks/006-05-update-docs-and-validate.md` | Update README and run final validation |

## Sequential Order

Tasks must be executed in order.

## Validation

After implementation tasks:

```bash
npx tsc --noEmit
```

When tests are affected or available:

```bash
npm test
```

At the end:

```bash
npm run test:coverage
```

When applicable, validate manually on Android through Expo.

## Out of Scope

- Backend
- Authentication
- Automatic payment detection
- Bank integration
- Installment tracking
- Purchase-level credit card tracking
