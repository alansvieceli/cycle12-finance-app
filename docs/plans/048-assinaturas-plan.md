# Assinaturas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the user a parallel, informational view of recurring subscription costs, registered in `Cadastros`, analysed in `Gráficos`, and recorded in `Histórico`, without touching any existing finance calculation.

**Architecture:** `Subscription` is a new top-level collection in `FinanceState`, deliberately without a due day, a per-month value, or a payment status, which is what keeps it out of the payment, reminder, and projection flows. One new pure module, `src/lib/subscriptions.ts`, derives every number the UI needs. The distribution chart reuses `CategoryBarChart` by mapping subscriptions to the existing `CategoryChartPoint` shape, so no chart component is created.

**Tech Stack:** React Native, Expo, TypeScript, Jest, react-native-gifted-charts, AsyncStorage.

## Execution Note

Tasks 1 and 3 were merged into a single commit during execution. `knip
--production --strict` rejects `src/lib/subscriptions.ts` while only its test
imports it, so Task 1 could not pass its own validation gate before the
`Gráficos` panel existed to consume the module. The task boundary was wrong, not
the check. Task 2 keeps its own commit and runs after both.

## Global Constraints

- No new dependencies.
- No change to any existing calculation: monthly expenses, income commitment, projected balance, salary distribution, paid/pending totals, account balance reconciliation, spending trends, the commitment goal, the existing charts, and due date reminders all keep their current values.
- The salary share uses `settings.monthlySalary` alone and never `calculateAvailableIncome`.
- Stored state and backups created before this feature must keep loading.
- Hidden values continue to use the existing privacy mask.
- Visible UI copy follows Brazilian Portuguese sentence case.
- The bottom navigation keeps its five items.

---

### Task 1: Subscription Data, Calculations, and Backup

**Files:**
- Modify: `src/types/finance.ts`
- Create: `src/lib/subscriptions.ts`
- Create: `src/lib/subscriptions.test.ts`
- Modify: `src/lib/financeBackup.ts`
- Modify: `src/lib/financeBackup.test.ts`
- Create: `docs/tasks/048-01-add-subscription-data.md`

**Interfaces:**
- Produces: `Subscription`, `FinanceState.subscriptions`, and the optional `MonthHistoryEntry.subscriptionsTotal` / `MonthHistoryEntry.subscriptions`.
- Produces: `calculateSubscriptionsMonthlyTotal`, `calculateSubscriptionsYearlyTotal`, `calculateSubscriptionsSalaryShare`, `toSubscriptionChartPoints`.
- Consumes: `chartPalette` from `src/theme/colors`, and the `CategoryChartPoint` shape from `src/lib/chartData`.

- [x] **Step 1: Write the failing calculation tests**

```ts
const subscriptions: Subscription[] = [
  { id: 's1', name: 'Netflix', amount: 5590 },
  { id: 's2', name: 'Spotify', amount: 3490 },
];

it('adds every subscription amount', () => {
  expect(calculateSubscriptionsMonthlyTotal(subscriptions)).toBe(9080);
});

it('projects the yearly total', () => {
  expect(calculateSubscriptionsYearlyTotal(subscriptions)).toBe(108960);
});

it('divides the monthly total by the salary alone', () => {
  expect(calculateSubscriptionsSalaryShare(9080, 90800)).toBeCloseTo(0.1);
});

it('returns null when there is no salary', () => {
  expect(calculateSubscriptionsSalaryShare(9080, 0)).toBeNull();
});

it('sorts chart points by amount descending and assigns palette colors', () => {
  const points = toSubscriptionChartPoints([
    { id: 's2', name: 'Spotify', amount: 3490 },
    { id: 's1', name: 'Netflix', amount: 5590 },
  ]);

  expect(points.map((point) => point.label)).toEqual(['Netflix', 'Spotify']);
  expect(points[0].color).toBe(chartPalette[0]);
  expect(points[1].color).toBe(chartPalette[1]);
});

it('keeps a subscription own color', () => {
  const [point] = toSubscriptionChartPoints([
    { id: 's1', name: 'Netflix', amount: 5590, color: '#abcdef' },
  ]);

  expect(point.color).toBe('#abcdef');
});
```

- [x] **Step 2: Verify the tests fail for the missing module**

Run: `npm test -- --runTestsByPath src/lib/subscriptions.test.ts`

Expected: FAIL because `src/lib/subscriptions.ts` does not exist.

- [x] **Step 3: Add the type and extend the state**

In `src/types/finance.ts` add `Subscription`, add `subscriptions: Subscription[]` to `FinanceState`, add `subscriptions: []` to `emptyFinanceState`, and add the two optional fields to `MonthHistoryEntry`.

```ts
export type Subscription = {
  id: string;
  name: string;
  amount: number;
  color?: string;
};
```

The two `MonthHistoryEntry` fields are optional on purpose, so the up to twelve entries already stored keep parsing.

- [x] **Step 4: Add the calculation module**

