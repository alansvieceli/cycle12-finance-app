import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ActionButton } from '../common/ActionButton';
import { Category, CategoryPropagation } from '../../types/finance';
import { sortCategories } from '../../lib/sorting';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const propagationOptions: { label: string; value: CategoryPropagation }[] = [
  { label: 'Fixo', value: 'fixed' },
  { label: 'Zerado', value: 'zero' },
  { label: 'Parcelas', value: 'installment' },
];

const monthOptions = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

type CategoryEditorProps = {
  categories: Category[];
  newCategoryName: string;
  newCategoryInstallmentEndDate: string;
  newCategoryPropagation: string;
  newCategorySortOrder: string;
  onChangeCategoryInstallmentEndDate: (categoryId: string, value: string) => void;
  onChangeCategoryName: (categoryId: string, name: string) => void;
  onChangeCategoryPropagation: (categoryId: string, propagation: string) => void;
  onChangeCategorySortOrder: (categoryId: string, sortOrder: string) => void;
  onChangeNewCategoryInstallmentEndDate: (value: string) => void;
  onChangeNewCategoryName: (name: string) => void;
  onChangeNewCategoryPropagation: (propagation: string) => void;
  onChangeNewCategorySortOrder: (sortOrder: string) => void;
  onCreateCategory: () => void;
  onDeleteCategory: (categoryId: string) => void;
};

