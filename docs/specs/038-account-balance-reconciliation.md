# Spec 038 - Account Balance Reconciliation

## Goal

Show a new value on `Resumo` — **Saldo em conta** (`Recebido − Pago`) — so the user can reconcile the app against their real bank balance at a glance, without doing the math manually.

## Context

The `Resumo` balance panel already shows **Recebido** (`calculateAvailableIncome`: salary + current month extra). The KPI grid below it already shows **Pago** (`paymentSummary.totalPaid`) and **Pendente** (`paymentSummary.totalPending`), from `calculatePaymentSummary`. Today there is no single value combining "what came in" and "what already went out", so the user has to subtract manually to check against their bank statement.

## Non-Goals

- Do not add any new setting, stored field, or backup shape change. This is a purely derived, read-only value.
- Do not change `calculateSurplusOrShortfall`, `calculatePaymentSummary`, or any existing KPI (`Despesas`, `Pendente`, `Pago`).
- Do not surface this value in Projeção, Histórico, Gráficos, or the `Pagamentos` secondary screen. Current-month `Resumo` only.
- Do not color the value based on sign (no red/negative treatment if `Pago` exceeds `Recebido`). Always the same neutral accent color.

## UX Behavior

### Resumo — current month KPI grid

- The 2x2 KPI grid changes from `Despesas / Pendente / Pago / Próximo venc.` to `Despesas / Pendente / Pago / Saldo em conta`.
- **Saldo em conta** = `Recebido − Pago` (`currentAvailableIncome - paymentSummary.totalPaid`).
- Value uses the existing `maskCurrency` formatting and respects the `valuesHidden` toggle, like every other monetary value on the screen.
- Value color is always `colors.info` (the app's existing neutral/info blue), regardless of whether the result is positive or negative.
- The card gets a subtle border in `colors.info` to visually distinguish it from the other three KPI cards (per approved mockup).

### Resumo — "Pagamentos do mês" shortcut card

- The next-due-account info (day, account name/category, and the relative day label — "hoje" / "em Nd" / "Nd atrás") that used to live in the KPI grid's "Próximo venc." card moves here as an additional line inside the existing shortcut card, below the progress bar.
- Same visibility rule as today: only rendered when a next-due account exists (`nextDueAccount` truthy). No line is shown when there is none.
- Format: `Próximo: dia {dueDay} · {accountName}` followed by the relative label, mirroring the wording already used by the KPI card being removed.

## Implementation Notes

- Add a small pure helper to `src/lib/financeCalculations.ts`:
  ```ts
  export function calculateAccountBalance(
    availableIncome: number,
    totalPaid: number,
  ): number {
    return availableIncome - totalPaid;
  }
  ```
- In `SummaryScreen.tsx`, compute `currentAccountBalance = calculateAccountBalance(currentAvailableIncome, paymentSummary.totalPaid)` and pass it to a `KpiCard` in place of the current `Próximo venc.` card. Force its color via a fixed prop/style (not derived from sign).
- Move the `nextDueAccount` / `nextDueAccountCategoryName` / `daysUntilNextDue` rendering out of the KPI grid and into the `paymentShortcut` block (`styles.paymentShortcut`), as a new `Text` line, conditionally rendered.
- No changes to `PaymentSummaryPanel.tsx` (used by the `Pagamentos` screen) — out of scope.
- Update `docs/app-context.md` (`Resumo` section) to mention the new "Saldo em conta" KPI and the relocated next-due line, per the app-context update policy.

## Tests

Unit tests for `calculateAccountBalance` in `financeCalculations.test.ts`:

- Positive result when `availableIncome > totalPaid`.
- Zero result when `availableIncome === totalPaid`.
- Negative result when `totalPaid > availableIncome`.

## Acceptance Criteria

- `Resumo` (current month) shows a **Saldo em conta** KPI card equal to `Recebido − Pago`, formatted with `maskCurrency`, hidden by the existing eye toggle, always in `colors.info` regardless of sign.
- The KPI grid no longer shows a `Próximo venc.` card.
- The `Pagamentos do mês` shortcut card shows the next-due-account line (day, name, relative day label) when a next-due account exists, and shows nothing extra when it doesn't.
- No other screen or stored data changes.
- `docs/app-context.md` is updated to describe the new KPI and the relocated next-due line.
- TypeScript validation passes.
- Unit tests pass.

## Validation

```bash
npm run check && npm run test:coverage
```
