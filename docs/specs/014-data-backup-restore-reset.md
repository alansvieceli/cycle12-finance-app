# Spec 014 - Data Backup Restore Reset

## Objective

Add a data management section that lets the user export a backup, restore a validated backup, and reset the app to a safe default finance state.

## Context

The app currently saves all finance data locally through AsyncStorage as one JSON document under the key `@cycle12-finance-app/finance-state/v2`.

The user wants a section opened from a button, with three actions:

1. Backup current app data to a JSON-based file with `.c12f` extension.
2. Restore from a `.c12f` file after validating that it is a valid Cycle12 Finance backup.
3. Clear everything and reset to defaults:
   - one category named `Outros`
   - `visibleMonthCount` = 12
   - `commitmentWarningThreshold` = 60
   - `commitmentDangerThreshold` = 80

The restore flow must never delete or overwrite the current app data before the imported file is fully validated.

## Goals

- Add a button in `Configurações` to open a data management section.
- Show three data management actions:
  - backup/export
  - restore/import
  - reset/clear all
- Export all currently persisted app data into a `.c12f` file.
- Use JSON content inside the `.c12f` file.
- Validate `.c12f` files before importing.
- Replace all current data only after validation succeeds.
- Reset all data to the specified default state.
- Keep the implementation local-only.
- Add unit tests for backup format validation and reset default construction.

## Non-goals

- Do not add backend code.
- Do not add authentication.
- Do not add cloud sync.
- Do not add paid services.
- Do not add encryption in this spec.
- Do not add automatic scheduled backups.
- Do not merge imported data with existing data.
- Do not partially restore valid sections from an invalid file.

## UI Placement

Add a button in the `Configurações` tab, below the existing settings inputs:

`Gerenciar Dados`

When tapped, it opens a dedicated section/panel in the same tab. The section includes:

- `Fazer Backup`
- `Restaurar Backup`
- `Limpar Tudo`
- a status/error message area
- a way to close or return to the regular settings view

The section should be clear that restore and reset replace current local data.

## Backup File Format

The exported file uses the `.c12f` extension.

The content is JSON with an explicit envelope:

```json
{
  "format": "cycle12-finance-backup",
  "formatVersion": 1,
  "exportedAt": "2026-06-05T12:00:00.000Z",
  "app": {
    "name": "Cycle12 Finance",
    "storageVersion": 2
  },
  "integrity": {
    "algorithm": "SHA-256",
    "canonicalPayloadHash": "..."
  },
  "data": {
    "settings": {
      "monthlySalary": 0,
      "currentMonthExtraBalance": 0,
      "visibleMonthCount": 12,
      "commitmentWarningThreshold": 80,
      "commitmentDangerThreshold": 90
    },
    "categories": [],
    "accountItems": [],
    "monthlyValues": [],
    "paymentStatuses": []
  }
}
```

The `data` object uses the current `FinanceState` shape.

## Backup Integrity

The backup should include an integrity section so the app can detect accidental or casual file modification before restore.

Recommended first implementation:

- Build a canonical JSON payload from the backup fields that must be protected.
- Exclude the `integrity` field itself from the hashed payload.
- Sort object keys consistently before hashing.
- Hash the canonical payload with SHA-256.
- Store the result in `integrity.canonicalPayloadHash`.
- On restore, rebuild the same canonical payload, recompute the SHA-256 hash, and compare it to the stored hash before validating/importing the data.

Important limitation:

- A plain SHA-256 hash detects accidental edits or casual manual changes.
- A plain SHA-256 hash does not cryptographically prevent a motivated person from editing the JSON and recalculating the hash.
- Strong tamper prevention would require a secret key or digital signature.
- Because this app is local-only, has no backend, no authentication, and must export on one Android device and import on another, a server-held private signing key is out of scope.
- An app-embedded HMAC secret would improve casual tamper resistance but would not be a true security boundary, because the secret ships inside the app and could be extracted.

Spec 014 therefore requires integrity validation against accidental/casual modification, not high-security anti-forgery.

Restore must reject the file if:

- `integrity` is missing
- `algorithm` is unsupported
- `canonicalPayloadHash` is missing
- the recomputed hash does not match the stored hash

Recommended filename:

```text
cycle12-finance-backup-YYYY-MM-DD.c12f
```

## Restore Validation Strategy

Restore must use a staged validation flow:

1. User selects a `.c12f` file.
2. App reads the file content.
3. App parses JSON.
4. App validates the envelope:
   - `format` equals `cycle12-finance-backup`
   - `formatVersion` is supported
   - `data` exists