export function CategoryEditor({
  categories,
  newCategoryInstallmentEndDate,
  newCategoryName,
  newCategoryPropagation,
  newCategorySortOrder,
  onChangeCategoryInstallmentEndDate,
  onChangeCategoryName,
  onChangeCategoryPropagation,
  onChangeCategorySortOrder,
  onChangeNewCategoryInstallmentEndDate,
  onChangeNewCategoryName,
  onChangeNewCategoryPropagation,
  onChangeNewCategorySortOrder,
  onCreateCategory,
  onDeleteCategory,
}: CategoryEditorProps) {
  const [expandedCategoryId, setExpandedCategoryId] = useState<string>();
  const [isCreateOpen, setIsCreateOpen] = useState(categories.length === 0);
  const [activePropagationSelector, setActivePropagationSelector] = useState<string>();
  const [activeMonthSelector, setActiveMonthSelector] = useState<string>();

  function closeSelectors() {
    setActivePropagationSelector(undefined);
    setActiveMonthSelector(undefined);
  }

  function toggleExpand(categoryId: string) {
    setExpandedCategoryId((prev) => (prev === categoryId ? undefined : categoryId));
  }

  function confirmDeleteCategory(category: Category) {
    Alert.alert(
      'Excluir categoria',
      `Deseja excluir "${category.name}"? As contas, valores e pagamentos dessa categoria também serão removidos.`,
      [
        { style: 'cancel', text: 'Cancelar' },
        {
          onPress: () => onDeleteCategory(category.id),
          style: 'destructive',
          text: 'Excluir',
        },
      ],
    );
  }

  const sortedCategories = sortCategories(categories);

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Categorias</Text>

      {sortedCategories.length > 0 && (
        <View style={styles.listSection}>
          {sortedCategories.map((category) => {
            const isExpanded = expandedCategoryId === category.id;

            return (
              <View key={category.id} style={styles.listItem}>
                <Pressable
                  onPress={() => toggleExpand(category.id)}
                  style={styles.compactRow}
                >
                  <Text numberOfLines={1} style={styles.itemName}>
                    {category.name}
                  </Text>
                  <View style={styles.badgesRow}>
                    <PropagationBadge value={category.propagation} />
                    {category.propagation === 'installment' &&
                    category.installmentEndDate ? (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          {formatInstallmentEndDate(category.installmentEndDate)}
                        </Text>
                      </View>
                    ) : null}
                    <View style={[styles.badge, styles.sortBadge]}>
                      <Text style={styles.badgeText}>#{category.sortOrder}</Text>
                    </View>
                  </View>
                  <Text style={styles.expandChevron}>{isExpanded ? '▴' : '▾'}</Text>
                </Pressable>

                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <View style={styles.editFieldsRow}>
                      <TextInput
                        onChangeText={(name) => onChangeCategoryName(category.id, name)}
                        style={[styles.input, styles.nameInput]}
                        value={category.name}
                      />
                      <SortOrderInput
                        onChangeValue={(sortOrder) =>
                          onChangeCategorySortOrder(category.id, sortOrder)
                        }
                        value={category.sortOrder}
                      />
                    </View>
                    <View style={styles.editFieldsRow}>
                      <PropagationSelector
                        label="Propagação"
                        onOpen={() => setActivePropagationSelector(category.id)}
                        selectorId={category.id}
                        value={category.propagation}
                        visibleSelectorId={activePropagationSelector}
                      />
                      {category.propagation === 'installment' ? (
                        <MonthYearSelector
                          onOpen={() => setActiveMonthSelector(category.id)}
                          selectorId={category.id}
                          value={category.installmentEndDate ?? ''}
                          visibleSelectorId={activeMonthSelector}
                        />
                      ) : null}
                    </View>
                    <ActionButton
                      label="Excluir categoria"
                      onPress={() => confirmDeleteCategory(category)}
                      variant="ghost-danger"
                    />
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}

      <Pressable
        onPress={() => setIsCreateOpen((p) => !p)}
        style={[styles.createToggle, isCreateOpen && styles.createToggleOpen]}
      >
        <Text style={styles.createToggleText}>Nova categoria</Text>
        <Text style={styles.createToggleIcon}>{isCreateOpen ? '−' : '+'}</Text>
      </Pressable>

      {isCreateOpen && (
        <View style={styles.createForm}>
          <View style={styles.createRow}>
            <TextInput
              onChangeText={onChangeNewCategoryName}
              placeholder="Nome"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, styles.createInput]}
              value={newCategoryName}
            />
            <TextInput
              keyboardType="number-pad"
              onChangeText={onChangeNewCategorySortOrder}
              placeholder="Ordem"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, styles.sortOrderInput]}
              value={newCategorySortOrder}
            />
          </View>
          <View style={styles.createRow}>
            <PropagationSelector
              label="Propagação"
              onOpen={() => setActivePropagationSelector('new')}
              selectorId="new"
              value={newCategoryPropagation}
              visibleSelectorId={activePropagationSelector}
            />
            {newCategoryPropagation === 'installment' ? (
              <MonthYearSelector
                onOpen={() => setActiveMonthSelector('new')}
                selectorId="new"
                value={newCategoryInstallmentEndDate}
                visibleSelectorId={activeMonthSelector}
              />
            ) : null}
          </View>
          <ActionButton label="Adicionar" onPress={onCreateCategory} />
        </View>
      )}

      <PropagationModal
        onChangeValue={(value) => {
          if (!activePropagationSelector) {
            return;
          }

          if (activePropagationSelector === 'new') {
            onChangeNewCategoryPropagation(value);
          } else {
            onChangeCategoryPropagation(activePropagationSelector, value);
          }

          closeSelectors();
        }}
        onClose={closeSelectors}
        visible={Boolean(activePropagationSelector)}
      />
      <MonthYearModal
        onChangeValue={(value) => {
          if (!activeMonthSelector) {
            return;
          }

          if (activeMonthSelector === 'new') {
            onChangeNewCategoryInstallmentEndDate(value);
          } else {
            onChangeCategoryInstallmentEndDate(activeMonthSelector, value);
          }

          closeSelectors();
        }}
        onClose={closeSelectors}
        value={
          activeMonthSelector === 'new'
            ? newCategoryInstallmentEndDate
            : categories.find((category) => category.id === activeMonthSelector)
                ?.installmentEndDate
        }
        visible={Boolean(activeMonthSelector)}
      />
    </View>
  );
}

