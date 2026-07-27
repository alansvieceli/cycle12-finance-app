# Task 044-05 - Update Docs and Validate

Status: Pending

## Spec

`docs/specs/044-account-review-mark.md`

## Plan

`docs/plans/044-account-review-mark-plan.md`

## Goal

Document the review mark in `docs/app-context.md` and `README.md`, then run the full quality gate for spec 044.

## Files

- Modify: `docs/app-context.md`
- Modify: `README.md`

## Steps

- [ ] **Step 1: Data concept**

In `docs/app-context.md`, under `Core Data Concepts`, replace the payment status line:

```markdown
- Payment status: the monthly status of an account item, holding its manual paid/unpaid state and whether its value was reviewed. Both are scoped to a single month and are discarded when that month leaves the planning window.
```

- [ ] **Step 2: Planejar section**

Add to the `Planejar` list, after the adjustment bullets:

```markdown
- marking the selected account as reviewed for the current month, through a button beside the account selector. Reviewed accounts also show the mark inside the selector list, and every mark clears itself when the planning window advances.
```

- [ ] **Step 3: Pagamentos section**

Add to the `Pagamentos` list:

```markdown
- see which accounts had their current-month value reviewed in `Planejar`, through a read-only mark on each row. The mark uses the informational blue, since green already means paid on this screen.
```

- [ ] **Step 4: README behavior list**

Add to the `App Behavior` list in `README.md`, after the adjustment bullets:

```markdown
- Lets the user mark an account as reviewed for the current month in Planejar, shows that mark on each row of the Pagamentos screen, and clears every mark when the planning window advances.
```

- [ ] **Step 5: Validate**

Run: `npm run check`
Expected: Biome CI, typecheck, the full suite with coverage, knip, and knip:production all pass. `src/lib/` statement coverage stays above 80%.

- [ ] **Step 6: Check duplication**

Run: `npm run dup`
Expected: at or below 5%. Task 044-01 routed the three status lookups through one private finder specifically to keep this clean.

- [ ] **Step 7: Commit**

```bash
git add docs/app-context.md README.md
git commit -m "docs: document the account review mark"
```

## Acceptance Criteria

- `docs/app-context.md` describes the mark in the data concepts, `Planejar`, and `Pagamentos` sections, including the reset on window advance.
- `README.md` mentions the feature in its behavior list.
- `npm run check` passes.
- `npm run dup` stays at or below 5%.
