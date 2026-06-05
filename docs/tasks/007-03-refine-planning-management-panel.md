# Task 007-03 - Refine Planning Management Panel

## Plan Reference

`docs/plans/007-sorting-and-compact-management-panels-plan.md`

## Spec Reference

`docs/specs/007-sorting-and-compact-management-panels.md`

## Objective

Make `Planejamento` focus on monthly values and move account management into an in-screen panel.

## Steps

1. Add a `Gerenciar Contas` action to `Planejamento`.
2. Show account management only when the panel is open.
3. Add a close/back action for the panel.
4. Add category selection during account creation using a compact combo/dropdown-style control.
5. Show the category/group on account selector buttons in monthly value editing.
6. Use consistent sorting in the account selector and management panel.

## Acceptance Criteria

- `Planejamento` opens focused on monthly value editing.
- Account management opens and closes from the planning screen.
- New account creation includes category selection.
- Category selection uses a compact combo/dropdown-style control instead of category chips.
- New accounts use the selected category.
- Monthly value account selector buttons show the account category/group.
- Account lists are consistently ordered.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```
