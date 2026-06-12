# Task 036-04 - Wire Goal Marker and Tag into Resumo, Projeção, Histórico

Status: Done

## Spec

`docs/specs/036-commitment-goal.md`

## Plan

`docs/plans/036-commitment-goal-plan.md`

## Goal

Add the neutral vertical "meta" marker to the current-month commitment bar in `SummaryScreen`, and render `GoalTag` in the balance panel (current month), `MonthSummaryCard` (Projeção), and `HistoryCard` (Histórico) — all without changing `resolveCommitmentColor` or the bar fill colors.

## Files

- Modify: `src/screens/SummaryScreen.tsx`
- Modify: `src/components/finance/MonthSummaryCard.tsx`
- Modify: `src/components/finance/HistoryCard.tsx`

## Context / Note

The spec describes the `GoalTag` as sitting "below the existing status hint text" in the balance panel. That hint text ("Dentro dos limites…" / "Acima do limite…") does **not currently exist** in `SummaryScreen.tsx` — the closest existing element is `trendLine` (spec 035's trend text, rendered after the commitment bar/progress track around line 318). Place the `GoalTag` immediately below `trendLine` instead; do not add the hint text (out of scope for this spec).

## Steps

1. **`SummaryScreen.tsx` — meta marker on the current-month commitment bar:**
   - Compute `goalFraction = financeState.settings.commitmentGoal / 100`.
   - Compute `goalStatus = resolveGoalStatus(currentCommitmentPercentage, goalFraction)` using the helper from `src/lib/commitmentGoal.ts`.
   - In the `styles.progressTrack` View (around line 308-314), add a new absolutely-positioned sibling `View` rendered only when `financeState.settings.commitmentGoal > 0`:
     ```tsx
     {
       financeState.settings.commitmentGoal > 0 && (
         <View
           style={[
             styles.goalMarker,
             {
               left: `${Math.min(Math.max(financeState.settings.commitmentGoal, 0), 100)}%`,
             },
           ]}
         />
       );
     }
     ```
   - Add `goalMarker` to the `StyleSheet`: a thin (1-2px wide), full-height, light-gray (neutral, e.g. `'rgba(255,255,255,0.4)'` or the project's existing neutral gray token) absolutely-positioned line, e.g.:
     ```ts
     goalMarker: {
       position: 'absolute',
       top: 0,
       bottom: 0,
       width: 2,
       backgroundColor: 'rgba(255,255,255,0.35)',
     },
     ```
     Ensure `styles.progressTrack` has `position: 'relative'` (or is already a positioning context) so the marker overlays correctly.

2. **`SummaryScreen.tsx` — status tag below the trend line:**
   - Immediately after the `trendLine` `Text` (around line 318), render:
     ```tsx
     <GoalTag status={goalStatus} />
     ```
   - Import `GoalTag` from `../components/finance/GoalTag` and `resolveGoalStatus` from `../lib/commitmentGoal`.

3. **`MonthSummaryCard.tsx` (Projeção) — status tag only:**
   - Add a `commitmentGoal: number` prop (or extend the existing settings prop to include it).
   - Compute the month's commitment ratio (already available as `salaryCommitmentPercentage` or equivalent per the card's existing props) and `goalStatus = resolveGoalStatus(ratio, commitmentGoal / 100)`.
   - Render `<GoalTag status={goalStatus} />` near the existing commitment percentage display — no bar marker, no extra text.
   - Update the call site in `SummaryScreen.tsx` (around line 467-484) to pass `commitmentGoal={financeState.settings.commitmentGoal}`.

4. **`HistoryCard.tsx` (Histórico) — status tag only:**
   - Add a `commitmentGoal: number` prop.
   - Using the existing `ratio = entry.totalIncome > 0 ? entry.totalExpenses / entry.totalIncome : 0` (or `null` when `totalIncome === 0`, to match `resolveGoalStatus`'s `null`-for-no-income contract), compute `goalStatus = resolveGoalStatus(ratio, commitmentGoal / 100)`.
   - Render `<GoalTag status={goalStatus} />` near the existing commitment display — no bar marker, no extra text.
   - Update the call site in `SummaryScreen.tsx` (around line 524-536) to pass `commitmentGoal={financeState.settings.commitmentGoal}`.

5. Run `npx tsc --noEmit`. If any snapshot/component tests exist for these screens/components, run them and update snapshots only if the diff is the expected new markup.

## Acceptance Criteria

- The current-month commitment bar shows a thin neutral vertical marker at `commitmentGoal%` of the track width when `commitmentGoal > 0`; hidden when `commitmentGoal === 0`.
- The bar's fill color and `resolveCommitmentColor` usage are unchanged.
- `GoalTag` renders below the trend line in the balance panel, reflecting `resolveGoalStatus` for the current month.
- `MonthSummaryCard` (Projeção) and `HistoryCard` (Histórico) each render only `GoalTag` (no marker, no extra text) for their respective month's commitment vs. goal.
- TypeScript compilation passes.
