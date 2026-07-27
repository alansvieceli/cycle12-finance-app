# Task 044-03 - Add the Review Toggle to Planejar

Status: Pending

## Spec

`docs/specs/044-account-review-mark.md`

## Plan

`docs/plans/044-account-review-mark-plan.md`

## Goal

Add the action that toggles the mark and the 44x44 button beside the account selector, plus the mark on already-reviewed accounts inside the selector list.

## Files

- Modify: `src/hooks/useFinanceState.ts` (near `toggleMonthlyPaymentStatus`, and the returned `actions` object)
- Modify: `src/screens/PlanningScreen.tsx`
- Modify: `src/components/finance/MonthlyValueEditor.tsx`
- Modify: `src/components/common/SelectField.tsx`
- Modify: `src/components/finance/MonthlyValueEditor.test.tsx`

## Interfaces

- Consumes: `isAccountItemReviewed` and `toggleAccountReview` from task 044-01.
- Produces: `actions.toggleMonthlyReviewStatus(accountItemId, projectionMonth)`; `MonthlyValueEditor` props `paymentStatuses: MonthlyPaymentStatus[]` and `onToggleReview: (accountItemId: string, projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>) => void`; `SelectOption.marked?: boolean`.

## Steps

- [ ] **Step 1: Write the failing tests**

In `src/components/finance/MonthlyValueEditor.test.tsx`, add the two new props to the defaults inside `renderEditor` (keep the existing keys):

```ts
    onAdjustMonthlyValue: jest.fn(),
    onChangeMonthlyValue: jest.fn(),
    onSelectAccountItem: jest.fn(),
    onToggleReview: jest.fn(),
    paymentStatuses: [],
```

Then add these cases at the end of the `describe('MonthlyValueEditor', ...)` block:

```ts
  it('toggles the review mark for the selected account in the current month', () => {
    const { onToggleReview } = renderEditor();

    fireEvent.press(screen.getByLabelText('Marcar conta como revisada'));

    expect(onToggleReview).toHaveBeenCalledWith(
      'account-rent',
      expect.objectContaining({ month: 7, year: 2026 }),
    );
  });

  it('shows the reviewed state when the account is already marked', () => {
    renderEditor({
      paymentStatuses: [
        {
          accountItemId: 'account-rent',
          isPaid: false,
          isReviewed: true,
          month: 7,
          year: 2026,
        },
      ],
    });

    expect(screen.getByLabelText('Desmarcar conta revisada')).toBeOnTheScreen();
  });
```

The fixture's window starts at `createProjectionMonths(new Date(2026, 6, 1))`, so the current month is July 2026 — hence `month: 7`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx jest MonthlyValueEditor`
Expected: FAIL — no element with the label `Marcar conta como revisada`.

- [ ] **Step 3: Add the hook action**

In `src/hooks/useFinanceState.ts`, add `toggleAccountReview` to the existing import from `../lib/financeCalculations`, then add this function right after `toggleMonthlyPaymentStatus`:

```ts
  function toggleMonthlyReviewStatus(
    accountItemId: string,
    projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
  ) {
    setFinanceState((currentState) => ({
      ...currentState,
      paymentStatuses: toggleAccountReview(
        currentState.paymentStatuses,
        accountItemId,
        projectionMonth,
      ),
    }));
  }
```

Add `toggleMonthlyReviewStatus,` to the returned `actions` object, right after the existing `toggleMonthlyPaymentStatus,` entry.

- [ ] **Step 4: Add the option mark to SelectField**

In `src/components/common/SelectField.tsx`, add the field to `SelectOption`:

```ts
type SelectOption = {
  id: string;
  label: string;
  sublabel?: string;
  color?: string;
  marked?: boolean;
};
```

Inside the options `map`, render the mark as the first child of `styles.itemLeft`, before the existing `option.sublabel` branch:

```tsx
                    <View style={styles.itemLeft}>
                      {option.marked ? (
                        <View style={styles.itemMark}>
                          <Ionicons
                            color={colors.accentText}
                            name="checkmark"
                            size={12}
                          />
                        </View>
                      ) : null}
                      {option.sublabel ? (
```

Add the style to the `StyleSheet.create` block:

```ts
  itemMark: {
    alignItems: 'center',
    backgroundColor: colors.info,
    borderRadius: 6,
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
```

Every other `SelectField` usage passes no `marked`, so nothing else changes.

- [ ] **Step 5: Add the button to MonthlyValueEditor**

In `src/components/finance/MonthlyValueEditor.tsx`:

