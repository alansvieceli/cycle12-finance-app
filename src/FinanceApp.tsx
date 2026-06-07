import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppLockOverlay } from './components/common/AppLockOverlay';
import { EyeIcon } from './components/common/EyeIcon';
import { TabBar, TabItem } from './components/common/TabBar';
import { CurrentMonthPaymentChecklist } from './components/finance/CurrentMonthPaymentChecklist';
import { createProjectionMonths } from './lib/financeCalculations';
import { useAppLock } from './hooks/useAppLock';
import { useFinanceState } from './hooks/useFinanceState';
import { AccountsScreen } from './screens/AccountsScreen';
import { ChartsScreen } from './screens/ChartsScreen';
import { PlanningScreen } from './screens/PlanningScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SummaryScreen } from './screens/SummaryScreen';
import { colors } from './theme/colors';
import { typography } from './theme/typography';

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
  const appLock = useAppLock();
  const [activeTab, setActiveTab] = useState<AppTab>('summary');
  const [isPaymentViewOpen, setIsPaymentViewOpen] = useState(false);
  const [valuesHidden, setValuesHidden] = useState(false);
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
        <View style={styles.greetingRow}>
          <Text style={styles.greeting}>Aloha :)</Text>
          <Pressable
            onPress={() => setValuesHidden((v) => !v)}
            style={styles.eyeButton}
          >
            <EyeIcon color={colors.textSecondary} hidden={valuesHidden} />
          </Pressable>
        </View>

        {activeTab === 'summary' && isPaymentViewOpen && currentProjectionMonth ? (
          <CurrentMonthPaymentChecklist
            accountItems={finance.financeState.accountItems}
            categories={finance.financeState.categories}
            monthlyValues={finance.financeState.monthlyValues}
            onAdjustMonthlyValue={finance.actions.adjustMonthlyValue}
            onClose={() => setIsPaymentViewOpen(false)}
            onCreateAccountItem={finance.actions.createAccountItemAndSetValue}
            onTogglePaymentStatus={finance.actions.toggleMonthlyPaymentStatus}
            paymentStatuses={finance.financeState.paymentStatuses}
            projectionMonth={currentProjectionMonth}
            valuesHidden={valuesHidden}
          />
        ) : null}

        {activeTab === 'summary' && !isPaymentViewOpen ? (
          <SummaryScreen
            financeState={finance.financeState}
            onOpenPayments={() => setIsPaymentViewOpen(true)}
            projectionMonths={visibleProjectionMonths}
            valuesHidden={valuesHidden}
          />
        ) : null}

        {activeTab === 'charts' ? (
          <ChartsScreen
            financeState={finance.financeState}
            projectionMonths={visibleProjectionMonths}
            valuesHidden={valuesHidden}
          />
        ) : null}

        {activeTab === 'planning' ? (
          <PlanningScreen
            finance={finance}
            projectionMonths={projectionMonths}
            valuesHidden={valuesHidden}
          />
        ) : null}

        {activeTab === 'accounts' ? <AccountsScreen finance={finance} /> : null}

        {activeTab === 'adjustments' ? (
          <SettingsScreen
            appLock={appLock}
            finance={finance}
            valuesHidden={valuesHidden}
          />
        ) : null}
      </ScrollView>

      <TabBar activeTab={activeTab} onChangeTab={changeTab} tabs={tabs} />
      <AppLockOverlay
        enabled={appLock.enabled}
        isInitializing={appLock.isInitializing}
        locked={appLock.locked}
        onUnlock={appLock.unlock}
      />
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
  greetingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  greeting: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.screenTitle,
  },
  eyeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
});
