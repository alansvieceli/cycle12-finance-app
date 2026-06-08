# Planejar: Painel de ajuste inline (±) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir os dois botões `+` e `−` inline do `MonthlyValueEditor` por um único botão `±` que expande um painel de ajuste abaixo da linha, igual ao padrão do `CurrentMonthPaymentChecklist`.

**Architecture:** Toda a mudança fica em `MonthlyValueEditor.tsx`. Remove o Modal de ajuste e os dois botões inline; adiciona estado `expandedMonthKey` + `adjustmentMode` + painel inline com o shape exato do `CurrentMonthPaymentChecklist` (incluindo suporte a parcelas quando modo `add`).

**Tech Stack:** React Native, TypeScript — sem novas dependências.

---

### Task 1: Reescrever MonthlyValueEditor com painel inline

**Files:**

- Modify: `src/components/finance/MonthlyValueEditor.tsx`

- [ ] **Step 1: Substituir estado e helpers**

Remover:

- `activeAdjustment` state
- `adjustmentInput` state
- `installmentsInput` state
- funções `openAdjustment`, `closeAdjustment`, `confirmAdjustment`
- variáveis `affectedInstallmentMonths`, `shouldShowInstallmentSummary`

Adicionar no lugar:

```tsx
const [expandedMonthKey, setExpandedMonthKey] = useState<string | null>(null);
const [adjustmentInput, setAdjustmentInput] = useState('');
const [adjustmentMode, setAdjustmentMode] =
  useState<MonthlyValueAdjustmentOperation>('add');
const [installmentsInput, setInstallmentsInput] = useState('1');

function openAdjustPanel(projectionMonth: ProjectionMonth) {
  if (expandedMonthKey === projectionMonth.key) {
    setExpandedMonthKey(null);
  } else {
    setExpandedMonthKey(projectionMonth.key);
    setAdjustmentInput('');
    setAdjustmentMode('add');
    setInstallmentsInput('1');
  }
}

function switchAdjustmentMode(mode: MonthlyValueAdjustmentOperation) {
  setAdjustmentMode(mode);
  setAdjustmentInput('');
  setInstallmentsInput('1');
}

function collapseAdjustPanel() {
  setExpandedMonthKey(null);
}

function confirmAdjustment(projectionMonth: ProjectionMonth) {
  if (!selectedAccountItem) return;
  onAdjustMonthlyValue(
    selectedAccountItem.id,
    projectionMonth,
    adjustmentInput,
    adjustmentMode,
    adjustmentMode === 'add' ? parseInstallmentsInput(installmentsInput) : undefined,
  );
  collapseAdjustPanel();
}
```

- [ ] **Step 2: Substituir a linha de cada mês**

Dentro do `projectionMonths.map(...)`, substituir o conteúdo de `<View key={...} style={styles.monthValueItem}>` pelo seguinte (mantém o `monthValueRow` mas troca os botões `+`/`−` pelo `±`, e adiciona o painel inline abaixo):

```tsx
<View key={projectionMonth.key} style={styles.monthValueItem}>
  <View style={styles.monthValueRow}>
    <View style={styles.monthValueLabel}>
      <Text style={styles.monthValueName}>
        {formatMonthLabel(projectionMonth.year, projectionMonth.month)}
      </Text>
    </View>
    <View style={styles.monthValueControlGroup}>
      <EditableAmountInput
        onChangeValue={(amount) =>
          onChangeMonthlyValue(selectedAccountItem.id, projectionMonth, amount)
        }
        style={[styles.input, styles.monthValueInput]}
        value={getMonthlyValueAmount(
          monthlyValues,
          selectedAccountItem.id,
          projectionMonth,
        )}
        valuesHidden={valuesHidden}
      />
      <Pressable
        accessibilityLabel="Ajustar valor"
        onPress={() => openAdjustPanel(projectionMonth)}
        style={styles.adjustToggleButton}
      >
        <Text style={styles.adjustToggleButtonText}>±</Text>
      </Pressable>
    </View>
  </View>

  {expandedMonthKey === projectionMonth.key ? (
    <AdjustPanel
      accountItemId={selectedAccountItem.id}
      adjustmentInput={adjustmentInput}
      adjustmentMode={adjustmentMode}
      installmentsInput={installmentsInput}
      monthlyValues={monthlyValues}
      onCancel={collapseAdjustPanel}
      onConfirm={() => confirmAdjustment(projectionMonth)}
      onInputChange={setAdjustmentInput}
      onInstallmentsChange={(v) => setInstallmentsInput(sanitizeInstallmentsInput(v))}
      onSwitchMode={switchAdjustmentMode}
      projectionMonth={projectionMonth}
      projectionMonths={projectionMonths}
      valuesHidden={valuesHidden}
    />
  ) : null}
</View>
```

