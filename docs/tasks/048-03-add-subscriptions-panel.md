# Task 048-03 - Add Subscriptions Panel to Gráficos

## Objective

Show the subscription totals and their distribution in the read-only analysis
tab, reusing the existing donut component.

## Acceptance Criteria

- [ ] `Gráficos` shows an `Assinaturas` panel below the existing ones.
- [ ] The panel shows the monthly total, the yearly total, and
      `consome N% do salário`.
- [ ] The share uses the salary alone and ignores the current month extra
      balance.
- [ ] A neutral placeholder replaces the percentage when the salary is zero.
- [ ] The distribution chart reuses `CategoryBarChart` unchanged, with one slice
      per subscription, its own color, and a legend naming each one.
- [ ] The panel shows an empty state when no subscription is registered.
- [ ] The eye toggle masks every monetary value in the panel.
- [ ] Adding, editing, or deleting a subscription in `Cadastros` updates the
      panel immediately.
- [ ] Every existing chart, calculation, and reminder test still passes
      unchanged.
- [ ] `npm run check` passes.
- [ ] `npm run dup` passes.
