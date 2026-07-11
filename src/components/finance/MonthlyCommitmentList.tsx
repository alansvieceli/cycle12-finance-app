import { type DimensionValue, StyleSheet, Text, View } from 'react-native';

import type { CommitmentChartPoint } from '../../lib/chartData';
import { percentageFormatter } from '../../lib/formatters';
import { colors } from '../../theme/colors';
import { panelStyles } from '../../theme/sharedStyles';
import { typography } from '../../theme/typography';

type MonthlyCommitmentListProps = {
  data: CommitmentChartPoint[];
  emptyText: string;
  goal?: number;
  title: string;
};

export function MonthlyCommitmentList({
  data,
  emptyText,
  goal,
  title,
}: MonthlyCommitmentListProps) {
  const hasGoal = !!goal && goal > 0;
  const goalLeft = `${Math.min(Math.max(goal ?? 0, 0), 100)}%`;

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.length > 0 ? (
        <>
          <View style={styles.list}>
            {data.map((point) => {
              const progress =
                point.percentage !== null
                  ? Math.min(Math.max(point.percentage, 0), 1)
                  : 0;
              const displayValue =
                point.percentage !== null
                  ? percentageFormatter.format(point.percentage)
                  : '—';

              return (
                <View key={point.key} style={styles.row}>
                  <Text style={styles.monthLabel}>{point.label}</Text>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor:
                            point.percentage !== null ? point.color : colors.border,
                          width: `${progress * 100}%`,
                        },
                      ]}
                    />
                    {hasGoal ? (
                      <View
                        style={[styles.goalLine, { left: goalLeft as DimensionValue }]}
                      />
                    ) : null}
                  </View>
                  <Text
                    style={[
                      styles.percentageValue,
                      point.percentage !== null ? { color: point.color } : null,
                    ]}
                  >
                    {displayValue}
                  </Text>
                </View>
              );
            })}
          </View>
          {hasGoal ? (
            <View style={styles.legendRow}>
              <View style={styles.legendSwatch} />
              <Text style={styles.legendText}>meta {goal}%</Text>
            </View>
          ) : null}
        </>
      ) : (
        <Text style={styles.emptyText}>{emptyText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ...panelStyles,
  list: {
    gap: 10,
    marginTop: 14,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    minHeight: 24,
  },
  monthLabel: {
    color: colors.textSecondary,
    letterSpacing: 0,
    minWidth: 28,
    textTransform: 'uppercase',
    ...typography.label,
  },
  progressTrack: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    flex: 1,
    height: 8,
    position: 'relative',
  },
  progressFill: {
    borderRadius: 999,
    height: '100%',
    overflow: 'hidden',
  },
  goalLine: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    bottom: -5,
    position: 'absolute',
    top: -5,
    width: 2,
  },
  percentageValue: {
    color: colors.textSecondary,
    letterSpacing: 0,
    minWidth: 44,
    textAlign: 'right',
    ...typography.bodySmall,
  },
  legendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  legendSwatch: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    height: 2,
    width: 12,
  },
  legendText: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.caption,
  },
});