- [ ] **Step 3: Remover o Modal e adicionar o componente AdjustPanel**

Remover todo o bloco `<Modal animationType="fade" ...>` do JSX.

Adicionar o componente `AdjustPanel` abaixo da função `MonthlyValueEditor` (antes dos helpers):

```tsx
type AdjustPanelProps = {
  accountItemId: string;
  adjustmentInput: string;
  adjustmentMode: MonthlyValueAdjustmentOperation;
  installmentsInput: string;
  monthlyValues: MonthlyValue[];
  onCancel: () => void;
  onConfirm: () => void;
  onInputChange: (value: string) => void;
  onInstallmentsChange: (value: string) => void;
  onSwitchMode: (mode: MonthlyValueAdjustmentOperation) => void;
  projectionMonth: ProjectionMonth;
  projectionMonths: ProjectionMonth[];
  valuesHidden: boolean;
};

function AdjustPanel({
  accountItemId,
  adjustmentInput,
  adjustmentMode,
  installmentsInput,
  monthlyValues,
  onCancel,
  onConfirm,
  onInputChange,
  onInstallmentsChange,
  onSwitchMode,
  projectionMonth,
  projectionMonths,
  valuesHidden,
}: AdjustPanelProps) {
  const activeColor = adjustmentMode === 'add' ? colors.accent : colors.negative;
  const currentAmount = getMonthlyValueAmount(
    monthlyValues,
    accountItemId,
    projectionMonth,
  );
  const parsedInstallments = parseInstallmentsInput(installmentsInput);
  const affectedInstallmentMonths =
    adjustmentMode === 'add' && projectionMonths[0]
      ? buildInstallmentMonths(
          projectionMonth.year,
          projectionMonth.month,
          parsedInstallments,
          projectionMonths[0].year,
          projectionMonths[0].month,
        )
      : [];
  const shouldShowInstallmentSummary =
    adjustmentMode === 'add' &&
    parsedInstallments > 1 &&
    affectedInstallmentMonths.length > 0;

  return (
    <View style={styles.adjustPanel}>
      <View style={[styles.adjustFieldRow, { borderColor: activeColor }]}>
        <Pressable
          onPress={() => onSwitchMode('add')}
          style={[
            styles.adjustModeButton,
            adjustmentMode === 'add'
              ? { backgroundColor: colors.accent }
              : styles.adjustModeButtonInactive,
          ]}
        >
          <Text
            style={[
              styles.adjustModeButtonText,
              adjustmentMode === 'add'
                ? { color: colors.accentText }
                : { color: colors.textSecondary },
            ]}
          >
            +
          </Text>
        </Pressable>

        <TextInput
          autoFocus
          keyboardType="decimal-pad"
          onChangeText={onInputChange}
          placeholder="0,00"
          placeholderTextColor={colors.textSecondary}
          style={styles.adjustInput}
          value={adjustmentInput}
        />

        <Pressable
          onPress={() => onSwitchMode('subtract')}
          style={[
            styles.adjustModeButton,
            adjustmentMode === 'subtract'
              ? { backgroundColor: colors.negative }
              : styles.adjustModeButtonInactive,
          ]}
        >
          <Text
            style={[
              styles.adjustModeButtonText,
              adjustmentMode === 'subtract'
                ? { color: colors.accentText }
                : { color: colors.textSecondary },
            ]}
          >
            −
          </Text>
        </Pressable>
      </View>

      {adjustmentMode === 'add' ? (
        <>
          <View style={styles.installmentsRow}>
            <Text style={styles.installmentsLabel}>Parcelas</Text>
            <TextInput
              keyboardType="number-pad"
              onChangeText={onInstallmentsChange}
              placeholder="1"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, styles.installmentsInput]}
              value={installmentsInput}
            />
          </View>
          {shouldShowInstallmentSummary ? (
            <Text style={styles.installmentSummary}>
              {formatInstallmentSummary(
                adjustmentInput,
                parsedInstallments,
                affectedInstallmentMonths,
              )}
            </Text>
          ) : null}
        </>
      ) : null}

      <View style={styles.adjustActions}>
        <Pressable onPress={onCancel} style={styles.adjustCancelButton}>
          <Text style={styles.adjustCancelButtonText}>Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={onConfirm}
          style={[styles.adjustConfirmButton, { backgroundColor: activeColor }]}
        >
          <Text style={styles.adjustConfirmText}>Novo total</Text>
          <Text style={styles.adjustConfirmText}>
            {maskCurrency(
              calculateAdjustedMonthlyValue(
                currentAmount,
                adjustmentInput,
                adjustmentMode,
              ),
              valuesHidden,
            )}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
```

