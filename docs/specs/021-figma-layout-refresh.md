# Spec 021 - Figma Layout Refresh

## Goal

Adapt the existing Cycle12 Finance app to the Figma layout kit in file `N9689rfFZqeLIvEpNbMlsR`, node `1:2`, while preserving the current local finance data model and calculation behavior.

## Context

The Figma design introduces a more compact dark fintech interface for the app that has already been implemented. The design keeps the same underlying finance concepts, but changes the screen organization and visual hierarchy significantly.

Current app areas:

- `Resumo`
- `Gráficos`
- `Planejamento`
- `Categorias`
- `Configurações`

Target app areas from the design:

- `Resumo`
- `Gráficos`
- `Planejar`
- `Contas`
- `Ajustes`

The design also shows a `Pagamentos` view. It is treated as a secondary screen opened from `Resumo`, not as one of the five fixed bottom navigation areas.

## Goals

- Apply the Figma color system and spacing language across the existing app.
- Replace the horizontal tab bar with a fixed bottom navigation with five areas.
- Keep all existing finance state, persistence, calculations, backup/restore, categories, accounts, monthly values, payment statuses, charts, and settings behavior.
- Move account management out of `Planejamento` into a dedicated `Contas` tab.
- Combine category management and app settings into an `Ajustes` tab.
- Make `Resumo` emphasize the current selected month with compact KPI cards and a payment shortcut.
- Keep `Pagamentos` as a dedicated view reachable from the summary.
- Keep visual-only changes mostly untested, while preserving tests for pure business logic.

## Non-Goals

- Do not add backend code.
- Do not add authentication.
- Do not replace local storage.
- Do not change the finance data model unless a small prop or screen composition change requires it.
- Do not hard-code the Figma sample values as app data.
- Do not add unnecessary dependencies.
- Do not implement app lock from spec 020 in this task.

## Design System

Use these values as the app's target visual tokens:

- Background: `#0B0D12`
- Card/surface: `#151A22`
- Raised/muted surface: `#202734`
- Border: `#2D3542`
- Text primary: `#F5F7FA`
- Text secondary: `#9AA3AF`
- Action/accent: `#FF6B1A`
- Positive: `#32D078`
- Negative/danger: `#FF5D6C`
- Warning: `#FFC845`
- Info: `#6EA8FF`

Layout rules from the design:

- Currency values should always use Brazilian Real formatting with two decimal places, such as `R$ 78.297,90`.
- Touch targets should be at least 44 px tall.
- Cards should use rounded corners around 16 to 24 px with subtle borders.
- Dangerous actions should use red and require confirmation before deleting or resetting data.
- Bottom navigation should remain fixed and expose five primary areas.

## UX Behavior

### App Shell

The root shell uses a full-screen dark background, a compact branded header, a scrollable content area, and a fixed bottom navigation.

The bottom navigation labels are:

- `Resumo`
- `Gráficos`
- `Planejar`
- `Contas`
- `Ajustes`

### Resumo

The summary should focus on the current visible projection month. It should show:

- Month selector/label.
- Projected balance.
- Salary commitment percentage and progress bar.
- Expense, paid, pending, and next due summary cards when available.
- A payment shortcut card that opens the payment view.

The existing visible month count setting should still be respected for chart inputs and any secondary summary details that remain.

### Pagamentos

The current-month payment checklist becomes a full screen-style view inside the app shell. It should continue to:

- Show paid and pending totals.
- Let the user toggle each current-month account item as paid/unpaid.
- Use existing local payment status persistence.
- Provide a `Voltar` action to return to `Resumo`.

### Gráficos

Charts remain read-only and continue using the existing chart data helpers. The UI should be adapted to the compact card style shown in Figma.

### Planejar

Planning focuses on selecting an account and editing monthly values. The previous `Gerenciar Contas` entry point should be removed from this tab because accounts now have their own tab.

### Contas

Account creation and editing moves to a dedicated tab using the existing `AccountEditor` behavior.

### Ajustes

The `Ajustes` tab combines:

- Category management.
- Salary and extra-balance settings.
- Visible month count.
- Commitment warning and danger thresholds.
- Window advance.
- Backup/restore/reset data management entry point.

The initial implementation may keep existing forms and controls if they follow the new visual style.

## Tests

No new unit tests are required for pure visual layout changes.

Tests should be added or updated only if implementation changes:

- calculation helpers
- formatting helpers
- parsing helpers
- storage adapters
- date/month logic

## Acceptance Criteria

- The app uses the Figma color system.
- The root navigation is a fixed five-item bottom navigation.
- `Contas` is available as its own tab.
- `Ajustes` contains category management and settings/data management.
- `Planejar` no longer owns account management.
- `Resumo` exposes the payment view as a dedicated in-app view.
- Existing finance calculations and persisted user data continue to drive all displayed values.
- README reflects the new app behavior and navigation.
- TypeScript validation passes.
- Unit tests pass.
