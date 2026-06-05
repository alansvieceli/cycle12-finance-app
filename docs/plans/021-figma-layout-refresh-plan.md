# Plan 021 - Figma Layout Refresh

## Objective

Implement the Figma layout refresh from spec 021 without changing the finance data model.

## Assumptions

- The Figma sample values are visual examples only. Runtime values continue to come from local app state.
- `Pagamentos` is a secondary view launched from `Resumo`, not a sixth bottom navigation tab.
- The first pass may use text-based navigation icons or simple glyphs if adding an icon dependency is not necessary.
- Visual components can be refined iteratively after the first implementation is reviewed on device.

## Tasks

1. Create this spec, plan, and task set.
2. Update theme tokens and shared visual components to match the Figma system.
3. Rework the app shell with fixed bottom navigation and new tab structure.
4. Split current account management into a dedicated `Contas` screen.
5. Compose `Ajustes` from category management plus existing settings/data controls.
6. Refine `Resumo`, `Pagamentos`, `Gráficos`, and `Planejar` layouts to follow the Figma direction.
7. Update README and validate with project commands.

## Validation

Run:

- `npm run typecheck`
- `npm test`

Run lint/format checks if the implementation touches enough styling or shared code to justify the extra validation.

## Documentation

Update README because navigation and visible app behavior change.
