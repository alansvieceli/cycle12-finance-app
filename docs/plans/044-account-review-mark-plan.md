# Account Review Mark Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking and live in the task files under `docs/tasks/`.

**Goal:** Let the user mark an account's current-month value as reviewed in `Planejar` and see that mark on every account row in `Pagamentos`, with the mark clearing itself when the planning window advances.

**Architecture:** The mark is a new optional `isReviewed` field on the existing per-account, per-month record (`MonthlyPaymentStatus`). Because `advanceWindow` already drops that month's records, the monthly reset needs no new code. Two pure helpers in `financeCalculations.ts` read and toggle the flag; the hook exposes one action; two components render it.

**Tech Stack:** React Native + Expo, TypeScript, AsyncStorage, Jest with React Native Testing Library, Biome, Knip.

Status: Planned

## Spec

`docs/specs/044-account-review-mark.md`

## Global Constraints

- Portuguese UI copy uses sentence case (`docs/standards/ui-copy-policy.md`).
- No new dependency, no backend, no new setting, no new screen.
- `BACKUP_FORMAT_VERSION` stays `1` and the storage key does not change; old stored state and old `.c12f` backups must keep loading.
- The mark changes no calculation: expenses, commitment, surplus, paid/pending, account balance, and reminders behave exactly as today.
- Reviewed uses `colors.info` (blue), never green — green already means paid in `Pagamentos`.
- Duplicated lines in `src/` stay at or below 5% (`docs/standards/code-duplication-policy.md`).
- Close with the full gate: `npm run check`.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `src/types/finance.ts` | `MonthlyPaymentStatus` gains optional `isReviewed`; the type comment states the record is the account's monthly status, not payment alone. |
| `src/lib/financeCalculations.ts` | `findMonthlyStatus` (private), `isAccountItemReviewed`, `toggleAccountReview`. `isAccountItemPaid` is refactored onto the shared finder. |
| `src/lib/financeBackup.ts` | `validatePaymentStatuses` carries `isReviewed` through when it is `true`. |
| `src/hooks/useFinanceState.ts` | `toggleMonthlyReviewStatus` action delegating to `toggleAccountReview`. |
| `src/screens/PlanningScreen.tsx` | Forwards `paymentStatuses` and the toggle to the editor. |
| `src/components/finance/MonthlyValueEditor.tsx` | Review button beside the account selector; marks in the selector options. |
| `src/components/common/SelectField.tsx` | Optional `marked` per option, rendering the blue mark. |
| `src/components/finance/CurrentMonthPaymentChecklist.tsx` | Fixed 24px review column on each payment row. |
| `docs/app-context.md` | Documents the mark and the reset. |

## Tasks

| Task | File | Deliverable |
| ------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 044-01 | `docs/tasks/044-01-add-review-status-helpers.md` | `isReviewed` field plus the two pure helpers, unit tested. |
| 044-02 | `docs/tasks/044-02-persist-review-mark.md` | Backup carries the flag; window advance drops it. Both proven by tests. |
| 044-03 | `docs/tasks/044-03-add-review-toggle-to-planejar.md` | The toggle action and the `Planejar` button plus selector marks, component tested. |
| 044-04 | `docs/tasks/044-04-show-review-column-in-payments.md` | The read-only column in `Pagamentos`. |
| 044-05 | `docs/tasks/044-05-update-docs-and-validate.md` | `docs/app-context.md` and the full gate. |

Order matters: 044-01 defines the helpers every later task consumes, and 044-02 locks the persistence behavior before any UI depends on it.

## Interfaces

Produced by 044-01, consumed by 044-02 through 044-04:

```ts
export function isAccountItemReviewed(
  paymentStatuses: MonthlyPaymentStatus[],
  accountItemId: string,
  projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
): boolean;

export function toggleAccountReview(
  paymentStatuses: MonthlyPaymentStatus[],
  accountItemId: string,
  projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
): MonthlyPaymentStatus[];
```

Produced by 044-03, consumed by nothing else:

```ts
// useFinanceState().actions
toggleMonthlyReviewStatus(
  accountItemId: string,
  projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
): void;
```

## Notes

- `toggleAccountReview` creates the record with `isPaid: false` when none exists, so marking an account reviewed never marks it paid.
- Restore keeps `isReviewed` only when it is `true`, writing `undefined` otherwise. `JSON.stringify` drops undefined keys, so storage, the canonical hash, and the existing `toEqual(sampleState)` round-trip assertion all stay unchanged.
- The review column in `Pagamentos` sits inside the row `Pressable` that toggles paid, so tapping it toggles paid exactly like tapping the account name or the amount does. That is intended — the mark is display-only and the row keeps one behavior.
- No month-level check and no counter. Out of scope per the spec.

## Validation

- `npm run check`
