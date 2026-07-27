# Task 044-02 - Persist the Review Mark

Status: Pending

## Spec

`docs/specs/044-account-review-mark.md`

## Plan

`docs/plans/044-account-review-mark-plan.md`

## Goal

Make the mark survive a backup round trip, keep old backups loading, and prove that advancing the planning window clears it. The clearing itself needs no new code — `advanceWindow` already drops the outgoing month's records — so this task locks that behavior with a test before any UI depends on it.

## Files

- Modify: `src/lib/financeBackup.ts:499-532`
- Modify: `src/lib/financeBackup.test.ts`
- Modify: `src/lib/windowAdvance.test.ts`

## Interfaces

- Consumes: `MonthlyPaymentStatus.isReviewed` from task 044-01.
- Produces: nothing new. `parseAndValidateBackupContent` keeps its signature.

## Steps

- [ ] **Step 1: Write the failing tests**

In `src/lib/windowAdvance.test.ts`, add this case inside `describe('windowAdvance', ...)`, right after `'drops oldest month values and payment statuses'`. It builds its own state instead of touching `baseState`, because the existing test asserts the exact shape of the `card` record:

```ts
  it('drops review marks from the month leaving the window', () => {
    const stateWithReviews: FinanceState = {
      ...baseState,
      paymentStatuses: [
        { accountItemId: 'rent', isPaid: false, isReviewed: true, month: 6, year: 2026 },
        { accountItemId: 'card', isPaid: false, isReviewed: true, month: 7, year: 2026 },
      ],
    };

    const advancedState = advanceWindow(stateWithReviews, 2026, 7);

    expect(
      advancedState.paymentStatuses.some(
        (paymentStatus) => paymentStatus.month === 6 && paymentStatus.year === 2026,
      ),
    ).toBe(false);
    expect(advancedState.paymentStatuses).toContainEqual({
      accountItemId: 'card',
      isPaid: false,
      isReviewed: true,
      month: 7,
      year: 2026,
    });
  });
```

In `src/lib/financeBackup.test.ts`, add these two cases inside `describe('financeBackup', ...)`, after `'creates and validates a backup envelope'`:

```ts
  it('preserves the review mark across a backup round trip', async () => {
    const reviewedState: FinanceState = {
      ...sampleState,
      paymentStatuses: [
        {
          accountItemId: 'account-rent',
          isPaid: true,
          isReviewed: true,
          month: 6,
          year: 2026,
        },
      ],
    };
    const envelope = await createBackupEnvelope(
      reviewedState,
      testHash,
      '2026-06-05T12:00:00.000Z',
    );

    const restoredState = await parseAndValidateBackupContent(
      serializeBackupEnvelope(envelope),
      testHash,
    );

    expect(restoredState.paymentStatuses[0]?.isReviewed).toBe(true);
  });

  it('restores a backup without the review field as not reviewed', async () => {
    const restoredState = await parseAndValidateBackupContent(
      buildEnvelopeJson(
        buildDataWithAccount({
          paymentStatuses: [
            { accountItemId: 'a1', isPaid: true, month: 6, year: 2026 },
          ],
        }),
      ),
      testHash,
    );

    expect(restoredState.paymentStatuses[0]?.isReviewed).toBeUndefined();
  });
```

`buildEnvelopeJson`, `buildDataWithAccount`, `testHash`, and `sampleState` already exist at the bottom of that file — do not redefine them.

- [ ] **Step 2: Run the tests to verify the backup ones fail**

Run: `npx jest windowAdvance financeBackup`
Expected: the `windowAdvance` case PASSES already (the reset is existing behavior — that is the point of the test), and `'preserves the review mark across a backup round trip'` FAILS because validation drops the field.

- [ ] **Step 3: Carry the field through validation**

In `src/lib/financeBackup.ts`, inside `validatePaymentStatuses`, replace the returned object:

```ts
    return {
      accountItemId,
      isPaid: paymentStatus.isPaid,
      isReviewed: paymentStatus.isReviewed === true ? true : undefined,
      month: validateMonth(paymentStatus.month),
      year: validateNumber(paymentStatus.year, 'Ano do pagamento inválido.'),
    };
```

`undefined` rather than `false` on purpose: `JSON.stringify` drops undefined keys, so storage stays clean, the canonical hash is unchanged for backups without the field, and the existing `expect(restoredState).toEqual(sampleState)` assertion keeps passing (Jest treats an undefined-valued key as absent). Writing `false` would break that test.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx jest windowAdvance financeBackup`
Expected: PASS, including the pre-existing `'creates and validates a backup envelope'` round trip.

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck && npm run lint`
Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add src/lib/financeBackup.ts src/lib/financeBackup.test.ts src/lib/windowAdvance.test.ts
git commit -m "feat: persist the account review mark in backups"
```

## Acceptance Criteria

- A backup round trip keeps `isReviewed: true`.
- A backup with no `isReviewed` restores with the field absent, not `false`.
- The existing round-trip equality test still passes.
- Advancing the window drops the outgoing month's marks and keeps later months', proven by a test.
- `BACKUP_FORMAT_VERSION` is still `1`.
