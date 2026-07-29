# Task 048-03 - Add Subscriptions Panel to Gráficos

## Objective

Show the subscription totals and their distribution in the read-only analysis
tab, reusing the existing donut component.

## Acceptance Criteria

- [x] `Gráficos` shows an `Assinaturas` panel below the existing ones.
- [x] The panel shows the monthly total, the yearly total, and
      `consome N% do salário`.
- [x] The share uses the salary alone and ignores the current month extra
      balance.
- [x] A neutral placeholder replaces the percentage when the salary is zero.
- [x] The distribution chart reuses `CategoryBarChart`, with one slice per
      subscription, its own color, and a legend naming each one. The component
      gained three optional props (`footnote`, `secondaryTotalLabel`,
      `secondaryTotalText`); its existing use in `Categorias no mês atual` is
      untouched.
- [x] The panel shows an empty state when no subscription is registered.
- [x] The eye toggle masks every monetary value in the panel.
- [ ] Adding, editing, or deleting a subscription in `Cadastros` updates the
      panel immediately. Pending task 048-02, which builds that section.
- [x] Every existing chart, calculation, and reminder test still passes
      unchanged.
- [x] `npm run check` passes.
- [x] `npm run dup` passes.
