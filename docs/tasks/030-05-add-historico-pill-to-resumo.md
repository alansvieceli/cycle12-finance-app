# Task 030-05 - Add Histórico Pill to SummaryScreen

Status: Pending

## Spec

`docs/specs/030-month-history.md`

## Plan

`docs/plans/030-month-history-plan.md`

## Goal

Add a third `Histórico` pill to the month pill row in `SummaryScreen` and render the scrollable history card list when it is active, including an empty state message.

## Files

- Modify: `src/screens/SummaryScreen.tsx`

## Steps

1. In `src/screens/SummaryScreen.tsx`, import `HistoryCard`:

```ts
import { HistoryCard } from '../components/finance/HistoryCard';
```

2. The component already receives `financeState` which now has `monthHistory`. No new props are needed.

3. Replace the existing `isOtherMonthsVisible: boolean` local state with a `activeView` union to support three views:

```ts
type ActiveView = 'current' | 'other' | 'history';

// replace:
//   const [isOtherMonthsVisible, setIsOtherMonthsVisible] = useState(false);
// with:
const [activeView, setActiveView] = useState<ActiveView>('current');
```

4. Update the three pill `Pressable` elements. Replace the two existing pills (current month and "Outros meses") and add the third:

```tsx
<View style={styles.monthPills}>
  <Pressable
    onPress={() => setActiveView('current')}
    style={[styles.monthPill, activeView === 'current' ? styles.monthPillActive : null]}
  >
    <Text
      style={[
        styles.monthPillText,
        activeView === 'current' ? styles.monthPillActiveText : null,
      ]}
    >
      {formatMonthLabel(currentProjectionMonth.year, currentProjectionMonth.month)}
    </Text>
  </Pressable>
  <Pressable
    onPress={() => setActiveView('other')}
    style={[styles.monthPill, activeView === 'other' ? styles.monthPillActive : null]}
  >
    <Text
      style={[
        styles.monthPillText,
        activeView === 'other' ? styles.monthPillActiveText : null,
      ]}
    >
      Outros meses
    </Text>
  </Pressable>
  <Pressable
    onPress={() => setActiveView('history')}
    style={[styles.monthPill, activeView === 'history' ? styles.monthPillActive : null]}
  >
    <Text
      style={[
        styles.monthPillText,
        activeView === 'history' ? styles.monthPillActiveText : null,
      ]}
    >
      Histórico
    </Text>
  </Pressable>
</View>
```

5. Update the conditional rendering below the pills row. Replace the existing `!isOtherMonthsVisible ? (...) : (...)` with a three-branch structure:

```tsx
{
  activeView === 'current' ? (
    <>{/* existing current month content — balancePanel, kpiGrid, paymentShortcut */}</>
  ) : activeView === 'other' ? (
    <>{/* existing other months list */}</>
  ) : (
    <>
      {financeState.monthHistory.length === 0 ? (
        <View style={styles.emptyHistory}>
          <Text style={styles.emptyHistoryText}>
            Nenhum mês registrado ainda. O histórico é salvo automaticamente quando o
            mês avança.
          </Text>
        </View>
      ) : (
        financeState.monthHistory.map((entry) => (
          <HistoryCard
            key={`${entry.year}-${entry.month}`}
            entry={entry}
            settings={financeState.settings}
            valuesHidden={valuesHidden}
          />
        ))
      )}
    </>
  );
}
```

6. Add the missing styles to the `StyleSheet.create` call:

```ts
emptyHistory: {
  alignItems: 'center',
  backgroundColor: colors.surface,
  borderColor: colors.border,
  borderRadius: 18,
  borderWidth: 1,
  justifyContent: 'center',
  minHeight: 120,
  padding: 24,
},
emptyHistoryText: {
  color: colors.textSecondary,
  textAlign: 'center',
  ...typography.body,
},
```

7. Run `npx tsc --noEmit` and confirm no type errors.

8. Run `npm test` and confirm all existing tests pass.

## Acceptance Criteria

- Three pills appear in Resumo: current month, Outros meses, Histórico.
- Selecting Histórico renders the history card list.
- Cards are rendered most-recent first (as stored in `monthHistory`).
- When `monthHistory` is empty, the empty state message is shown.
- When `monthHistory` has entries, each is rendered as a `HistoryCard`.
- Selecting the current month or Outros meses pill restores the original content.
- All monetary values respect the `valuesHidden` toggle.
- TypeScript compilation passes.
- All existing tests pass.
