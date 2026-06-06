import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '../common/ActionButton';
import { CategoryMonthTotal, ProjectionMonth } from '../../lib/financeCalculations';
import { currencyFormatter, formatMonthLabel } from '../../lib/formatters';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { CategoryTotalsList } from './CategoryTotalsList';

type MonthDetailsPanelProps = {
  categoryNamesById: Record<string, string>;
  categoryTotals: CategoryMonthTotal[];
  monthlyTotalExpenses: number;
  onClose: () => void;
  projectionMonth: ProjectionMonth;
};

export function MonthDetailsPanel({
  categoryNamesById,
  categoryTotals,
  monthlyTotalExpenses,
  onClose,
  projectionMonth,
}: MonthDetailsPanelProps) {
  return (
    <View style={styles.panel}>
      <View style={styles.panelHeader}>
        <View style={styles.headerText}>
          <Text style={styles.sectionTitle}>
            {formatMonthLabel(projectionMonth.year, projectionMonth.month)}
          </Text>
          <Text style={styles.sectionHint}>
            Total previsto: {currencyFormatter.format(monthlyTotalExpenses)}
          </Text>
        </View>
        <ActionButton label="Fechar" onPress={onClose} />
      </View>

      <CategoryTotalsList
        categoryNamesById={categoryNamesById}
        categoryTotals={categoryTotals}
      />
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
  panelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
  },
  sectionTitle: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.sectionTitle,
  },
  sectionHint: {
    color: colors.textSecondary,
    marginTop: 4,
    ...typography.bodySmall,
  },
});
