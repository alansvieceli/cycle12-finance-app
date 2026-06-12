# Task 036-06 - Add Commitment Goal Field to Ajustes

Status: Done

## Spec

`docs/specs/036-commitment-goal.md`

## Plan

`docs/plans/036-commitment-goal-plan.md`

## Goal

Add a `Meta de comprometimento` (0-100%) field in `Ajustes`, backed by a new `updateCommitmentGoal` action, following the existing `commitmentWarningThreshold`/`commitmentDangerThreshold` pattern.

## Files

- Modify: `src/hooks/useFinanceState.ts`
- Modify: `src/screens/SettingsScreen.tsx`

## Steps

1. **`useFinanceState.ts`:**
   - Add a new action `updateCommitmentGoal(value: string)`, mirroring `updateCommitmentWarningThreshold`/`updateCommitmentDangerThreshold` but targeting `commitmentGoal` directly:
     ```ts
     function updateCommitmentGoal(value: string) {
       const parsed = parseInt(value.replace(/\D/g, ''), 10);
       const clamped = isNaN(parsed) ? 0 : Math.max(0, Math.min(100, parsed));
       setFinanceState((currentState) => ({
         ...currentState,
         settings: { ...currentState.settings, commitmentGoal: clamped },
       }));
     }
     ```
   - Export `updateCommitmentGoal` in the hook's returned `actions` object alongside the existing threshold updaters.

2. **`SettingsScreen.tsx`:**
   - Add a `Meta de comprometimento` field near the existing `Comprometimento` card (lines ~158-179), reusing the local `ThresholdInput` component:
     ```tsx
     <View style={styles.card}>
       <Text style={styles.cardTitle}>Meta de comprometimento</Text>
       <Text style={styles.hint}>Use 0 a 100. Deixe 0 para desativar.</Text>
       <ThresholdInput
         onChangeValue={actions.updateCommitmentGoal}
         placeholder="70"
         value={financeState.settings.commitmentGoal}
       />
     </View>
     ```
     Place this as its own card below the existing `Comprometimento` (thresholds) card, or as an additional row within it if that better matches the surrounding layout — prioritize visual consistency with the existing thresholds UI.

3. Run `npx tsc --noEmit` and `npm test` (full suite) to confirm the new action doesn't break existing `useFinanceState` tests.

## Acceptance Criteria

- `actions.updateCommitmentGoal(value)` clamps to 0-100 (non-digit input treated as 0) and updates `financeState.settings.commitmentGoal`, matching the threshold updaters' behavior.
- `Ajustes` shows a `Meta de comprometimento` field (0-100%), defaulting to 70, that updates the marker/tag/chart line everywhere when changed.
- TypeScript compilation passes; existing tests still pass.
