# Task 038-03 - Update Docs and Validate

Status: Not started

## Spec

`docs/specs/038-account-balance-reconciliation.md`

## Plan

`docs/plans/038-account-balance-reconciliation-plan.md`

## Goal

Update `docs/app-context.md` to describe the new `Saldo em conta` KPI, per the app-context update policy, and run the full validation gate before closing the spec.

## Files

- Modify: `docs/app-context.md`

## Steps

- [ ] **Step 1: Update the Resumo section**

In `docs/app-context.md`, under `### Resumo`, find this bullet:

```
- monthly expense, paid, pending, and next due information when available.
```

Replace it with:

```
- monthly expense, paid, pending, an account-balance reconciliation value ("Saldo em conta" = received minus paid, for comparing against the real bank balance), and next due information (shown inside the payment shortcut card) when available.
```

- [ ] **Step 2: Run the full validation gate**

```bash
npm run check && npm run test:coverage
```

Expected: all checks (lint, format:check, typecheck, test) pass, and `src/lib/` coverage stays above 80% statements.

- [ ] **Step 3: Commit**

```bash
git add docs/app-context.md
git commit -m "docs: describe saldo em conta kpi in app context"
```

## Acceptance Criteria

- `docs/app-context.md` describes the `Saldo em conta` reconciliation value under `Resumo`.
- `npm run check && npm run test:coverage` passes with `src/lib/` coverage above 80% statements.
- Spec 038 acceptance criteria (in `docs/specs/038-account-balance-reconciliation.md`) are all satisfied.
