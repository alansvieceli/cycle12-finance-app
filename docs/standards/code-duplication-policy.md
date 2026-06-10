# Code Duplication Policy

## Limit

Duplicated lines in `src/` must stay at or below **5%**, as measured by `jscpd`.

## How to Measure

```bash
npx jscpd src --min-tokens 50 --threshold 5
```

- `--min-tokens 50` ignores small incidental repetitions.
- `--threshold 5` makes the command fail when duplication exceeds 5%, so it can gate CI or local validation.

## Rules

- Run the duplication check before closing any spec that adds or changes UI components or screens.
- New code must not introduce clones of 12 lines or more; extract a shared component, helper, or hook instead.
- Repeated UI structures (modal overlay/card/actions, adjustment panels, chart scaffolding) belong in shared components under `src/components/common/`.
- Test fixtures may repeat when extraction would hurt test readability; prefer factory helpers when a fixture is cloned three or more times.
- When a refactor to remove duplication is too large for the current task, document it as a pending item instead of ignoring it.

## Current Baseline

As of 2026-06-10: 0% duplicated lines (0 clones), after a dedicated refactor. Shared building blocks created by that refactor:

- `src/components/common/ModalShell.tsx`: standard modal overlay/card/title.
- `src/components/finance/AdjustmentPanel.tsx`: the `±` add/subtract amount panel.
- `src/components/finance/ChartPanel.tsx`: chart section scaffolding (title, total, empty state).
- `src/components/finance/SummaryValue.tsx`: label + amount summary tile.
- `src/theme/sharedStyles.ts`: `panelStyles`, `editorStyles`, and `modalFormStyles`.
- `src/lib/financeStateFixtures.ts`: sample finance state factory for tests.

Reuse these instead of redefining equivalent structures.
