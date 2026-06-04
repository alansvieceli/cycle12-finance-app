import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { createInitialFinanceState } from './src/data/initialFinanceState';
import {
  calculateCategoryTotals,
  calculateMonthlyTotalExpenses,
  calculateSalaryCommitmentPercentage,
  calculateSurplusOrShortfall,
  createProjectionMonths,
} from './src/lib/financeCalculations';
import { CategoryMonthTotal } from './src/lib/financeCalculations';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  currency: 'BRL',
  style: 'currency',
});

const percentageFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
  style: 'percent',
});

const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
});

export default function App() {
  const projectionMonths = useMemo(() => createProjectionMonths(), []);
  const initialFinanceState = useMemo(
    () => createInitialFinanceState(projectionMonths),
    [projectionMonths],
  );
  const [financeState, setFinanceState] = useState(initialFinanceState);

  function updateMonthlySalary(value: string) {
    setFinanceState((currentState) => ({
      ...currentState,
      settings: {
        ...currentState.settings,
        monthlySalary: parseCurrencyInput(value),
      },
    }));
  }

  function updateCurrentMonthExtraBalance(value: string) {
    setFinanceState((currentState) => ({
      ...currentState,
      settings: {
        ...currentState.settings,
        currentMonthExtraBalance: parseCurrencyInput(value),
      },
    }));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Cycle12 Finance</Text>
        <Text style={styles.title}>Projeção de 12 meses</Text>
        <Text style={styles.subtitle}>
          Acompanhe despesas, comprometimento do salário e sobra ou falta mensal.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.monthList}>
        <View style={styles.settingsPanel}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          <View style={styles.inputGrid}>
            <CurrencyInput
              label="Salário mensal"
              value={financeState.settings.monthlySalary}
              onChangeValue={updateMonthlySalary}
            />
            <CurrencyInput
              label="Extra do mês atual"
              value={financeState.settings.currentMonthExtraBalance}
              onChangeValue={updateCurrentMonthExtraBalance}
            />
          </View>
        </View>

        {projectionMonths.map((projectionMonth) => {
          const monthlyTotalExpenses = calculateMonthlyTotalExpenses(
            financeState.categories,
            financeState.accountItems,
            financeState.monthlyValues,
            projectionMonth,
          );
          const salaryCommitmentPercentage =
            calculateSalaryCommitmentPercentage(
              monthlyTotalExpenses,
              financeState.settings.monthlySalary,
            );
          const surplusOrShortfall = calculateSurplusOrShortfall(
            financeState.settings,
            monthlyTotalExpenses,
            projectionMonth,
          );
          const categoryTotals = calculateCategoryTotals(
            financeState.categories,
            financeState.accountItems,
            financeState.monthlyValues,
            projectionMonth,
          );

          return (
            <View key={projectionMonth.key} style={styles.monthCard}>
              <View style={styles.monthHeader}>
                <View>
                  <Text style={styles.monthName}>
                    {formatMonthLabel(projectionMonth.year, projectionMonth.month)}
                  </Text>
                  {projectionMonth.isCurrentMonth ? (
                    <Text style={styles.currentMonthLabel}>Mês atual</Text>
                  ) : null}
                </View>
                <Text
                  style={[
                    styles.balance,
                    surplusOrShortfall < 0
                      ? styles.negativeBalance
                      : styles.positiveBalance,
                  ]}
                >
                  {currencyFormatter.format(surplusOrShortfall)}
                </Text>
              </View>

              <View style={styles.summaryGrid}>
                <SummaryValue
                  label="Despesas"
                  value={currencyFormatter.format(monthlyTotalExpenses)}
                />
                <SummaryValue
                  label="Comprometido"
                  value={
                    salaryCommitmentPercentage === null
                      ? '-'
                      : percentageFormatter.format(salaryCommitmentPercentage)
                  }
                />
              </View>

              <CategoryTotals
                categoryTotals={categoryTotals}
                categoryNamesById={Object.fromEntries(
                  financeState.categories.map((category) => [
                    category.id,
                    category.name,
                  ]),
                )}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function CurrencyInput({
  label,
  onChangeValue,
  value,
}: {
  label: string;
  onChangeValue: (value: string) => void;
  value: number;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        keyboardType="decimal-pad"
        onChangeText={onChangeValue}
        placeholder="0,00"
        style={styles.input}
        value={formatEditableAmount(value)}
      />
    </View>
  );
}

function SummaryValue({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryValue}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryAmount}>{value}</Text>
    </View>
  );
}

function CategoryTotals({
  categoryNamesById,
  categoryTotals,
}: {
  categoryNamesById: Record<string, string>;
  categoryTotals: CategoryMonthTotal[];
}) {
  return (
    <View style={styles.categoryList}>
      {categoryTotals.map((categoryTotal) => (
        <View key={categoryTotal.categoryId} style={styles.categoryRow}>
          <Text style={styles.categoryName}>
            {categoryNamesById[categoryTotal.categoryId]}
          </Text>
          <Text style={styles.categoryAmount}>
            {currencyFormatter.format(categoryTotal.total)}
          </Text>
        </View>
      ))}
    </View>
  );
}

function formatMonthLabel(year: number, month: number) {
  const label = monthFormatter.format(new Date(year, month - 1, 1));

  return label.charAt(0).toUpperCase() + label.slice(1);
}

function parseCurrencyInput(value: string) {
  const normalizedValue = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function formatEditableAmount(value: number) {
  if (!Number.isFinite(value) || value === 0) {
    return '';
  }

  return String(value).replace('.', ',');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
  },
  header: {
    backgroundColor: '#16302b',
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  eyebrow: {
    color: '#8fd3c7',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 8,
  },
  subtitle: {
    color: '#d7e4e0',
    fontSize: 15,
    lineHeight: 21,
    marginTop: 8,
  },
  monthList: {
    gap: 12,
    padding: 16,
    paddingBottom: 28,
  },
  settingsPanel: {
    backgroundColor: '#ffffff',
    borderColor: '#dfe7e4',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    color: '#17211f',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  inputGrid: {
    gap: 12,
    marginTop: 14,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    color: '#60716d',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#f7faf9',
    borderColor: '#c9d6d2',
    borderRadius: 8,
    borderWidth: 1,
    color: '#17211f',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  monthCard: {
    backgroundColor: '#ffffff',
    borderColor: '#dfe7e4',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  monthHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  monthName: {
    color: '#17211f',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  currentMonthLabel: {
    color: '#3d6f66',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  balance: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0,
    textAlign: 'right',
  },
  positiveBalance: {
    color: '#176a4d',
  },
  negativeBalance: {
    color: '#a33b2f',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  summaryValue: {
    backgroundColor: '#eef4f2',
    borderRadius: 8,
    flex: 1,
    minHeight: 68,
    padding: 12,
  },
  summaryLabel: {
    color: '#60716d',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  summaryAmount: {
    color: '#17211f',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 8,
  },
  categoryList: {
    borderTopColor: '#e7eeeb',
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 6,
  },
  categoryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 32,
  },
  categoryName: {
    color: '#32403d',
    flex: 1,
    fontSize: 14,
    letterSpacing: 0,
  },
  categoryAmount: {
    color: '#17211f',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
    marginLeft: 12,
  },
});
