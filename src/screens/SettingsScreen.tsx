import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ActionButton } from '../components/common/ActionButton';
import { CurrencyInput } from '../components/common/CurrencyInput';
import { ModalShell } from '../components/common/ModalShell';
import { DataManagementPanel } from '../components/finance/DataManagementPanel';
import { AppLockState } from '../hooks/useAppLock';
import { useFinanceState } from '../hooks/useFinanceState';
import { RemindersState } from '../hooks/useReminders';
import { APP_LOCK_TIMEOUT_OPTIONS } from '../lib/appLock';
import { createProjectionMonths } from '../lib/financeCalculations';
import { REMINDER_DAYS_BEFORE_OPTIONS } from '../lib/reminders';
import { formatMonthLabel } from '../lib/formatters';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type SettingsScreenProps = {
  appLock: AppLockState;
  finance: ReturnType<typeof useFinanceState>;
  reminders: RemindersState;
  valuesHidden: boolean;
};

const MONTH_COUNT_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => hour);
const MINUTE_OPTIONS = [0, 15, 30, 45];

function formatReminderDaysBefore(daysBefore: number): string {
  if (daysBefore === 0) {
    return 'no dia';
  }

  return daysBefore === 1 ? '1 dia antes' : `${daysBefore} dias antes`;
}

