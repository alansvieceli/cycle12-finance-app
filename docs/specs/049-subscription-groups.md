# Spec 049 - Subscription Groups

## Objective

Let the user organize subscriptions by a free-text group (e.g. `Streaming`,
`IA`, `Música`) so `Cadastros` and `Gráficos` show them clustered instead of a
single flat list, making it easier to see what each category of subscription
costs.

## Problem

Spec 048 gave subscriptions a flat list sorted by amount. With enough
subscriptions (streaming, AI tools, music, productivity, cable TV) that list
stops answering "how much do I spend on streaming" without manual addition.
There is no grouping concept anywhere in `Subscription` today.

## Data Concepts

`Subscription` gains an optional `tag`:

```ts
export type Subscription = {
  id: string;
  name: string;
  amount: number;
  tag?: string;
  color?: string;
};
```

`tag` is free text, trimmed, matched exactly (case-sensitive). There is no
separate managed list of groups: the user types a group name directly on the
subscription, the same way they already type its name. A blank or missing
`tag` falls into a fixed fallback group, `"Outros"`. This keeps every
subscription created before this spec valid without migration.

`MonthHistoryEntry.subscriptions[]` gains the same optional field:

```ts
subscriptions?: { id: string; name: string; amount: number; tag?: string }[];
```

so a month's snapshot keeps its grouping when viewed later in `Histórico`.

## Changes

### Grouping logic

Add to `src/lib/subscriptions.ts`:

- `UNTAGGED_SUBSCRIPTION_GROUP = 'Outros'` constant.
- `groupSubscriptionsByTag(subscriptions)` — buckets subscriptions by
  `tag?.trim() || UNTAGGED_SUBSCRIPTION_GROUP`, sorts each bucket's
  subscriptions by amount descending, and sorts the buckets themselves by
  their total amount descending. Returns
  `{ tag: string; subscriptions: Subscription[]; total: number }[]`.
- `toSubscriptionChartPoints(subscriptions)` — unchanged signature, but now
  orders by `groupSubscriptionsByTag` flattened (group order, then amount
  within group) instead of a flat amount sort, so same-group slices sit next
  to each other in the donut and legend. Same palette-by-index and
  filter/color rules as today.
- `toSubscriptionGroupChartPoints(subscriptions)` — new. Maps each group from
  `groupSubscriptionsByTag` to a `CategoryChartPoint`: `categoryId` and
  `label` are the group tag, `value` is the group total, `color` is
  `chartPalette` by group index.

No existing calculation (monthly/yearly total, salary share) changes; they
already operate on the full subscription list regardless of grouping.

### Cadastros — subscription editor

`SubscriptionEditor` (`src/components/finance/SubscriptionEditor.tsx`):

1. The create form and each expanded row gain a group field: a row of
   tappable pill chips (visually the same pill shape as `GoalTag` — rounded,
   bordered, small — but interactive) listing every distinct tag already used
   across the user's subscriptions, ordered the same way as
   `groupSubscriptionsByTag` (by group total descending), plus a small text
   input next to the chips. Tapping a chip sets the text input to that tag;
   the input stays freely editable so typing a new value creates a new group.
   A chip renders in its selected state when its label equals the current
   trimmed input value, so no separate selection state is needed beyond the
   existing controlled text value.
2. The chip row is empty (renders nothing) until at least one subscription
   with a tag exists — no chips to suggest on a fresh install.
3. The list gains a group header above each cluster, reusing the pattern
   `HistoryCard` already uses for accounts-by-category: a small colored dot
   (`chartPalette` by group index) plus the group name in
   `panelStyles`/uppercase label style, with the group's total amount
   (masked by `valuesHidden`) aligned to the right of the header.
4. List order changes from flat amount-descending to
   `groupSubscriptionsByTag` flattened (group by total descending, then
   amount descending within group). The frozen-order behavior introduced in
   048 (order does not change while a row is expanded, a subscription created
   mid-edit goes last) is preserved: it now freezes the grouped flattened
   order instead of the flat one. Headers are derived by scanning the
   rendered order for tag boundaries, so they stay correct in both the fresh
   and the frozen case, including a subscription appended at the end under
   its own tag while another row is open.

No new files: the chip row is a small addition inside `SubscriptionEditor`,
not a new reusable component, since nothing else in the app needs a tag
picker yet.

### Gráficos — subscriptions panels

`ChartsScreen` replaces the single `Assinaturas` `CategoryBarChart` call with
two, both reusing `CategoryBarChart` unchanged (no new props needed):

