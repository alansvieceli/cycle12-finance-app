# App Context - Cycle12 Finance

## App Name

Cycle12 Finance

## Summary

Cycle12 Finance is a local-first personal finance projection app built with React Native, Expo, and TypeScript. It helps a single user control account bills, salary commitment, payments, and projected monthly surplus or shortfall across a rolling 12-month planning window.

The app replaces a personal spreadsheet workflow with a mobile-first experience focused on repeated monthly finance planning.

## Target Problem

The app is for a user who wants to:

- register expense categories and account items.
- project month-by-month expenses for the next 12 months.
- compare expenses against a fixed monthly salary.
- track paid and pending account items for the current month.
- see whether each month ends with surplus or shortfall.
- keep data private and stored only on the device.
- optionally protect app access with the device's enrolled biometrics.
- quickly hide all monetary values on screen without leaving the app.
- export and restore local backups when needed.

## Core Product Principles

- Local-first: there is no backend, login, remote sync, or cloud account.
- Optional security: biometric app lock is local-only and disabled by default.
- Privacy toggle: a session-only eye icon in the greeting row hides all monetary values across every tab until tapped again or the app is reopened.
- Android-first: validation and manual testing target Android emulator first.
- Simple and maintainable: avoid unnecessary dependencies and complex architecture.
- Finance-focused: UI changes should support fast scanning, monthly planning, and practical money decisions.
- Spec-first workflow: new behavior should be documented in specs, plans, and tasks before implementation.

## Core Data Concepts

- Category: a group for account items, such as a type of expense.
- Account item: an expense or bill with a name, category, due day, and monthly values.
- Monthly value: the editable amount for an account item in a specific projected month.
- Salary: the fixed monthly income used for commitment and balance calculations.
- Current month extra balance: an extra amount that affects the current month projection. Added quickly via the "+" button in the Resumo balance panel or edited directly in Ajustes. Resets to zero automatically when the planning window advances.
- Payment status: the monthly status of an account item, holding its manual paid/unpaid state and whether its value was reviewed. Both are scoped to a single month and are discarded when that month leaves the planning window.
- Month history: a snapshot of each past month captured when the planning window advances, storing income, total expenses, and per-category/per-account breakdowns. Up to 12 entries are kept.
- Visible month count: how many projection months appear in summary and charts, from 3 to 12 (values loaded from storage or a backup are clamped to 1-12).
- Rolling window: the app stores and displays 12 projected months starting from the saved current window month.
- Category propagation rule: defines how values are filled when the 12-month window advances.
- Backup file: a local `.c12f` JSON-based export with integrity validation.
- App lock settings: local app security settings that are separate from finance backup data.

## Primary Navigation

The app uses a fixed five-item bottom navigation:

- `Resumo`
- `Gráficos`
- `Planejar`
- `Cadastros`
- `Ajustes`

## Tab Responsibilities

### Resumo

`Resumo` is the main financial overview. It focuses on the current selected projection month and compact monthly indicators.

It shows:

- projected balance.
- salary commitment percentage and progress.
- monthly expense, paid, pending, an account-balance reconciliation value ("Saldo em conta" = received minus paid, blue when zero or positive and red when negative), and next due information (shown inside the payment shortcut card) when available.
- compact monthly summaries (Projeção), each showing the commitment goal status tag for that month (when a goal is configured).
- a shortcut to current-month payment tracking.
- a "+" button on the balance panel for quickly adding an extra amount to the current month income.
- a "Alocação do salário" panel showing how the current month's available income is distributed across categories, with a leftover/over-budget indicator and an expandable per-category breakdown.
- a trend line comparing the current month's total expenses to the historical average (from the saved month history), with a direction arrow, percentage, and amount delta in a neutral informational color; shows an insufficient-data message when fewer than 2 history entries exist.
- a commitment goal indicator: when a `Meta de comprometimento` is configured (0-100%, default 70%, 0 = disabled), the current-month commitment bar shows a thin neutral vertical marker at the goal position, and a fixed-width colored status tag (`dentro da meta` / `quase na meta` / `acima da meta`) appears below the trend line, based on how the month's commitment ratio compares to the goal. This is separate from the existing alert-threshold color semaphore, which is unchanged.
- past month history accessible through the Histórico pill, showing income vs expenses cards with category and account breakdown. When 2+ history entries exist, an overall average monthly spend summary is shown, and each expanded card's "Categorias" tab shows each category's variation versus its own historical average. Each card also shows the commitment goal status tag for that month (when a goal is configured).