function PropagationBadge({ value }: { value: string }) {
  const option =
    propagationOptions.find((o) => o.value === value) ?? propagationOptions[1];

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{option.label}</Text>
    </View>
  );
}

function PropagationSelector({
  label,
  onOpen,
  selectorId,
  value,
  visibleSelectorId,
}: {
  label: string;
  onOpen: () => void;
  selectorId: string;
  value: string;
  visibleSelectorId?: string;
}) {
  const currentOption =
    propagationOptions.find((option) => option.value === value) ??
    propagationOptions[1];

  return (
    <Pressable
      accessibilityLabel={label}
      onPress={onOpen}
      style={[
        styles.selectorButton,
        visibleSelectorId === selectorId ? styles.selectorButtonActive : null,
      ]}
    >
      <Text style={styles.selectorText}>
        <Text style={styles.selectorLabel}>{label}: </Text>
        {currentOption.label} ▾
      </Text>
    </Pressable>
  );
}

function PropagationModal({
  onChangeValue,
  onClose,
  visible,
}: {
  onChangeValue: (value: CategoryPropagation) => void;
  onClose: () => void;
  visible: boolean;
}) {
  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Propagação</Text>
          {propagationOptions.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => onChangeValue(option.value)}
              style={styles.modalOption}
            >
              <Text style={styles.modalOptionTitle}>{option.label}</Text>
              <Text style={styles.modalOptionDescription}>
                {getPropagationDescription(option.value)}
              </Text>
            </Pressable>
          ))}
          <ActionButton label="Cancelar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

function MonthYearSelector({
  onOpen,
  selectorId,
  value,
  visibleSelectorId,
}: {
  onOpen: () => void;
  selectorId: string;
  value: string;
  visibleSelectorId?: string;
}) {
  return (
    <Pressable
      accessibilityLabel="Data de encerramento"
      onPress={onOpen}
      style={[
        styles.selectorButton,
        styles.monthSelectorButton,
        visibleSelectorId === selectorId ? styles.selectorButtonActive : null,
      ]}
    >
      <Text style={styles.selectorText}>
        <Text style={styles.selectorLabel}>Fim: </Text>
        {formatInstallmentEndDate(value) || 'Mês/ano'} ▾
      </Text>
    </Pressable>
  );
}

