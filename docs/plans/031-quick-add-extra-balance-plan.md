# Plan 031 - Quick Add Extra Balance

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "+" button to the balance panel in Resumo that lets the user quickly add an extra amount to the current month, and reset `currentMonthExtraBalance` to zero when the month advances.

**Architecture:** A new `addCurrentMonthExtraBalance` action handles the additive logic in `useFinanceState`. `SummaryScreen` receives this as an `onAddExtra` callback and owns the modal state locally. The window advance reset is a one-line addition to `advanceWindowOneStep`.

**Tech Stack:** React Native (Modal, TextInput, Pressable), TypeScript, Jest.

---

Status: Completed

## Spec

`docs/specs/031-quick-add-extra-balance.md`

## Tasks

| Task   | File                                                  | Purpose                                                                                |
| ------ | ----------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 031-01 | `docs/tasks/031-01-reset-and-add-action.md`           | Reset extra on window advance + add `addCurrentMonthExtraBalance` action + unit tests. |
| 031-02 | `docs/tasks/031-02-add-button-and-modal-to-resumo.md` | "+" button and modal in `SummaryScreen`, wired via `FinanceApp`.                       |
| 031-03 | `docs/tasks/031-03-update-docs-and-validate.md`       | Update `docs/app-context.md` and run full validation.                                  |

## Notes

- The "+" button appears only in the `activeView === 'current'` branch of `SummaryScreen`.
- The modal input starts at `''` (renders placeholder `0,00`) and is auto-focused on open.
- Confirming with an empty input or zero amount is a no-op (amount defaults to 0 via `parseCurrencyInput`).
- `valuesHidden` masks the confirm button label as `"Nova extra ••••"`.
- The existing `CurrencyInput` in `Ajustes` is unchanged.

## Validation

```bash
npx tsc --noEmit
npm test
```