Create `src/lib/subscriptions.ts` with the four functions. `calculateSubscriptionsSalaryShare` returns `null` when the salary is zero or negative. `toSubscriptionChartPoints` sorts by amount descending first, then assigns `chartPalette[index % chartPalette.length]` to any subscription without its own color, so the color follows the position in the chart legend.

- [x] **Step 5: Verify the calculation tests pass**

Run: `npm test -- --runTestsByPath src/lib/subscriptions.test.ts`

Expected: PASS.

- [x] **Step 6: Write the failing backup tests**

```ts
it('preserves subscriptions through an export and restore', async () => {
  // round-trip a state holding two subscriptions
});

it('restores a backup without subscriptions as an empty list', async () => {
  // omit the field from the payload and expect []
});
```

- [x] **Step 7: Carry subscriptions through the backup**

Include `subscriptions` in the exported payload beside `categories` and `accountItems`, and add a `validateSubscriptions` helper following the shape of the existing validators: reject a non-array, require `id` and `name` as non-empty strings and `amount` as a finite non-negative number, and default a missing field to `[]` so older backups stay valid.

- [x] **Step 8: Verify the backup tests pass**

Run: `npm test -- --runTestsByPath src/lib/financeBackup.test.ts`

Expected: PASS.

- [x] **Step 9: Run project validation**

Run: `npm run check`

Run: `npm run dup`

Expected: both commands exit successfully.

- [x] **Step 10: Complete the task record and commit**

Mark every acceptance criterion in `docs/tasks/048-01-add-subscription-data.md` complete.

```bash
git add src/types/finance.ts src/lib/subscriptions.ts src/lib/subscriptions.test.ts src/lib/financeBackup.ts src/lib/financeBackup.test.ts docs/specs/048-assinaturas.md docs/plans/048-assinaturas-plan.md docs/tasks/048-01-add-subscription-data.md
git commit -m "feat: add subscription data and totals"
```

---

### Task 2: Register Subscriptions in Cadastros

**Files:**
- Modify: `src/hooks/useFinanceState.ts`
- Modify: `src/screens/AccountsScreen.tsx`
- Create: `docs/tasks/048-02-register-subscriptions.md`

**Interfaces:**
- Produces: `createSubscription`, `updateSubscription`, and `removeSubscription` on the hook actions.
- Consumes: `financeState.subscriptions`.

- [x] **Step 1: Add the state actions**

Add three actions to `useFinanceState`, following the shape the category and account actions already use: `createSubscription(name, amount)` ignoring an empty name or an amount of zero or less, `updateSubscription(id, changes)`, and `removeSubscription(id)`. Use `createId('subscription')` for the identifier.

- [x] **Step 2: Add the third section**

Extend `accountSections` in `AccountsScreen` with `{ id: 'subscriptions', label: 'Assinaturas' }` and widen the `AccountsSection` union.

- [x] **Step 3: Fix the segmented control layout before adding content**

In `AccountsScreen`, add `numberOfLines={1}` to the segment label `Text` and change `segmentButton.paddingHorizontal` from `12` to `6`. Three items must fit on one line at the narrowest supported width.

- [x] **Step 4: Build the section body**

Render an `Adicionar assinatura` button and the subscription list sorted by amount descending, each row showing the name, `maskCurrency(amount, valuesHidden)`, and edit and delete actions. Deleting asks for confirmation. Creating and editing use a modal with a name input and an `EditableAmountInput`, which already supplies the currency mask, the cap, and the non-negative rule. Save stays disabled until the name is non-empty and the amount is greater than zero.

- [x] **Step 5: Verify on the Android emulator**

Confirm the three labels render on a single line with no wrapping and no ellipsis. If `Assinaturas` still does not fit, apply the fallback recorded in the spec: shorten to `Assin.` in this control first, then in both controls for consistency.

- [x] **Step 6: Run project validation**

Run: `npm run check`

Run: `npm run dup`

Expected: both commands exit successfully.

- [x] **Step 7: Complete the task record and commit**

Mark every acceptance criterion in `docs/tasks/048-02-register-subscriptions.md` complete.

```bash
git add src/hooks/useFinanceState.ts src/screens/AccountsScreen.tsx docs/plans/048-assinaturas-plan.md docs/tasks/048-02-register-subscriptions.md
git commit -m "feat: register subscriptions in cadastros"
```

---

### Task 3: Subscriptions Panel in Gráficos

**Files:**
- Modify: `src/screens/ChartsScreen.tsx`
- Create: `docs/tasks/048-03-add-subscriptions-panel.md`

**Interfaces:**
- Consumes: the four functions from `src/lib/subscriptions.ts`.
- Reuses: `CategoryBarChart` unchanged.

- [x] **Step 1: Derive the panel values**

In `ChartsScreen`, derive the monthly total, the yearly total, the salary share from `financeState.settings.monthlySalary`, and the chart points.

- [x] **Step 2: Render the panel**

Add the `Assinaturas` panel below the existing ones: the monthly total in the main size, the yearly total below it, and `consome N% do salário`. When the share is `null`, show a neutral placeholder instead of a percentage. Pass the chart points to `CategoryBarChart` with the existing empty text, total label, and `valuesHidden` props.

- [x] **Step 3: Confirm nothing else moved**

