# Task 009-05 - Update Summary Color

## Plan Reference

`docs/plans/009-commitment-color-thresholds-plan.md`

## Spec Reference

`docs/specs/009-commitment-color-thresholds.md`

## Objective

Apply `resolveCommitmentColor` to the commitment percentage field in the Summary tab so the text color reflects the configured thresholds.

## Steps

1. Locate where the commitment percentage (`COMPROMETIDO`) is rendered — likely in `src/components/finance/MonthSummaryCard.tsx` or `src/screens/SummaryScreen.tsx`.

2. Pass the two threshold settings down to the component that renders the commitment value, if they are not already available.

3. Call `resolveCommitmentColor(commitmentRatio, warningThreshold, dangerThreshold)` where the commitment value is rendered.

4. Apply the returned color to the commitment text style:
   - If `resolveCommitmentColor` returns a color string, use it as `color` in the text style.
   - If it returns `null`, keep the existing default color unchanged.

5. Do not change any other field's color. Do not alter the commitment calculation or value.

## Acceptance Criteria

- Commitment text renders in red (`#d9534f`) when the percentage exceeds `commitmentDangerThreshold` and that threshold is > 0.
- Commitment text renders in amber (`#f0a500`) when the percentage exceeds `commitmentWarningThreshold`, that threshold is > 0, and the danger condition is not met.
- Commitment text renders in the default color when neither condition is met or when commitment is null.
- No other fields in the Summary tab change color.

## Validation

- `npx tsc --noEmit` passes with no errors.
- `npm test` passes.
- Manual: set warning to 80, danger to 90. Verify color changes at each threshold.
- Manual: set both to 0. Verify the field always shows the default color.
