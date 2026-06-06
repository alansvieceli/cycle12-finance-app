# Task 025-01 - Add Eye Icon Component

## Spec

`docs/specs/025-hide-values-toggle.md`

## Plan

`docs/plans/025-hide-values-toggle-plan.md`

## Goal

Create the `EyeIcon` component used by the visibility toggle button.

## Steps

1. Create `src/components/common/EyeIcon.tsx`.
2. Accept props `hidden: boolean` and `color: string`.
3. Render the open-eye paths when `hidden` is `false`, taken from `assets/eye-open.svg` (eye outline + pupil paths only, no background circle).
4. Render the closed-eye paths when `hidden` is `true`, taken from `assets/eye-closed.svg` (eyelid arch + lash paths, no background circle).
5. Use `react-native-svg` (`Svg`, `Path`) — already installed.
6. Set `viewBox="0 0 35 35"` and render at 22×22 dp.

## Acceptance Criteria

- Component renders without errors.
- Open eye renders when `hidden` is `false`.
- Closed eye renders when `hidden` is `true`.
- No background circle is rendered.
- TypeScript validation passes.