1. `Assinaturas por grupo` — `data` from `toSubscriptionGroupChartPoints`,
   keeps today's `totalLabel` ("Total por mês"), `secondaryTotalLabel`/
   `secondaryTotalText` (yearly total), and `footnote` (salary share text).
   This panel is the summary view and carries the numbers the user reads
   first.
2. `Assinaturas por assinatura` — `data` from `toSubscriptionChartPoints`
   (now group-ordered), same `totalLabel`, no secondary total and no
   footnote, since the summary already showed those on the panel above. This
   is the existing per-subscription slice-and-legend view, just reordered and
   with a distinguishing title.

Both keep today's empty-state text and `valuesHidden` masking.

### Histórico

`buildHistoryEntry` in `windowAdvance.ts` records `tag` alongside `id`,
`name`, `amount` for each subscription, same pattern as the existing fields.

`HistoryCard`'s `SubscriptionsTab` groups its list the same way as
`Cadastros`: a header per tag (dot + name + group total) using
`groupSubscriptionsByTag` on `entry.subscriptions`, subscriptions sorted by
amount within each group, groups by total descending. The existing total
footer row (`entry.subscriptionsTotal`) is unchanged. Entries recorded before
this spec have no `tag` on their subscriptions, so they render entirely under
`Outros` — still correct, no migration needed.

### Persistence

`tag` travels inside `subscriptions` through AsyncStorage persistence with no
change, since that path serializes `FinanceState` as-is.

The `.c12f` backup path rebuilds each subscription from an explicit allowlist
(`validateSubscriptions` in `financeBackup.ts` returns `{ amount, color, id,
name }`), so `tag` needs to be added to that allowlist explicitly or it is
silently dropped on export/restore. A backup without `tag` restores
subscriptions as untagged (`Outros`).

The `tag` on the `MonthHistoryEntry.subscriptions[]` breakdown is not part of
this: `validateMonthHistory` in `financeBackup.ts` already does not restore
`subscriptionsTotal`/`subscriptions` on history entries at all (a pre-existing
gap from spec 048, not introduced here), so a restored backup's history cards
show the `Outros` empty state for that tab regardless of what was recorded
before export. Fixing that gap is out of scope for this spec.

## Data Flow

`AccountsScreen` passes the new tag value through the same add/edit handlers
`SubscriptionEditor` already uses, extended with a `tag` argument.
`ChartsScreen` and `HistoryCard` derive grouping from `FinanceState`/
`MonthHistoryEntry` through `groupSubscriptionsByTag`, no new state.

## Testing

- `subscriptions.test.ts`: `groupSubscriptionsByTag` buckets by trimmed tag,
  falls back untagged subscriptions to `Outros`, sorts groups by total
  descending and subscriptions within a group by amount descending;
  `toSubscriptionChartPoints` orders by group then amount;
  `toSubscriptionGroupChartPoints` returns one point per group with the
  correct total and palette color.
- `windowAdvance.test.ts`: a history entry captures each subscription's `tag`.
- `financeBackup.test.ts`: a backup round-trip preserves each subscription's
  `tag`, and a backup without the field restores subscriptions as untagged.

## Out of Scope

- A managed list of groups (separate entity, colors set once, rename-cascade
  across subscriptions). Groups are inferred from whatever text subscriptions
  currently carry.
- Case-insensitive or fuzzy tag matching. `Streaming` and `streaming` are
  distinct groups; the chip picker is the mitigation, not a normalizer.
- Grouping anywhere in the app other than `Cadastros`, `Gráficos`, and
  `Histórico` subscriptions.
- Per-subscription color no longer picked from the group; `color` on
  `Subscription` keeps meaning exactly what it means today (038/048), unused
  by the new grouping logic.

## Acceptance Criteria

- Creating or editing a subscription offers existing tags as tappable chips
  plus a free-text field; selecting a chip fills the field, typing creates a
  new group.
- `Cadastros` lists subscriptions under a header per group, group order and
  in-group order both by amount descending (group total, then subscription
  amount), with subscriptions with no tag grouped under `Outros`.
- Editing a subscription's amount or tag while its row is expanded does not
  reorder or reheader the list until the row closes.
- `Gráficos` shows `Assinaturas por grupo` (one slice per group, with monthly
  total, yearly total, and salary share) and `Assinaturas por assinatura`
  (one slice per subscription, group-ordered) as two separate panels.
- `Histórico`'s `Assinaturas` tab for each month groups that month's
  recorded subscriptions by their snapshotted tag, same header pattern,
  with entries recorded before this spec showing entirely under `Outros`.
- The eye toggle still masks every monetary value in all three places.
- Exporting and restoring a `.c12f` backup preserves each subscription's tag.
- `npm run check` and `npm run dup` pass.
- README and app context describe subscription grouping.
