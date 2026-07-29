# Subscription Groups Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Let the user cluster subscriptions by a free-text group (`tag`) so `Cadastros`, `Gráficos`, and `Histórico` show them organized instead of one flat list.

**Architecture:** `Subscription` gains one optional field, `tag`. A single pure function, `groupSubscriptionsByTag` in `src/lib/subscriptions.ts`, is the one place that buckets and orders subscriptions by group; every screen (`Cadastros` list headers, both `Gráficos` panels, the `Histórico` tab) derives its grouping from that function so the ordering rule lives in exactly one place. No new entity, no new screen, no new dependency — reuses `CategoryBarChart` and the `HistoryCard` group-header pattern already used for accounts-by-category.

**Tech Stack:** React Native, Expo, TypeScript, Jest, react-native-gifted-charts, AsyncStorage.

## Global Constraints

- No new dependencies.
- No change to any existing calculation: monthly/yearly subscription totals and the salary share keep their current formulas, just fed by grouped rather than flat ordering downstream.
- Grouping is case-sensitive, exact-match on trimmed `tag`. No normalization, no separate managed group entity.
- A missing or blank `tag` falls into the fixed `Outros` group everywhere.
- Stored state and backups created before this feature must keep loading, with every existing subscription landing in `Outros`.
- Hidden values continue to use the existing privacy mask.
- Visible UI copy follows Brazilian Portuguese sentence case.
- Never run `git commit` without asking the user for confirmation first, even though each task below ends with a commit step.

---

### Task 1: Grouping Logic and Data Model

**Files:**
- Modify: `src/types/finance.ts`
- Modify: `src/lib/subscriptions.ts`
- Modify: `src/lib/subscriptions.test.ts`
- Modify: `src/lib/financeBackup.ts`
- Modify: `src/lib/financeBackup.test.ts`
- Create: `docs/tasks/049-01-add-grouping-logic.md`

**Interfaces:**
- Produces: `Subscription.tag`, `UNTAGGED_SUBSCRIPTION_GROUP`, `groupSubscriptionsByTag`, `toSubscriptionGroupChartPoints`.
- Changes: `toSubscriptionChartPoints` now orders by group then amount instead of amount alone (signature unchanged).
- Consumes: `chartPalette` from `src/theme/colors`.

- [x] **Step 1: Write the failing grouping tests**

```ts
const subscriptions: Subscription[] = [
  { id: 's1', name: 'Netflix', amount: 5590, tag: 'Streaming' },
  { id: 's2', name: 'Spotify', amount: 3490, tag: 'Streaming' },
  { id: 's3', name: 'Notion', amount: 1000, tag: 'Produtividade' },
  { id: 's4', name: 'Sem grupo', amount: 100 },
];

it('buckets by trimmed tag and falls back to Outros', () => {
  const groups = groupSubscriptionsByTag(subscriptions);
  expect(groups.map((g) => g.tag)).toEqual(['Streaming', 'Produtividade', 'Outros']);
});

it('sorts groups by total descending and subscriptions within a group by amount descending', () => {
  const groups = groupSubscriptionsByTag(subscriptions);
  expect(groups[0].total).toBe(9080);
  expect(groups[0].subscriptions.map((s) => s.name)).toEqual(['Netflix', 'Spotify']);
});

it('orders chart points by group then amount', () => {
  const points = toSubscriptionChartPoints(subscriptions);
  expect(points.map((p) => p.label)).toEqual(['Netflix', 'Spotify', 'Notion', 'Sem grupo']);
});

it('returns one chart point per group with its total and a palette color', () => {
  const points = toSubscriptionGroupChartPoints(subscriptions);
  expect(points.map((p) => p.label)).toEqual(['Streaming', 'Produtividade', 'Outros']);
  expect(points[0].value).toBe(9080);
  expect(points[0].color).toBe(chartPalette[0]);
});
```

- [x] **Step 2: Verify the tests fail**

Run: `npm test -- --runTestsByPath src/lib/subscriptions.test.ts`

Expected: FAIL, `groupSubscriptionsByTag` and `toSubscriptionGroupChartPoints` do not exist yet, and the existing amount-only order test for `toSubscriptionChartPoints` still passes but the new group-ordering one does not.

- [x] **Step 3: Add `tag` to the data model**

In `src/types/finance.ts`, add `tag?: string` to `Subscription` and to the `MonthHistoryEntry.subscriptions[]` item type.

- [x] **Step 4: Implement the grouping logic**

In `src/lib/subscriptions.ts` add `export const UNTAGGED_SUBSCRIPTION_GROUP = 'Outros';` and `groupSubscriptionsByTag`, which buckets by `subscription.tag?.trim() || UNTAGGED_SUBSCRIPTION_GROUP`, sorts each bucket's subscriptions by amount descending, and sorts the buckets by total descending. Rewrite `toSubscriptionChartPoints` to flatten `groupSubscriptionsByTag(...)` instead of a flat amount sort, keeping the existing `amount > 0` filter and the "own color wins, else palette by index" rule. Add `toSubscriptionGroupChartPoints`, mapping each group to a `CategoryChartPoint` with `categoryId`/`label` as the tag and `color` as `chartPalette` by group index.

