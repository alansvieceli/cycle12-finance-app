import { StyleSheet, Text, View } from 'react-native';

import { CommitmentChartPoint } from '../../lib/chartData';
import { percentageFormatter } from '../../lib/formatters';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

type MonthlyCommitmentListProps = {
  data: CommitmentChartPoint[];
  emptyText: string;
  title: string;
};

export function MonthlyCommitmentList({
  data,
  emptyText,
  title,
}: MonthlyCommitmentListProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.length > 0 ? (
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
      ) : (
        <Text style={styles.emptyText}>{emptyText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.sectionTitle,
  },
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
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 999,
    height: '100%',
  },
  percentageValue: {
    color: colors.textSecondary,
    letterSpacing: 0,
    minWidth: 44,
    textAlign: 'right',
    ...typography.bodySmall,
  },
  emptyText: {
    color: colors.textSecondary,
    marginTop: 10,
    ...typography.body,
  },
});
