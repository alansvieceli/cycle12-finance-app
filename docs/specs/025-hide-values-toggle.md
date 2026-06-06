# Spec 025 - Hide Values Toggle

## Goal

Allow the user to hide all monetary values in the app with a single tap, replacing amounts with a masked placeholder, so sensitive financial data is not visible when sharing the screen or when others are nearby.

## Context

The app displays monetary values across all tabs. There is no way to quickly hide this data. A common pattern in finance apps is an eye icon that toggles visibility of all amounts at once.

The user already has an open-eye SVG at `assets/eye-open.svg`. A matching closed-eye SVG was created at `assets/eye-closed.svg` in the same stroke style.

## Goals

- Add a visibility toggle button (eye icon) to the greeting row in `FinanceApp.tsx`, aligned to the right of the `Aloha :)` text.
- When hidden, replace all rendered monetary values with `R$ ••••`.
- The toggle is session-only: it resets to visible on every cold start.
- The button is visible on all tabs because it lives in the persistent greeting row, not inside any screen component.
- No new dependencies. `react-native-svg` is already installed.

## Non-Goals

- Do not persist the hidden state to `AsyncStorage`.
- Do not hide percentage values (commitment percentage is not a sensitive absolute amount).
- Do not use `secureTextEntry` on any input — it masks characters one at a time while typing, which is unusable for numeric entry.
- Do not add backend, cloud sync, or authentication.
- Do not add a separate setting in `Ajustes`.

## UX Behavior

### Greeting row

The greeting row in `FinanceApp.tsx` currently shows `Aloha :)` as a full-width `Text`. It becomes a `flexDirection: row` row with `justifyContent: space-between` and `alignItems: center`:

- Left: `Aloha :)` text (unchanged style)
- Right: eye icon button (`Pressable` wrapping the SVG icon)

The button has a minimum touch target of 44×44 dp. No label or tooltip is needed.

### Eye icon states

- Values visible → open eye (`assets/eye-open.svg` shape, no background circle)
- Values hidden → closed eye (`assets/eye-closed.svg` shape, no background circle)

The icon is rendered as an inline `react-native-svg` component. The background circle present in the SVG files is not used — the button area itself provides the touch target. Icon color matches `colors.textSecondary` when visible and `colors.accent` when hidden, so the active state is visually distinct.

### Hidden state

When values are hidden, every rendered monetary amount in the app is replaced with the string `R$ ••••`. The layout and structure of each component remain unchanged — only the text content changes.

Affected locations:

- `SummaryScreen` — projected balance, Despesas, Pendente, Pago KPI cards
- `MonthSummaryCard` — monthly balance and Despesas values
- `MonthDetailsPanel` — category totals and monthly total
- `CategoryTotalsList` — category total amounts
- `PaymentSummaryPanel` — paid and pending totals
- `CurrentMonthPaymentChecklist` — individual account item amounts
- `MonthlyBarChart` — bar chart data labels
- `CategoryBarChart` — bar chart data labels

The `Próximo venc.` KPI card in `SummaryScreen` shows a day number, not a monetary value, and is not masked.

### Editable fields

`EditableAmountInput` is used in `MonthlyValueEditor` (Planejar tab) to display and edit each month's value inline. It already manages an `isFocused` state internally.

Behavior when `valuesHidden` is true:

- Field not focused (at rest) → displays `• • •` instead of the real amount. The compact mask fits the narrow input width (106 dp) without overflowing.
- Field focused (user tapped to edit) → displays the real numeric value so the user can read and edit it normally. The user tapped intentionally, so revealing the value is expected.
- On blur → returns to `• • •` if `valuesHidden` is still true.

The adjustment modal (opened by the `+` and `–` buttons) asks the user to enter a new delta amount, not to read an existing value. It is never masked regardless of `valuesHidden`.

`EditableAmountInput` receives a `valuesHidden` prop. The `draftValue` displayed to the user is replaced with `'• • •'` when `valuesHidden && !isFocused`. The internal `draftValue` state and all calculations are unaffected.

## Implementation Notes

### State location

A `valuesHidden: boolean` state lives in `FinanceApp.tsx` alongside the existing `activeTab` and `isPaymentViewOpen` states. It defaults to `false`.

### Prop propagation

`valuesHidden` is passed as a prop down to every screen and component that renders monetary values. No React Context is needed. The existing pattern in the project already passes all data as props.

Affected prop chains:

- `FinanceApp` → `SummaryScreen` → `MonthSummaryCard`, `MonthDetailsPanel`, `CategoryTotalsList`, `PaymentSummaryPanel`
- `FinanceApp` → `CurrentMonthPaymentChecklist`
- `FinanceApp` → `ChartsScreen` → `MonthlyBarChart`, `CategoryBarChart`
- `FinanceApp` → `PlanningScreen` → `MonthlyValueEditor` → `EditableAmountInput`

### Masking helper

Add a `maskCurrency` helper to `src/lib/formatters.ts`:

```ts
export function maskCurrency(value: number, hidden: boolean): string {
  return hidden ? 'R$ ••••' : currencyFormatter.format(value);
}
```

Each component replaces direct `currencyFormatter.format(value)` calls with `maskCurrency(value, valuesHidden)`.

### Chart labels

`MonthlyBarChart` and `CategoryBarChart` pass label strings to `react-native-gifted-charts`. When `valuesHidden` is true, pass `'R$ ••••'` as the label value instead of the formatted amount.

### Eye icon component

Create `src/components/common/EyeIcon.tsx` as a small component that accepts `hidden: boolean` and `color: string` and renders the appropriate inline SVG using `react-native-svg`. Path data is taken directly from `assets/Olho aberto.svg` and `assets/Olho fechado.svg`.

The component does not render the background circle present in the SVG files.

## Acceptance Criteria

- The greeting row shows `Aloha :)` on the left and the eye icon on the right on all tabs.
- Tapping the eye icon toggles between open and closed states.
- When hidden, all monetary values across all tabs show `R$ ••••`.
- Percentage values are not masked.
- `EditableAmountInput` at rest shows `• • •` when hidden.
- `EditableAmountInput` when focused shows the real value, regardless of `valuesHidden`.
- The adjustment modal (+/–) is never masked.
- The toggle resets to visible on cold start.
- The icon color changes between `colors.textSecondary` (visible) and `colors.accent` (hidden).
- TypeScript validation passes.
- Existing tests pass.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```

Confirm on Android emulator:

- Eye icon appears on the greeting row on every tab.
- Tapping hides all monetary values simultaneously.
- Tapping again restores all values.
- In Planejar, each month value shows `• • •` at rest and the real value when tapped.
- Tapping the +/– buttons opens the adjustment modal with a normal unmasked input.
- Reopening the app resets to visible.
