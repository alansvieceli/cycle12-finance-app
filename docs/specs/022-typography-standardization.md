# Spec 022 - Typography Standardization

## Objective

Standardize app typography with centralized tokens while preserving the current visual identity, navigation, business rules, colors, and general layouts.

## Context

The app is visually close to the desired dark fintech direction, but text hierarchy is inconsistent across screens, cards, buttons, labels, values, tabs, lists, and forms.

Initial audit found:

- 101 `fontSize` declarations in `src`.
- 83 `fontWeight` declarations in `src`.
- 16 `lineHeight` declarations in `src`.
- Hardcoded font sizes from `10` to `34`.
- Equivalent visual roles using different sizes:
  - section titles mostly `18`, but modal/card titles also use `15`, `16`, `17`, and `18`.
  - labels use `10`, `11`, `12`, and `13`.
  - body/helper text uses `12`, `13`, and `14` with line heights `16`, `17`, `18`, `19`, and `20`.
  - amounts use `13`, `14`, `16`, `17`, `18`, and `34`.
  - buttons use `12`, `13`, and some implicit weights from shared components.
  - tab labels use `10`, smaller than the target tab role.

## Goals

- Create a centralized typography theme file, such as `src/theme/typography.ts`.
- Replace scattered hardcoded `fontSize`, `fontWeight`, and `lineHeight` values with semantic tokens.
- Keep typography aligned with the current dark finance UI.
- Standardize:
  - screen titles
  - section titles
  - card titles
  - monetary values
  - labels
  - secondary/body text
  - button text
  - input text
  - tabs and filters
  - chart labels and captions
- Keep `lineHeight` proportional to each text role.
- Keep `fontWeight` semantic by visual function.

## Non-goals

- Do not redesign screens.
- Do not change colors.
- Do not change navigation.
- Do not change business rules.
- Do not refactor component structure unless needed to consume typography tokens.
- Do not change spacing except where a text line height requires it.
- Do not add dependencies.

## Proposed Typography Scale

Create semantic tokens based on the existing app style:

| Token          | Size | Line height | Weight |
| -------------- | ---: | ----------: | ------ |
| `screenTitle`  |   24 |          30 | `700`  |
| `sectionTitle` |   18 |          24 | `800`  |
| `cardTitle`    |   16 |          22 | `800`  |
| `amountLarge`  |   30 |          36 | `900`  |
| `amountMedium` |   18 |          24 | `900`  |
| `amountSmall`  |   14 |          20 | `800`  |
| `body`         |   14 |          20 | `700`  |
| `bodySmall`    |   12 |          17 | `700`  |
| `label`        |   11 |          15 | `900`  |
| `button`       |   13 |          18 | `800`  |
| `tab`          |   12 |          16 | `800`  |
| `caption`      |   11 |          15 | `800`  |
| `input`        |   18 |          24 | `700`  |
| `inputCompact` |   14 |          20 | `700`  |

Weights should also be exported for local composition:

- `regular`
- `medium`
- `semibold`
- `bold`
- `heavy`

## Acceptance Criteria

- `src/theme/typography.ts` exists and exports semantic typography tokens.
- Components consume typography tokens instead of hardcoded `fontSize`, `fontWeight`, and `lineHeight` where practical.
- Remaining hardcoded typography values are documented as justified exceptions.
- Visual hierarchy remains close to the current app.
- Colors remain unchanged.
- Navigation and business behavior remain unchanged.
- TypeScript validation passes.
- Lint passes.
- Unit tests pass.

## Validation

Run:

```bash
npm run lint
```

Run:

```bash
npm run typecheck
```

Run:

```bash
npm test
```
