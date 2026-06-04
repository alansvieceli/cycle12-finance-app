import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { TabBar, TabItem } from './components/common/TabBar';
import { createProjectionMonths } from './lib/financeCalculations';
import { useFinanceState } from './hooks/useFinanceState';
import { CategoriesScreen } from './screens/CategoriesScreen';
import { ChartsScreen } from './screens/ChartsScreen';
import { PlanningScreen } from './screens/PlanningScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SummaryScreen } from './screens/SummaryScreen';

type AppTab = 'summary' | 'charts' | 'planning' | 'categories' | 'settings';

const tabs: TabItem<AppTab>[] = [
  { id: 'summary', label: 'Resumo' },
  { id: 'charts', label: 'Gráficos' },
  { id: 'planning', label: 'Planejamento' },
  { id: 'categories', label: 'Categorias' },
  { id: 'settings', label: 'Ajustes' },
];

export function FinanceApp() {
  const projectionMonths = useMemo(() => createProjectionMonths(), []);
  const finance = useFinanceState();
  const [activeTab, setActiveTab] = useState<AppTab>('summary');
  const visibleProjectionMonths = projectionMonths.slice(
    0,
    finance.financeState.settings.visibleMonthCount,
  );

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

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'summary' ? (
          <SummaryScreen
            financeState={finance.financeState}
            onTogglePaymentStatus={finance.actions.toggleMonthlyPaymentStatus}
            projectionMonths={visibleProjectionMonths}
          />
        ) : null}

        {activeTab === 'charts' ? (
          <ChartsScreen
            financeState={finance.financeState}
            projectionMonths={visibleProjectionMonths}
          />
        ) : null}

        {activeTab === 'planning' ? (
          <PlanningScreen finance={finance} projectionMonths={projectionMonths} />
        ) : null}

        {activeTab === 'categories' ? (
          <CategoriesScreen finance={finance} />
        ) : null}

        {activeTab === 'settings' ? <SettingsScreen finance={finance} /> : null}
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
  content: {
    gap: 12,
    padding: 16,
    paddingBottom: 28,
  },
});
