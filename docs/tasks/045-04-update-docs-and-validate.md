# Task 045-04 - Update Docs and Validate

Status: Ready

## Spec

`docs/specs/045-monthly-value-list-import.md`

## Plan

`docs/plans/045-monthly-value-list-import-plan.md`

## Goal

Document the completed Planejar import flow and run the full project gate.

## Files

- Modify: `docs/app-context.md`
- Modify: `README.md`
- Modify: `docs/plans/045-monthly-value-list-import-plan.md`
- Modify: `docs/tasks/045-01-parse-monthly-value-list.md`
- Modify: `docs/tasks/045-02-replace-monthly-values-atomically.md`
- Modify: `docs/tasks/045-03-add-planejar-import-flow.md`
- Modify: `docs/tasks/045-04-update-docs-and-validate.md`

## Interfaces

- Consumes: the completed behavior from tasks 045-01 through 045-03.
- Produces: no code interface; documentation matches the shipped UI and all checks pass.

## Steps

- [ ] **Step 1: Update app context**

In the `### Planejar` bullet list in `docs/app-context.md`, add after direct inline editing:

```markdown
- importing a pasted list of values for the selected account, starting at the current month, with an old-to-new preview before the supplied visible months are replaced.
```

Keep the existing adjustment, total, and review bullets unchanged.

- [ ] **Step 2: Update README**

In the README's `Planejar` behavior summary, add one concise sentence:

```markdown
For the selected account, a pasted value list can replace consecutive visible months after an old-to-new confirmation preview.
```

Do not describe parsing internals or add a new architecture section.

- [ ] **Step 3: Run focused regression tests**

Run:

```bash
npx jest inputParsers useFinanceState ActionButton MonthlyValueEditor
```

Expected: PASS.

- [ ] **Step 4: Run the full gate**

Run:

```bash
npm run check
```

Expected: Biome, TypeScript, coverage tests, Knip workspace validation, and strict production Knip validation all pass.

- [ ] **Step 5: Mark documentation status**

After the full gate passes:

- change the plan status from `Planned` to `Implemented, checks passing`;
- change each 045 task status from `Ready` to `Done`;
- replace every task checkbox `- [ ]` with `- [x]` only for steps actually executed.

- [ ] **Step 6: Commit**

```bash
git add README.md docs/app-context.md docs/plans/045-monthly-value-list-import-plan.md docs/tasks/045-*.md
git commit -m "docs: complete monthly value list import"
```

## Acceptance Criteria

- README and app context describe the import without contradicting the UI.
- All four task files and the plan reflect their executed status.
- Focused tests pass.
- `npm run check` passes.
