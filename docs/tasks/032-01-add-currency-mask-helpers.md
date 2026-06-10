# Task 032-01 - Add Currency Mask Helpers

Status: Completed

## Spec

`docs/specs/032-currency-input-mask.md`

## Plan

`docs/plans/032-currency-input-mask-plan.md`

## Goal

Add pure helpers that implement the digit-based currency mask logic, independent from any component.

## Steps

1. Create `src/lib/currencyMask.ts`.
2. Add a helper that converts arbitrary input text into cents by keeping only digits (handles typing, backspace, and paste uniformly).
3. Add a helper that formats cents into the `pt-BR` display string (`0,00`, `9,41`, `9.412,34`).
4. Apply the cap: digits beyond `999.999.999,99` are ignored.
5. Add focused unit tests in `src/lib/currencyMask.test.ts`.

## Acceptance Criteria

- Typing digits one by one reproduces the spec example sequence (`9` → `0,09`, ..., `4` → `9.412,34`).
- Removing the last character of the formatted text drops the rightmost digit (`9.412,34` → `941,23`).
- Pasted text with non-digit characters keeps only the digits.
- Digits beyond the cap are ignored.
- Zero cents formats as `0,00`.
- Unit tests cover all cases above and pass.
