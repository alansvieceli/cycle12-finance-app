# Task 035-04 - Update Docs and Validate

Status: Done

## Spec

`docs/specs/035-spending-trends-and-averages.md`

## Plan

`docs/plans/035-spending-trends-and-averages-plan.md`

## Goal

Document the new spending-trend behavior in `docs/app-context.md` and run full project validation.

## Files

- Modify: `docs/app-context.md`

## Steps

1. In `docs/app-context.md`, under the `### Resumo` section (around line 64-79), add a bullet describing the trend line: in the current-month view, a neutral indicator compares total expenses to the historical average (`monthHistory`), with arrow/percentage/delta amount, or an insufficient-data message when fewer than 2 history entries exist.
2. In the history-related bullet (around line 77, "past month history accessible through the Histórico pill..."), extend it (or add an adjacent bullet) to mention: each expanded history card's `Categorias` tab shows per-category variation vs that category's historical average, and the `Histórico` view shows an overall average monthly spend summary when 2+ history entries exist.
3. Run full validation:

```bash
npm run check
npm test
```

4. Confirm both commands pass (the pre-existing `expo-asset` test failure, if any, is a known unrelated issue — note it explicitly if it still occurs, do not attempt to fix it).

## Acceptance Criteria

- `docs/app-context.md` describes the Resumo trend line and the Histórico per-category variation / average summary.
- `npm run check` passes.
- `npm test` passes (aside from the pre-existing unrelated `expo-asset` failure, if still present).
