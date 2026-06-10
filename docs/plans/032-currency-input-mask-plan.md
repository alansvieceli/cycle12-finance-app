# Plan 032 - Currency Input Mask

Status: Completed

## Spec

`docs/specs/032-currency-input-mask.md`

## Objective

Replace free-text currency typing with a cash-register style mask in all monetary inputs: digits enter from the right as cents, display is always `pt-BR` formatted, and callers receive numeric values instead of raw strings.

## Tasks

| Task   | File                                                | Purpose                                                                      |
| ------ | --------------------------------------------------- | ---------------------------------------------------------------------------- |
| 032-01 | `docs/tasks/032-01-add-currency-mask-helpers.md`    | Add pure currency mask helpers in `src/lib/` with unit tests.                |
| 032-02 | `docs/tasks/032-02-rework-editable-amount-input.md` | Rework `EditableAmountInput` into a masked input emitting numeric values.    |
| 032-03 | `docs/tasks/032-03-migrate-monetary-fields.md`      | Migrate all monetary fields and state action signatures to the masked input. |
| 032-04 | `docs/tasks/032-04-update-docs-and-validate.md`     | Update README and `docs/app-context.md`, run validation.                     |

## Notes

- Post-implementation adjustment (2026-06-10): mask reimplemented with `react-native-currency-input` (JS-only) for keystroke-level fluidity, at the user's explicit request. `src/lib/currencyMask.ts` and its tests were removed as dead code; task 032-01's helper deliverable is superseded.
- No new dependencies. _(superseded by the adjustment above)_
- `parseCurrencyInput` remains for non-typing paths (backup parsing, programmatic values); it leaves the typing path only.
- Negative amounts are not supported by the mask; `±` flows keep their mode toggles.
- Cents cap: digits beyond `999.999.999,99` are ignored.
- `valuesHidden` behavior (`• • •` when unfocused) is preserved.
- Assumption: when an unfocused field receives a new external `value`, the display resyncs, as today.

## Validation

- `npx tsc --noEmit` - passed
- `npm test` - 141 tests passed; the `ActionButton.test.tsx` suite fails to run with `Cannot find module 'expo-asset'`, a pre-existing environment issue confirmed on a clean working tree, unrelated to this spec.
- `npm run check` - lint passes with pre-existing warnings only; prettier passes; the test step has the same pre-existing suite failure noted above.
