import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { resolveCommitmentColor } from '../../lib/commitmentColor';
import { resolveGoalStatus } from '../../lib/commitmentGoal';
import {
  formatMonthLabel,
  maskCurrency,
  percentageFormatter,
} from '../../lib/formatters';
import { type CategoryAverage, categoryVariation } from '../../lib/spendingTrends';
import { chartPalette, colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import type { Category, FinanceSettings, MonthHistoryEntry } from '../../types/finance';
import { GoalTag } from './GoalTag';

type HistoryCardProps = {
  categories: Pick<Category, 'id' | 'sortOrder'>[];
  categoryAverages: CategoryAverage[];
  entry: MonthHistoryEntry;
  hasEnoughHistory: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  settings: Pick<
    FinanceSettings,
    'commitmentWarningThreshold' | 'commitmentDangerThreshold' | 'commitmentGoal'
  >;
  valuesHidden: boolean;
};

function variationColor(direction: ReturnType<typeof categoryVariation>['direction']) {
  if (direction === 'below') return colors.positive;
  if (direction === 'above') return colors.negativeText;
  return colors.textSecondary;
}

function formatVariationText(
  direction: ReturnType<typeof categoryVariation>['direction'],
  ratio: number | null,
): string {
  if (direction === 'average') return 'na média';
  const sign = direction === 'above' ? '+' : '-';
  return `${sign}${percentageFormatter.format(Math.abs(ratio ?? 0))}`;
}

type DetailTab = 'categories' | 'accounts';

export function HistoryCard({
  categories,
  categoryAverages,
  entry,
  hasEnoughHistory,
  isExpanded,
  onToggle,
  settings,
  valuesHidden,
}: HistoryCardProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('categories');

  const ratio = entry.totalIncome > 0 ? entry.totalExpenses / entry.totalIncome : 0;
  const commitmentColor =
    resolveCommitmentColor(
      ratio,
      settings.commitmentWarningThreshold,
      settings.commitmentDangerThreshold,
    ) ?? colors.commitmentLow;
  const progressWidthPercent = Math.min(ratio * 100, 100);
  const goalRatio = entry.totalIncome > 0 ? ratio : null;
  const goalStatus = resolveGoalStatus(goalRatio, settings.commitmentGoal / 100);

  const liveSortOrderById = new Map(categories.map((c) => [c.id, c.sortOrder]));
  const resolveSortOrder = (id: string, snapshotOrder?: number) =>
    liveSortOrderById.get(id) ?? snapshotOrder ?? 0;

  const sortedCategories = [...entry.categories].sort(
    (a, b) => resolveSortOrder(a.id, a.sortOrder) - resolveSortOrder(b.id, b.sortOrder),
  );

  const categorySortOrderById = new Map(
    entry.categories.map((c) => [c.id, resolveSortOrder(c.id, c.sortOrder)]),
  );
  const sortedAccounts = [...entry.accounts]
    .filter((a) => a.amount > 0)
    .sort((a, b) => {
      const catDiff =
        (categorySortOrderById.get(a.categoryId) ?? 0) -
        (categorySortOrderById.get(b.categoryId) ?? 0);
      if (catDiff !== 0) return catDiff;
      return (a.dueDay ?? 0) - (b.dueDay ?? 0);
    });

  return (
    <View style={styles.card}>
      <Pressable onPress={onToggle} style={styles.header}>
        <Text style={styles.monthLabel}>
          {formatMonthLabel(entry.year, entry.month)}
        </Text>
        <Ionicons
          color={colors.textSecondary}
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={22}
        />
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
              { backgroundColor: commitmentColor, width: `${progressWidthPercent}%` },
            ]}
          />
        </View>
        <Text style={[styles.progressLabel, { color: commitmentColor }]}>
          {percentageFormatter.format(ratio)}
        </Text>
      </View>

      <View style={styles.goalTagRow}>
        <GoalTag status={goalStatus} />
      </View>

      {isExpanded ? (
        <View style={styles.detail}>
          <View style={styles.segmentedControl}>
            <Pressable
              onPress={() => setActiveTab('categories')}
              style={[
                styles.segmentButton,
                activeTab === 'categories' ? styles.segmentButtonActive : null,
              ]}
            >
              <Text
                style={[
                  styles.segmentButtonText,
                  activeTab === 'categories' ? styles.segmentButtonTextActive : null,
                ]}
              >
                Categorias
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('accounts')}
              style={[
                styles.segmentButton,
                activeTab === 'accounts' ? styles.segmentButtonActive : null,
              ]}
            >
              <Text
                style={[
                  styles.segmentButtonText,
                  activeTab === 'accounts' ? styles.segmentButtonTextActive : null,
                ]}
              >
                Contas
              </Text>
            </Pressable>
          </View>

          {activeTab === 'categories'
            ? sortedCategories.map((category, index) => {
                const average = categoryAverages.find(
                  (a) => a.categoryId === category.id,
                );
                const variation =
                  hasEnoughHistory && average
                    ? categoryVariation(category.total, average.average)
                    : null;

                return (
                  <View key={category.id} style={styles.row}>
                    <View
                      style={[
                        styles.categoryDot,
                        {
                          backgroundColor:
                            category.color ?? chartPalette[index % chartPalette.length],
                        },
                      ]}
                    />
                    <Text style={styles.rowName}>{category.name}</Text>
                    {variation ? (
                      <Text
                        style={[
                          styles.rowVariation,
                          { color: variationColor(variation.direction) },
                        ]}
                      >
                        {formatVariationText(variation.direction, variation.ratio)}
                      </Text>
                    ) : null}
                    <Text style={styles.rowAmount}>
                      {maskCurrency(category.total, valuesHidden)}
                    </Text>
                  </View>
                );
              })
            : (() => {
                const categoryMap = new Map(entry.categories.map((c) => [c.id, c]));
                const categoryIndexMap = new Map(
                  sortedCategories.map((c, i) => [c.id, i]),
                );
                const grouped = new Map<string, typeof sortedAccounts>();
                for (const account of sortedAccounts) {
                  const existing = grouped.get(account.categoryId) ?? [];
                  grouped.set(account.categoryId, [...existing, account]);
                }
                return Array.from(grouped.entries()).map(([categoryId, accounts]) => {
                  const cat = categoryMap.get(categoryId);
                  const catIndex = categoryIndexMap.get(categoryId) ?? 0;
                  const dotColor =
                    cat?.color ?? chartPalette[catIndex % chartPalette.length];
                  return (
                    <View key={categoryId}>
                      <View style={styles.groupHeaderRow}>
                        <View
                          style={[styles.categoryDot, { backgroundColor: dotColor }]}
                        />
                        <Text style={styles.groupHeader}>
                          {cat?.name ?? categoryId}
                        </Text>
                      </View>
                      {accounts.map((account) => (
                        <View key={account.id} style={styles.row}>
                          <Text style={styles.rowName}>{account.name}</Text>
                          <Text style={styles.rowAmount}>
                            {maskCurrency(account.amount, valuesHidden)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  );
                });
              })()}
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
  metricsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  metricBlock: {
    flex: 1,
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
  goalTagRow: {
    marginTop: 8,
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
  segmentedControl: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    padding: 6,
  },
  segmentButton: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: 12,
  },
  segmentButtonActive: {
    backgroundColor: colors.accent,
  },
  segmentButtonText: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.button,
  },
  segmentButtonTextActive: {
    color: colors.accentText,
  },
  categoryDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
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
  rowVariation: {
    ...typography.label,
  },
  groupHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  groupHeader: {
    color: colors.textSecondary,
    textTransform: 'uppercase',
    ...typography.label,
  },
});