`Resumo` should stay mostly read-only. It can open secondary views, but it should not become the main place for editing categories, accounts, or monthly values.

### Gráficos

`Gráficos` is a read-only analysis tab. It helps compare finance trends across the configured visible projection months.

It shows chart-based summaries such as:

- per-month income commitment. When a commitment goal is configured, the "Comprometimento por mês" chart also shows a single vertical neutral meta line across each bar at the goal position, plus a bottom legend (`meta NN%`).
- current-month category distribution.
- positive and negative monthly balance comparisons, with a summary that adds only
  negative balances across the visible period.

Charts are driven by existing finance calculation and chart data helpers.

### Planejar

`Planejar` is for editing monthly values for existing account items.

It focuses on:

- selecting an account item.
- viewing the 12-month planning window.
- editing full monthly values directly via an inline masked currency input.
- importing a pasted list of values for the selected account, starting at the current month, with an old-to-new preview before the supplied visible months are replaced.
- applying partial monthly adjustments via the adjustment button (`Ajustar valor`) on each month row, which opens a modal with add or subtract modes.
- applying addition adjustments across multiple consecutive months (installments) when the add mode is selected.
- a `Total dos 12 meses` footer summing the selected account's values across the whole planning window.
- marking the selected account as reviewed for the current month, through a button beside the account selector. Reviewed accounts also show the mark inside the selector list, and every mark clears itself when the planning window advances.

Account and category management do not belong in this tab; they live in `Cadastros`.

### Cadastros

`Cadastros` is the management area for finance structure.

It contains two internal sections, selected by a segmented control:

- `Categorias`.
- `Contas` (account items).

It supports creating and editing account items, assigning categories, setting due days, and keeping category/account organization separate from month-by-month planning.

### Ajustes

`Ajustes` contains global finance settings and local data actions.

It includes:

- salary.
- current month extra balance.
- visible month count.
- commitment warning and danger thresholds.
- commitment goal (`Meta de comprometimento`, 0-100%, default 70%, 0 = disabled), used to show goal-status indicators in Resumo, Projeção, Histórico, and the "Comprometimento por mês" chart. Does not change the alert-threshold color semaphore.
- 12-month window advance behavior.
- backup, restore, and reset data management.
- optional biometric app lock controls in the `Segurança` section.
- optional due-date reminder controls in the `Lembretes` section.
- app version shown as a discreet footer, read from the Expo app config.

Destructive actions, such as reset, should remain explicit and require confirmation.

The `Segurança` section lets the user enable `Bloquear com biometria` and choose `Bloquear após` timeout options. The feature is disabled by default. Enabling it requires enrolled biometrics and successful device authentication.

The `Lembretes` section lets the user enable `Lembrar vencimentos`, disabled by default. Enabling it requests OS notification permission; if denied, the toggle stays off and a hint explains permission must be granted in system settings. When enabled, the user picks `Avisar com antecedência` (0-7 days before the due date) and a reminder time (hour and minute).

## Secondary Views

### Pagamentos

`Pagamentos` is a secondary view opened from `Resumo`.

It is used to:

- view paid and pending totals for the current month.
- toggle current-month account items between paid and unpaid.
- add a new account item with a value for the current month.
- adjust (add or subtract) the value of an existing account item for the current month using the adjustment button (`Ajustar valor`) on each payment row.
- see which accounts had their current-month value reviewed in `Planejar`, through a read-only mark on each row. The mark uses the informational blue, since green already means paid on this screen.
- return to `Resumo` through a clear back action.

The header displays the current month and year. An `Adicionar conta` button opens a modal for creating an account item. The modal requires an existing category; if none exists, the button is disabled. New accounts created here set a value only for the current month; behavior in subsequent months follows the selected category's propagation rule.

It is not a sixth bottom navigation tab.

## Calculations and Behavior

The app calculates:

- monthly expenses.
- salary commitment percentage.
- projected monthly surplus or shortfall.
- paid and pending totals for the current month.
- chart-ready finance summaries.

Credit card bills are treated as manually editable monthly totals. The app does not connect to banks, cards, accounts, or external financial APIs.