function MonthYearModal({
  onChangeValue,
  onClose,
  value,
  visible,
}: {
  onChangeValue: (value: string) => void;
  onClose: () => void;
  value?: string;
  visible: boolean;
}) {
  const initialSelection = parseInstallmentEndDate(value);
  const [selectedYear, setSelectedYear] = useState(initialSelection.year);

  useEffect(() => {
    if (visible) {
      setSelectedYear(parseInstallmentEndDate(value).year);
    }
  }, [value, visible]);

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Encerrar parcelas em</Text>
          <View style={styles.yearSelector}>
            <Pressable
              onPress={() => setSelectedYear((currentYear) => currentYear - 1)}
              style={styles.yearButton}
            >
              <Text style={styles.yearButtonText}>‹</Text>
            </Pressable>
            <Text style={styles.yearText}>{selectedYear}</Text>
            <Pressable
              onPress={() => setSelectedYear((currentYear) => currentYear + 1)}
              style={styles.yearButton}
            >
              <Text style={styles.yearButtonText}>›</Text>
            </Pressable>
          </View>
          <View style={styles.monthGrid}>
            {monthOptions.map((monthLabel, index) => (
              <Pressable
                key={monthLabel}
                onPress={() =>
                  onChangeValue(formatInstallmentDate(selectedYear, index + 1))
                }
                style={styles.monthButton}
              >
                <Text style={styles.monthButtonText}>{monthLabel}</Text>
              </Pressable>
            ))}
          </View>
          <ActionButton label="Cancelar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

function getPropagationDescription(value: CategoryPropagation) {
  if (value === 'fixed') {
    return 'Copia o último valor conhecido para novos meses.';
  }

  if (value === 'installment') {
    return 'Copia até o mês final das parcelas; depois zera.';
  }

  return 'Começa novos meses com valor zero.';
}

function parseInstallmentEndDate(value?: string) {
  const [yearText, monthText] = value?.split('-') ?? [];
  const year = Number(yearText);
  const month = Number(monthText);
  const currentDate = new Date();

  return {
    year: Number.isInteger(year) ? year : currentDate.getFullYear(),
    month: Number.isInteger(month) && month >= 1 && month <= 12 ? month : 1,
  };
}

function formatInstallmentDate(year: number, month: number) {
  return `${year}-${String(month).padStart(2, '0')}-01`;
}

function formatInstallmentEndDate(value: string) {
  const parsedDate = parseInstallmentEndDate(value);

  if (!value) {
    return '';
  }

  return `${monthOptions[parsedDate.month - 1]} ${parsedDate.year}`;
}

function SortOrderInput({
  onChangeValue,
  value,
}: {
  onChangeValue: (value: string) => void;
  value: number;
}) {
  const [draftValue, setDraftValue] = useState(String(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDraftValue(String(value));
    }
  }, [isFocused, value]);

  function handleChangeText(nextValue: string) {
    const numericValue = nextValue.replace(/\D/g, '');

    setDraftValue(numericValue);
    onChangeValue(numericValue);
  }

  function handleBlur() {
    setIsFocused(false);
    setDraftValue(String(value));
  }

  return (
    <TextInput
      keyboardType="number-pad"
      onBlur={handleBlur}
      onChangeText={handleChangeText}
      onFocus={() => setIsFocused(true)}
      placeholder="0"
      placeholderTextColor={colors.textSecondary}
      style={[styles.input, styles.sortOrderInput]}
      value={draftValue}
    />
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    letterSpacing: 0,
    marginBottom: 8,
    ...typography.sectionTitle,
  },
  listSection: {
    marginBottom: 10,
  },
  listItem: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
  },
  compactRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    minHeight: 44,
    paddingVertical: 8,
  },
  itemName: {
    color: colors.textPrimary,
    flex: 1,
    letterSpacing: 0,
    ...typography.body,
  },
  badgesRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  sortBadge: {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  badgeText: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.caption,
  },
  expandChevron: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.caption,
  },
  expandedContent: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: 8,
    paddingBottom: 10,
    paddingTop: 10,
  },
  editFieldsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.textPrimary,
    letterSpacing: 0,
    minHeight: 44,
    paddingHorizontal: 12,
    ...typography.inputCompact,
  },
  nameInput: {
    flex: 1,
    minWidth: 140,
  },
  sortOrderInput: {
    maxWidth: 92,
    textAlign: 'center',
  },
  createToggle: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: 14,
  },
  createToggleOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  createToggleText: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.body,
  },
  createToggleIcon: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.cardTitle,
  },
  createForm: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  createRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  createInput: {
    flex: 1,
    minWidth: 140,
  },
  selectorButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 156,
    paddingHorizontal: 12,
  },
  selectorButtonActive: {
    borderColor: colors.accent,
  },
  selectorLabel: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.bodySmall,
  },
  selectorText: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.button,
  },
  monthSelectorButton: {
    minWidth: 142,
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
    maxWidth: 380,
    padding: 16,
    width: '100%',
  },
  modalTitle: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.cardTitle,
  },
  modalOption: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  modalOptionTitle: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.body,
  },
  modalOptionDescription: {
    color: colors.textSecondary,
    letterSpacing: 0,
    marginTop: 3,
    ...typography.bodySmall,
  },
  yearSelector: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  yearButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  yearButtonText: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.screenTitle,
  },
  yearText: {
    color: colors.textPrimary,
    letterSpacing: 0,
    minWidth: 72,
    textAlign: 'center',
    ...typography.amountSmall,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    flexBasis: '23%',
    flexGrow: 1,
    minHeight: 44,
    justifyContent: 'center',
  },
  monthButtonText: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.button,
  },
});