Add `isAccountItemReviewed` to the existing import from `../../lib/financeCalculations`, and `MonthlyPaymentStatus` to the existing type import from `../../types/finance`.

Add the two props to `MonthlyValueEditorProps` and to the destructured parameter list:

```ts
  onToggleReview: (
    accountItemId: string,
    projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
  ) => void;
  paymentStatuses: MonthlyPaymentStatus[];
```

Inside the component, before the `return`, derive the current month and the current mark:

```ts
  const currentProjectionMonth =
    projectionMonths.find((projectionMonth) => projectionMonth.isCurrentMonth) ??
    projectionMonths[0];
  const isSelectedAccountReviewed = Boolean(
    selectedAccountItem &&
      currentProjectionMonth &&
      isAccountItemReviewed(
        paymentStatuses,
        selectedAccountItem.id,
        currentProjectionMonth,
      ),
  );
```

Replace the existing `<SelectField ... />` block with the row below. `SelectField` renders its trigger plus a `Modal`; wrapping it in a flex view only stretches the trigger, since the modal renders above the whole screen regardless of its parent:

```tsx
          <View style={styles.accountRow}>
            <View style={styles.accountSelect}>
              <SelectField
                fieldLabel="Conta"
                onChange={onSelectAccountItem}
                options={sortAccountItems(accountItems, categories).map(
                  (accountItem) => ({
                    id: accountItem.id,
                    label: accountItem.name,
                    sublabel: getCategoryName(categories, accountItem.categoryId),
                    color: getCategoryColor(accountItem.categoryId, categories),
                    marked: currentProjectionMonth
                      ? isAccountItemReviewed(
                          paymentStatuses,
                          accountItem.id,
                          currentProjectionMonth,
                        )
                      : false,
                  }),
                )}
                value={selectedAccountItem.id}
              />
            </View>
            {currentProjectionMonth ? (
              <Pressable
                accessibilityLabel={
                  isSelectedAccountReviewed
                    ? 'Desmarcar conta revisada'
                    : 'Marcar conta como revisada'
                }
                onPress={() =>
                  onToggleReview(selectedAccountItem.id, currentProjectionMonth)
                }
                style={[
                  styles.reviewButton,
                  isSelectedAccountReviewed ? styles.reviewButtonActive : null,
                ]}
              >
                <Ionicons
                  color={
                    isSelectedAccountReviewed
                      ? colors.accentText
                      : colors.textSecondary
                  }
                  name="checkmark"
                  size={20}
                />
              </Pressable>
            ) : null}
          </View>
```

Add the styles to the `StyleSheet.create` block:

```ts
  accountRow: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: 8,
  },
  accountSelect: {
    flex: 1,
  },
  reviewButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    width: 44,
  },
  reviewButtonActive: {
    backgroundColor: colors.info,
    borderColor: colors.info,
  },
```

- [ ] **Step 6: Wire the screen**

In `src/screens/PlanningScreen.tsx`, pass the two new props (the component already destructures `actions` and `financeState`):

```tsx
    <MonthlyValueEditor
      accountItems={financeState.accountItems}
      categories={financeState.categories}
      monthlyValues={financeState.monthlyValues}
      onAdjustMonthlyValue={actions.adjustMonthlyValue}
      onChangeMonthlyValue={actions.updateMonthlyValue}
      onSelectAccountItem={actions.setSelectedAccountItemId}
      onToggleReview={actions.toggleMonthlyReviewStatus}
      paymentStatuses={financeState.paymentStatuses}
      projectionMonths={projectionMonths}
      selectedAccountItem={selectedAccountItem}
      valuesHidden={valuesHidden}
    />
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npx jest MonthlyValueEditor`
Expected: PASS, all seven cases.

- [ ] **Step 8: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: clean.

- [ ] **Step 9: Commit**

```bash
git add src/hooks/useFinanceState.ts src/screens/PlanningScreen.tsx src/components/finance/MonthlyValueEditor.tsx src/components/common/SelectField.tsx src/components/finance/MonthlyValueEditor.test.tsx
git commit -m "feat: mark an account as reviewed from Planejar"
```

## Acceptance Criteria

- A 44x44 button sits at the right of the account selector, blue when the selected account is reviewed for the current month.
- Its accessibility label is `Marcar conta como revisada` when unmarked and `Desmarcar conta revisada` when marked.
- Pressing it calls `toggleMonthlyReviewStatus` with the selected account and the current month.
- Reviewed accounts show the blue mark inside the selector list; other `SelectField` usages are visually unchanged.
- `npx jest MonthlyValueEditor`, `npm run typecheck`, and `npm run lint` pass.
