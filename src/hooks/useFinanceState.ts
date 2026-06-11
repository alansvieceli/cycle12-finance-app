import { useEffect, useState } from 'react';

import { createId } from '../lib/ids';
import { suggestCategoryColor } from '../lib/categoryColors';
import {
  clampVisibleMonthCount,
  parseDueDay,
  parseSortOrder,
} from '../lib/inputParsers';
import {
  sortAccountItems,
  sortCategories,
  suggestNextCategorySortOrder,
} from '../lib/sorting';
import { advanceWindow, getNextWindowStart } from '../lib/windowAdvance';
import { normalizeFinanceState } from '../lib/financeBackup';
import {
  loadFinanceState,
  loadSelectedPlanningAccountId,
  saveFinanceState,
  saveSelectedPlanningAccountId,
} from '../storage/financeStorage';
import {
  AccountItem,
  FinanceState,
  MonthlyValue,
  emptyFinanceState,
} from '../types/finance';
import { ProjectionMonth } from '../lib/financeCalculations';
import {
  MonthlyValueAdjustmentOperation,
  calculateAdjustedMonthlyValue,
} from '../lib/monthlyValueAdjustments';
import { buildInstallmentMonths } from '../lib/installmentMonths';

export function useFinanceState() {
  const [financeState, setFinanceState] = useState(emptyFinanceState);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySortOrder, setNewCategorySortOrder] = useState('');
  const [newCategoryPropagation, setNewCategoryPropagation] = useState('zero');
  const [newCategoryInstallmentEndDate, setNewCategoryInstallmentEndDate] =
    useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('');
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountDueDay, setNewAccountDueDay] = useState('');
  const [newAccountCategoryId, setNewAccountCategoryId] = useState('');
  const [hasLoadedStoredState, setHasLoadedStoredState] = useState(false);
  const [selectedAccountItemId, setSelectedAccountItemId] = useState('');
  const sortedAccountItems = sortAccountItems(
    financeState.accountItems,
    financeState.categories,
  );
  const selectedAccountItem =
    financeState.accountItems.find(
      (accountItem) => accountItem.id === selectedAccountItemId,
    ) ?? sortedAccountItems[0];

  useEffect(() => {
    let isMounted = true;

    async function loadStoredState() {
      try {
        const storedState = await loadFinanceState();

        if (!isMounted) {
          return;
        }

        const currentDate = new Date();
        const advancedState = advanceWindow(
          storedState,
          currentDate.getFullYear(),
          (currentDate.getMonth() + 1) as FinanceState['settings']['windowStartMonth'],
        );

        setFinanceState(advancedState);

        const sortedAccounts = sortAccountItems(
          advancedState.accountItems,
          advancedState.categories,
        );
        const storedSelectedAccountId = await loadSelectedPlanningAccountId();
        const restoredAccountId = sortedAccounts.some(
          (accountItem) => accountItem.id === storedSelectedAccountId,
        )
          ? storedSelectedAccountId
          : null;

        setSelectedAccountItemId(restoredAccountId ?? sortedAccounts[0]?.id ?? '');
        setNewAccountCategoryId(sortCategories(advancedState.categories)[0]?.id ?? '');
      } catch {
        // load failure is silent — app starts empty
      } finally {
        if (isMounted) {
          setHasLoadedStoredState(true);
        }
      }
    }

    loadStoredState();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredState) {
      return;
    }

    saveFinanceState(financeState).catch(() => {
      // save failure is silent
    });
  }, [financeState, hasLoadedStoredState]);

  useEffect(() => {
    if (!hasLoadedStoredState || !selectedAccountItemId) {
      return;
    }

    saveSelectedPlanningAccountId(selectedAccountItemId).catch(() => {
      // save failure is silent
    });
  }, [selectedAccountItemId, hasLoadedStoredState]);

  function updateMonthlySalary(value: number) {
    setFinanceState((currentState) => ({
      ...currentState,
      settings: {
        ...currentState.settings,
        monthlySalary: value,
      },
    }));
  }

  function updateCurrentMonthExtraBalance(value: number) {
    setFinanceState((currentState) => ({
      ...currentState,
      settings: {
        ...currentState.settings,
        currentMonthExtraBalance: value,
      },
    }));
  }

  function addCurrentMonthExtraBalance(amount: number) {
    setFinanceState((currentState) => ({
      ...currentState,
      settings: {
        ...currentState.settings,
        currentMonthExtraBalance:
          currentState.settings.currentMonthExtraBalance + amount,
      },
    }));
  }

  function updateSummaryVisibleMonthCount(value: string) {
    const numericValue = value.replace(/\D/g, '');

    if (!numericValue) {
      return;
    }

    setFinanceState((currentState) => ({
      ...currentState,
      settings: {
        ...currentState.settings,
        summaryVisibleMonthCount: clampVisibleMonthCount(Number(numericValue)),
      },
    }));
  }

  function updateCommitmentThreshold(
    settingKey: 'commitmentWarningThreshold' | 'commitmentDangerThreshold',
    value: string,
  ) {
    const parsed = parseInt(value.replace(/\D/g, ''), 10);
    const clamped = isNaN(parsed) ? 0 : Math.max(0, Math.min(100, parsed));

    setFinanceState((currentState) => ({
      ...currentState,
      settings: { ...currentState.settings, [settingKey]: clamped },
    }));
  }

  function updateCommitmentWarningThreshold(value: string) {
    updateCommitmentThreshold('commitmentWarningThreshold', value);
  }

  function updateCommitmentDangerThreshold(value: string) {
    updateCommitmentThreshold('commitmentDangerThreshold', value);
  }

  function replaceFinanceState(nextState: FinanceState) {
    const currentDate = new Date();
    const normalizedState = advanceWindow(
      normalizeFinanceState(nextState),
      currentDate.getFullYear(),
      (currentDate.getMonth() + 1) as FinanceState['settings']['windowStartMonth'],
    );
    const sortedCategories = sortCategories(normalizedState.categories);
    const sortedAccounts = sortAccountItems(
      normalizedState.accountItems,
      normalizedState.categories,
    );

    setFinanceState(normalizedState);
    setSelectedAccountItemId(sortedAccounts[0]?.id ?? '');
    setNewAccountCategoryId(sortedCategories[0]?.id ?? '');
    setNewCategoryName('');
    setNewCategorySortOrder('');
    setNewCategoryPropagation('zero');
    setNewCategoryInstallmentEndDate('');
    setNewCategoryColor('');
    setNewAccountName('');
    setNewAccountDueDay('');
  }

  function createCategory() {
    const categoryName = newCategoryName.trim();

    if (!categoryName) {
      return;
    }
    const categoryId = createId('category');

    setFinanceState((currentState) => {
      const chosenSortOrder = newCategorySortOrder
        ? parseSortOrder(newCategorySortOrder)
        : suggestNextCategorySortOrder(currentState.categories);
      const hasConflict = currentState.categories.some(
        (category) => category.sortOrder === chosenSortOrder,
      );
      const shiftedCategories = hasConflict
        ? currentState.categories.map((category) =>
            category.sortOrder >= chosenSortOrder
              ? { ...category, sortOrder: category.sortOrder + 1 }
              : category,
          )
        : currentState.categories;
      return {
        ...currentState,
        categories: [
          ...shiftedCategories,
          {
            id: categoryId,
            color: newCategoryColor || suggestCategoryColor(currentState.categories),
            installmentEndDate:
              newCategoryPropagation === 'installment'
                ? newCategoryInstallmentEndDate.trim()
                : undefined,
            name: categoryName,
            propagation:
              newCategoryPropagation === 'fixed' ||
              newCategoryPropagation === 'installment'
                ? newCategoryPropagation
                : 'zero',
            sortOrder: chosenSortOrder,
          },
        ],
      };
    });
    setNewAccountCategoryId((currentCategoryId) => currentCategoryId || categoryId);
    setNewCategoryName('');
    setNewCategorySortOrder('');
    setNewCategoryPropagation('zero');
    setNewCategoryInstallmentEndDate('');
    setNewCategoryColor('');
  }

  function updateCategoryName(categoryId: string, name: string) {
    setFinanceState((currentState) => ({
      ...currentState,
      categories: currentState.categories.map((category) =>
        category.id === categoryId ? { ...category, name } : category,
      ),
    }));
  }

  function updateCategorySortOrder(categoryId: string, sortOrder: string) {
    const newSortOrder = parseSortOrder(sortOrder);
    setFinanceState((currentState) => {
      const hasConflict = currentState.categories.some(
        (category) => category.id !== categoryId && category.sortOrder === newSortOrder,
      );
      return {
        ...currentState,
        categories: currentState.categories.map((category) => {
          if (category.id === categoryId) {
            return { ...category, sortOrder: newSortOrder };
          }
          if (hasConflict && category.sortOrder >= newSortOrder) {
            return { ...category, sortOrder: category.sortOrder + 1 };
          }
          return category;
        }),
      };
    });
  }

  function updateCategoryPropagation(categoryId: string, propagation: string) {
    setFinanceState((currentState) => ({
      ...currentState,
      categories: currentState.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              installmentEndDate:
                propagation === 'installment' ? category.installmentEndDate : undefined,
              propagation:
                propagation === 'fixed' || propagation === 'installment'
                  ? propagation
                  : 'zero',
            }
          : category,
      ),
    }));
  }

  function updateCategoryColor(categoryId: string, color: string) {
    setFinanceState((currentState) => ({
      ...currentState,
      categories: currentState.categories.map((category) =>
        category.id === categoryId ? { ...category, color } : category,
      ),
    }));
  }

  function updateCategoryInstallmentEndDate(categoryId: string, value: string) {
    setFinanceState((currentState) => ({
      ...currentState,
      categories: currentState.categories.map((category) =>
        category.id === categoryId
          ? { ...category, installmentEndDate: value }
          : category,
      ),
    }));
  }

  function deleteCategory(categoryId: string) {
    setFinanceState((currentState) => {
      const removedAccountIds = new Set(
        currentState.accountItems
          .filter((accountItem) => accountItem.categoryId === categoryId)
          .map((accountItem) => accountItem.id),
      );

      return {
        ...currentState,
        accountItems: currentState.accountItems.filter(
          (accountItem) => accountItem.categoryId !== categoryId,
        ),
        categories: currentState.categories.filter(
          (category) => category.id !== categoryId,
        ),
        monthlyValues: currentState.monthlyValues.filter(
          (monthlyValue) => !removedAccountIds.has(monthlyValue.accountItemId),
        ),
        paymentStatuses: currentState.paymentStatuses.filter(
          (paymentStatus) => !removedAccountIds.has(paymentStatus.accountItemId),
        ),
      };
    });

    if (newAccountCategoryId === categoryId) {
      setNewAccountCategoryId('');
    }
  }

  function createAccountItem() {
    const accountName = newAccountName.trim();
    const selectedCategory =
      financeState.categories.find(
        (category) => category.id === newAccountCategoryId,
      ) ?? sortCategories(financeState.categories)[0];

    if (!accountName || !selectedCategory) {
      return;
    }

    const accountItemId = createId('account');

    setFinanceState((currentState) => ({
      ...currentState,
      accountItems: [
        ...currentState.accountItems,
        {
          id: accountItemId,
          categoryId: selectedCategory.id,
          dueDay: parseDueDay(newAccountDueDay),
          name: accountName,
          sortOrder: 0,
        },
      ],
    }));
    setNewAccountDueDay('');
    setNewAccountName('');
    setSelectedAccountItemId(accountItemId);
  }

  function updateAccountName(accountItemId: string, name: string) {
    setFinanceState((currentState) => ({
      ...currentState,
      accountItems: currentState.accountItems.map((accountItem) =>
        accountItem.id === accountItemId ? { ...accountItem, name } : accountItem,
      ),
    }));
  }

  function updateAccountDueDay(accountItemId: string, dueDay: string) {
    setFinanceState((currentState) => ({
      ...currentState,
      accountItems: currentState.accountItems.map((accountItem) =>
        accountItem.id === accountItemId
          ? { ...accountItem, dueDay: parseDueDay(dueDay) }
          : accountItem,
      ),
    }));
  }

  function setAccountCategory(accountItemId: string, categoryId: string) {
    setFinanceState((currentState) => ({
      ...currentState,
      accountItems: currentState.accountItems.map((accountItem) =>
        accountItem.id === accountItemId ? { ...accountItem, categoryId } : accountItem,
      ),
    }));
  }

  function deleteAccountItem(accountItemId: string) {
    setFinanceState((currentState) => ({
      ...currentState,
      accountItems: currentState.accountItems.filter(
        (accountItem) => accountItem.id !== accountItemId,
      ),
      monthlyValues: currentState.monthlyValues.filter(
        (monthlyValue) => monthlyValue.accountItemId !== accountItemId,
      ),
      paymentStatuses: currentState.paymentStatuses.filter(
        (paymentStatus) => paymentStatus.accountItemId !== accountItemId,
      ),
    }));

    if (selectedAccountItemId === accountItemId) {
      setSelectedAccountItemId('');
    }
  }

  function updateMonthlyValue(
    accountItemId: string,
    projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
    amount: number,
  ) {
    setMonthlyValueAmount(accountItemId, projectionMonth, amount);
  }

  function adjustMonthlyValue(
    accountItemId: string,
    projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
    adjustmentAmount: number,
    operation: MonthlyValueAdjustmentOperation,
    installments = 1,
  ) {
    setFinanceState((currentState) => {
      const targetMonths =
        operation === 'add'
          ? buildInstallmentMonths(
              projectionMonth.year,
              projectionMonth.month,
              installments,
              currentState.settings.windowStartYear,
              currentState.settings.windowStartMonth,
            )
          : [projectionMonth];

      if (targetMonths.length === 0) {
        return currentState;
      }

      return {
        ...currentState,
        monthlyValues: targetMonths.reduce(
          (monthlyValues, targetMonth) =>
            adjustMonthlyValueAmount(
              monthlyValues,
              accountItemId,
              targetMonth,
              adjustmentAmount,
              operation,
            ),
          currentState.monthlyValues,
        ),
      };
    });
  }

  function createAccountItemAndSetValue(
    name: string,
    categoryId: string,
    dueDay: number,
    projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
    amount: number,
  ) {
    const accountItemId = createId('account');

    setFinanceState((currentState) =>
      buildAccountItemWithValueState(
        currentState,
        accountItemId,
        name,
        categoryId,
        dueDay,
        projectionMonth,
        amount,
      ),
    );
    setSelectedAccountItemId(accountItemId);
  }

  function setMonthlyValueAmount(
    accountItemId: string,
    projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
    amount: number,
  ) {
    setFinanceState((currentState) => {
      const existingValue = currentState.monthlyValues.find(
        (monthlyValue) =>
          monthlyValue.accountItemId === accountItemId &&
          monthlyValue.month === projectionMonth.month &&
          monthlyValue.year === projectionMonth.year,
      );

      if (!existingValue) {
        return {
          ...currentState,
          monthlyValues: [
            ...currentState.monthlyValues,
            {
              accountItemId,
              amount,
              month: projectionMonth.month,
              year: projectionMonth.year,
            },
          ],
        };
      }

      return {
        ...currentState,
        monthlyValues: currentState.monthlyValues.map((monthlyValue) =>
          monthlyValue === existingValue ? { ...monthlyValue, amount } : monthlyValue,
        ),
      };
    });
  }

  function toggleMonthlyPaymentStatus(
    accountItemId: string,
    projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
  ) {
    setFinanceState((currentState) => {
      const existingStatus = currentState.paymentStatuses.find(
        (paymentStatus) =>
          paymentStatus.accountItemId === accountItemId &&
          paymentStatus.month === projectionMonth.month &&
          paymentStatus.year === projectionMonth.year,
      );

      if (!existingStatus) {
        return {
          ...currentState,
          paymentStatuses: [
            ...currentState.paymentStatuses,
            {
              accountItemId,
              isPaid: true,
              month: projectionMonth.month,
              year: projectionMonth.year,
            },
          ],
        };
      }

      return {
        ...currentState,
        paymentStatuses: currentState.paymentStatuses.map((paymentStatus) =>
          paymentStatus === existingStatus
            ? { ...paymentStatus, isPaid: !paymentStatus.isPaid }
            : paymentStatus,
        ),
      };
    });
  }

  function advanceWindowMonth() {
    setFinanceState((currentState) => {
      const nextWindowStart = getNextWindowStart(currentState);

      return advanceWindow(currentState, nextWindowStart.year, nextWindowStart.month);
    });
  }

  return {
    actions: {
      addCurrentMonthExtraBalance,
      createAccountItem,
      createAccountItemAndSetValue,
      createCategory,
      deleteAccountItem,
      deleteCategory,
      setAccountCategory,
      setNewAccountCategoryId,
      setNewAccountDueDay,
      setNewAccountName,
      setNewCategoryColor,
      setNewCategoryInstallmentEndDate,
      setNewCategoryName,
      setNewCategoryPropagation,
      setNewCategorySortOrder,
      setSelectedAccountItemId,
      adjustMonthlyValue,
      advanceWindowMonth,
      replaceFinanceState,
      toggleMonthlyPaymentStatus,
      updateAccountDueDay,
      updateAccountName,
      updateCommitmentDangerThreshold,
      updateCommitmentWarningThreshold,
      updateCurrentMonthExtraBalance,
      updateCategoryColor,
      updateCategoryName,
      updateCategoryInstallmentEndDate,
      updateCategoryPropagation,
      updateCategorySortOrder,
      updateMonthlySalary,
      updateMonthlyValue,
      updateSummaryVisibleMonthCount,
    },
    financeState,
    formState: {
      newAccountCategoryId,
      newAccountDueDay,
      newAccountName,
      newCategoryColor,
      newCategoryInstallmentEndDate,
      newCategoryName,
      newCategoryPropagation,
      newCategorySortOrder,
    },
    selectedAccountItem,
    selectedAccountItemId,
  };
}

