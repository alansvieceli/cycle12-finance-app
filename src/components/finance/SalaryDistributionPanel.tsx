import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { maskCurrency } from '../../lib/formatters';
import type { SalaryDistribution } from '../../lib/salaryDistribution';
import { colors } from '../../theme/colors';
import { panelStyles } from '../../theme/sharedStyles';
import { typography } from '../../theme/typography';

const TAIL_SHARE_THRESHOLD = 0.08;

const wholePercentFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 0,
  style: 'percent',
});

type SalaryDistributionPanelProps = {
  distribution: SalaryDistribution;
  valuesHidden: boolean;
};

export function SalaryDistributionPanel({
  distribution,
  valuesHidden,
}: SalaryDistributionPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!distribution.hasSalary) {
    return (
      <View style={styles.panel}>
        <Text style={styles.kicker}>Alocação do salário</Text>
        <Text style={styles.emptyText}>
          Configure o salário para ver a distribuição.
        </Text>
      </View>
    );
  }

  const visibleSegments = distribution.segments.filter(
    (segment) => segment.share >= TAIL_SHARE_THRESHOLD,
  );
  const tailShare = distribution.segments
    .filter((segment) => segment.share < TAIL_SHARE_THRESHOLD)
    .reduce((sum, segment) => sum + segment.share, 0);
  const largestSegmentValue = distribution.segments[0]?.value ?? 0;

  return (
    <View style={styles.panel}>
      <Text style={styles.kicker}>Alocação do salário</Text>

      <View style={styles.bar}>
        {visibleSegments.map((segment) => (
          <View
            key={segment.categoryId}
            style={[
              styles.segment,
              { backgroundColor: segment.color, width: `${segment.share * 100}%` },
            ]}
          >
            <Text style={styles.segmentLabel} numberOfLines={1}>
              {wholePercentFormatter.format(segment.share)}
            </Text>
          </View>
        ))}
        {distribution.tailGroupedCount > 0 ? (
          <View
            style={[
              styles.segment,
              styles.tailSegment,
              { width: `${tailShare * 100}%` },
            ]}
          >
            {tailShare >= TAIL_SHARE_THRESHOLD ? (
              <Text style={styles.segmentLabel} numberOfLines={1}>
                +{distribution.tailGroupedCount}
              </Text>
            ) : null}
          </View>
        ) : null}
        {!distribution.isOverBudget && distribution.leftoverShare > 0 ? (
          <View
            style={[
              styles.segment,
              styles.leftoverSegment,
              { width: `${distribution.leftoverShare * 100}%` },
            ]}
          >
            {distribution.leftoverShare >= TAIL_SHARE_THRESHOLD ? (
              <Text style={styles.leftoverLabel} numberOfLines={1}>
                sobra {wholePercentFormatter.format(distribution.leftoverShare)}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>

      <Pressable
        onPress={() => setIsExpanded((current) => !current)}
        style={styles.toggle}
      >
        <Text style={styles.toggleText}>
          {isExpanded
            ? 'ocultar'
            : `ver por categoria (${distribution.segments.length})`}
        </Text>
      </Pressable>

      {isExpanded ? (
        <ScrollView style={styles.list} nestedScrollEnabled>
          {distribution.segments.map((segment) => (
            <View key={segment.categoryId} style={styles.row}>
              <View style={[styles.swatch, { backgroundColor: segment.color }]} />
              <Text style={styles.rowName} numberOfLines={1}>
                {segment.label}
              </Text>
              <View style={styles.miniBarTrack}>
                <View
                  style={[
                    styles.miniBarFill,
                    {
                      backgroundColor: segment.color,
                      width: `${
                        largestSegmentValue > 0
                          ? (segment.value / largestSegmentValue) * 100
                          : 0
                      }%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.rowPercentage}>
                {wholePercentFormatter.format(segment.share)}
              </Text>
              <Text style={styles.rowAmount}>
                {maskCurrency(segment.value, valuesHidden)}
              </Text>
            </View>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ...panelStyles,
  panel: {
    ...panelStyles.panel,
    gap: 10,
  },
  kicker: {
    color: colors.textSecondary,
    letterSpacing: 0,
    textTransform: 'uppercase',
    ...typography.label,
  },
  bar: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    flexDirection: 'row',
    height: 28,
    overflow: 'hidden',
  },
  segment: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 2,
  },
  segmentLabel: {
    color: colors.accentText,
    letterSpacing: 0,
    ...typography.caption,
  },
  tailSegment: {
    backgroundColor: colors.borderStrong,
  },
  leftoverSegment: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderWidth: 1,
  },
  leftoverLabel: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.caption,
  },
  toggle: {
    alignSelf: 'flex-start',
  },
  toggleText: {
    color: colors.accent,
    letterSpacing: 0,
    ...typography.button,
  },
  list: {
    maxHeight: 240,
  },
  row: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
  },
  swatch: {
    borderRadius: 4,
    height: 12,
    width: 12,
  },
  rowName: {
    color: colors.textPrimary,
    flex: 1,
    letterSpacing: 0,
    ...typography.bodySmall,
  },
  miniBarTrack: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 3,
    height: 6,
    overflow: 'hidden',
    width: 60,
  },
  miniBarFill: {
    height: 6,
  },
  rowPercentage: {
    color: colors.textSecondary,
    letterSpacing: 0,
    minWidth: 36,
    textAlign: 'right',
    ...typography.caption,
  },
  rowAmount: {
    color: colors.textPrimary,
    letterSpacing: 0,
    minWidth: 80,
    textAlign: 'right',
    ...typography.bodySmall,
  },
});
