# Task 031-02 - Add "+" Button and Modal to SummaryScreen

Status: Completed

## Spec

`docs/specs/031-quick-add-extra-balance.md`

## Plan

`docs/plans/031-quick-add-extra-balance-plan.md`

## Goal

Add a circular "+" button to the right of the projected balance value in `SummaryScreen`, and a modal that lets the user add an extra amount to the current month. Wire the `onAddExtra` callback through `FinanceApp`.

## Files

- Modify: `src/screens/SummaryScreen.tsx`
- Modify: `src/FinanceApp.tsx`

## Steps

- [ ] **Step 1: Add `onAddExtra` prop and new local state to `SummaryScreen`**

Open `src/screens/SummaryScreen.tsx`.

Update the props type:

```ts
type SummaryScreenProps = {
  financeState: FinanceState;
  onAddExtra: (amount: number) => void;
  onOpenPayments: () => void;
  projectionMonths: ProjectionMonth[];
  valuesHidden: boolean;
};
```

Update the function signature to destructure `onAddExtra`:

```ts
export function SummaryScreen({
  financeState,
  onAddExtra,
  onOpenPayments,
  projectionMonths,
  valuesHidden,
}: SummaryScreenProps) {
```

Add two new local state variables after the existing `useState` calls:

```ts
const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);
const [extraInput, setExtraInput] = useState('');
```

- [ ] **Step 2: Add `Modal` and `TextInput` to the React Native import**

At the top of `src/screens/SummaryScreen.tsx`, update the react-native import to include `Modal` and `TextInput`:

```ts
import { Fragment, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
```

- [ ] **Step 3: Add `parseCurrencyInput` import**

Add `parseCurrencyInput` to the existing lib imports:

```ts
import { parseCurrencyInput } from '../lib/inputParsers';
```

- [ ] **Step 4: Replace the projected balance `Text` with a row containing the value and the "+" button**

Find this block inside the `balancePanel` (currently around line 200–212):

```tsx
<Text style={styles.kicker}>Saldo projetado</Text>
<Text
  style={[
    styles.projectedBalance,
    currentSurplusOrShortfall < 0
      ? styles.negativeText
      : styles.positiveText,
  ]}
>
  {maskCurrency(currentSurplusOrShortfall, valuesHidden)}
</Text>
```

Replace it with:

```tsx
<Text style={styles.kicker}>Saldo projetado</Text>
<View style={styles.balanceRow}>
  <Text
    style={[
      styles.projectedBalance,
      currentSurplusOrShortfall < 0
        ? styles.negativeText
        : styles.positiveText,
    ]}
  >
    {maskCurrency(currentSurplusOrShortfall, valuesHidden)}
  </Text>
  <Pressable
    onPress={() => {
      setExtraInput('');
      setIsExtraModalOpen(true);
    }}
    style={styles.addExtraButton}
  >
    <Text style={styles.addExtraButtonText}>+</Text>
  </Pressable>
</View>
```

- [ ] **Step 5: Add the modal just before the closing tag of the `activeView === 'current'` branch**

The `activeView === 'current'` branch ends just before `activeView === 'other'`. Add the modal as the last element inside that fragment (`<>...</>`):

```tsx
<Modal
  animationType="fade"
  onRequestClose={() => setIsExtraModalOpen(false)}
  transparent
  visible={isExtraModalOpen}
>
  <Pressable onPress={() => setIsExtraModalOpen(false)} style={styles.modalOverlay}>
    <Pressable style={styles.modalCard}>
      <Text style={styles.modalTitle}>Adicionar extra do mês</Text>
      <TextInput
        autoFocus
        keyboardType="decimal-pad"
        onChangeText={setExtraInput}
        placeholder="0,00"
        placeholderTextColor={colors.textSecondary}
        style={styles.modalInput}
        value={extraInput}
      />
      <View style={styles.modalActions}>
        <Pressable
          onPress={() => setIsExtraModalOpen(false)}
          style={styles.modalCancelButton}
        >
          <Text style={styles.modalCancelButtonText}>Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            const amount = parseCurrencyInput(extraInput);
            if (amount > 0) {
              onAddExtra(amount);
            }
            setIsExtraModalOpen(false);
          }}
          style={styles.modalConfirmButton}
        >
          <Text style={styles.modalConfirmButtonText}>
            {valuesHidden
              ? 'Nova extra ••••'
              : `Nova extra ${maskCurrency(
                  financeState.settings.currentMonthExtraBalance +
                    parseCurrencyInput(extraInput),
                  false,
                )}`}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  </Pressable>
</Modal>
```

