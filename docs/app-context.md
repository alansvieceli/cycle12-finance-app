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
- Payment status: manual paid/unpaid state for current-month account items.
- Month history: a snapshot of each past month captured when the planning window advances, storing income, total expenses, and per-category/per-account breakdowns. Up to 12 entries are kept.
- Visible month count: how many projection months appear in summary and charts, from 1 to 12.
- Rolling window: the app stores and displays 12 projected months starting from the saved current window month.
- Category propagation rule: defines how values are filled when the 12-month window advances.
- Backup file: a local `.c12f` JSON-based export with integrity validation.
- App lock settings: local app security settings that are separate from finance backup data.

## Primary Navigation

The app uses a fixed five-item bottom navigation:

- `Resumo`
- `Gráficos`
- `Planejar`
- `Contas`
- `Ajustes`

## Tab Responsibilities

### Resumo

`Resumo` is the main financial overview. It focuses on the current selected projection month and compact monthly indicators.

It shows:

- projected balance.
- salary commitment percentage and progress.
- monthly expense, paid, pending, and next due information when available.
- compact monthly summaries.
- a shortcut to current-month payment tracking.
- a "+" button on the balance panel for quickly adding an extra amount to the current month income.
- past month history accessible through the Histórico pill, showing income vs expenses cards with category and account breakdown.

`Resumo` should stay mostly read-only. It can open secondary views, but it should not become the main place for editing categories, accounts, or monthly values.

### Gráficos

`Gráficos` is a read-only analysis tab. It helps compare finance trends across the configured visible projection months.

It shows chart-based summaries such as:

- per-month income commitment.
- paid vs pending information for the current month.
- current-month category distribution.
- positive and negative monthly balance comparisons.

Charts are driven by existing finance calculation and chart data helpers.

### Planejar

`Planejar` is for editing monthly values for existing account items.

It focuses on:

- selecting an account item.
- viewing the 12-month planning window.
- editing full monthly values directly via an inline input.
- applying partial monthly adjustments via a `±` button on each month row, which opens a modal with add or subtract modes.
- applying addition adjustments across multiple consecutive months (installments) when the add mode is selected.

Account and category management do not belong in this tab; they live in `Contas`.

### Contas

`Contas` is the management area for finance structure.

It contains internal sections for:

- categories.
- account items.

It supports creating and editing account items, assigning categories, setting due days, and keeping category/account organization separate from month-by-month planning.

### Ajustes

`Ajustes` contains global finance settings and local data actions.

It includes:

- salary.
- current month extra balance.
- visible month count.
- commitment warning and danger thresholds.
- 12-month window advance behavior.
- backup, restore, and reset data management.
- optional biometric app lock controls in the `Segurança` section.

Destructive actions, such as reset, should remain explicit and require confirmation.

The `Segurança` section lets the user enable `Bloquear com biometria` and choose `Bloquear após` timeout options. The feature is disabled by default. Enabling it requires enrolled biometrics and successful device authentication.

## Secondary Views

### Pagamentos

`Pagamentos` is a secondary view opened from `Resumo`.

It is used to:

- view paid and pending totals for the current month.
- toggle current-month account items between paid and unpaid.
- add a new account item with a value for the current month.
- adjust (add or subtract) the value of an existing account item for the current month using the `±` button on each payment row.
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

## Local Data and Backups

All finance data is stored locally on the device through AsyncStorage.

Optional app-lock settings are also stored locally, but they are not part of the `.c12f` finance backup payload.

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

## Branding

The app is identified as `Cycle12 Finance`.

Current branding uses:

- a dark premium finance UI theme with orange accents.
- the Cycle12 `12` logo for Android launcher icon and native splash screen.

## Technical Stack

- React Native with Expo.
- TypeScript.
- AsyncStorage for local persistence.
- Expo File System, Document Picker, Sharing, and Crypto for local backup/restore.
- Expo Local Authentication and Blur for optional app lock.
- Expo Splash Screen for native loading branding.
- React Native Gifted Charts for chart rendering.
- Jest/Expo with React Native Testing Library for tests.

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