- [x] **Step 5: Verify the grouping tests pass**

Run: `npm test -- --runTestsByPath src/lib/subscriptions.test.ts`

Expected: PASS.

- [x] **Step 6: Write the failing backup test for `tag`**

```ts
it('preserves each subscription tag through an export and restore', async () => {
  // round-trip a state with one tagged and one untagged subscription
});

it('restores a backup without tag as an untagged subscription', async () => {
  // omit tag from the payload subscription and expect tag undefined
});
```

- [x] **Step 7: Verify the backup test fails**

Run: `npm test -- --runTestsByPath src/lib/financeBackup.test.ts`

Expected: FAIL, `validateSubscriptions` in `src/lib/financeBackup.ts` reconstructs each subscription from an explicit `{ amount, color, id, name }` allowlist and silently drops `tag`.

- [x] **Step 8: Add `tag` to the backup allowlist**

In `validateSubscriptions`, add `tag: typeof subscription.tag === 'string' ? subscription.tag : undefined` to the returned object, matching how `color` is already handled.

- [x] **Step 9: Verify the backup tests pass**

Run: `npm test -- --runTestsByPath src/lib/financeBackup.test.ts`

Expected: PASS.

- [x] **Step 10: Run project validation**

Run: `npm run check`

Run: `npm run dup`

Expected: both commands exit successfully.

- [x] **Step 11: Complete the task record**

Mark every acceptance criterion in `docs/tasks/049-01-add-grouping-logic.md` complete. Do not commit yet — ask the user for confirmation first, per the global constraint above.

---

### Task 2: Group Chips and Headers in Cadastros

**Files:**
- Modify: `src/hooks/useFinanceState.ts`
- Modify: `src/components/finance/SubscriptionEditor.tsx`
- Modify: `src/screens/AccountsScreen.tsx`
- Create: `docs/tasks/049-02-register-subscription-groups.md`

**Interfaces:**
- Produces: `newSubscriptionTag`/`setNewSubscriptionTag` on the finance state hook, `updateSubscriptionTag(id, tag)` action, `tag` passed through `createSubscription`.
- Consumes: `groupSubscriptionsByTag`, `UNTAGGED_SUBSCRIPTION_GROUP` from `src/lib/subscriptions.ts`, `chartPalette` from `src/theme/colors`.

- [x] **Step 1: Add the tag state and action to the hook**

In `useFinanceState.ts`: add `newSubscriptionTag`/`setNewSubscriptionTag` state, include `tag: newSubscriptionTag.trim() || undefined` when `createSubscription` pushes the new item and reset the field alongside name/amount, and add `updateSubscriptionTag(subscriptionId, tag)` following the exact shape of `updateSubscriptionName`. Expose the new pieces from the hook's returned `actions`/`formState`.

- [x] **Step 2: Wire the new props into `AccountsScreen`**

Pass `newSubscriptionTag`, `onChangeNewSubscriptionTag`, and `onChangeSubscriptionTag` into `SubscriptionEditor` alongside the existing subscription props.

- [x] **Step 3: Add the tag chip row to the create form and each expanded row**

In `SubscriptionEditor`, add a `distinctTags` derivation: `groupSubscriptionsByTag(subscriptions)` filtered to exclude `UNTAGGED_SUBSCRIPTION_GROUP`, mapped to `{ tag, color }` using `chartPalette` by index. Render it as a horizontal row of small `Pressable` pills — same rounded/bordered shape as `GoalTag` (`borderRadius: 999`, `borderWidth: 1`) but interactive: unselected pills use `colors.border`/`colors.textSecondary`, the pill whose label equals the current trimmed tag value uses `colors.accent` background and `colors.accentText` text (same active-state colors `segmentButtonActive` already uses elsewhere). Tapping a pill calls the same setter as the text field. Place a compact `TextInput` (reusing `styles.input`) next to the chip row for typing a new tag or overriding the selection. The chip row renders nothing when `distinctTags` is empty.

Wire this into both the create form (`newSubscriptionTag`/`onChangeNewSubscriptionTag`) and each expanded row (`subscription.tag`/`onChangeSubscriptionTag`).

- [x] **Step 4: Group the list with headers**

Replace the flat `byAmount` derivation with a flattened `groupSubscriptionsByTag(subscriptions)` order (`byGroup`), keeping the existing frozen-order mechanism (`openOrder`/`frozenIndex`) working against this new base order instead of the old flat one — no other change to that mechanism. While rendering `sortedSubscriptions` (fresh or frozen), track the previous item's resolved tag and render a header (colored dot via `chartPalette` by the group's position in `groupSubscriptionsByTag(subscriptions)`, group name, and the group's total masked by `valuesHidden`) whenever the tag changes from the previous row, including for a subscription appended at the end while another row is expanded.

- [x] **Step 5: Verify on the Android emulator**

