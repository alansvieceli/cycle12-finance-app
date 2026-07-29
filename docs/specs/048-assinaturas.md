# Spec 048 - Assinaturas

## Objective

Give the user a dedicated view of recurring subscription costs: monthly total,
yearly total, share of the monthly salary, and a per-subscription distribution
chart, without mixing subscriptions into any existing expense, payment, or
balance calculation.

## Problem

The user pays most subscriptions on the credit card, and the card bill is
already an `AccountItem` with a manually edited monthly total. That money is
therefore already counted in monthly expenses, commitment, and projected
balance.

Registering each subscription as an account item would either count the same
money twice or force every calculation to exclude a whole category. The user
needs a parallel, informational view: what the subscriptions cost, which one
costs the most, and how much of the salary they consume.

## Data Concepts

New `Subscription`:

```ts
export type Subscription = {
  id: string;
  name: string;
  amount: number;
  color?: string;
};
```

`amount` is a single fixed monthly value that applies to every month. There is
no due day, no per-month value, and no payment status; their absence is what
keeps subscriptions out of the payment, reminder, and projection flows. Editing
`amount` changes the current and future totals only, since past months are
already frozen in the history snapshot.

`FinanceState` gains `subscriptions: Subscription[]`.

`MonthHistoryEntry` gains two optional fields, so entries recorded before this
feature stay valid:

```ts
subscriptionsTotal?: number;
subscriptions?: { id: string; name: string; amount: number }[];
```

## Changes

### Calculations

Add `src/lib/subscriptions.ts` with:

- `calculateSubscriptionsMonthlyTotal(subscriptions)` — sum of `amount`.
- `calculateSubscriptionsYearlyTotal(subscriptions)` — monthly total times 12.
- `calculateSubscriptionsSalaryShare(monthlyTotal, monthlySalary)` — the ratio
  between them, returning `null` when the salary is zero or negative. It takes
  the salary alone and deliberately does not use `calculateAvailableIncome`,
  because the current month extra balance is a one-off amount and would distort
  a recurring cost.
- `toSubscriptionChartPoints(subscriptions)` — maps subscriptions to the
  existing `CategoryChartPoint` shape, sorted by amount descending, assigning
  `color` from `chartPalette` by index when the subscription has none.

No existing calculation changes. Subscriptions do not affect monthly expenses,
income commitment, projected balance, salary distribution, paid/pending totals,
account balance reconciliation, spending trends, the commitment goal, the
existing charts, or due date reminders. The only place they appear in `Gráficos`
is their own new panel.

### Screens

Management and analysis stay in the tabs that already own each responsibility.
There is no new navigation, no sixth bottom tab, and no new secondary view.

#### Cadastros - management

`Cadastros` gains a third section in its existing segmented control:
`Categorias | Contas | Assinaturas`. The section holds only registration:

1. An `Adicionar assinatura` button.
2. The subscription list sorted by amount descending, each row with name,
   formatted amount, and edit and delete actions.

Creating and editing follow the pattern `CategoryEditor` and `AccountEditor`
already use in this tab, rather than a modal: a collapsible `Nova assinatura`
form at the top, and a list where tapping a row expands it into its editable
fields. Both use a name `TextInput` and the existing `EditableAmountInput`, so
the cash-register currency mask, the `999.999.999,99` cap, and the non-negative
rule apply without new code, and the section reuses `editorStyles` and
`panelStyles`.

`Adicionar` stays disabled until the name is non-empty and the amount is greater
than zero. Deleting requires confirmation through the same `Alert` the other
editors use.

The list is sorted by amount descending, but that order is frozen while a row is
expanded. Without freezing it, editing an amount would re-sort the list and move
the row away from under the user mid-edit, which is exactly the flow the
expanded row exists for. The order settles back to amount descending when the
row closes, and a subscription created while a row is open goes last rather than
jumping to the top.

#### Gráficos - analysis

`Gráficos` gains an `Assinaturas` panel below the existing ones, matching the
read-only nature of the tab:

1. The monthly total in the main size, the yearly total below it, and the salary
   share as `consome N% do salário`. When the salary is zero, the share line
   shows a neutral placeholder instead of a percentage.
2. The distribution chart, reusing `CategoryBarChart`. It already renders the
   donut, the legend, the total, and honors `valuesHidden`. It gains three
   optional props so it can carry this panel: `secondaryTotalLabel` and
   `secondaryTotalText`, forwarded to the paired totals `ChartPanel` already
   supports, and `footnote` for the salary share line. Its existing use in
   `Categorias no mês atual` passes none of them and is unaffected.

The panel shows the existing empty state when no subscription is registered.

Every monetary value in both places is masked by the existing `valuesHidden` eye
toggle.

### History

`buildHistoryEntry` in `windowAdvance.ts` records `subscriptionsTotal` and the
per-subscription breakdown for the month leaving the planning window, following
the pattern it already uses for categories and accounts. Deleting or editing a
subscription afterwards does not alter a snapshot already taken.

`HistoryCard` gains a third item in the segmented control it already has inside
each expanded card, going from `Categorias | Contas` to
`Categorias | Contas | Assinaturas`. The new tab lists that month's
subscriptions sorted by amount descending, with the recorded total in a footer
row.

The total is deliberately not placed next to `RECEBIDO` and `PAGO`. `PAGO`
already includes the credit card bill, which already includes the subscriptions,
so showing both figures side by side would invite an incorrect sum. Keeping the
breakdown inside its own tab makes it read as a different cut of the same money.