- [ ] **Step 4: Atualizar os imports**

Adicionar ao bloco de imports:

```tsx
import { calculateAdjustedMonthlyValue } from '../../lib/monthlyValueAdjustments';
import { maskCurrency } from '../../lib/formatters';
```

Remover `Modal` dos imports do React Native (se não for mais usado):

```tsx
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
```

- [ ] **Step 5: Substituir os estilos**

Remover os estilos que não existem mais:

- `adjustmentButtons`
- `adjustmentButton`
- `addButton`, `addButtonText`
- `subtractButton`, `subtractButtonText`
- `modalOverlay`, `modalCard`
- `adjustmentTitle`, `adjustmentInput` (o input agora usa estilo diferente)
- `modalActions`, `modalButton`, `cancelButton`, `cancelButtonText`
- `subtractConfirmButton`, `subtractConfirmButtonText`

Adicionar os novos estilos (idênticos ao `CurrentMonthPaymentChecklist`):

```tsx
adjustToggleButton: {
  alignItems: 'center',
  backgroundColor: colors.surfaceRaised,
  borderColor: colors.borderStrong,
  borderRadius: 8,
  borderWidth: 1,
  height: 30,
  justifyContent: 'center',
  width: 30,
},
adjustToggleButtonText: {
  color: colors.textSecondary,
  letterSpacing: 0,
  ...typography.button,
},
adjustPanel: {
  borderTopColor: colors.border,
  borderTopWidth: 1,
  gap: 8,
  marginTop: 8,
  paddingTop: 8,
},
adjustFieldRow: {
  alignItems: 'center',
  borderColor: colors.border,
  borderRadius: 12,
  borderWidth: 1,
  flexDirection: 'row',
  overflow: 'hidden',
},
adjustModeButton: {
  alignItems: 'center',
  height: 44,
  justifyContent: 'center',
  width: 44,
},
adjustModeButtonInactive: {
  backgroundColor: colors.surfaceMuted,
},
adjustModeButtonText: {
  ...typography.button,
  letterSpacing: 0,
},
adjustInput: {
  color: colors.textPrimary,
  flex: 1,
  letterSpacing: 0,
  paddingHorizontal: 12,
  textAlign: 'center',
  ...typography.input,
},
adjustActions: {
  flexDirection: 'row',
  gap: 8,
},
adjustCancelButton: {
  alignItems: 'center',
  backgroundColor: colors.surfaceMuted,
  borderColor: colors.borderStrong,
  borderRadius: 12,
  borderWidth: 1,
  flex: 1,
  justifyContent: 'center',
  minHeight: 44,
  paddingHorizontal: 12,
},
adjustCancelButtonText: {
  color: colors.textSecondary,
  letterSpacing: 0,
  ...typography.button,
},
adjustConfirmButton: {
  alignItems: 'center',
  borderRadius: 12,
  flex: 2,
  flexDirection: 'row',
  gap: 6,
  justifyContent: 'center',
  minHeight: 44,
  paddingHorizontal: 12,
},
adjustConfirmText: {
  color: colors.accentText,
  letterSpacing: 0,
  ...typography.button,
},
```

Manter os estilos existentes que continuam sendo usados:

- `panel`, `sectionTitle`, `monthValueList`, `monthValueItem`
- `monthValueRow`, `monthValueLabel`, `monthValueName`
- `monthValueControlGroup`, `input`, `monthValueInput`
- `installmentsRow`, `installmentsLabel`, `installmentsInput`, `installmentSummary`
- `emptyText`
