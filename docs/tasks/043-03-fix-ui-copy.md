# Task 043-03 - Fix UI Copy

Status: Done

## Spec

`docs/specs/043-tab-review-cleanup.md`

## Plan

`docs/plans/043-tab-review-cleanup-plan.md`

## Goal

Fix three pieces of visible text that contradict the app: a hint pointing at a tab name that does not exist, two title-case labels, and a placeholder that shows the wrong default.

## Files

- Modify: `src/components/finance/CurrentMonthPaymentChecklist.tsx`
- Modify: `src/screens/SettingsScreen.tsx`

## Steps

- [x] **Step 1: Tab pointer**

"Crie uma categoria em Contas primeiro." → "Crie uma categoria em Cadastros primeiro."

The bottom navigation labels the tab `Cadastros`; `Contas` is a section inside it, so the old text sent the user to a name that does not exist.

- [x] **Step 2: Sentence case**

`Renda Extra` → `Renda extra`; `Janela Atual` → `Janela atual`, per `docs/standards/ui-copy-policy.md`.

- [x] **Step 3: Threshold placeholder**

The `Alerta` field's placeholder is `80`, but `createDefaultFinanceSettings` sets `commitmentWarningThreshold: 70`. Change the placeholder to `70`. `Perigo` (`90`) and `Meta` (`70`) already match their defaults.

- [x] **Step 4: Validate**

```bash
npm run typecheck && npm run lint
```

## Acceptance Criteria

- No visible copy names a `Contas` tab.
- No Portuguese UI label uses English-style title case.
- The `Alerta` placeholder matches the shipped default (`70`).