5. App validates backup integrity:
   - `integrity` exists
   - the declared algorithm is supported
   - the canonical payload hash matches the file content
6. App validates the `FinanceState` shape:
   - `settings` exists and numeric fields are valid numbers
   - `visibleMonthCount` can be clamped to 1-12
   - `commitmentWarningThreshold` and `commitmentDangerThreshold` are numbers from 0-100
   - `categories`, `accountItems`, `monthlyValues`, and `paymentStatuses` are arrays
   - each category has string `id`, string `name`, and numeric `sortOrder`
   - each account item has string `id`, string `categoryId`, string `name`, numeric `dueDay`, and numeric `sortOrder`
   - each monthly value has string `accountItemId`, month 1-12, numeric `year`, and numeric `amount`
   - each payment status has string `accountItemId`, month 1-12, numeric `year`, and boolean `isPaid`
7. App validates references:
   - every account item references an existing category
   - every monthly value references an existing account item
   - every payment status references an existing account item
8. App normalizes the validated state.
9. Only after all prior steps succeed, app replaces the current local finance state.

If any step fails, the current app data must remain unchanged.

## Restore Failure Behavior

Invalid restore attempts should:

- show a user-readable error message
- not call the state replacement path
- not call AsyncStorage save with imported data
- leave current data unchanged

Recommended error messages:

- `Arquivo inválido ou corrompido.`
- `Este arquivo não é um backup do Cycle12 Finance.`
- `Versão de backup não suportada.`
- `Backup inválido: o conteúdo foi alterado ou está corrompido.`
- `Backup inválido: há referências entre categorias e contas que não existem.`

## Reset Default State

Reset creates a new `FinanceState`:

```json
{
  "settings": {
    "monthlySalary": 0,
    "currentMonthExtraBalance": 0,
    "visibleMonthCount": 12,
    "commitmentWarningThreshold": 60,
    "commitmentDangerThreshold": 80
  },
  "categories": [
    {
      "id": "category_default_outros",
      "name": "Outros",
      "sortOrder": 1
    }
  ],
  "accountItems": [],
  "monthlyValues": [],
  "paymentStatuses": []
}
```

Reset should require explicit user confirmation before replacing current data.

## Implementation Notes

Recommended implementation:

- Add pure backup helpers under `src/lib/`:
  - create backup envelope
  - parse/validate backup envelope
  - build canonical payload
  - calculate and verify backup hash
  - build reset default state
- Add tests for valid restore, invalid restore, modified hash/payload, broken references, unsupported version, and reset defaults.
- Add storage/state action for replacing the entire `FinanceState`.
- Add UI under `SettingsScreen` or a finance-specific data management component.
- Use Expo-compatible local file APIs for export/import.
- Prefer Expo document picker/sharing/file-system APIs if available and install only the minimum required dependencies.
- Keep restore atomic: validate first, replace second.

## Acceptance Criteria

- `Configurações` has a `Gerenciar Dados` button.
- Data management section opens from the button.
- User can export a `.c12f` backup file containing the full finance state.
- Backup content is JSON with the documented envelope.
- Backup content includes an integrity hash.
- User can choose a `.c12f` file to restore.
- Restore validates envelope, integrity hash, state shape, and references before replacing current state.
- Restore rejects modified or corrupted backup content before replacing current state.
- Invalid restore does not change current app data.
- Valid restore replaces all current app data.
- `Limpar Tudo` resets the app to the specified default state after confirmation.
- Reset default includes category `Outros`.
- Reset default sets visible months to 12.
- Reset default sets warning threshold to 60 and danger threshold to 80.
- TypeScript validation passes.
- Existing tests pass.
- Unit tests cover backup validation and reset defaults.
- Unit tests cover hash mismatch rejection.

## Validation

Run:

```bash
npx tsc --noEmit
```

Run:

```bash
npm test
```

Run:

```bash
npm run test:coverage
```

Manual validation:

- export backup from a populated state
- inspect that the file has `.c12f` extension and JSON content
- restore the exported file into an app with different data
- attempt to restore invalid JSON and confirm current data remains unchanged
- edit an exported `.c12f` file manually and confirm restore rejects it
- attempt to restore a structurally invalid `.c12f` and confirm current data remains unchanged
- reset data and confirm only `Outros` remains with the specified defaults

## Documentation Requirements

Update `README.md` after implementation to mention:

- local `.c12f` backup files
- restore validation behavior
- reset default state
- any new dependencies or setup notes

Follow:

- `docs/standards/ai-workflow.md`
- `docs/standards/readme-policy.md`
- `docs/standards/testing-policy.md`
