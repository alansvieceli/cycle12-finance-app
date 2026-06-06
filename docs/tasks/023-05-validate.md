# Task 023-05 - Validate

## Plan

`docs/plans/023-graficos-tab-revision-plan.md`

## Goal

Run all validations and confirm the `Gráficos` tab behavior manually on device.

## Steps

1. Run TypeScript check.
2. Run unit tests.
3. Validate manually on Android through Expo.

## Validation

```bash
npx tsc --noEmit
```

```bash
npm test
```

```bash
npx expo start
```

## Manual Checks

- Aba Gráficos mostra 4 painéis: Comprometimento → Pago vs Pendente → Categorias → Saldo.
- Comprometimento por mês: barra colorida por threshold (branco/amarelo/vermelho) e % à direita.
- Pago vs Pendente: dois cards (Pago verde / Pendente vermelho) + barra de progresso + "X de Y contas".
- Categorias no mês atual: donut e legenda intactos.
- Saldo por mês: gráfico de barras +/- intacto.
- Estados vazios não crasham.
- Aba Resumo permanece intacta.
