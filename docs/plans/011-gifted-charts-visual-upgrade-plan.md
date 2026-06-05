# Plan 011 - Gifted Charts Visual Upgrade

## Spec

`docs/specs/011-gifted-charts-visual-upgrade.md`

## Objective

Replace the simple view-based charts in the `Gráficos` tab with `react-native-gifted-charts` visualizations.

## Tasks

| Task | File | Purpose |
|---|---|---|
| 011-01 | `docs/tasks/011-01-add-gifted-charts-dependencies.md` | Verify and install the chart library and required Expo-compatible peers. |
| 011-02 | `docs/tasks/011-02-add-gifted-chart-adapters.md` | Add pure adapter helpers for gifted chart data shapes and cover them with tests. |
| 011-03 | `docs/tasks/011-03-replace-chart-components.md` | Replace monthly/category chart components with gifted bar, line/area, and donut charts. |
| 011-04 | `docs/tasks/011-04-update-docs-and-validate.md` | Update README and run validation. |

## Dependency Notes

- `react-native-gifted-charts` 1.4.77 was checked through npm.
- It declares `react-native-svg` and gradient libraries as peers.
- Use Expo-compatible installs for native peers.

## Validation

- `npx tsc --noEmit`
- `npm test`
- `npm run test:coverage`
- Android/Expo manual validation when available