Run: `npm test`

Expected: PASS, with the existing chart, calculation, and reminder tests unchanged. A failure here means the panel touched a shared calculation, which the spec forbids.

- [x] **Step 4: Run project validation**

Run: `npm run check`

Run: `npm run dup`

Expected: both commands exit successfully.

- [x] **Step 5: Complete the task record and commit**

Mark every acceptance criterion in `docs/tasks/048-03-add-subscriptions-panel.md` complete.

```bash
git add src/screens/ChartsScreen.tsx docs/plans/048-assinaturas-plan.md docs/tasks/048-03-add-subscriptions-panel.md
git commit -m "feat: show subscriptions panel in charts"
```

---

### Task 4: Record Subscriptions in the Month History

**Files:**
- Modify: `src/lib/windowAdvance.ts`
- Modify: `src/lib/windowAdvance.test.ts`
- Modify: `src/components/finance/HistoryCard.tsx`
- Create: `docs/tasks/048-04-record-subscriptions-history.md`

**Interfaces:**
- Extends: `buildHistoryEntry` with the subscriptions snapshot.
- Extends: `HistoryCard`'s `DetailTab` union with `'subscriptions'`.

- [x] **Step 1: Write the failing history tests**

```ts
it('records the subscriptions total and breakdown when the window advances', () => {
  // advance a state holding two subscriptions and assert the newest entry
  // carries subscriptionsTotal and one item per subscription
});

it('records a zero total when there is no subscription', () => {
  // advance a state with an empty list and assert a zero total
});
```

- [x] **Step 2: Verify the tests fail**

Run: `npm test -- --runTestsByPath src/lib/windowAdvance.test.ts`

Expected: FAIL because the entry carries no subscription data.

- [x] **Step 3: Snapshot the subscriptions**

In `buildHistoryEntry`, record `subscriptionsTotal` and one `{ id, name, amount }` per subscription, following the pattern already used for categories and accounts. The snapshot is a copy, so editing or deleting a subscription afterwards never alters a month already recorded.

- [x] **Step 4: Verify the history tests pass**

Run: `npm test -- --runTestsByPath src/lib/windowAdvance.test.ts`

Expected: PASS.

- [x] **Step 5: Add the third tab to the history card**

Widen `DetailTab` to `'categories' | 'accounts' | 'subscriptions'`, add the `Assinaturas` segment, and render that month's subscriptions sorted by amount descending with the recorded total in a footer row. Show an empty state when the entry has no subscription data, which is the case for every month recorded before this feature.

Keep `RECEBIDO` and `PAGO` as the only headline figures. The subscriptions total must not sit beside them: `PAGO` already includes the credit card bill, which already includes the subscriptions, so the two side by side would invite an incorrect sum.

- [x] **Step 6: Fix the history card segmented control layout**

Add `numberOfLines={1}` and `adjustsFontSizeToFit` to the segment labels and change `segmentButton.paddingHorizontal` from `12` to `6`. This control is nested inside a card and is the tighter of the two, so verify it on the Android emulator at the narrowest supported width.

- [x] **Step 7: Run project validation**

Run: `npm run check`

Run: `npm run dup`

Expected: both commands exit successfully.

- [x] **Step 8: Complete the task record and commit**

Mark every acceptance criterion in `docs/tasks/048-04-record-subscriptions-history.md` complete.

```bash
git add src/lib/windowAdvance.ts src/lib/windowAdvance.test.ts src/components/finance/HistoryCard.tsx docs/plans/048-assinaturas-plan.md docs/tasks/048-04-record-subscriptions-history.md
git commit -m "feat: record subscriptions in month history"
```

---

### Task 5: Documentation and Final Validation

**Files:**
- Modify: `README.md`
- Modify: `docs/app-context.md`
- Create: `docs/tasks/048-05-update-docs-and-validate.md`

- [x] **Step 1: Update the app context**

Add `Assinatura` to `Core Data Concepts`, describing it as a fixed monthly recurring cost kept deliberately outside every expense, payment, and balance calculation because that money is already counted in the account it is charged to. Document the `Cadastros` third section, the `Gráficos` panel, the third tab in the history card, and the inclusion of subscriptions in the `.c12f` backup.

- [x] **Step 2: Update the README**

Describe the subscriptions section and panel in the tab list and the feature list.

- [x] **Step 3: Run the full validation**

Run: `npm test`

Run: `npm run check`

Run: `npm run dup`

Expected: every command exits successfully.

- [x] **Step 4: Verify the acceptance criteria on the emulator**

Register a subscription, confirm the `Gráficos` panel totals and chart update, and confirm the projected balance, monthly expenses, income commitment, and paid/pending totals are unchanged. Export and restore a backup and confirm the subscriptions survive.

- [x] **Step 5: Complete the task record and commit**

Mark every acceptance criterion in `docs/tasks/048-05-update-docs-and-validate.md` complete.

```bash
git add README.md docs/app-context.md docs/plans/048-assinaturas-plan.md docs/tasks/048-05-update-docs-and-validate.md
git commit -m "docs: describe subscriptions"
```
