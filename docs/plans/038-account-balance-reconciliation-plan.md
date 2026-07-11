# Plan 038 - Account Balance Reconciliation

Status: Implemented, checks passing — commits pending user confirmation

## Spec

`docs/specs/038-account-balance-reconciliation.md`

## Objective

Add a **Saldo em conta** KPI (`Recebido − Pago`) to the current-month KPI grid in `Resumo`, in place of the existing `Próximo venc.` card, so the user can reconcile the app against their real bank balance. Relocate the next-due-account info into the existing `Pagamentos do mês` shortcut card.

## Tasks

| Task   | File                                                | Purpose                                                                                                           |
| ------ | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 038-01 | `docs/tasks/038-01-add-account-balance-helper.md`   | Add pure `calculateAccountBalance` helper to `financeCalculations.ts`, with tests.                                |
| 038-02 | `docs/tasks/038-02-wire-resumo-kpi-and-shortcut.md` | Replace `Próximo venc.` KPI with `Saldo em conta`; move next-due info into the `Pagamentos do mês` shortcut card. |
| 038-03 | `docs/tasks/038-03-update-docs-and-validate.md`     | Update `docs/app-context.md`, run full validation.                                                                |

## Calculation (038-01)

```ts
export function calculateAccountBalance(
  availableIncome: number,
  totalPaid: number,
): number {
  return availableIncome - totalPaid;
}
```

- Pure, no rounding/clamping — mirrors the simplicity of the existing `calculateSurplusOrShortfall`.
- Placed in `src/lib/financeCalculations.ts`, right after `calculateSurplusOrShortfall` (before `calculatePaymentSummary`).

## UI Wiring (038-02)

- `SummaryScreen.tsx` computes `currentAccountBalance = calculateAccountBalance(currentAvailableIncome, paymentSummary.totalPaid)`.
- The KPI grid's 4th card changes from `Próximo venc.` to `Saldo em conta`, value = `maskCurrency(currentAccountBalance, valuesHidden)`. Its value and border use `colors.info` when zero or positive and `colors.negativeText` when negative.
- `KpiCard` gains an optional `borderColor` prop used only by this card; all other `KpiCard` usages keep the default border color.
- The next-due-account line (`Próximo: dia {dueDay} · {name}` + relative day label) moves into `paymentShortcutLeft`, below the progress bar, rendered only when `nextDueAccount` exists — no fallback text when it doesn't.
- No changes to `PaymentSummaryPanel.tsx` (the `Pagamentos` screen) — out of scope per spec.

## Notes

- Do not touch `calculatePaymentSummary`, `calculateSurplusOrShortfall`, or any other existing KPI (`Despesas`, `Pendente`, `Pago`).
- No new settings, no backup shape change — this is a derived, read-only value.
- Scope is current-month `Resumo` only; Projeção, Histórico, Gráficos, and `Pagamentos` are untouched.

## Tests (038-01)

- `calculateAccountBalance` returns a positive result when `availableIncome > totalPaid`.
- Returns `0` when `availableIncome === totalPaid`.
- Returns a negative result when `totalPaid > availableIncome`.

## Validation

- `npm run check`
- `npm test`
