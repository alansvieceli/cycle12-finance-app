# Spec 009 - Commitment Color Thresholds

## Objective

Allow the user to configure percentage thresholds that change the color of the commitment percentage shown in the Summary tab, making it easier to spot months where expenses are approaching or exceeding a comfortable limit.

## Context

The Summary tab shows a `COMPROMETIDO` field for each month, calculated by `calculateIncomeCommitmentPercentage`. Currently this value is always displayed in the same neutral color regardless of how high it is.

The user wants a visual warning system: when the commitment percentage crosses a configurable threshold, the text color changes to yellow (warning) or red (danger). The thresholds themselves should be configurable from the Settings tab.

The commitment percentage is already calculated and available. This spec adds only the threshold configuration and the color logic. No calculation changes are needed.

## Goals

- Add two configurable threshold values to `FinanceSettings`: warning threshold and danger threshold.
- Display the commitment percentage in a warning color when it exceeds the warning threshold.
- Display the commitment percentage in a danger color when it exceeds the danger threshold.
- The danger color takes priority over the warning color when both thresholds are exceeded.
- Allow the user to edit both thresholds in the Settings tab as whole-number percentage fields.
- Persist threshold values with the rest of the settings via AsyncStorage.

## Non-goals

- No threshold for surplus/shortfall, category totals, or other fields.
- No color changes outside the commitment percentage field.
- No animated transitions or icons.
- No per-month or per-category threshold overrides.

## Settings Fields

Two new fields are added to the Settings tab, grouped visually near the existing salary inputs.

| Field                        | Label                     | Type                      | Default |
| ---------------------------- | ------------------------- | ------------------------- | ------- |
| `commitmentWarningThreshold` | Alerta de comprometimento | integer percentage, 0–100 | 80      |
| `commitmentDangerThreshold`  | Perigo de comprometimento | integer percentage, 0–100 | 90      |

Both fields accept whole numbers from 0 to 100, representing percentages.

If the warning threshold is greater than or equal to the danger threshold, the danger threshold is simply ignored and only warning color applies when exceeded.

Input hint: `0 a 100. Deixe 0 para desativar.`

Setting either threshold to 0 effectively disables that level.

## Color Rules

The commitment percentage text in the Summary tab follows this priority:

1. If `commitmentDangerThreshold > 0` and commitment % > danger threshold → danger color (`#d9534f` red).
2. Else if `commitmentWarningThreshold > 0` and commitment % > warning threshold → warning color (`#f0a500` amber).
3. Otherwise → default text color (unchanged from current).

The commitment percentage is expressed as a ratio internally (e.g., `0.85` = 85%). The threshold comparison converts the stored integer percentage to the same scale (divide by 100).

When commitment is `null` (no salary configured), no color rule applies.

## Data Model

`FinanceSettings` gains two new optional fields with default values:

```ts
commitmentWarningThreshold: number; // default 80
commitmentDangerThreshold: number; // default 90
```

The `emptyFinanceState` constant must be updated to include both fields.

Existing persisted data that does not have these fields should fall back to the defaults on load.

## Persistence Rules

Threshold values are stored alongside the rest of `FinanceSettings` in AsyncStorage.

When loading saved data, missing threshold fields default to `80` (warning) and `90` (danger).

## Acceptance Criteria

- `FinanceSettings` type includes `commitmentWarningThreshold` and `commitmentDangerThreshold`.
- `emptyFinanceState` sets both thresholds to their defaults (80 and 90).
- The storage load path applies defaults for missing threshold fields.
- `useFinanceState` exposes actions to update each threshold.
- Settings tab shows both threshold input fields with appropriate labels and hints.
- Commitment percentage in the Summary tab renders in the danger color when the percentage exceeds `commitmentDangerThreshold` and that threshold is greater than 0.
- Commitment percentage renders in the warning color when the percentage exceeds `commitmentWarningThreshold`, that threshold is greater than 0, and the danger condition is not met.
- When neither threshold condition is met, the commitment percentage renders in the default color.
- When commitment is null, no color rule is applied.
- TypeScript validation passes.
- Existing tests pass.

## Validation

- `npx tsc --noEmit` passes with no errors.
- `npm test` passes.
- Manually set warning to 80 and danger to 90. Enter salary and expenses that put a month above 90% and confirm red. Adjust expenses to fall between 80–90% and confirm amber. Drop below 80% and confirm default color.
- Set both thresholds to 0 and confirm the field always shows default color.

## Documentation Requirements

- Update `README.md` app behavior section to mention configurable commitment color thresholds.
- Update `FinanceSettings` documentation if a separate type reference doc exists.