Confirm chips are tappable, tapping fills the tag field, a newly typed tag creates a new header on save, and editing an amount or tag on an expanded row does not move it or its header until the row closes.

- [x] **Step 6: Run project validation**

Run: `npm run check`

Run: `npm run dup`

Expected: both commands exit successfully.

- [x] **Step 7: Complete the task record**

Mark every acceptance criterion in `docs/tasks/049-02-register-subscription-groups.md` complete. Do not commit yet — ask for confirmation first.

---

### Task 3: Two Subscription Panels in Gráficos

**Files:**
- Modify: `src/screens/ChartsScreen.tsx`
- Create: `docs/tasks/049-03-add-grouped-charts-panel.md`

**Interfaces:**
- Consumes: `toSubscriptionGroupChartPoints` and the reordered `toSubscriptionChartPoints` from `src/lib/subscriptions.ts`.
- Reuses: `CategoryBarChart` unchanged.

- [x] **Step 1: Split the single panel into two `CategoryBarChart` calls**

Replace the existing `Assinaturas` `CategoryBarChart` with two: `Assinaturas por grupo` using `toSubscriptionGroupChartPoints(financeState.subscriptions)`, keeping today's `totalLabel`, `secondaryTotalLabel`/`secondaryTotalText` (yearly total), and `footnote` (salary share); and `Assinaturas por assinatura` using the reordered `toSubscriptionChartPoints`, same `totalLabel`, no secondary total, no footnote. Both keep the existing empty text and `valuesHidden`.

- [x] **Step 2: Confirm nothing else moved**

Run: `npm test`

Expected: PASS, with every other chart, calculation, and reminder test unchanged.

- [x] **Step 3: Run project validation**

Run: `npm run check`

Run: `npm run dup`

Expected: both commands exit successfully.

- [x] **Step 4: Complete the task record**

Mark every acceptance criterion in `docs/tasks/049-03-add-grouped-charts-panel.md` complete. Do not commit yet — ask for confirmation first.

---

### Task 4: Grouped Subscriptions in Histórico

**Files:**
- Modify: `src/lib/windowAdvance.ts`
- Modify: `src/lib/windowAdvance.test.ts`
- Modify: `src/components/finance/HistoryCard.tsx`
- Create: `docs/tasks/049-04-group-history-subscriptions.md`

**Interfaces:**
- Extends: `buildHistoryEntry`'s subscription snapshot with `tag`.
- Extends: `HistoryCard`'s `SubscriptionsTab` with group headers.

- [x] **Step 1: Write the failing history test**

```ts
it('records each subscription tag when the window advances', () => {
  // advance a state with a tagged subscription and assert the newest entry's
  // subscriptions[0].tag matches
});
```

- [x] **Step 2: Verify the test fails**

Run: `npm test -- --runTestsByPath src/lib/windowAdvance.test.ts`

Expected: FAIL, the snapshot does not carry `tag`.

- [x] **Step 3: Snapshot the tag**

In `buildHistoryEntry`, include `tag: subscription.tag` in the per-subscription snapshot object, same pattern as `id`/`name`/`amount`.

- [x] **Step 4: Verify the history test passes**

Run: `npm test -- --runTestsByPath src/lib/windowAdvance.test.ts`

Expected: PASS.

- [x] **Step 5: Group `SubscriptionsTab`**

In `HistoryCard`, replace the flat amount sort in `SubscriptionsTab` with `groupSubscriptionsByTag(entry.subscriptions ?? [])`, rendering a header per group reusing the existing `groupHeaderRow`/`groupHeader` styles already used for accounts-by-category in this file (dot via `chartPalette` by group index, group name, group total masked by `valuesHidden`), subscriptions listed by amount within each group. The existing total footer row and empty state (no `entry.subscriptions`) are unchanged. An entry recorded before this spec has no `tag` on its subscriptions, so it renders entirely under `Outros`.

- [x] **Step 6: Run project validation**

Run: `npm run check`

Run: `npm run dup`

Expected: both commands exit successfully.

- [x] **Step 7: Complete the task record**

Mark every acceptance criterion in `docs/tasks/049-04-group-history-subscriptions.md` complete. Do not commit yet — ask for confirmation first.

---

### Task 5: Documentation and Final Validation

**Files:**
- Modify: `README.md`
- Modify: `docs/app-context.md`
- Create: `docs/tasks/049-05-update-docs-and-validate.md`

- [x] **Step 1: Update the app context**

In `docs/app-context.md`, describe `Subscription.tag` under the existing `Assinatura` data concept entry, and document the group headers in `Cadastros`, the two panels in `Gráficos`, and the grouped tab in `Histórico`.

- [x] **Step 2: Update the README**

Describe subscription grouping where the subscriptions section/panel is already described.

- [x] **Step 3: Run the full validation**

Run: `npm test`

Run: `npm run check`

Run: `npm run dup`

Expected: every command exits successfully.

- [x] **Step 4: Complete the task record**

Mark every acceptance criterion in `docs/tasks/049-05-update-docs-and-validate.md` complete. Present a summary of every change across all five tasks and ask the user for confirmation before making any commit.
