# Task 047-01 - Replace Monthly Balance Chart

## Objective

Turn `Saldo por mês` into a diverging horizontal bar list that fits every
visible month.

## Acceptance Criteria

- [x] `calculateBalanceBarRatio` returns a proportional length, `0` for a zero
      balance, and a minimum visible length for any non-zero balance.
- [x] `MonthlyBarChart` renders one row per month with label, diverging bar, and
      formatted balance.
- [x] Negative balances grow left in the negative color, positive balances grow
      right in the positive color, from a shared center zero line.
- [x] The `Valores` toggle and its value list are removed.
- [x] A bottom legend names `falta` and `sobra`.
- [x] `Total do período` and `Total negativo no período` are unchanged.
- [x] The eye toggle masks every monetary value in the panel.
- [x] `toGiftedBalanceBarData`, `GiftedBarPoint`, and their test are deleted.
- [x] Focused tests pass.
- [x] README and app context are updated.
- [x] `npm run check` passes.
- [x] `npm run dup` passes.