export function SettingsScreen({
  appLock,
  finance,
  reminders,
  valuesHidden,
}: SettingsScreenProps) {
  const { actions, financeState } = finance;
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const [isMonthCountPickerOpen, setIsMonthCountPickerOpen] = useState(false);
  const [isSecurityTimeoutPickerOpen, setIsSecurityTimeoutPickerOpen] = useState(false);
  const [isReminderDaysPickerOpen, setIsReminderDaysPickerOpen] = useState(false);
  const [isReminderHourPickerOpen, setIsReminderHourPickerOpen] = useState(false);
  const [isReminderMinutePickerOpen, setIsReminderMinutePickerOpen] = useState(false);
  const projectionMonths = createProjectionMonths(
    new Date(
      financeState.settings.windowStartYear,
      financeState.settings.windowStartMonth - 1,
      1,
    ),
  );
  const lastProjectionMonth = projectionMonths[projectionMonths.length - 1];
  const nextProjectionMonth = createProjectionMonths(
    new Date(
      financeState.settings.windowStartYear,
      financeState.settings.windowStartMonth,
      1,
    ),
    1,
  )[0];

  if (isDataManagementOpen) {
    return (
      <DataManagementPanel
        financeState={financeState}
        onClose={() => setIsDataManagementOpen(false)}
        onReplaceFinanceState={actions.replaceFinanceState}
      />
    );
  }

  async function handleToggleAppLock(nextValue: boolean) {
    const result = await appLock.setEnabled(nextValue);

    if (result.success) {
      return;
    }

    if (result.reason === 'not_available') {
      Alert.alert(
        'Biometria indisponível',
        'Este aparelho não tem biometria disponível para proteger o app.',
      );
      return;
    }

    if (result.reason === 'not_enrolled') {
      Alert.alert(
        'Biometria não cadastrada',
        'Cadastre uma digital ou reconhecimento facial no aparelho antes de ativar o bloqueio.',
      );
      return;
    }

    Alert.alert(
      'Bloqueio não ativado',
      'A autenticação não foi concluída. O bloqueio continua desligado.',
    );
  }

  async function handleToggleReminders(nextValue: boolean) {
    const result = await reminders.setEnabled(nextValue);

    if (result.success) {
      return;
    }

    Alert.alert(
      'Permissão de notificação negada',
      'Para receber lembretes de vencimento, permita notificações para o Cycle12 Finance nas configurações do aparelho.',
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Valores e visualização</Text>
        <CurrencyInput
          label="Salário mensal"
          value={financeState.settings.monthlySalary}
          onChangeValue={actions.updateMonthlySalary}
          valuesHidden={valuesHidden}
        />
        <CurrencyInput
          label="Renda Extra"
          value={financeState.settings.currentMonthExtraBalance}
          onChangeValue={actions.updateCurrentMonthExtraBalance}
          valuesHidden={valuesHidden}
        />
        <View style={styles.settingRow}>
          <Text style={styles.inputLabel}>Meses no Resumo e Gráficos:</Text>
          <Pressable
            onPress={() => setIsMonthCountPickerOpen(true)}
            style={styles.comboButton}
          >
            <Text style={styles.comboButtonText}>
              {financeState.settings.summaryVisibleMonthCount}
            </Text>
            <Ionicons color={colors.textSecondary} name="chevron-down" size={16} />
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Comprometimento</Text>
        <Text style={styles.hint}>Use 0 a 100. Deixe 0 para desativar.</Text>
        <View style={styles.thresholdRow}>
          <View style={styles.thresholdItem}>
            <Text style={styles.thresholdLabel}>Alerta</Text>
            <ThresholdInput
              onChangeValue={actions.updateCommitmentWarningThreshold}
              placeholder="80"
              value={financeState.settings.commitmentWarningThreshold}
            />
          </View>
          <View style={styles.thresholdItem}>
            <Text style={styles.thresholdLabel}>Perigo</Text>
            <ThresholdInput
              onChangeValue={actions.updateCommitmentDangerThreshold}
              placeholder="90"
              value={financeState.settings.commitmentDangerThreshold}
            />
          </View>
          <View style={styles.thresholdItem}>
            <Text style={styles.thresholdLabel}>Meta</Text>
            <ThresholdInput
              onChangeValue={actions.updateCommitmentGoal}
              placeholder="70"
              value={financeState.settings.commitmentGoal}
            />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Janela Atual</Text>
        <Text
          adjustsFontSizeToFit
          minimumFontScale={0.82}
          numberOfLines={1}
          style={styles.windowRangeHighlight}
        >
          {formatMonthLabel(
            financeState.settings.windowStartYear,
            financeState.settings.windowStartMonth,
          )}{' '}
          - {formatMonthLabel(lastProjectionMonth.year, lastProjectionMonth.month)}
        </Text>
        <ActionButton
          label="Avançar mês"
          onPress={() =>
            Alert.alert(
              `Avançar para ${formatMonthLabel(
                nextProjectionMonth.year,
                nextProjectionMonth.month,
              )}?`,
              `Os valores de ${formatMonthLabel(
                financeState.settings.windowStartYear,
                financeState.settings.windowStartMonth,
              )} serão removidos e um novo mês será gerado com base nas regras de propagação.`,
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Confirmar', onPress: actions.advanceWindowMonth },
              ],
            )
          }
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Segurança</Text>
        <View style={styles.settingRow}>
          <Text style={styles.inputLabel}>Bloquear com biometria:</Text>
          <Switch
            onValueChange={handleToggleAppLock}
            thumbColor={appLock.enabled ? colors.accent : colors.textSecondary}
            trackColor={{
              false: colors.surfaceMuted,
              true: colors.accent,
            }}
            value={appLock.enabled}
          />
        </View>
        {appLock.enabled ? (
          <View style={styles.settingRow}>
            <Text style={styles.inputLabel}>Bloquear após:</Text>
            <Pressable
              onPress={() => setIsSecurityTimeoutPickerOpen(true)}
              style={styles.comboButton}
            >
              <Text style={styles.comboButtonText}>{appLock.timeoutMinutes} min</Text>
              <Ionicons color={colors.textSecondary} name="chevron-down" size={16} />
            </Pressable>
          </View>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Lembretes</Text>
        <View style={styles.settingRow}>
          <Text style={styles.inputLabel}>Lembrar vencimentos:</Text>
          <Switch
            onValueChange={handleToggleReminders}
            thumbColor={
              reminders.settings.enabled ? colors.accent : colors.textSecondary
            }
            trackColor={{
              false: colors.surfaceMuted,
              true: colors.accent,
            }}
            value={reminders.settings.enabled}
          />
        </View>
        {reminders.settings.enabled ? (
          <>
            <View style={styles.settingRow}>
              <Text style={styles.inputLabel}>Avisar com antecedência:</Text>
              <Pressable
                onPress={() => setIsReminderDaysPickerOpen(true)}
                style={styles.comboButton}
              >
                <Text style={styles.comboButtonText}>
                  {formatReminderDaysBefore(reminders.settings.daysBefore)}
                </Text>
                <Ionicons color={colors.textSecondary} name="chevron-down" size={16} />
              </Pressable>
            </View>
            <View style={styles.settingRow}>
              <Text style={styles.inputLabel}>Horário do lembrete:</Text>
              <Pressable
                onPress={() => setIsReminderHourPickerOpen(true)}
                style={styles.comboButton}
              >
                <Text style={styles.comboButtonText}>
                  {String(reminders.settings.hour).padStart(2, '0')}
                </Text>
                <Ionicons color={colors.textSecondary} name="chevron-down" size={16} />
              </Pressable>
              <Text style={styles.comboSeparator}>:</Text>
              <Pressable
                onPress={() => setIsReminderMinutePickerOpen(true)}
                style={styles.comboButton}
              >
                <Text style={styles.comboButtonText}>
                  {String(reminders.settings.minute).padStart(2, '0')}
                </Text>
                <Ionicons color={colors.textSecondary} name="chevron-down" size={16} />
              </Pressable>
            </View>
          </>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dados</Text>
        <ActionButton
          label="Backup e restauração"
          onPress={() => setIsDataManagementOpen(true)}
        />
      </View>

      <ModalShell
        cardStyle={styles.pickerModalCard}
        closeOnOverlayPress
        onRequestClose={() => setIsMonthCountPickerOpen(false)}
        title="Meses no Resumo e Gráficos"
        visible={isMonthCountPickerOpen}
      >
        <View style={styles.monthCountGrid}>
          {MONTH_COUNT_OPTIONS.map((n) => {
            const isSelected = financeState.settings.summaryVisibleMonthCount === n;
            return (
              <Pressable
                key={n}
                onPress={() => {
                  actions.updateSummaryVisibleMonthCount(String(n));
                  setIsMonthCountPickerOpen(false);
                }}
                style={[
                  styles.monthCountOption,
                  isSelected && styles.monthCountOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.monthCountOptionText,
                    isSelected && styles.monthCountOptionTextActive,
                  ]}
                >
                  {n}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ModalShell>

      <ModalShell
        cardStyle={styles.pickerModalCard}
        closeOnOverlayPress
        onRequestClose={() => setIsSecurityTimeoutPickerOpen(false)}
        title="Bloquear após"
        visible={isSecurityTimeoutPickerOpen}
      >
        <View style={styles.monthCountGrid}>
          {APP_LOCK_TIMEOUT_OPTIONS.map((timeoutMinutes) => {
            const isSelected = appLock.timeoutMinutes === timeoutMinutes;
            return (
              <Pressable
                key={timeoutMinutes}
                onPress={() => {
                  void appLock.setTimeoutMinutes(timeoutMinutes);
                  setIsSecurityTimeoutPickerOpen(false);
                }}
                style={[
                  styles.monthCountOption,
                  isSelected && styles.monthCountOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.monthCountOptionText,
                    isSelected && styles.monthCountOptionTextActive,
                  ]}
                >
                  {timeoutMinutes} min
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ModalShell>
      <ModalShell
        cardStyle={styles.pickerModalCard}
        closeOnOverlayPress
        onRequestClose={() => setIsReminderDaysPickerOpen(false)}
        title="Avisar com antecedência"
        visible={isReminderDaysPickerOpen}
      >
        <View style={styles.monthCountGrid}>
          {REMINDER_DAYS_BEFORE_OPTIONS.map((daysBefore) => {
            const isSelected = reminders.settings.daysBefore === daysBefore;
            return (
              <Pressable
                key={daysBefore}
                onPress={() => {
                  void reminders.setDaysBefore(daysBefore);
                  setIsReminderDaysPickerOpen(false);
                }}
                style={[
                  styles.monthCountOption,
                  isSelected && styles.monthCountOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.monthCountOptionText,
                    isSelected && styles.monthCountOptionTextActive,
                  ]}
                >
                  {formatReminderDaysBefore(daysBefore)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ModalShell>

      <ModalShell
        cardStyle={styles.pickerModalCard}
        closeOnOverlayPress
        onRequestClose={() => setIsReminderHourPickerOpen(false)}
        title="Hora do lembrete"
        visible={isReminderHourPickerOpen}
      >
        <View style={styles.monthCountGrid}>
          {HOUR_OPTIONS.map((hour) => {
            const isSelected = reminders.settings.hour === hour;
            return (
              <Pressable
                key={hour}
                onPress={() => {
                  void reminders.setTime(hour, reminders.settings.minute);
                  setIsReminderHourPickerOpen(false);
                }}
                style={[styles.hourOption, isSelected && styles.monthCountOptionActive]}
              >
                <Text
                  style={[
                    styles.monthCountOptionText,
                    isSelected && styles.monthCountOptionTextActive,
                  ]}
                >
                  {String(hour).padStart(2, '0')}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ModalShell>

      <ModalShell
        cardStyle={styles.pickerModalCard}
        closeOnOverlayPress
        onRequestClose={() => setIsReminderMinutePickerOpen(false)}
        title="Minuto do lembrete"
        visible={isReminderMinutePickerOpen}
      >
        <View style={styles.monthCountGrid}>
          {MINUTE_OPTIONS.map((minute) => {
            const isSelected = reminders.settings.minute === minute;
            return (
              <Pressable
                key={minute}
                onPress={() => {
                  void reminders.setTime(reminders.settings.hour, minute);
                  setIsReminderMinutePickerOpen(false);
                }}
                style={[
                  styles.monthCountOption,
                  isSelected && styles.monthCountOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.monthCountOptionText,
                    isSelected && styles.monthCountOptionTextActive,
                  ]}
                >
                  {String(minute).padStart(2, '0')}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ModalShell>
    </View>
  );
}

function ThresholdInput({
  onChangeValue,
  placeholder,
  value,
}: {
  onChangeValue: (value: string) => void;
  placeholder: string;
  value: number;
}) {
  const [draftValue, setDraftValue] = useState(String(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDraftValue(String(value));
    }
  }, [isFocused, value]);

  function handleChangeText(nextValue: string) {
    const numericValue = nextValue.replace(/\D/g, '');
    setDraftValue(numericValue);
    onChangeValue(numericValue || '0');
  }

  function handleBlur() {
    setIsFocused(false);
    setDraftValue(String(value));
  }

  return (
    <TextInput
      keyboardType="number-pad"
      onBlur={handleBlur}
      onChangeText={handleChangeText}
      onFocus={() => setIsFocused(true)}
      placeholder={placeholder}
      placeholderTextColor={colors.textSecondary}
      style={styles.smallInput}
      value={draftValue}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  cardTitle: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.sectionTitle,
  },
  settingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  inputLabel: {
    color: colors.textSecondary,
    flex: 1,
    letterSpacing: 0,
    ...typography.bodySmall,
  },
  smallInput: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.textPrimary,
    letterSpacing: 0,
    minHeight: 38,
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 6,
    textAlign: 'center',
    ...typography.inputCompact,
  },
  comboButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 72,
    paddingHorizontal: 14,
  },
  comboButtonText: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.button,
  },
  comboSeparator: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.button,
  },
  hint: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.caption,
  },
  windowRangeHighlight: {
    color: colors.textPrimary,
    letterSpacing: 0,
    textAlign: 'center',
    ...typography.amountSmall,
  },
  thresholdRow: {
    flexDirection: 'row',
    gap: 12,
  },
  thresholdItem: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  thresholdLabel: {
    color: colors.textSecondary,
    letterSpacing: 0,
    textAlign: 'center',
    ...typography.bodySmall,
  },
  pickerModalCard: {
    maxWidth: 320,
  },
  monthCountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthCountOption: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    flexBasis: '17%',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  hourOption: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    flexBasis: '21%',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  monthCountOptionActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  monthCountOptionText: {
    color: colors.textPrimary,
    letterSpacing: 0,
    textAlign: 'center',
    ...typography.button,
  },
  monthCountOptionTextActive: {
    color: colors.accentText,
  },
});