export function buildAccountItemWithValueState(
  currentState: FinanceState,
  accountItemId: string,
  name: string,
  categoryId: string,
  dueDay: number,
  projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
  amount: number,
): FinanceState {
  const newItem: AccountItem = {
    id: accountItemId,
    categoryId,
    dueDay,
    name: name.trim(),
    sortOrder: 0,
  };
  const withNewItem: FinanceState = {
    ...currentState,
    accountItems: [...currentState.accountItems, newItem],
  };

  if (amount <= 0) return withNewItem;

  return {
    ...withNewItem,
    monthlyValues: [
      ...withNewItem.monthlyValues,
      {
        accountItemId,
        amount,
        month: projectionMonth.month,
        year: projectionMonth.year,
      },
    ],
  };
}

function adjustMonthlyValueAmount(
  monthlyValues: MonthlyValue[],
  accountItemId: string,
  projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
  adjustmentAmount: number,
  operation: MonthlyValueAdjustmentOperation,
) {
  const existingValue = monthlyValues.find(
    (monthlyValue) =>
      monthlyValue.accountItemId === accountItemId &&
      monthlyValue.month === projectionMonth.month &&
      monthlyValue.year === projectionMonth.year,
  );
  const nextAmount = calculateAdjustedMonthlyValue(
    existingValue?.amount ?? 0,
    adjustmentAmount,
    operation,
  );

  if (!existingValue) {
    return [
      ...monthlyValues,
      {
        accountItemId,
        amount: nextAmount,
        month: projectionMonth.month,
        year: projectionMonth.year,
      },
    ];
  }

  return monthlyValues.map((monthlyValue) =>
    monthlyValue === existingValue
      ? { ...monthlyValue, amount: nextAmount }
      : monthlyValue,
  );
}
