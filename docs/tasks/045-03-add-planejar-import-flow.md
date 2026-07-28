# Task 045-03 - Add the Planejar Import Flow

Status: Done

## Spec

`docs/specs/045-monthly-value-list-import.md`

## Plan

`docs/plans/045-monthly-value-list-import-plan.md`

## Goal

Add the import icon beside the review button and the paste/preview confirmation modal, wired once to the bulk action.

## Files

- Modify: `src/components/common/ActionButton.tsx`
- Modify: `src/components/common/ActionButton.test.tsx`
- Modify: `src/screens/PlanningScreen.tsx`
- Modify: `src/components/finance/MonthlyValueEditor.tsx`
- Modify: `src/components/finance/MonthlyValueEditor.test.tsx`

## Interfaces

- Consumes: `parseMonthlyValueList` and `MonthlyValueImportEntry` from 045-01; `actions.replaceMonthlyValues` from 045-02.
- Produces: `MonthlyValueEditor.onReplaceMonthlyValues(accountItemId, entries)`.

## Steps

- [x] **Step 1: Write the failing disabled-button test**

In `src/components/common/ActionButton.test.tsx`, import `fireEvent` and append:

```ts
  it('does not fire when disabled', () => {
    const onPress = jest.fn();

    render(<ActionButton disabled label="Continuar" onPress={onPress} />);
    fireEvent.press(screen.getByText('Continuar'));

    expect(onPress).not.toHaveBeenCalled();
  });
```

- [x] **Step 2: Add the disabled state**

In `ActionButtonProps`, add `disabled?: boolean`. Destructure it with
`disabled = false`, then pass it to `Pressable` and append the disabled style:

```tsx
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        isDanger
          ? styles.dangerButton
          : isSecondary
            ? styles.secondaryButton
            : isGhostDanger
              ? styles.ghostDangerButton
              : styles.primaryButton,
        disabled ? styles.disabledButton : null,
      ]}
    >
```

Add:

```ts
  disabledButton: {
    opacity: 0.45,
  },
```

Run: `npx jest ActionButton`

Expected: PASS.

- [x] **Step 3: Add the editor prop and import-state handlers**

In `src/components/finance/MonthlyValueEditor.tsx`:

1. Add `ScrollView` and `TextInput` to the React Native import.
2. Import `ActionButton`.
3. Import `parseMonthlyValueList` and the `MonthlyValueImportEntry` type from `../../lib/inputParsers`.
4. Add this prop and destructure it:

```ts
  onReplaceMonthlyValues: (
    accountItemId: string,
    entries: MonthlyValueImportEntry[],
  ) => void;
```

Inside the component, add:

```ts
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importPreview, setImportPreview] =
    useState<MonthlyValueImportEntry[] | null>(null);

  function openImportModal() {
    setImportText('');
    setImportError(null);
    setImportPreview(null);
    setIsImportModalOpen(true);
  }

  function closeImportModal() {
    setIsImportModalOpen(false);
    setImportText('');
    setImportError(null);
    setImportPreview(null);
  }

  function buildImportPreview() {
    const result = parseMonthlyValueList(importText, projectionMonths);

    if (!result.ok) {
      setImportError(
        result.invalidLine
          ? `Linha ${result.invalidLine}: use apenas números com vírgula e até duas casas decimais.`
          : 'Cole ao menos um valor.',
      );
      return;
    }

    setImportError(null);
    setImportPreview(result.entries);
  }

  function confirmImport() {
    if (!selectedAccountItem || !importPreview) return;

    onReplaceMonthlyValues(selectedAccountItem.id, importPreview);
    closeImportModal();
  }
```

When `TextInput.onChangeText` runs, call `setImportText(value)` and clear only `importError`. `Voltar` sets `importPreview(null)` and preserves `importText`.

- [x] **Step 4: Add the icon beside review**

Rename the base `reviewButton` style to `accountActionButton` and keep `reviewButtonActive` unchanged. Use `accountActionButton` on the existing review `Pressable`.

Immediately after the review button, add:

```tsx
            <Pressable
              accessibilityLabel="Importar valores"
              onPress={openImportModal}
              style={styles.accountActionButton}
            >
              <Ionicons
                color={colors.textSecondary}
                name="download-outline"
                size={20}
              />
            </Pressable>
```

This preserves the chosen order: selector, review, import.

- [x] **Step 5: Add the two-step modal**

After the existing adjustment `ModalShell`, add:

```tsx
          <ModalShell
            onRequestClose={closeImportModal}
            title={importPreview ? 'Confirmar importação' : 'Importar valores'}
            visible={isImportModalOpen}
          >
            {importPreview ? (
              <>
                <Text style={styles.importAccountName}>
                  {selectedAccountItem.name}
                </Text>
                <ScrollView style={styles.importPreviewList}>
                  {importPreview.map((entry) => (
                    <View
                      key={`${entry.year}-${entry.month}`}
                      style={styles.importPreviewRow}
                    >
                      <Text style={styles.importPreviewMonth}>
                        {formatMonthLabel(entry.year, entry.month)}
                      </Text>
                      <Text style={styles.importPreviewValue}>
                        {`${currencyFormatter.format(
                          getMonthlyValueAmount(
                            monthlyValues,
                            selectedAccountItem.id,
                            entry,
                          ),
                        )} → ${currencyFormatter.format(entry.amount)}`}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.importActions}>
                  <ActionButton
                    label="Voltar"
                    onPress={() => setImportPreview(null)}
                    variant="secondary"
                  />
                  <ActionButton
                    label="Cancelar"
                    onPress={closeImportModal}
                    variant="secondary"
                  />
                  <ActionButton label="Confirmar" onPress={confirmImport} />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.importAccountName}>
                  {selectedAccountItem.name}
                </Text>
                <Text style={styles.importHint}>
                  Cole um valor por linha. A primeira linha corresponde ao mês atual.
                </Text>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  multiline
                  onChangeText={(value) => {
                    setImportText(value);
                    setImportError(null);
                  }}
                  placeholder="Um valor por linha"
                  placeholderTextColor={colors.textSecondary}
                  style={styles.importInput}
                  value={importText}
                />
                {importError ? (
                  <Text style={styles.importError}>{importError}</Text>
                ) : null}
                <View style={styles.importActions}>
                  <ActionButton
                    label="Cancelar"
                    onPress={closeImportModal}
                    variant="secondary"
                  />
                  <ActionButton
                    disabled={!importText.trim()}
                    label="Continuar"
                    onPress={buildImportPreview}
                  />
                </View>
              </>
            )}
          </ModalShell>
```

Add these styles:

```ts
  importAccountName: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.cardTitle,
  },
  importHint: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.bodySmall,
  },
  importInput: {
    ...modalFormStyles.input,
    minHeight: 160,
    textAlignVertical: 'top',
  },
  importError: {
    color: colors.negativeText,
    letterSpacing: 0,
    ...typography.bodySmall,
  },
  importPreviewList: {
    maxHeight: 300,
  },
  importPreviewRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: 4,
    paddingVertical: 8,
  },
  importPreviewMonth: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.label,
  },
  importPreviewValue: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.body,
  },
  importActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
```

Do not pass `valuesHidden` to preview formatting. The user is actively entering and confirming these values; the month rows outside the modal remain masked.

- [x] **Step 6: Wire PlanningScreen**

In `src/screens/PlanningScreen.tsx`, add:

```tsx
      onReplaceMonthlyValues={actions.replaceMonthlyValues}
```

Place it after `onChangeMonthlyValue`.

- [x] **Step 7: Write the component tests**

In `renderEditor`, add:

```ts
    onReplaceMonthlyValues: jest.fn(),
```

Append these tests:

```ts
  it('blocks invalid import input and identifies its line', () => {
    const { onReplaceMonthlyValues } = renderEditor();

    fireEvent.press(screen.getByLabelText('Importar valores'));
    fireEvent.changeText(
      screen.getByPlaceholderText('Um valor por linha'),
      '123,21\ntexto',
    );
    fireEvent.press(screen.getByText('Continuar'));

    expect(
      screen.getByText(
        'Linha 2: use apenas números com vírgula e até duas casas decimais.',
      ),
    ).toBeOnTheScreen();
    expect(onReplaceMonthlyValues).not.toHaveBeenCalled();
  });

  it('previews and confirms one atomic import without marking review', () => {
    const { onReplaceMonthlyValues, onToggleReview } = renderEditor();

    fireEvent.press(screen.getByLabelText('Importar valores'));
    fireEvent.changeText(
      screen.getByPlaceholderText('Um valor por linha'),
      '123,21\n\n456,7',
    );
    fireEvent.press(screen.getByText('Continuar'));

    expect(screen.getByText('Confirmar importação')).toBeOnTheScreen();
    expect(
      screen.getByText(
        `${currencyFormatter.format(1200)} → ${currencyFormatter.format(123.21)}`,
      ),
    ).toBeOnTheScreen();
    expect(
      screen.getByText(
        `${currencyFormatter.format(800)} → ${currencyFormatter.format(0)}`,
      ),
    ).toBeOnTheScreen();

    fireEvent.press(screen.getByText('Confirmar'));

    expect(onReplaceMonthlyValues).toHaveBeenCalledTimes(1);
    expect(onReplaceMonthlyValues).toHaveBeenCalledWith('account-rent', [
      { amount: 123.21, month: 7, year: 2026 },
      { amount: 0, month: 8, year: 2026 },
      { amount: 456.7, month: 9, year: 2026 },
    ]);
    expect(onToggleReview).not.toHaveBeenCalled();
  });

  it('preserves pasted text when returning from preview and cancels safely', () => {
    const { onReplaceMonthlyValues } = renderEditor();

    fireEvent.press(screen.getByLabelText('Importar valores'));
    fireEvent.changeText(
      screen.getByPlaceholderText('Um valor por linha'),
      '123,21\n456,70',
    );
    fireEvent.press(screen.getByText('Continuar'));
    fireEvent.press(screen.getByText('Voltar'));

    expect(screen.getByPlaceholderText('Um valor por linha')).toHaveProp(
      'value',
      '123,21\n456,70',
    );

    fireEvent.press(screen.getByText('Cancelar'));
    expect(onReplaceMonthlyValues).not.toHaveBeenCalled();
  });

  it('ignores values beyond the displayed month count', () => {
    const { onReplaceMonthlyValues } = renderEditor({
      projectionMonths: projectionMonths.slice(0, 2),
    });

    fireEvent.press(screen.getByLabelText('Importar valores'));
    fireEvent.changeText(
      screen.getByPlaceholderText('Um valor por linha'),
      '10\n20\ntexto ignorado',
    );
    fireEvent.press(screen.getByText('Continuar'));
    fireEvent.press(screen.getByText('Confirmar'));

    expect(onReplaceMonthlyValues).toHaveBeenCalledWith('account-rent', [
      { amount: 10, month: 7, year: 2026 },
      { amount: 20, month: 8, year: 2026 },
    ]);
  });
```

- [x] **Step 8: Run focused tests**

Run: `npx jest ActionButton MonthlyValueEditor`

Expected: PASS, including all existing inline edit, adjustment, and review tests.

- [x] **Step 9: Run typecheck and lint**

Run: `npm run typecheck && npm run lint`

Expected: both commands pass with no warnings.

- [x] **Step 10: Commit**

```bash
git add src/components/common/ActionButton.tsx src/components/common/ActionButton.test.tsx src/screens/PlanningScreen.tsx src/components/finance/MonthlyValueEditor.tsx src/components/finance/MonthlyValueEditor.test.tsx
git commit -m "feat: import monthly values in Planejar"
```

## Acceptance Criteria

- The import icon is the third control in the account row, after review.
- Empty input cannot continue.
- Invalid input remains in the paste step and writes nothing.
- Preview shows the selected account and old-to-new values.
- Back preserves text; cancel writes nothing.
- Confirm calls the bulk action exactly once.
- Import never toggles review.
- Existing Planejar behavior and tests remain intact.
