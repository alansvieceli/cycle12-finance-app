# Task 020-04 - Add App Lock Overlay

## Spec

`docs/specs/020-app-lock.md`

## Plan

`docs/plans/020-app-lock-plan.md`

## Goal

Add the full-screen lock overlay component.

## Steps

1. Create `src/components/common/AppLockOverlay.tsx`.
2. Render a `BlurView` covering the full app when locked or initializing in a protected state.
3. Center the app logo over the blur.
4. Add a `Desbloquear` action button that calls `unlock()`.
5. Keep the overlay at the highest z-index so underlying app content is not readable or interactable.
6. Return `null` when app lock is disabled and initialization is complete.

## Acceptance Criteria

- Overlay covers 100% of the app while locked.
- Underlying app content is not readable or interactable while locked.
- The app logo is visible.
- The button label is `Desbloquear`.
- Cancelling or failing OS authentication leaves the overlay visible.

## Implementation Notes

- Added `src/components/common/AppLockOverlay.tsx`.
- The overlay also covers the app during app-lock setting initialization to avoid a brief data flash.
- The `Desbloquear` button appears only when the app is actually locked.
