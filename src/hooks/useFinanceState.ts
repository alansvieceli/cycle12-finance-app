import { useEffect, useState } from 'react';

import { createId } from '../lib/ids';
import {
  clampVisibleMonthCount,
  parseCurrencyInput,
  parseDueDay,
  parseSortOrder,
} from '../lib/inputParsers';
import { sortAccountItems, sortCategories } from '../lib/sorting';
import {
  loadFinanceState,
  normalizeFinanceState,
  saveFinanceState,
} from '../storage/financeStorage';
import { FinanceState, emptyFinanceState } from '../types/finance';
import { ProjectionMonth } from '../lib/financeCalculations';
import {
  MonthlyValueAdjustmentOperation,
  calculateAdjustedMonthlyValue,
} from '../lib/monthlyValueAdjustments';

export function useFinanceState() {
  const [financeState, setFinanceState] = useState(emptyFinanceState);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySortOrder, setNewCategorySortOrder] = useState('');
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountDueDay, setNewAccountDueDay] = useState('');
  const [newAccountCategoryId, setNewAccountCategoryId] = useState('');
  const [hasLoadedStoredState, setHasLoadedStoredState] = useState(false);
  const [storageMessage, setStorageMessage] = useState('');
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

        setFinanceState(storedState);
        setSelectedAccountItemId(
          sortAccountItems(storedState.accountItems, storedState.categories)[0]?.id ??
            '',
        );
        setNewAccountCategoryId(sortCategories(storedState.categories)[0]?.id ?? '');
      } catch {
        if (isMounted) {
          setStorageMessage(
            'Não foi possível carregar os dados locais. Começando vazio.',
          );
        }
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
      setStorageMessage('Não foi possível salvar os dados locais agora.');
    });
  }, [financeState, hasLoadedStoredState]);

  function updateMonthlySalary(value: string) {
    setFinanceState((currentState) => ({
      ...currentState,
      settings: {
        ...currentState.settings,
        monthlySalary: parseCurrencyInput(value),
      },
    }));
  }

  function updateCurrentMonthExtraBalance(value: string) {
    setFinanceState((currentState) => ({
      ...currentState,
      settings: {
        ...currentState.settings,
        currentMonthExtraBalance: parseCurrencyInput(value),
      },
    }));
  }

  function updateVisibleMonthCount(value: string) {
    const numericValue = value.replace(/\D/g, '');

    if (!numericValue) {
      return;
    }

    const parsedValue = Number(numericValue);

    setFinanceState((currentState) => ({
      ...currentState,
      settings: {
        ...currentState.settings,
        visibleMonthCount: clampVisibleMonthCount(parsedValue),
      },
    }));
  }

  function updateCommitmentWarningThreshold(value: string) {
    const parsed = parseInt(value.replace(/\D/g, ''), 10);
    const clamped = isNaN(parsed) ? 0 : Math.max(0, Math.min(100, parsed));

    setFinanceState((currentState) => ({
      ...currentState,
      settings: { ...currentState.settings, commitmentWarningThreshold: clamped },
    }));
  }

  function updateCommitmentDangerThreshold(value: string) {
    const parsed = parseInt(value.replace(/\D/g, ''), 10);
    const clamped = isNaN(parsed) ? 0 : Math.max(0, Math.min(100, parsed));

    setFinanceState((currentState) => ({
      ...currentState,
      settings: { ...currentState.settings, commitmentDangerThreshold: clamped },
    }));
  }

  function replaceFinanceState(nextState: FinanceState) {
    const normalizedState = normalizeFinanceState(nextState);
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
    setNewAccountName('');
    setNewAccountDueDay('');
  }

  function createCategory() {
    const categoryName = newCategoryName.trim();

    if (!categoryName) {
      return;
    }
    const categoryId = createId('category');

    setFinanceState((currentState) => ({
      ...currentState,
      categories: [
        ...currentState.categories,
        {
          id: categoryId,
          name: categoryName,
          sortOrder: parseSortOrder(newCategorySortOrder),
        },
      ],
    }));
    setNewAccountCategoryId((currentCategoryId) => currentCategoryId || categoryId);
    setNewCategoryName('');
    setNewCategorySortOrder('');
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
    setFinanceState((currentState) => ({
      ...currentState,
      categories: currentState.categories.map((category) =>
        category.id === categoryId
          ? { ...category, sortOrder: parseSortOrder(sortOrder) }
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

  function cycleAccountCategory(accountItemId: string) {
    setFinanceState((currentState) => {
      const categories = sortCategories(currentState.categories);

      if (categories.length === 0) {
        return currentState;
      }

      return {
        ...currentState,
        accountItems: currentState.accountItems.map((accountItem) => {
          if (accountItem.id !== accountItemId) {
            return accountItem;
          }

          const categoryIndex = categories.findIndex(
            (category) => category.id === accountItem.categoryId,
          );
          const nextCategory = categories[(categoryIndex + 1) % categories.length];

          return {
            ...accountItem,
            categoryId: nextCategory.id,
          };
        }),
      };
    });
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
    amount: string,
  ) {
    setMonthlyValueAmount(accountItemId, projectionMonth, parseCurrencyInput(amount));
  }

  function adjustMonthlyValue(
    accountItemId: string,
    projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
    adjustmentInput: string,
    operation: MonthlyValueAdjustmentOperation,
  ) {
    setFinanceState((currentState) => {
      const existingValue = currentState.monthlyValues.find(
        (monthlyValue) =>
          monthlyValue.accountItemId === accountItemId &&
          monthlyValue.month === projectionMonth.month &&
          monthlyValue.year === projectionMonth.year,
      );
      const nextAmount = calculateAdjustedMonthlyValue(
        existingValue?.amount ?? 0,
        adjustmentInput,
        operation,
      );

      if (!existingValue) {
        return {
          ...currentState,
          monthlyValues: [
            ...currentState.monthlyValues,
            {
              accountItemId,
              amount: nextAmount,
              month: projectionMonth.month,
              year: projectionMonth.year,
            },
          ],
        };
      }

      return {
        ...currentState,
        monthlyValues: currentState.monthlyValues.map((monthlyValue) =>
          monthlyValue === existingValue
            ? { ...monthlyValue, amount: nextAmount }
            : monthlyValue,
        ),
      };
    });
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

  return {
    actions: {
      createAccountItem,
      createCategory,
      cycleAccountCategory,
      deleteAccountItem,
      deleteCategory,
      setNewAccountCategoryId,
      setNewAccountDueDay,
      setNewAccountName,
      setNewCategoryName,
      setNewCategorySortOrder,
      setSelectedAccountItemId,
      adjustMonthlyValue,
      replaceFinanceState,
      toggleMonthlyPaymentStatus,
      updateAccountDueDay,
      updateAccountName,
      updateCommitmentDangerThreshold,
      updateCommitmentWarningThreshold,
      updateCurrentMonthExtraBalance,
      updateCategoryName,
      updateCategorySortOrder,
      updateMonthlySalary,
      updateMonthlyValue,
      updateVisibleMonthCount,
    },
    financeState,
    formState: {
      newAccountCategoryId,
      newAccountDueDay,
      newAccountName,
      newCategoryName,
      newCategorySortOrder,
    },
    selectedAccountItem,
    selectedAccountItemId,
    storageMessage,
  };
}
