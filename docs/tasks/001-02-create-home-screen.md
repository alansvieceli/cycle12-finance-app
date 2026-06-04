# Task 001-02 - Create Home Screen

## Plan Reference

`docs/plans/001-bootstrap-expo-project-plan.md`

## Prerequisite

Task `001-01` must be complete.

## Objective

Replace the default template content in `App.tsx` with a minimal screen displaying the text `Cycle12 Finance`.

## Steps

1. Open `App.tsx`.
2. Remove all default boilerplate content.
3. Render a centered `<Text>` component with the value `Cycle12 Finance`.
4. Keep only the imports required for the component (`React`, `View`, `Text`, `StyleSheet` from React Native).

## Expected Result

`App.tsx` renders a single screen with `Cycle12 Finance` centered on the screen. No other UI elements are required.

## Acceptance Criteria

- `App.tsx` compiles without TypeScript errors.
- Screen shows only the text `Cycle12 Finance`.
- No navigation, forms, or financial logic introduced.

## Notes

- Do not use any third-party UI library.
- Do not add props, state, or hooks beyond what is strictly necessary to display the text.
