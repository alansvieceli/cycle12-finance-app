# Task 038-02 - Wire Resumo KPI and Shortcut Card

Status: Not started

## Spec

`docs/specs/038-account-balance-reconciliation.md`

## Plan

`docs/plans/038-account-balance-reconciliation-plan.md`

## Goal

Replace the `Próximo venc.` KPI card with a `Saldo em conta` KPI card (`Recebido − Pago`, always `colors.info`), and move the next-due-account info into the `Pagamentos do mês` shortcut card below it.

## Files

- Modify: `src/screens/SummaryScreen.tsx`

## Steps

- [ ] **Step 1: Import the new helper**

In `src/screens/SummaryScreen.tsx`, add `calculateAccountBalance` to the existing import from `'../lib/financeCalculations'` (keep alphabetical order):

```ts
import {
  calculateAccountBalance,
  calculateAvailableIncome,
  calculateCategoryTotals,
  calculateIncomeCommitmentPercentage,
  calculatePaymentSummary,
  calculateMonthlyTotalExpenses,
  calculateSurplusOrShortfall,
  getMonthlyValueAmount,
  isAccountItemPaid,
  ProjectionMonth,
} from '../lib/financeCalculations';
```

- [ ] **Step 2: Remove the now-unused `nextDueAccountCategoryName`**

Delete this block (it was only used by the KPI card's `detail` prop, which this task removes):

```ts
const nextDueAccountCategoryName = nextDueAccount
  ? categoryNamesById[nextDueAccount.categoryId]
  : undefined;
```

- [ ] **Step 3: Compute `currentAccountBalance`**

Right after the `currentAvailableIncome` declaration:

```ts
const currentAvailableIncome = currentProjectionMonth
  ? calculateAvailableIncome(financeState.settings, currentProjectionMonth)
  : 0;
```

add:

```ts
const currentAccountBalance = calculateAccountBalance(
  currentAvailableIncome,
  paymentSummary.totalPaid,
);
```

- [ ] **Step 4: Add a `borderColor` prop to `KpiCard`**

Replace the `KpiCard` function definition:

```tsx
function KpiCard({
  color,
  detail,
  label,
  subvalue,
  value,
}: {
  color?: string;
  detail?: string;
  label: string;
  subvalue?: string;
  value: string;
}) {
  return (
    <View style={styles.kpiCard}>
```

with:

```tsx
function KpiCard({
  borderColor,
  color,
  detail,
  label,
  subvalue,
  value,
}: {
  borderColor?: string;
  color?: string;
  detail?: string;
  label: string;
  subvalue?: string;
  value: string;
}) {
  return (
    <View style={[styles.kpiCard, borderColor ? { borderColor } : null]}>
```

(the rest of the function body is unchanged).

- [ ] **Step 5: Replace the `Próximo venc.` card with `Saldo em conta`**

Replace this block:

```tsx
<KpiCard
  color={colors.commitmentMedium}
  label="Próximo venc."
  value={nextDueAccount ? `Dia ${nextDueAccount.dueDay}` : 'N/A'}
  detail={
    nextDueAccount
      ? [nextDueAccount.name, nextDueAccountCategoryName].filter(Boolean).join(' - ')
      : undefined
  }
  subvalue={
    daysUntilNextDue === null
      ? undefined
      : daysUntilNextDue === 0
        ? 'hoje'
        : daysUntilNextDue < 0
          ? `${Math.abs(daysUntilNextDue)}d atrás`
          : `em ${daysUntilNextDue}d`
  }
/>
```

with:

```tsx
<KpiCard
  borderColor={colors.info}
  color={colors.info}
  label="Saldo em conta"
  value={maskCurrency(currentAccountBalance, valuesHidden)}
/>
```

- [ ] **Step 6: Move the next-due line into the payment shortcut card**

In the `paymentShortcut` block, add a conditional `Text` right after the progress-track `View` (still inside `styles.paymentShortcutLeft`):

```tsx
{
  currentMonthPayableAccounts.length > 0 ? (
    <View style={styles.paymentProgressTrack}>
      <View
        style={[
          styles.paymentProgressFill,
          {
            width: `${
              ((currentMonthPayableAccounts.length -
                currentMonthPendingAccounts.length) /
                currentMonthPayableAccounts.length) *
              100
            }%`,
          },
        ]}
      />
    </View>
  ) : null;
}
{
  nextDueAccount ? (
    <Text style={styles.paymentShortcutNextDue}>
      Próximo: dia {nextDueAccount.dueDay} · {nextDueAccount.name}
      {daysUntilNextDue === null
        ? ''
        : daysUntilNextDue === 0
          ? ' · hoje'
          : daysUntilNextDue < 0
            ? ` · ${Math.abs(daysUntilNextDue)}d atrás`
            : ` · em ${daysUntilNextDue}d`}
    </Text>
  ) : null;
}
```

- [ ] **Step 7: Add the `paymentShortcutNextDue` style**

Right after `paymentShortcutHint` in the `StyleSheet.create` call:

```ts
  paymentShortcutHint: {
    color: colors.textSecondary,
    letterSpacing: 0,
    marginTop: 5,
    ...typography.bodySmall,
  },
  paymentShortcutNextDue: {
    color: colors.commitmentMedium,
    letterSpacing: 0,
    marginTop: 8,
    ...typography.bodySmall,
  },
```

- [ ] **Step 8: Typecheck and lint**

Run: `npx tsc --noEmit`
Expected: no errors (confirms no unused variables and correct prop types).

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 9: Visually verify spacing on the emulator**

Start the app (it should already be running with hot reload) and open `Resumo`. Confirm:

- The KPI grid shows `Despesas / Pendente / Pago / Saldo em conta`, with the last card visibly bordered in blue and its label not clipped or overlapping the value.
- The `Pagamentos do mês` card shows the `Próximo: dia N · Nome` line only when a next-due account exists, with normal spacing below the progress bar (no overlap with the "Detalhes" button).
- Toggle the eye icon (hide values) and confirm `Saldo em conta` masks like the other KPIs.

- [ ] **Step 10: Commit**

```bash
git add src/screens/SummaryScreen.tsx
git commit -m "feat: add saldo em conta kpi and relocate next due info"
```

## Acceptance Criteria

- The KPI grid shows `Despesas`, `Pendente`, `Pago`, `Saldo em conta` (no more `Próximo venc.`).
- `Saldo em conta` value equals `calculateAccountBalance(currentAvailableIncome, paymentSummary.totalPaid)`, formatted with `maskCurrency`, respecting `valuesHidden`, always rendered in `colors.info` with a `colors.info` border.
- The `Pagamentos do mês` shortcut card shows `Próximo: dia {dueDay} · {name}` plus the relative day label, only when `nextDueAccount` exists; nothing extra renders when it doesn't.
- No unused variables remain (`nextDueAccountCategoryName` removed).
- `npx tsc --noEmit` and `npm run lint` pass.
- Spacing looks correct on the running app (no clipped text, no overlapping elements).
