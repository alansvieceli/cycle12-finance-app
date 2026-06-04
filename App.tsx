import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CurrencyInput } from './src/components/common/CurrencyInput';
import { TabBar, TabItem } from './src/components/common/TabBar';
import { AccountEditor } from './src/components/finance/AccountEditor';
import { CategoryEditor } from './src/components/finance/CategoryEditor';
import { MonthSummaryCard } from './src/components/finance/MonthSummaryCard';
import { MonthlyValueEditor } from './src/components/finance/MonthlyValueEditor';
import {
  calculateCategoryTotals,
  calculateMonthlyTotalExpenses,
  calculateSalaryCommitmentPercentage,
  calculateSurplusOrShortfall,
  createProjectionMonths,
} from './src/lib/financeCalculations';
import { useFinanceState } from './src/hooks/useFinanceState';

type AppTab = 'summary' | 'planning' | 'categories' | 'settings';

const tabs: TabItem<AppTab>[] = [
  { id: 'summary', label: 'Resumo' },
  { id: 'planning', label: 'Planejamento' },
  { id: 'categories', label: 'Categorias' },
  { id: 'settings', label: 'Ajustes' },
];

export default function App() {
  const projectionMonths = useMemo(() => createProjectionMonths(), []);
  const {
    actions,
    financeState,
    formState,
    selectedAccountItem,
    storageMessage,
  } = useFinanceState();
  const visibleProjectionMonths = projectionMonths.slice(
    0,
    financeState.settings.visibleMonthCount,
  );
  const [activeTab, setActiveTab] = useState<AppTab>('summary');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Cycle12 Finance</Text>
        <Text style={styles.title}>Projeção financeira</Text>
        <Text style={styles.subtitle}>
          Acompanhe despesas, comprometimento do salário e sobra ou falta mensal.
        </Text>
      </View>

      <TabBar activeTab={activeTab} onChangeTab={setActiveTab} tabs={tabs} />

      <ScrollView contentContainerStyle={styles.monthList}>
        {activeTab === 'summary'
          ? visibleProjectionMonths.map((projectionMonth) => {
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
                <MonthSummaryCard
                  key={projectionMonth.key}
                  categoryNamesById={Object.fromEntries(
                    financeState.categories.map((category) => [
                      category.id,
                      category.name,
                    ]),
                  )}
                  categoryTotals={categoryTotals}
                  monthlyTotalExpenses={monthlyTotalExpenses}
                  projectionMonth={projectionMonth}
                  salaryCommitmentPercentage={salaryCommitmentPercentage}
                  surplusOrShortfall={surplusOrShortfall}
                />
              );
            })
          : null}

        {activeTab === 'planning' ? (
          <>
            <AccountEditor
              accountItems={financeState.accountItems}
              categories={financeState.categories}
              newAccountDueDay={formState.newAccountDueDay}
              newAccountName={formState.newAccountName}
              onChangeAccountDueDay={actions.updateAccountDueDay}
              onChangeAccountName={actions.updateAccountName}
              onChangeNewAccountDueDay={actions.setNewAccountDueDay}
              onChangeNewAccountName={actions.setNewAccountName}
              onCreateAccountItem={actions.createAccountItem}
              onCycleAccountCategory={actions.cycleAccountCategory}
              onDeleteAccountItem={actions.deleteAccountItem}
            />

            <MonthlyValueEditor
              accountItems={financeState.accountItems}
              categories={financeState.categories}
              monthlyValues={financeState.monthlyValues}
              onChangeMonthlyValue={actions.updateMonthlyValue}
              onSelectAccountItem={actions.setSelectedAccountItemId}
              projectionMonths={projectionMonths}
              selectedAccountItem={selectedAccountItem}
            />
          </>
        ) : null}

        {activeTab === 'categories' ? (
          <CategoryEditor
            categories={financeState.categories}
            newCategoryName={formState.newCategoryName}
            onChangeCategoryName={actions.updateCategoryName}
            onChangeNewCategoryName={actions.setNewCategoryName}
            onCreateCategory={actions.createCategory}
            onDeleteCategory={actions.deleteCategory}
          />
        ) : null}

        {activeTab === 'settings' ? (
          <View style={styles.settingsPanel}>
            <Text style={styles.sectionTitle}>Ajustes</Text>
            {storageMessage ? (
              <Text style={styles.storageMessage}>{storageMessage}</Text>
            ) : (
              <Text style={styles.storageMessage}>
                Dados salvos localmente neste dispositivo.
              </Text>
            )}
            <View style={styles.inputGrid}>
              <CurrencyInput
                label="Salário mensal"
                value={financeState.settings.monthlySalary}
                onChangeValue={actions.updateMonthlySalary}
              />
              <CurrencyInput
                label="Extra do mês atual"
                value={financeState.settings.currentMonthExtraBalance}
                onChangeValue={actions.updateCurrentMonthExtraBalance}
              />
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
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
  storageMessage: {
    color: '#60716d',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  inputGrid: {
    gap: 12,
    marginTop: 14,
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
});
