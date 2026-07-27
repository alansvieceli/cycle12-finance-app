# Spec 045 - Monthly Value List Import

## Goal

Let the user paste a sequential list of monthly values into `Planejar` for the
selected account, review the month-to-value mapping, and replace the affected
values in one confirmed operation.

## Context

Every month the user reviews the values of each account in `Planejar`. The
screen already edits one selected account across the visible planning months,
but each value must be entered separately even when the values already exist as
a column in a spreadsheet.

The existing flow is:

`FinanceApp` -> `PlanningScreen` -> `MonthlyValueEditor` ->
`useFinanceState.updateMonthlyValue`

`MonthlyValueEditor` already receives the ordered `projectionMonths` shown on
screen. `MonthlyValue` already stores each amount by account, month, and year,
so this feature needs no data-model, storage, or backup-format change.

## Non-Goals

- No CSV, TXT, spreadsheet, or document picker.
- No import for multiple accounts at once.
- No account lookup by name.
- No month or year inside the pasted text.
- No additive or subtractive adjustment; imported values replace full values.
- No change to the number or order of months displayed in `Planejar`.
- No automatic review mark after importing.
- No new dependency, backend, authentication, or paid service.

## UX Behavior

### Entry Point

The selected-account row in `Planejar` contains, in order:

1. the existing account selector;
2. the existing review button;
3. a new 44x44 import button using the `download-outline` icon.

The import button has the accessibility label `Importar valores`. It is shown
only when an account is selected, matching the rest of the editor.

### Paste Step

Tapping the import button opens a modal for the selected account. The modal
shows:

- title `Importar valores`;
- the selected account name;
- a multiline text field;
- concise guidance that the first line maps to the first displayed month;
- `Cancelar` and `Continuar` actions.

The user pastes one numeric value per line:

```text
123,21
45687,60
123,8
```

The first line maps to the first displayed projection month, which is the
current month. Each following line maps to the next displayed month.

### Parsing Rules

- Accepted values contain digits and an optional decimal comma with one or two
  decimal digits: `123`, `123,8`, or `123,80`.
- Leading and trailing whitespace around a line is ignored.
- Currency symbols, thousands separators, periods, negative signs, letters,
  internal spaces, multiple commas, or more than two decimal digits are
  invalid.
- Values use the same maximum as the app's monetary inputs:
  `999999999,99`.
- An internal empty line maps to zero for its corresponding month.
- A completely empty or whitespace-only field imports nothing and cannot
  continue. The user can enter `0` to zero the first month.
- A terminal line break produced when copying a spreadsheet column does not
  create an extra zero month. Internal empty lines remain meaningful.
- Only lines that map to displayed `projectionMonths` are considered. Any
  additional lines are ignored without validation or error.
- If fewer lines are supplied than displayed months, only the corresponding
  leading months are replaced. Later displayed months remain unchanged.
- If any considered non-empty line is invalid, no preview is created and no
  value changes. The modal identifies the one-based line number with the
  problem.

### Preview Step

After successful parsing, the modal shows a confirmation preview for the
affected months:

```text
Jul/26: 500,00 → 123,21
Ago/26: 650,00 → 45687,60
Set/26: 700,00 → 123,80
```

The preview includes the selected account name and only the months that will be
replaced. The actions are `Voltar`, `Cancelar`, and `Confirmar`.

`Voltar` preserves the pasted text for correction. `Cancelar` closes the modal
without changing values. Only `Confirmar` writes the imported values.

After confirmation, the modal closes and the existing month rows and
`Total dos 12 meses` immediately reflect the new values.

Importing does not change `isReviewed`. The user still reviews and marks the
account manually after checking the imported values.

## Data Flow

### Parser

Add a pure list parser beside the existing input parsers. It receives the pasted
text and the ordered displayed projection months, then returns either:

- valid entries containing `month`, `year`, and numeric `amount`; or
- a validation error containing the invalid one-based line number.

The parser limits the considered lines to `projectionMonths.length` before
validation, so excess spreadsheet rows are ignored exactly as specified.

### State Update

Add one bulk replacement action to `useFinanceState`. It receives:

- the selected `accountItemId`;
- the parsed month/year/amount entries.

The action performs one functional `setFinanceState` update. For each supplied
entry, it replaces the matching `MonthlyValue` for that account and month, or
creates it when absent. Values for other accounts and months remain untouched.

The full input is parsed before the action is called, so invalid input can never
produce a partial import.

### Component Wiring

- `PlanningScreen` forwards the bulk replacement action.
- `MonthlyValueEditor` owns the modal step, pasted text, validation message, and
  preview state.
- Existing inline editing, adjustments, installments, totals, selection, and
  review behavior remain unchanged.

## Error Handling

- Empty input keeps `Continuar` disabled.
- Invalid input stays on the paste step and displays the invalid line number.
- No state update occurs before confirmation.
- Closing the modal discards its temporary text, error, and preview.
- Switching accounts while the modal is closed changes the import target
  normally; the target cannot change while the modal is open.

## Tests

### Parser Tests

Extend the existing input-parser tests with:

- integer, one-decimal, and two-decimal values;
- surrounding whitespace;
- internal empty line mapped to zero;
- terminal line break ignored;
- completely empty input rejected;
- invalid characters and decimal formats rejected with the correct line;
- maximum accepted and an over-limit value rejected;
- fewer lines than displayed months;
- extra lines ignored, including invalid extra lines.

### State Tests

Cover the bulk replacement action:

- replaces existing values for the selected account;
- creates missing monthly values;
- changes only the supplied leading months;
- leaves other accounts and later months unchanged;
- performs no review-status change.

### Component Tests

Extend `MonthlyValueEditor.test.tsx` to cover:

- opening the import modal from the new accessibility-labelled button;
- invalid input showing its line error without calling the action;
- valid input rendering the account and old-to-new preview;
- going back preserves the pasted text;
- confirming calls the bulk action once with all parsed entries;
- canceling makes no change;
- import does not call `onToggleReview`.

## Documentation

Update `docs/app-context.md` and `README.md` to mention that `Planejar` can paste
sequential values for the selected account, previews the mapping, and replaces
only the supplied visible months after confirmation.

## Acceptance Criteria

- `Planejar` shows an import icon beside the review button for the selected
  account.
- One pasted line maps to one displayed month, starting with the current month.
- Internal empty lines zero their months.
- Fewer lines replace only their corresponding months.
- Lines beyond the displayed month count are ignored without error.
- Invalid considered lines block the entire import and identify their line.
- The user sees an old-to-new preview before any value is changed.
- Confirmation replaces all parsed values in one state update.
- Importing never marks the account as reviewed.
- Storage and backup formats remain unchanged.
- Relevant parser, state, and component tests pass.
- `npm run check` passes.

## Validation

```bash
npm run check
```
