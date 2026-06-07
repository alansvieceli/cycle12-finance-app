# Task 030-04 - Add HistoryCard Component

Status: Pending

## Spec

`docs/specs/030-month-history.md`

## Plan

`docs/plans/030-month-history-plan.md`

## Goal

Create `src/components/finance/HistoryCard.tsx` — a card that shows a past month's income vs expenses with a colored progress bar and expands inline (accordion) to show Categorias or Contas breakdown tabs.

## Files

- Create: `src/components/finance/HistoryCard.tsx`

## Steps

1. Create `src/components/finance/HistoryCard.tsx` with the following structure:

```tsx
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { resolveCommitmentColor } from '../../lib/commitmentColor';
import {
  formatMonthLabel,
  maskCurrency,
  percentageFormatter,
} from '../../lib/formatters';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { FinanceSettings, MonthHistoryEntry } from '../../types/finance';

type HistoryCardProps = {
  entry: MonthHistoryEntry;
  settings: Pick<
    FinanceSettings,
    'commitmentWarningThreshold' | 'commitmentDangerThreshold'
  >;
  valuesHidden: boolean;
};

type DetailTab = 'categories' | 'accounts';

export function HistoryCard({ entry, settings, valuesHidden }: HistoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>('categories');

  const ratio = entry.totalIncome > 0 ? entry.totalExpenses / entry.totalIncome : 0;
  const commitmentColor =
    resolveCommitmentColor(
      ratio,
      settings.commitmentWarningThreshold,
      settings.commitmentDangerThreshold,
    ) ?? colors.commitmentLow;
  const progressWidth = `${Math.min(ratio * 100, 100)}%`;

  const sortedCategories = [...entry.categories].sort((a, b) => b.total - a.total);
  const sortedAccounts = [...entry.accounts]
    .filter((a) => a.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return (
    <View style={styles.card}>
      <Pressable onPress={() => setExpanded((prev) => !prev)} style={styles.header}>
        <Text style={styles.monthLabel}>
          {formatMonthLabel(entry.year, entry.month)}
        </Text>
        <Text style={styles.chevron}>{expanded ? '∧' : '›'}</Text>
      </Pressable>

      <View style={styles.metricsRow}>
        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>RECEBIDO</Text>
          <Text style={[styles.metricValue, styles.positiveText]}>
            {maskCurrency(entry.totalIncome, valuesHidden)}
          </Text>
        </View>
        <View style={styles.metricBlock}>
          <Text style={styles.metricLabel}>PAGO</Text>
          <Text style={[styles.metricValue, styles.negativeText]}>
            {maskCurrency(entry.totalExpenses, valuesHidden)}
          </Text>
        </View>
      </View>

      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: commitmentColor, width: progressWidth },
            ]}
          />
        </View>
        <Text style={[styles.progressLabel, { color: commitmentColor }]}>
          {valuesHidden ? '••' : percentageFormatter.format(ratio)}
        </Text>
      </View>

      {expanded ? (
        <View style={styles.detail}>
          <View style={styles.tabs}>
            <Pressable
              onPress={() => setActiveTab('categories')}
              style={[styles.tab, activeTab === 'categories' ? styles.tabActive : null]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'categories' ? styles.tabActiveText : null,
                ]}
              >
                Categorias
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('accounts')}
              style={[styles.tab, activeTab === 'accounts' ? styles.tabActive : null]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'accounts' ? styles.tabActiveText : null,
                ]}
              >
                Contas
              </Text>
            </Pressable>
          </View>

          {activeTab === 'categories'
            ? sortedCategories.map((category) => (
                <View key={category.id} style={styles.row}>
                  <Text style={styles.rowName}>{category.name}</Text>
                  <Text style={styles.rowAmount}>
                    {maskCurrency(category.total, valuesHidden)}
                  </Text>
                </View>
              ))
            : sortedAccounts.map((account) => (
                <View key={account.id} style={styles.row}>
                  <Text style={styles.rowName}>{account.name}</Text>
                  <Text style={styles.rowAmount}>
                    {maskCurrency(account.amount, valuesHidden)}
                  </Text>
                </View>
              ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 18,
    gap: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthLabel: {
    color: colors.textPrimary,
    ...typography.sectionTitle,
  },
  chevron: {
    color: colors.textSecondary,
    ...typography.sectionTitle,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  metricBlock: {
    gap: 4,
  },
  metricLabel: {
    color: colors.textSecondary,
    textTransform: 'uppercase',
    ...typography.label,
  },
  metricValue: {
    ...typography.amountMedium,
  },
  positiveText: {
    color: colors.positive,
  },
  negativeText: {
    color: colors.negativeText,
  },
  progressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  progressTrack: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    flex: 1,
    height: 10,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 999,
    height: '100%',
  },
  progressLabel: {
    ...typography.button,
  },
  detail: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: 8,
    paddingTop: 12,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  tab: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: 14,
  },
  tabActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  tabText: {
    color: colors.textPrimary,
    ...typography.button,
  },
  tabActiveText: {
    color: colors.accentText,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 36,
  },
  rowName: {
    color: colors.textPrimary,
    flex: 1,
    ...typography.body,
  },
  rowAmount: {
    color: colors.textPrimary,
    ...typography.body,
  },
});
```

2. Run `npx tsc --noEmit` and confirm no type errors.

## Acceptance Criteria

- `HistoryCard` renders month label, RECEBIDO (green) and PAGO (red) values, and a colored progress bar.
- Tapping the card toggles expanded state.
- Expanded state shows `Categorias` and `Contas` tabs, defaulting to `Categorias`.
- `Categorias` tab lists category name and total, sorted by total descending.
- `Contas` tab lists account name and amount, sorted by amount descending, hiding zero-amount accounts.
- All monetary values respect `valuesHidden`.
- TypeScript compilation passes.
