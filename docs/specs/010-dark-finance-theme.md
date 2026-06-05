# Spec 010 - Dark Finance Theme

## Objective

Update the app visual theme to a dark finance-focused palette that improves perceived focus, keeps financial warnings easy to scan, and gives the app a more modern Android-first appearance.

## Context

The app currently uses a light palette with green as the primary color. The user proposed moving to a dark theme with orange navigation and clear commitment status colors:

| Type              | Color     |
| ----------------- | --------- |
| Background        | `#121212` |
| Card              | `#1E1E1E` |
| Text              | `#FFFFFF` |
| Navigation        | `#F97316` |
| Low commitment    | `#FFFFFF` |
| Medium commitment | `#FACC15` |
| High commitment   | `#EF4444` |

This direction makes sense for a personal finance control app because dark backgrounds reduce visual noise, orange works well as a navigation/accent color, and yellow/red are familiar warning and danger signals. The implementation should add the missing supporting colors needed for a complete interface: secondary text, borders, muted surfaces, positive values, and negative values.

## Goals

- Replace the current light visual style with a dark theme across the app.
- Use `#121212` as the main app background.
- Use `#1E1E1E` as the default card/panel background.
- Use `#FFFFFF` as primary text and neutral/low commitment text.
- Use `#F97316` as the primary navigation and action accent.
- Use `#FACC15` for medium commitment warning.
- Use `#EF4444` for high commitment danger when legibility is sufficient.
- Add supporting dark-theme tokens for secondary text, borders, muted inputs, positive values, and negative values.
- Keep the app simple and maintainable by avoiding new styling dependencies.

## Non-goals

- Do not add a user-facing light/dark mode toggle in this spec.
- Do not add system theme detection in this spec.
- Do not change finance calculations.
- Do not change app navigation structure.
- Do not add animations or decorative visual effects.
- Do not add backend code, authentication, paid services, or unnecessary dependencies.

## Theme Tokens

Create or update a shared theme source so colors are not duplicated across every component.

Recommended tokens:

| Token              |     Color | Usage                                         |
| ------------------ | --------: | --------------------------------------------- |
| `background`       | `#121212` | App screen background                         |
| `surface`          | `#1E1E1E` | Cards, panels, grouped sections               |
| `surfaceMuted`     | `#242424` | Inputs, inactive chips, subtle grouped areas  |
| `border`           | `#333333` | Card borders, dividers, input borders         |
| `textPrimary`      | `#FFFFFF` | Main values and headings                      |
| `textSecondary`    | `#A3A3A3` | Labels, hints, secondary metadata             |
| `accent`           | `#F97316` | Active tab, primary buttons, selected states  |
| `accentText`       | `#121212` | Text/icons placed on orange backgrounds       |
| `commitmentLow`    | `#FFFFFF` | Low/default commitment percentage             |
| `commitmentMedium` | `#FACC15` | Warning commitment percentage                 |
| `commitmentHigh`   | `#EF4444` | Danger commitment percentage                  |
| `positive`         | `#22C55E` | Positive balances and favorable values        |
| `negative`         | `#EF4444` | Shortfalls, destructive or unfavorable values |

If `#EF4444` is too low-contrast for small text in implementation, use `#F87171` for text while keeping `#EF4444` for larger badges, bars, or filled danger surfaces.

## Visual Rules

- Screens use `background`.
- Cards and panels use `surface` with `border`.
- Inputs use `surfaceMuted`, `border`, and `textPrimary`.
- Labels, hints, empty-state details, and helper text use `textSecondary`.
- Active tab state uses `accent`.
- Primary actions use `accent` with `accentText` when the button is filled.
- Destructive actions continue to use danger styling, but must be readable on the dark theme.
- Positive finance values use `positive`.
- Negative finance values use `negative`.
- Commitment percentage colors follow the existing threshold behavior:
  - below warning threshold: `commitmentLow`
  - above warning threshold: `commitmentMedium`
  - above danger threshold: `commitmentHigh`

## Accessibility And Readability

- Primary text must remain readable on `background`, `surface`, and `surfaceMuted`.
- Secondary text must be clearly distinguishable from primary text without becoming too faint.
- Orange-filled buttons must use dark text/icons for contrast.
- Red warning text should be checked on both `background` and `surface`; use the lighter fallback red if needed.
- Touch targets and spacing should not shrink as part of the visual change.

## Implementation Notes

Recommended implementation:

- Add a shared theme file under `src/theme/` or `src/styles/`.
- Replace hard-coded colors in common components first.
- Then update finance components and screens to use the shared tokens.
- Keep style changes scoped to visual presentation.
- Do not introduce a styling library.
- Do not combine this change with unrelated layout or behavior refactors.

## Acceptance Criteria

- The app uses `#121212` as the main background.
- Cards and panels use `#1E1E1E`.
- Primary text is white and readable.
- Secondary labels and hints use a muted readable color.
- Active navigation uses `#F97316`.
- Primary buttons/actions use the orange accent consistently.
- Inputs are readable on the dark theme.
- Commitment percentage still respects the configured thresholds.
- Commitment low/default color is white.
- Commitment medium color is `#FACC15`.
- Commitment high color is `#EF4444` or the documented lighter fallback when needed for readability.
- Positive and negative financial values remain visually distinct.
- No new dependencies are added.
- TypeScript validation passes.
- Existing tests pass.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```

When applicable, validate manually on Android through Expo:

```bash
npx expo start
```

Confirm:

- all tabs are readable
- cards, inputs, and buttons have enough contrast
- active tab state is obvious
- commitment colors appear correctly below, between, and above thresholds
- positive and negative values are still easy to distinguish
- no text overlaps or becomes clipped on mobile width

## Documentation Requirements

Update `README.md` after implementation to mention:

- the dark finance theme
- the orange navigation/accent color
- the commitment color behavior if not already documented

Follow:

- `docs/standards/ai-workflow.md`
- `docs/standards/readme-policy.md`
- `docs/standards/testing-policy.md`