All monetary input fields use a cash-register style mask: digits enter from the right as cents (`9`, `4`, `1` → `9,41`) and the display is always formatted in `pt-BR` (`9.412,34`). The user never types comma or thousand separators; backspace removes the rightmost digit. This applies to Planejar (inline values and the adjustment modal), Pagamentos (new account value and the adjustment modal), the Resumo quick-add extra modal, and the salary and extra balance fields in Ajustes. Amounts are capped at `999.999.999,99` and cannot be negative.

## Local Data and Backups

All finance data is stored locally on the device through AsyncStorage.

Optional app-lock settings and reminder settings are also stored locally, but they are not part of the `.c12f` finance backup payload.

Backup and restore behavior:

- export creates a portable `.c12f` file.
- restore validates file format, version, SHA-256 integrity hash, data shape, and internal references.
- corrupted or manually changed backup content is rejected.
- reset clears local data and recreates only the default category and settings.

## App Lock

The app can optionally lock access with device biometrics.

Behavior:

- disabled by default.
- configured in `Ajustes` under `Segurança`.
- requires enrolled biometrics before it can be enabled.
- requires a successful biometric authentication before saving the enabled state.
- locks on cold start when enabled.
- locks after returning from background if the configured timeout has elapsed.
- uses the operating system authentication prompt, including supported biometric modality and system-owned fallback behavior.

If the device has no enrolled biometrics, the feature remains disabled.

This is not an account system and does not add a custom in-app PIN.

Uninstalling the app can remove local data from the device.

## Due Date Reminders

The app can optionally send local notifications about upcoming account due dates.

Behavior:

- disabled by default.
- configured in `Ajustes` under `Lembretes`.
- enabling requests OS notification permission; denial keeps the feature off and shows a hint to grant permission in system settings.
- on Android, notifications use a branded monochrome `12` small icon configured through `expo-notifications`.
- the user configures `daysBefore` (0-7, "no dia" to "7 dias antes") and a reminder time (hour and minute).
- when fired, a notification summarizes that day's pending accounts: `N conta(s) vencem em até X dia(s) — R$ Y pendente`, counting unpaid current-window account items with a value due within the configured window, and `Y` is their pending total.
- no notification is shown for days with no qualifying accounts.
- paid accounts and accounts with no value for the month never appear in reminders.
- scheduling is bounded to a rolling 14-day horizon and re-synced on app start, on settings change, on relevant finance data changes (accounts, due days, monthly values, payment statuses), and when the planning window advances.
- notification amounts always show real values; the `valuesHidden` eye toggle is session-only and does not affect OS notifications.

This is fully local (`expo-notifications`); no backend, account, or notification history is added.

## Branding

The app is identified as `Cycle12 Finance`.

Current branding uses:

- a dark premium finance UI theme with orange accents.
- the Cycle12 `12` logo for Android launcher icon and native splash screen.
- a white transparent Cycle12 `12` notification icon for Android notification tray branding.

## Technical Stack

- React Native with Expo.
- TypeScript.
- AsyncStorage for local persistence.
- Expo File System, Document Picker, Sharing, and Crypto for local backup/restore.
- Expo Local Authentication and Blur for optional app lock.
- Expo Notifications for optional local due-date reminders.
- Expo Splash Screen for native loading branding.
- React Native Gifted Charts for chart rendering.
- Jest/Expo with React Native Testing Library for tests.
- Biome recommended React/project rules for strict linting, formatting, and import organization; Knip validates both the complete workspace and strict production-only code/dependencies.
- Husky validates staged files before commits and enforces semantic commit messages in the `type: message` format.

## Project Constraints

- Do not add backend code.
- Do not add authentication.
- Do not add paid services.
- Do not add unnecessary dependencies.
- Keep the app local-first.
- Keep the project simple and maintainable.
- Target Android emulator first.

## Documentation Workflow for Agents

Before implementing app changes, read:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/app-context.md`
4. relevant files under `docs/standards/`
5. the active spec under `docs/specs/`
6. the corresponding plan under `docs/plans/`
7. approved tasks under `docs/tasks/`

When a change affects app behavior, navigation, data concepts, branding, local storage, backup/restore, or constraints, update this document according to `docs/standards/app-context-policy.md`.
