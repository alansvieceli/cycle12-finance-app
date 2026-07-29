import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppLockOverlay } from './components/common/AppLockOverlay';
import { TabBar, type TabItem } from './components/common/TabBar';
import { CurrentMonthPaymentChecklist } from './components/finance/CurrentMonthPaymentChecklist';
import { useAppLock } from './hooks/useAppLock';
import { useFinanceState } from './hooks/useFinanceState';
import { useReminders } from './hooks/useReminders';
import { createProjectionMonths } from './lib/financeCalculations';
import { Notifications } from './lib/notifications';
import { syncReminders } from './lib/syncReminders';
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
  { id: 'accounts', icon: 'accounts', label: 'Cadastros' },
  { id: 'adjustments', icon: 'adjustments', label: 'Ajustes' },
];

export function FinanceApp() {
  const finance = useFinanceState();
  const appLock = useAppLock();
  const reminders = useReminders();
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

  // Window changes must resync reminders even when the finance arrays keep their references.
  // biome-ignore lint/correctness/useExhaustiveDependencies: window start is an intentional trigger
  useEffect(() => {
    if (reminders.isInitializing) {
      return;
    }

    let isCancelled = false;

    async function sync() {
      const { status } = await Notifications.getPermissionsAsync();

      if (isCancelled) {
        return;
      }

      await syncReminders(
        finance.financeState.accountItems,
        finance.financeState.monthlyValues,
        finance.financeState.paymentStatuses,
        reminders.settings,
        status === 'granted',
      );
    }

    void sync();

    return () => {
      isCancelled = true;
    };
  }, [
    reminders.isInitializing,
    reminders.settings,
    finance.financeState.accountItems,
    finance.financeState.monthlyValues,
    finance.financeState.paymentStatuses,
    finance.financeState.settings.windowStartMonth,
    finance.financeState.settings.windowStartYear,
  ]);

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
            <Ionicons
              color={colors.textSecondary}
              name={valuesHidden ? 'eye-off-outline' : 'eye-outline'}
              size={26}
            />
          </Pressable>
        </View>

        {activeTab === 'summary' && isPaymentViewOpen && currentProjectionMonth ? (
          <CurrentMonthPaymentChecklist
            accountItems={finance.financeState.accountItems}
            categories={finance.financeState.categories}
            initialFilter="pending"
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
            onAddExtra={finance.actions.addCurrentMonthExtraBalance}
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

        {activeTab === 'accounts' ? (
          <AccountsScreen finance={finance} valuesHidden={valuesHidden} />
        ) : null}

        {activeTab === 'adjustments' ? (
          <SettingsScreen
            appLock={appLock}
            finance={finance}
            reminders={reminders}
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
