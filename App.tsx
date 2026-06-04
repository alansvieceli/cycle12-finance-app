import { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  calculateCategoryTotals,
  calculateMonthlyTotalExpenses,
  calculateSalaryCommitmentPercentage,
  calculateSurplusOrShortfall,
  createProjectionMonths,
} from './src/lib/financeCalculations';
import {
  CategoryMonthTotal,
  ProjectionMonth,
} from './src/lib/financeCalculations';
import {
  loadFinanceState,
  saveFinanceState,
} from './src/storage/financeStorage';
import { emptyFinanceState } from './src/types/finance';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  currency: 'BRL',
  style: 'currency',
});

const percentageFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
  style: 'percent',
});

const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
});

export default function App() {
  const projectionMonths = useMemo(() => createProjectionMonths(), []);
  const [financeState, setFinanceState] = useState(emptyFinanceState);
  const visibleProjectionMonths = projectionMonths.slice(
    0,
    financeState.settings.visibleMonthCount,
  );
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountDueDay, setNewAccountDueDay] = useState('');
  const [hasLoadedStoredState, setHasLoadedStoredState] = useState(false);
  const [storageMessage, setStorageMessage] = useState('');
  const [selectedAccountItemId, setSelectedAccountItemId] = useState('');
  const selectedAccountItem =
    financeState.accountItems.find(
      (accountItem) => accountItem.id === selectedAccountItemId,
    ) ?? financeState.accountItems[0];

  useEffect(() => {
    let isMounted = true;

    async function loadStoredState() {
      try {
        const storedState = await loadFinanceState();

        if (!isMounted) {
          return;
        }

        setFinanceState(storedState);
        setSelectedAccountItemId(storedState.accountItems[0]?.id ?? '');
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

  function createCategory() {
    const categoryName = newCategoryName.trim();

    if (!categoryName) {
      return;
    }

    setFinanceState((currentState) => ({
      ...currentState,
      categories: [
        ...currentState.categories,
        {
          id: createId('category'),
          name: categoryName,
          sortOrder: currentState.categories.length + 1,
        },
      ],
    }));
    setNewCategoryName('');
  }

  function updateCategoryName(categoryId: string, name: string) {
    setFinanceState((currentState) => ({
      ...currentState,
      categories: currentState.categories.map((category) =>
        category.id === categoryId ? { ...category, name } : category,
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
      };
    });
  }

  function createAccountItem() {
    const accountName = newAccountName.trim();
    const firstCategory = financeState.categories[0];

    if (!accountName || !firstCategory) {
      return;
    }

    const accountItemId = createId('account');

    setFinanceState((currentState) => ({
      ...currentState,
      accountItems: [
        ...currentState.accountItems,
        {
          id: accountItemId,
          categoryId: firstCategory.id,
          dueDay: parseDueDay(newAccountDueDay),
          name: accountName,
          sortOrder: currentState.accountItems.length + 1,
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
      const categories = [...currentState.categories].sort(
        (firstCategory, secondCategory) =>
          firstCategory.sortOrder - secondCategory.sortOrder,
      );

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
    setFinanceState((currentState) => {
      const parsedAmount = parseCurrencyInput(amount);
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
              amount: parsedAmount,
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
            ? { ...monthlyValue, amount: parsedAmount }
            : monthlyValue,
        ),
      };
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Cycle12 Finance</Text>
        <Text style={styles.title}>Projeção de 12 meses</Text>
        <Text style={styles.subtitle}>
          Acompanhe despesas, comprometimento do salário e sobra ou falta mensal.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.monthList}>
        <View style={styles.settingsPanel}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          {storageMessage ? (
            <Text style={styles.storageMessage}>{storageMessage}</Text>
          ) : (
            <Text style={styles.storageMessage}>
              Dados salvos localmente neste dispositivo.
            </Text>
          )}
          <View style={styles.inputGrid}>
            <CurrencyInput
              label="Salário mensal"
              value={financeState.settings.monthlySalary}
              onChangeValue={updateMonthlySalary}
            />
            <CurrencyInput
              label="Extra do mês atual"
              value={financeState.settings.currentMonthExtraBalance}
              onChangeValue={updateCurrentMonthExtraBalance}
            />
          </View>
        </View>

        <View style={styles.settingsPanel}>
          <Text style={styles.sectionTitle}>Cadastros</Text>

          <View style={styles.editorSection}>
            <Text style={styles.editorTitle}>Categorias</Text>
            <View style={styles.createRow}>
              <TextInput
                onChangeText={setNewCategoryName}
                placeholder="Nova categoria"
                style={[styles.input, styles.createInput]}
                value={newCategoryName}
              />
              <PrimaryButton label="Adicionar" onPress={createCategory} />
            </View>

            {financeState.categories
              .slice()
              .sort(
                (firstCategory, secondCategory) =>
                  firstCategory.sortOrder - secondCategory.sortOrder,
              )
              .map((category) => (
                <View key={category.id} style={styles.editorRow}>
                  <TextInput
                    onChangeText={(name) => updateCategoryName(category.id, name)}
                    style={[styles.input, styles.rowInput]}
                    value={category.name}
                  />
                  <DangerButton
                    label="Excluir"
                    onPress={() => deleteCategory(category.id)}
                  />
                </View>
              ))}
          </View>

          <View style={styles.editorSection}>
            <Text style={styles.editorTitle}>Contas</Text>
            <View style={styles.createAccountRow}>
              <TextInput
                onChangeText={setNewAccountName}
                placeholder="Nova conta"
                style={styles.input}
                value={newAccountName}
              />
              <TextInput
                keyboardType="number-pad"
                onChangeText={setNewAccountDueDay}
                placeholder="Dia"
                style={[styles.input, styles.dueDayInput]}
                value={newAccountDueDay}
              />
              <PrimaryButton label="Adicionar" onPress={createAccountItem} />
            </View>

            {financeState.accountItems
              .slice()
              .sort(
                (firstAccountItem, secondAccountItem) =>
                  firstAccountItem.sortOrder - secondAccountItem.sortOrder,
              )
              .map((accountItem) => (
                <View key={accountItem.id} style={styles.accountEditorRow}>
                  <TextInput
                    onChangeText={(name) =>
                      updateAccountName(accountItem.id, name)
                    }
                    style={styles.input}
                    value={accountItem.name}
                  />
                  <View style={styles.accountMetaRow}>
                    <Pressable
                      onPress={() => cycleAccountCategory(accountItem.id)}
                      style={styles.categoryButton}
                    >
                      <Text style={styles.categoryButtonText}>
                        {getCategoryName(
                          financeState.categories,
                          accountItem.categoryId,
                        )}
                      </Text>
                    </Pressable>
                    <TextInput
                      keyboardType="number-pad"
                      onChangeText={(dueDay) =>
                        updateAccountDueDay(accountItem.id, dueDay)
                      }
                      style={[styles.input, styles.dueDayInput]}
                      value={String(accountItem.dueDay)}
                    />
                    <DangerButton
                      label="Excluir"
                      onPress={() => deleteAccountItem(accountItem.id)}
                    />
                  </View>
                </View>
              ))}
          </View>
        </View>

        <View style={styles.settingsPanel}>
          <Text style={styles.sectionTitle}>Valores mensais</Text>
          {selectedAccountItem ? (
            <>
              <Text style={styles.editorHint}>
                Selecione uma conta e edite os valores previstos para cada mês.
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.accountSelector}
              >
                {financeState.accountItems
                  .slice()
                  .sort(
                    (firstAccountItem, secondAccountItem) =>
                      firstAccountItem.sortOrder - secondAccountItem.sortOrder,
                  )
                  .map((accountItem) => (
                    <Pressable
                      key={accountItem.id}
                      onPress={() => setSelectedAccountItemId(accountItem.id)}
                      style={[
                        styles.accountSelectorButton,
                        selectedAccountItem.id === accountItem.id
                          ? styles.accountSelectorButtonActive
                          : null,
                      ]}
                    >
                      <Text
                        style={[
                          styles.accountSelectorButtonText,
                          selectedAccountItem.id === accountItem.id
                            ? styles.accountSelectorButtonTextActive
                            : null,
                        ]}
                      >
                        {accountItem.name}
                      </Text>
                    </Pressable>
                  ))}
              </ScrollView>

              <View style={styles.monthValueList}>
                {projectionMonths.map((projectionMonth) => (
                  <View key={projectionMonth.key} style={styles.monthValueRow}>
                    <View style={styles.monthValueLabel}>
                      <Text style={styles.monthValueName}>
                        {formatMonthLabel(
                          projectionMonth.year,
                          projectionMonth.month,
                        )}
                      </Text>
                      <Text style={styles.monthValueCategory}>
                        {getCategoryName(
                          financeState.categories,
                          selectedAccountItem.categoryId,
                        )}
                      </Text>
                    </View>
                    <TextInput
                      keyboardType="decimal-pad"
                      onChangeText={(amount) =>
                        updateMonthlyValue(
                          selectedAccountItem.id,
                          projectionMonth,
                          amount,
                        )
                      }
                      placeholder="0,00"
                      style={[styles.input, styles.monthValueInput]}
                      value={formatEditableAmount(
                        getMonthlyValueAmount(
                          financeState.monthlyValues,
                          selectedAccountItem.id,
                          projectionMonth,
                        ),
                      )}
                    />
                  </View>
                ))}
              </View>
            </>
          ) : (
            <Text style={styles.emptyText}>
              Crie uma conta para editar valores mensais.
            </Text>
          )}
        </View>

        {visibleProjectionMonths.map((projectionMonth) => {
          const monthlyTotalExpenses = calculateMonthlyTotalExpenses(
            financeState.categories,
            financeState.accountItems,
            financeState.monthlyValues,
            projectionMonth,
          );
          const salaryCommitmentPercentage =
            calculateSalaryCommitmentPercentage(
              monthlyTotalExpenses,
              financeState.settings.monthlySalary,
            );
          const surplusOrShortfall = calculateSurplusOrShortfall(
            financeState.settings,
            monthlyTotalExpenses,
            projectionMonth,
          );
          const categoryTotals = calculateCategoryTotals(
            financeState.categories,
            financeState.accountItems,
            financeState.monthlyValues,
            projectionMonth,
          );

          return (
            <View key={projectionMonth.key} style={styles.monthCard}>
              <View style={styles.monthHeader}>
                <View>
                  <Text style={styles.monthName}>
                    {formatMonthLabel(projectionMonth.year, projectionMonth.month)}
                  </Text>
                  {projectionMonth.isCurrentMonth ? (
                    <Text style={styles.currentMonthLabel}>Mês atual</Text>
                  ) : null}
                </View>
                <Text
                  style={[
                    styles.balance,
                    surplusOrShortfall < 0
                      ? styles.negativeBalance
                      : styles.positiveBalance,
                  ]}
                >
                  {currencyFormatter.format(surplusOrShortfall)}
                </Text>
              </View>

              <View style={styles.summaryGrid}>
                <SummaryValue
                  label="Despesas"
                  value={currencyFormatter.format(monthlyTotalExpenses)}
                />
                <SummaryValue
                  label="Comprometido"
                  value={
                    salaryCommitmentPercentage === null
                      ? '-'
                      : percentageFormatter.format(salaryCommitmentPercentage)
                  }
                />
              </View>

              <CategoryTotals
                categoryTotals={categoryTotals}
                categoryNamesById={Object.fromEntries(
                  financeState.categories.map((category) => [
                    category.id,
                    category.name,
                  ]),
                )}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function PrimaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.primaryButton}>
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function DangerButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.dangerButton}>
      <Text style={styles.dangerButtonText}>{label}</Text>
    </Pressable>
  );
}

function CurrencyInput({
  label,
  onChangeValue,
  value,
}: {
  label: string;
  onChangeValue: (value: string) => void;
  value: number;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        keyboardType="decimal-pad"
        onChangeText={onChangeValue}
        placeholder="0,00"
        style={styles.input}
        value={formatEditableAmount(value)}
      />
    </View>
  );
}

function SummaryValue({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryValue}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryAmount}>{value}</Text>
    </View>
  );
}

function CategoryTotals({
  categoryNamesById,
  categoryTotals,
}: {
  categoryNamesById: Record<string, string>;
  categoryTotals: CategoryMonthTotal[];
}) {
  return (
    <View style={styles.categoryList}>
      {categoryTotals.map((categoryTotal) => (
        <View key={categoryTotal.categoryId} style={styles.categoryRow}>
          <Text style={styles.categoryName}>
            {categoryNamesById[categoryTotal.categoryId]}
          </Text>
          <Text style={styles.categoryAmount}>
            {currencyFormatter.format(categoryTotal.total)}
          </Text>
        </View>
      ))}
    </View>
  );
}

function formatMonthLabel(year: number, month: number) {
  const label = monthFormatter.format(new Date(year, month - 1, 1));

  return label.charAt(0).toUpperCase() + label.slice(1);
}

function parseCurrencyInput(value: string) {
  const normalizedValue = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function formatEditableAmount(value: number) {
  if (!Number.isFinite(value) || value === 0) {
    return '';
  }

  return String(value).replace('.', ',');
}

function parseDueDay(value: string) {
  const parsedValue = Number(value.replace(/\D/g, ''));

  if (!Number.isFinite(parsedValue)) {
    return 1;
  }

  return Math.max(1, Math.min(31, parsedValue));
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 100000)}`;
}

function getCategoryName(
  categories: { id: string; name: string }[],
  categoryId: string,
) {
  return categories.find((category) => category.id === categoryId)?.name ?? '-';
}

function getMonthlyValueAmount(
  monthlyValues: { accountItemId: string; month: number; year: number; amount: number }[],
  accountItemId: string,
  projectionMonth: Pick<ProjectionMonth, 'month' | 'year'>,
) {
  return (
    monthlyValues.find(
      (monthlyValue) =>
        monthlyValue.accountItemId === accountItemId &&
        monthlyValue.month === projectionMonth.month &&
        monthlyValue.year === projectionMonth.year,
    )?.amount ?? 0
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
  },
  header: {
    backgroundColor: '#16302b',
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  eyebrow: {
    color: '#8fd3c7',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 8,
  },
  subtitle: {
    color: '#d7e4e0',
    fontSize: 15,
    lineHeight: 21,
    marginTop: 8,
  },
  monthList: {
    gap: 12,
    padding: 16,
    paddingBottom: 28,
  },
  settingsPanel: {
    backgroundColor: '#ffffff',
    borderColor: '#dfe7e4',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    color: '#17211f',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  storageMessage: {
    color: '#60716d',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  inputGrid: {
    gap: 12,
    marginTop: 14,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    color: '#60716d',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#f7faf9',
    borderColor: '#c9d6d2',
    borderRadius: 8,
    borderWidth: 1,
    color: '#17211f',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  editorSection: {
    marginTop: 18,
  },
  editorTitle: {
    color: '#32403d',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
  },
  editorHint: {
    color: '#60716d',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  createRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  createInput: {
    flex: 1,
  },
  editorRow: {
    alignItems: 'center',
    borderTopColor: '#e7eeeb',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    paddingTop: 10,
  },
  rowInput: {
    flex: 1,
  },
  createAccountRow: {
    gap: 10,
    marginTop: 10,
  },
  accountEditorRow: {
    borderTopColor: '#e7eeeb',
    borderTopWidth: 1,
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
  },
  accountMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  dueDayInput: {
    maxWidth: 78,
    textAlign: 'center',
  },
  categoryButton: {
    alignItems: 'center',
    backgroundColor: '#eef4f2',
    borderColor: '#c9d6d2',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 10,
  },
  categoryButtonText: {
    color: '#17211f',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
    textAlign: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#176a4d',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  dangerButton: {
    alignItems: 'center',
    backgroundColor: '#f9e8e5',
    borderColor: '#e3b8b1',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  dangerButtonText: {
    color: '#94372d',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
  },
  accountSelector: {
    marginTop: 14,
  },
  accountSelectorButton: {
    alignItems: 'center',
    backgroundColor: '#eef4f2',
    borderColor: '#c9d6d2',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    marginRight: 8,
    minHeight: 42,
    paddingHorizontal: 12,
  },
  accountSelectorButtonActive: {
    backgroundColor: '#176a4d',
    borderColor: '#176a4d',
  },
  accountSelectorButtonText: {
    color: '#17211f',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
  },
  accountSelectorButtonTextActive: {
    color: '#ffffff',
  },
  monthValueList: {
    gap: 10,
    marginTop: 14,
  },
  monthValueRow: {
    alignItems: 'center',
    borderTopColor: '#e7eeeb',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingTop: 10,
  },
  monthValueLabel: {
    flex: 1,
  },
  monthValueName: {
    color: '#17211f',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
  },
  monthValueCategory: {
    color: '#60716d',
    fontSize: 12,
    letterSpacing: 0,
    marginTop: 3,
  },
  monthValueInput: {
    maxWidth: 130,
    textAlign: 'right',
  },
  emptyText: {
    color: '#60716d',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  monthCard: {
    backgroundColor: '#ffffff',
    borderColor: '#dfe7e4',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  monthHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  monthName: {
    color: '#17211f',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  currentMonthLabel: {
    color: '#3d6f66',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  balance: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0,
    textAlign: 'right',
  },
  positiveBalance: {
    color: '#176a4d',
  },
  negativeBalance: {
    color: '#a33b2f',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  summaryValue: {
    backgroundColor: '#eef4f2',
    borderRadius: 8,
    flex: 1,
    minHeight: 68,
    padding: 12,
  },
  summaryLabel: {
    color: '#60716d',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  summaryAmount: {
    color: '#17211f',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 8,
  },
  categoryList: {
    borderTopColor: '#e7eeeb',
    borderTopWidth: 1,
    marginTop: 14,
    paddingTop: 6,
  },
  categoryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 32,
  },
  categoryName: {
    color: '#32403d',
    flex: 1,
    fontSize: 14,
    letterSpacing: 0,
  },
  categoryAmount: {
    color: '#17211f',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
    marginLeft: 12,
  },
});
