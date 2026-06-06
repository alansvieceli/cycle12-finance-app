# Task 023-03 - Add PaymentSummaryPanel Component

## Plan

`docs/plans/023-graficos-tab-revision-plan.md`

## Goal

Add a read-only `PaymentSummaryPanel` component under `src/components/finance/`. It shows paid and pending amounts for the current month as two side-by-side cards, a progress bar, and an account count.

## Steps

1. Create `src/components/finance/PaymentSummaryPanel.tsx`.
2. Render two cards: Pago (green) and Pendente (red).
3. Render a green progress bar below showing `totalPaid / (totalPaid + totalPending)`.
4. Render footer text with percentage paid and account count.
5. Show empty state text when `totalAccounts` is zero.

## Acceptance Criteria

- Paid amount renders in `colors.positive`.
- Pending amount renders in `colors.negativeText`.
- Progress bar width reflects the paid fraction.
- Footer shows percentage and account count.
- Empty state renders without crashing.
- TypeScript passes.
