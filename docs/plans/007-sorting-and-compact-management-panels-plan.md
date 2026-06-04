# Plan 007 - Sorting And Compact Management Panels

## Spec Reference

`docs/specs/007-sorting-and-compact-management-panels.md`

## Objective

Improve planning and summary scanability with consistent ordering, compact panels, faster account creation, and current-month commitment based on available income.

## Assumptions

- Use local component state for panels instead of adding navigation dependencies.
- Keep account management inside `Planejamento`, but hidden by default behind a panel action.
- Keep current-month payment tracking accessible from `Resumo`, but hidden behind a panel action by default.
- Move category totals out of default month cards and into a selected-month details panel.
- Add reusable pure sorting helpers and tests.

## Tasks

| # | File | Description |
|---|------|-------------|
| 1 | `docs/tasks/007-01-add-plan-and-tasks.md` | Create plan and task breakdown |
| 2 | `docs/tasks/007-02-add-sorting-helpers.md` | Add reusable sorting helpers and tests |
| 3 | `docs/tasks/007-03-refine-planning-management-panel.md` | Move account management into a planning panel and add category selection on account creation |
| 4 | `docs/tasks/007-04-refine-summary-details-panel.md` | Make summary month cards compact and add a month details panel |
| 5 | `docs/tasks/007-05-update-current-month-commitment.md` | Calculate current-month commitment using salary plus current-month extra balance |
| 6 | `docs/tasks/007-06-update-docs-and-validate.md` | Update docs and run final validation |

## Sequential Order

Tasks must be executed in order.

## Validation

After implementation tasks:

```bash
npx tsc --noEmit
```

When tests are affected or available:

```bash
npm test
```

At the end:

```bash
npm run test:coverage
```

## Out of Scope

- Backend
- Authentication
- Paid services
- Drag-and-drop sorting
- Navigation library
- Bank integration
