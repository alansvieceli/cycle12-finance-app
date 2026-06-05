import { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { TabBar, TabItem } from './components/common/TabBar';
import { CurrentMonthPaymentChecklist } from './components/finance/CurrentMonthPaymentChecklist';
import { createProjectionMonths } from './lib/financeCalculations';
import { useFinanceState } from './hooks/useFinanceState';
import { AccountsScreen } from './screens/AccountsScreen';
import { AdjustmentsScreen } from './screens/AdjustmentsScreen';
import { ChartsScreen } from './screens/ChartsScreen';
import { PlanningScreen } from './screens/PlanningScreen';
import { SummaryScreen } from './screens/SummaryScreen';
import { colors } from './theme/colors';

type AppTab = 'summary' | 'charts' | 'planning' | 'accounts' | 'adjustments';

const tabs: TabItem<AppTab>[] = [
  { id: 'summary', icon: 'summary', label: 'Resumo' },
  { id: 'charts', icon: 'charts', label: 'Gráficos' },
  { id: 'planning', icon: 'planning', label: 'Planejar' },
  { id: 'accounts', icon: 'accounts', label: 'Contas' },
  { id: 'adjustments', icon: 'adjustments', label: 'Ajustes' },
];

export function FinanceApp() {
  const finance = useFinanceState();
  const [activeTab, setActiveTab] = useState<AppTab>('summary');
  const [isPaymentViewOpen, setIsPaymentViewOpen] = useState(false);
  const projectionMonths = useMemo(
    () =>
      createProjectionMonths(
        new Date(
          finance.financeState.settings.windowStartYear,
          finance.financeState.settings.windowStartMonth - 1,
          1,
        ),
      ),
    [
      finance.financeState.settings.windowStartMonth,
      finance.financeState.settings.windowStartYear,
    ],
  );
  const visibleProjectionMonths = projectionMonths.slice(
    0,
    finance.financeState.settings.summaryVisibleMonthCount,
  );
  const currentProjectionMonth =
    projectionMonths.find((projectionMonth) => projectionMonth.isCurrentMonth) ??
    projectionMonths[0];

  function changeTab(tab: AppTab) {
    setActiveTab(tab);
    setIsPaymentViewOpen(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          accessibilityIgnoresInvertColors
          source={require('../assets/logo-header.png')}
          style={styles.headerLogo}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Aloha :)</Text>

        {activeTab === 'summary' && isPaymentViewOpen && currentProjectionMonth ? (
          <CurrentMonthPaymentChecklist
            accountItems={finance.financeState.accountItems}
            categories={finance.financeState.categories}
            monthlyValues={finance.financeState.monthlyValues}
            onClose={() => setIsPaymentViewOpen(false)}
            onTogglePaymentStatus={finance.actions.toggleMonthlyPaymentStatus}
            paymentStatuses={finance.financeState.paymentStatuses}
            projectionMonth={currentProjectionMonth}
          />
        ) : null}

        {activeTab === 'summary' && !isPaymentViewOpen ? (
          <SummaryScreen
            financeState={finance.financeState}
            onOpenPayments={() => setIsPaymentViewOpen(true)}
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

        {activeTab === 'accounts' ? <AccountsScreen finance={finance} /> : null}

        {activeTab === 'adjustments' ? <AdjustmentsScreen finance={finance} /> : null}
      </ScrollView>

      <TabBar activeTab={activeTab} onChangeTab={changeTab} tabs={tabs} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 4,
    paddingLeft: 22,
    paddingRight: 28,
    paddingTop: 58,
  },
  headerLogo: {
    height: 47,
    resizeMode: 'contain',
    width: 196,
  },
  content: {
    gap: 12,
    paddingHorizontal: 28,
    paddingTop: 2,
    paddingBottom: 18,
  },
  greeting: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0,
  },
});
