# Task 003-02 - Add Tab Shell

## Plan Reference

`docs/plans/003-tabbed-finance-workflow-plan.md`

## Spec Reference

`docs/specs/003-tabbed-finance-workflow.md`

## Prerequisite

Task `003-01` must be complete.

## Objective

Add a simple four-tab shell for `Resumo`, `Planejamento`, `Categorias`, and `Ajustes`.

## Steps

1. Add local tab state.
2. Add tab controls.
3. Move summary cards into `Resumo`.
4. Move monthly/account editing into `Planejamento`.
5. Move category editing into `Categorias`.
6. Move salary/extra settings into `Ajustes`.

## Acceptance Criteria

- App opens on `Resumo`.
- User can switch tabs.
- Each tab shows only its relevant content.
- No navigation dependency is added unless explicitly justified.
- TypeScript validation passes.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```
