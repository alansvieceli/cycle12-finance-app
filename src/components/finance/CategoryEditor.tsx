import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ActionButton } from '../common/ActionButton';
import { Category, CategoryPropagation } from '../../types/finance';
import { sortCategories } from '../../lib/sorting';
import { colors } from '../../theme/colors';

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
  const [activePropagationSelector, setActivePropagationSelector] = useState<string>();
  const [activeMonthSelector, setActiveMonthSelector] = useState<string>();

  function closeSelectors() {
    setActivePropagationSelector(undefined);
    setActiveMonthSelector(undefined);
  }

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Categorias</Text>
      <View style={styles.createSection}>
        <Text style={styles.subsectionTitle}>Adicionar categoria</Text>
        <View style={styles.createRow}>
          <TextInput
            onChangeText={onChangeNewCategoryName}
            placeholder="Nova categoria"
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
          <ActionButton label="Adicionar" onPress={onCreateCategory} />
        </View>
      </View>

      <View style={styles.listSection}>
        <Text style={styles.subsectionTitle}>Categorias cadastradas</Text>
        {sortCategories(categories).map((category) => (
          <View key={category.id} style={styles.editorRow}>
            <View style={styles.editorMainRow}>
              <TextInput
                onChangeText={(name) => onChangeCategoryName(category.id, name)}
                style={[styles.input, styles.rowInput]}
                value={category.name}
              />
              <SortOrderInput
                onChangeValue={(sortOrder) =>
                  onChangeCategorySortOrder(category.id, sortOrder)
                }
                value={category.sortOrder}
              />
              <ActionButton
                label="Excluir"
                onPress={() => onDeleteCategory(category.id)}
                variant="danger"
              />
            </View>
            <View style={styles.propagationRow}>
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
          </View>
        ))}
      </View>
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
          <ActionButton label="Cancelar" onPress={onClose} variant="danger" />
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
          <ActionButton label="Cancelar" onPress={onClose} variant="danger" />
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
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  subsectionTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  createSection: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: 10,
    marginTop: 14,
    paddingBottom: 14,
  },
  listSection: {
    gap: 10,
    marginTop: 14,
  },
  createRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  createInput: {
    flex: 1,
    minWidth: 160,
  },
  sortOrderInput: {
    maxWidth: 92,
    textAlign: 'center',
  },
  editorRow: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: 8,
    paddingTop: 10,
  },
  editorMainRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  rowInput: {
    flex: 1,
    minWidth: 160,
  },
  propagationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectorButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 46,
    minWidth: 156,
    paddingHorizontal: 12,
  },
  selectorButtonActive: {
    borderColor: colors.accent,
  },
  selectorLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
  },
  selectorText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
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
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0,
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
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
  },
  modalOptionDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 17,
    marginTop: 3,
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
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  yearButtonText: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  yearText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
    minWidth: 72,
    textAlign: 'center',
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
    minHeight: 42,
    justifyContent: 'center',
  },
  monthButtonText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
});