Note: the outer `Pressable` with `modalOverlay` style closes the modal on tap outside; the inner `Pressable` with `modalCard` style stops the event from propagating to the overlay.

- [ ] **Step 6: Add the new styles to `StyleSheet.create`**

Add these entries inside the existing `StyleSheet.create({...})` call:

```ts
balanceRow: {
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 6,
},
addExtraButton: {
  alignItems: 'center',
  backgroundColor: colors.accent,
  borderRadius: 999,
  height: 32,
  justifyContent: 'center',
  width: 32,
},
addExtraButtonText: {
  color: colors.accentText,
  fontSize: 20,
  fontWeight: '700',
  lineHeight: 24,
},
modalOverlay: {
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.72)',
  flex: 1,
  justifyContent: 'center',
  padding: 20,
},
modalCard: {
  backgroundColor: colors.surface,
  borderColor: colors.borderStrong,
  borderRadius: 18,
  borderWidth: 1,
  gap: 12,
  maxWidth: 360,
  padding: 16,
  width: '100%',
},
modalTitle: {
  color: colors.textPrimary,
  letterSpacing: 0,
  ...typography.cardTitle,
},
modalInput: {
  backgroundColor: colors.surfaceMuted,
  borderColor: colors.borderStrong,
  borderRadius: 12,
  borderWidth: 1,
  color: colors.textPrimary,
  letterSpacing: 0,
  minHeight: 44,
  paddingHorizontal: 12,
  ...typography.input,
},
modalActions: {
  flexDirection: 'row',
  gap: 8,
  justifyContent: 'flex-end',
},
modalCancelButton: {
  alignItems: 'center',
  backgroundColor: colors.surfaceMuted,
  borderColor: colors.borderStrong,
  borderRadius: 12,
  borderWidth: 1,
  justifyContent: 'center',
  minHeight: 42,
  minWidth: 96,
  paddingHorizontal: 12,
},
modalCancelButtonText: {
  color: colors.textSecondary,
  letterSpacing: 0,
  ...typography.button,
},
modalConfirmButton: {
  alignItems: 'center',
  backgroundColor: colors.accent,
  borderRadius: 12,
  flex: 1,
  justifyContent: 'center',
  minHeight: 42,
  paddingHorizontal: 12,
},
modalConfirmButtonText: {
  color: colors.accentText,
  letterSpacing: 0,
  ...typography.button,
},
```

Also remove the existing `projectedBalance` style's `marginTop: 6` if present, since the row wrapper now handles spacing — or keep it if removing causes a gap. Check visually.

- [ ] **Step 7: Wire `onAddExtra` in `FinanceApp`**

Open `src/FinanceApp.tsx`. Find the `SummaryScreen` usage (around line 99) and add the `onAddExtra` prop:

```tsx
<SummaryScreen
  financeState={finance.financeState}
  onAddExtra={finance.actions.addCurrentMonthExtraBalance}
  onOpenPayments={() => setIsPaymentViewOpen(true)}
  projectionMonths={visibleProjectionMonths}
  valuesHidden={valuesHidden}
/>
```

- [ ] **Step 8: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 9: Run all tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 10: Commit**

```bash
git add src/screens/SummaryScreen.tsx src/FinanceApp.tsx
git commit -m "feat: add quick extra balance button and modal to Resumo"
```

## Acceptance Criteria

- A circular orange "+" button appears to the right of the projected balance value, vertically centered.
- The button is only visible in the current month view (`activeView === 'current'`).
- Tapping "+" opens a modal with title "Adicionar extra do mês", a numeric input auto-focused, and action buttons.
- The confirm button shows "Nova extra R$ X,00" updating as the user types, using the sum of the current extra and the entered amount.
- When `valuesHidden` is active, the confirm button shows "Nova extra ••••".
- Confirming with a positive amount calls `onAddExtra` and closes the modal.
- Confirming with zero or empty input closes the modal without changing the state.
- Tapping outside the card (overlay) closes the modal without saving.
- TypeScript compilation passes.
- All existing tests pass.
