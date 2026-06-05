# Spec 012 - Settings Tab Label

## Objective

Rename the settings tab label from `Ajustes` to `Configurações` so the tab name better communicates that it contains global app and finance configuration.

## Context

The app currently uses `Ajustes` for the tab that contains salary, current-month extra balance, visible month count, and commitment thresholds. The user wants this label changed to `Configurações`.

This change is purely textual and visual. It should not change the settings data model, persistence, calculations, or tab behavior.

## Goals

- Change the settings tab label from `Ajustes` to `Configurações`.
- Update the settings screen heading if it uses the old label.
- Adjust the tab button sizing if needed so the longer label fits inside the active tab frame.
- Keep the tab id and internal code naming as `settings` unless a user-visible label requires translation.

## Non-goals

- Do not rename files, components, hooks, or types.
- Do not change settings behavior.
- Do not change navigation order.
- Do not add a navigation dependency.
- Do not change finance calculations or storage.

## Acceptance Criteria

- The tab bar shows `Configurações` instead of `Ajustes`.
- The settings screen title shows `Configurações`.
- The longer tab label fits inside the tab button frame on mobile width.
- The existing tab order is unchanged.
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

When applicable, validate manually on Android through Expo:

```bash
npx expo start
```

Confirm:

- `Configurações` appears in the tab bar
- the active tab frame contains the full label
- the settings screen still renders the same controls

## Documentation Requirements

Update `README.md` if it references the settings tab label.

Follow:

- `docs/standards/ai-workflow.md`
- `docs/standards/readme-policy.md`
- `docs/standards/testing-policy.md`
