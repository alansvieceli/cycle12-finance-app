import { StyleSheet, Text, View } from 'react-native';
import type {
  CategoryMonthTotal,
  ProjectionMonth,
} from '../../lib/financeCalculations';
import { formatMonthLabel, maskCurrency } from '../../lib/formatters';
import { colors } from '../../theme/colors';
import { panelStyles } from '../../theme/sharedStyles';
import { typography } from '../../theme/typography';
import { ActionButton } from '../common/ActionButton';
import { CategoryTotalsList } from './CategoryTotalsList';

type MonthDetailsPanelProps = {
  categoryColorsById: Record<string, string>;
  categoryNamesById: Record<string, string>;
  categoryTotals: CategoryMonthTotal[];
  monthlyTotalExpenses: number;
  onClose: () => void;
  projectionMonth: ProjectionMonth;
  valuesHidden: boolean;
};

export function MonthDetailsPanel({
  categoryColorsById,
  categoryNamesById,
  categoryTotals,
  monthlyTotalExpenses,
  onClose,
  projectionMonth,
  valuesHidden,
}: MonthDetailsPanelProps) {
  return (
    <View style={styles.panel}>
      <View style={styles.panelHeader}>
        <View style={styles.headerText}>
          <Text style={styles.sectionTitle}>
            {formatMonthLabel(projectionMonth.year, projectionMonth.month)}
          </Text>
          <Text style={styles.sectionHint}>
            Total previsto: {maskCurrency(monthlyTotalExpenses, valuesHidden)}
          </Text>
        </View>
        <ActionButton icon="close" label="Fechar" onPress={onClose} />
      </View>

      <CategoryTotalsList
        categoryColorsById={categoryColorsById}
        categoryNamesById={categoryNamesById}
        categoryTotals={categoryTotals}
        valuesHidden={valuesHidden}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ...panelStyles,
  panelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
  },
  sectionHint: {
    color: colors.textSecondary,
    marginTop: 4,
    ...typography.bodySmall,
  },
});
