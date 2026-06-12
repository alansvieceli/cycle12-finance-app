# Task 036-05 - Add Meta Line and Legend to Commitment Chart

Status: Done

## Spec

`docs/specs/036-commitment-goal.md`

## Plan

`docs/plans/036-commitment-goal-plan.md`

## Goal

Add a single vertical "meta" line crossing each bar's track in `MonthlyCommitmentList` at the goal position, plus a discreet bottom legend (`meta NN%`), without changing the chart title or per-bar colors. Hidden when the goal is unset.

## Files

- Modify: `src/components/finance/MonthlyCommitmentList.tsx`
- Modify: `src/screens/ChartsScreen.tsx`

## Steps

1. **`MonthlyCommitmentList.tsx`:**
   - Add a `goal?: number` prop (0-100; the configured `commitmentGoal`).
   - For each row's `styles.progressTrack` (lines ~38-49), add a sibling absolutely-positioned `View` rendered when `goal && goal > 0`:
     ```tsx
     {
       goal > 0 && (
         <View
           style={[styles.goalLine, { left: `${Math.min(Math.max(goal, 0), 100)}%` }]}
         />
       );
     }
     ```
     Reuse the same marker style approach as `SummaryScreen`'s `goalMarker` (thin, neutral, full-height of the track, absolutely positioned, `position: 'relative'` on `progressTrack` as the positioning context). Name it `goalLine` for clarity within this component, but keep the visual style consistent with the `Resumo` marker.
   - After the `.list` View (the list of bars), inside `styles.panel`, add a bottom legend row rendered when `goal && goal > 0`:
     ```tsx
     {
       goal > 0 && (
         <View style={styles.legendRow}>
           <View style={styles.legendSwatch} />
           <Text style={styles.legendText}>meta {goal}%</Text>
         </View>
       );
     }
     ```
   - Add `legendRow` (flex row, small gap, aligned to the start, with some top margin to separate from the bars), `legendSwatch` (a short horizontal line/rect matching the `goalLine` color), and `legendText` (small, muted text style) to the `StyleSheet`. The chart title (`sectionTitle`, line ~22) is unchanged and the legend must not be placed adjacent to/around it — only at the bottom of the panel, after the bar list.

2. **`ChartsScreen.tsx`:**
   - Pass `goal={financeState.settings.commitmentGoal}` to the `<MonthlyCommitmentList ... />` call (around lines 93-97).

3. Run `npx tsc --noEmit`.

## Acceptance Criteria

- `MonthlyCommitmentList` draws a single vertical neutral line across each bar's track at `goal%` of the track width, when `goal > 0`.
- A bottom legend (`meta NN%` + small line swatch) appears below the bar list when `goal > 0`; hidden when `goal === 0`.
- The chart title `"Comprometimento por mês"` is unchanged in text and position; the legend is not placed above/under the title.
- Per-bar fill colors are unchanged.
- TypeScript compilation passes.
