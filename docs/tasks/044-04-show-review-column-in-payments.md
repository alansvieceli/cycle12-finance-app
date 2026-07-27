# Task 044-04 - Show the Review Column in Pagamentos

Status: Done

## Spec

`docs/specs/044-account-review-mark.md`

## Plan

`docs/plans/044-account-review-mark-plan.md`

## Goal

Add the fixed-width, read-only review column to every payment row, between the account name block and the amount.

## Files

- Modify: `src/components/finance/CurrentMonthPaymentChecklist.tsx`

## Interfaces

- Consumes: `isAccountItemReviewed` from task 044-01. The component already receives `paymentStatuses` and `projectionMonth`, so it needs no new prop.
- Produces: nothing.

## Steps

- [x] **Step 1: Import the helper**

Add `isAccountItemReviewed` to the existing import from `../../lib/financeCalculations`:

```ts
import {
  calculatePaymentSummary,
  getCategoryName,
  getMonthlyValueAmount,
  isAccountItemPaid,
  isAccountItemReviewed,
  type ProjectionMonth,
} from '../../lib/financeCalculations';
```

- [x] **Step 2: Read the mark per row**

Inside the `filteredAccountItems.map(...)` callback, next to the existing `const isPaid = ...` and `const isExpanded = ...`:

```ts
            const isReviewed = isAccountItemReviewed(
              paymentStatuses,
              accountItem.id,
              projectionMonth,
            );
```

- [x] **Step 3: Render the column**

Inside the row `Pressable` (`styles.paymentRowTop`), insert this between the `styles.paymentInfo` `View` and the amount `Text`:

```tsx
                  <View style={styles.reviewColumn}>
                    {isReviewed ? (
                      <View style={styles.reviewMark}>
                        <Ionicons
                          color={colors.accentText}
                          name="checkmark"
                          size={14}
                        />
                      </View>
                    ) : (
                      <View style={styles.reviewMarkEmpty} />
                    )}
                  </View>
```

The column renders on every row, marked or not, so the amounts stay aligned and the unmarked accounts read as gaps. It has no `onPress`: it sits inside the row `Pressable`, so tapping it toggles paid exactly like tapping the account name does. That is intended — the row keeps one behavior and the mark is changed only in `Planejar`.

- [x] **Step 4: Add the styles**

In the `StyleSheet.create` block, after `amountPaid`:

```ts
  reviewColumn: {
    alignItems: 'center',
    flexShrink: 0,
    justifyContent: 'center',
    width: 24,
  },
  reviewMark: {
    alignItems: 'center',
    backgroundColor: colors.info,
    borderRadius: 7,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  reviewMarkEmpty: {
    borderColor: colors.border,
    borderRadius: 7,
    borderStyle: 'dashed',
    borderWidth: 1,
    height: 24,
    width: 24,
  },
```

Blue (`colors.info`), never green: green already marks the paid row border and the paid amount on this screen, and the two states are independent.

- [x] **Step 5: Verify nothing else moved**

Run: `npm run typecheck && npm run lint && npx jest`
Expected: clean, and the whole suite passes — no existing test asserts this row's layout.

- [x] **Step 6: Commit**

```bash
git add src/components/finance/CurrentMonthPaymentChecklist.tsx
git commit -m "feat: show the review mark on payment rows"
```

## Acceptance Criteria

- Every payment row shows a 24px column before the amount: a filled blue mark with a check when reviewed, a dashed empty square when not.
- The column is not tappable on its own and adds no new prop to the component.
- Paid state rendering (green border, green amount, checkbox) is unchanged.
- Typecheck, lint, and the full test suite pass.