The card shows an empty state in that tab for months recorded before this
feature existed, or for months with no subscription registered.

### Layout constraint on the segmented controls

Both segmented controls go from two items to three, and `Assinaturas` is a long
label. `AccountsScreen` and `HistoryCard` share the same style: `flex: 1`
buttons, `paddingHorizontal: 12`, `gap: 6`, container `padding: 6`, and
`typography.button` at 13px bold. Nothing currently prevents the label from
wrapping to a second line.

With three items the text area per button drops to roughly `(width - 24) / 3 -
24`. On a 360dp phone that is about 77dp inside `Cadastros` and about 67dp inside
a history card, which is nested and therefore narrower. `Assinaturas` needs
around 83dp, and inside the history card even the existing `Categorias` label
stops fitting.

Required changes, all native `Text` props and style values:

- `numberOfLines={1}` on the segment labels in both controls, so a tight fit
  never becomes a two-line button.
- `paddingHorizontal` reduced from `12` to `6` on `segmentButton` in both
  controls, which returns about 12dp of text area per button.
- `adjustsFontSizeToFit` on the history card labels, the tighter of the two, so
  the text shrinks instead of truncating with an ellipsis.

With the reduced padding the label is expected to fit in `Cadastros` and to be
about five percent over inside a history card, which `adjustsFontSizeToFit`
absorbs without a visible difference.

Both controls must be checked on the Android emulator at the narrowest supported
width before the spec is considered done. Every label must render on one line,
fully legible, with no ellipsis in `Cadastros`.

If the emulator shows the label still does not fit, apply this fallback, in
order, and only where it is needed:

1. Shorten the label to `Assin.` in the control that fails. `Ass.` is rejected:
   it saves no meaningful width over `Assin.` and reads poorly beside two full
   words.
2. Shorten it in both controls, so the two look consistent.

Icon-only or icon-plus-text segments are rejected. The existing segments are
text only, no unambiguous glyph exists for a subscription, and a text label
stays readable for screen readers and for a user who has never seen the
section before.

### Persistence

`subscriptions` is part of `FinanceState`, so AsyncStorage persistence needs no
new key.

The `.c12f` backup payload includes `subscriptions`, validated for shape like
the other collections. A backup or stored state without the field restores as an
empty list, so older backups stay valid.

## Data Flow

`AccountsScreen` reads `financeState.subscriptions` and calls the existing
finance state hook to add, edit, and delete them.

`ChartsScreen` reads the same list and derives the monthly total, the yearly
total, the salary share, and the chart points through `src/lib/subscriptions.ts`,
then passes the points to `CategoryBarChart`.

`windowAdvance` reads the same list when it builds a history entry.

Both screens read from `FinanceState`, so no data is duplicated and the panel
reflects a registration change immediately.

## Testing

- `subscriptions.test.ts`: monthly total, yearly total, salary share with a
  normal salary, salary share returning `null` when the salary is zero, and
  chart points sorted by amount descending with palette colors assigned.
- `windowAdvance.test.ts`: a history entry captures the subscriptions total and
  breakdown, and an empty subscription list produces a zero total.
- `financeBackup.test.ts`: a backup round-trip preserves subscriptions, and a
  backup without the field restores as an empty list.

## Out of Scope

- Billing cycles other than monthly. An annual subscription is divided by twelve
  manually when registered.
- Renewal dates, active/cancelled status, free trial tracking, and price change
  history or alerts.
- Marking a subscription as paid, and any due date reminder for subscriptions.
- Including subscriptions in monthly expenses, income commitment, projected
  balance, salary distribution, spending trends, or any existing chart. The new
  panel is additive and leaves the other panels untouched.
- A sixth bottom navigation tab, and any mirror of the total in `Resumo`.
- New dependencies.

## Acceptance Criteria

- `Cadastros` shows three sections, and `Assinaturas` lists every registered
  subscription sorted by amount descending with edit and delete actions.
- `Gráficos` shows an `Assinaturas` panel with the monthly total, the yearly
  total, and the share of the salary; the share shows a neutral placeholder when
  the salary is zero.
- The salary share uses the salary alone and ignores the current month extra
  balance.
- The distribution chart shows one slice per subscription with its own color and
  a legend naming each one.
- Adding, editing, or deleting a subscription in `Cadastros` updates the
  `Gráficos` panel immediately and persists across app restarts.
- Amount input uses the existing currency mask and rejects zero and negative
  values.
- The eye toggle masks every monetary value in both places.
- The bottom navigation keeps its five items.
- Registered subscriptions do not change the projected balance, monthly
  expenses, income commitment, paid/pending totals, or any existing chart.
- A month leaving the planning window records its subscriptions total and
  breakdown in the history.
- Each expanded history card offers `Categorias | Contas | Assinaturas`, and the
  new tab lists that month's subscriptions with the recorded total, showing an
  empty state for months recorded before this feature.
- The history card keeps showing only `RECEBIDO` and `PAGO` as its headline
  figures.
- Every label in both segmented controls renders on a single line at the
  narrowest supported width, with no wrapping and no ellipsis in `Cadastros`.
- Exporting and restoring a `.c12f` backup preserves subscriptions, and a backup
  created before this feature still restores.
- `npm run check` and `npm run dup` pass.
- README and app context describe the `Cadastros` section, the `Gráficos` panel,
  and the new data concept.
