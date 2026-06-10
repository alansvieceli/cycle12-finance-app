import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ActionButton } from '../common/ActionButton';
import { ModalShell } from '../common/ModalShell';
import { getCategoryColor, suggestCategoryColor } from '../../lib/categoryColors';
import { Category, CategoryPropagation } from '../../types/finance';
import { sortCategories } from '../../lib/sorting';
import { chartPalette, colors } from '../../theme/colors';
import { editorStyles, panelStyles } from '../../theme/sharedStyles';
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
  newCategoryColor: string;
  newCategoryName: string;
  newCategoryInstallmentEndDate: string;
  newCategoryPropagation: string;
  newCategorySortOrder: string;
  onChangeCategoryColor: (categoryId: string, color: string) => void;
  onChangeCategoryInstallmentEndDate: (categoryId: string, value: string) => void;
  onChangeCategoryName: (categoryId: string, name: string) => void;
  onChangeCategoryPropagation: (categoryId: string, propagation: string) => void;
  onChangeCategorySortOrder: (categoryId: string, sortOrder: string) => void;
  onChangeNewCategoryColor: (color: string) => void;
  onChangeNewCategoryInstallmentEndDate: (value: string) => void;
  onChangeNewCategoryName: (name: string) => void;
  onChangeNewCategoryPropagation: (propagation: string) => void;
  onChangeNewCategorySortOrder: (sortOrder: string) => void;
  onCreateCategory: () => void;
  onDeleteCategory: (categoryId: string) => void;
};

export function CategoryEditor({
  categories,
  newCategoryColor,
  newCategoryInstallmentEndDate,
  newCategoryName,
  newCategoryPropagation,
  newCategorySortOrder,
  onChangeCategoryColor,
  onChangeCategoryInstallmentEndDate,
  onChangeCategoryName,
  onChangeCategoryPropagation,
  onChangeCategorySortOrder,
  onChangeNewCategoryColor,
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
  const [activeSortOrderSelector, setActiveSortOrderSelector] = useState<string>();

  function closeSelectors() {
    setActivePropagationSelector(undefined);
    setActiveMonthSelector(undefined);
    setActiveSortOrderSelector(undefined);
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

      <Pressable
        onPress={() => setIsCreateOpen((p) => !p)}
        style={[styles.createToggle, isCreateOpen && styles.createToggleOpen]}
      >
        <Text style={styles.createToggleText}>Nova categoria</Text>
        <Ionicons
          color={colors.textSecondary}
          name={isCreateOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
        />
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
            <SortOrderSelector
              isActive={activeSortOrderSelector === 'new'}
              label="Posição"
              onOpen={() => setActiveSortOrderSelector('new')}
              value={newCategorySortOrder || String(categories.length + 1)}
            />
          </View>
          <ColorPicker
            selectedColor={newCategoryColor || suggestCategoryColor(categories)}
            onSelectColor={onChangeNewCategoryColor}
          />
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
                  <View
                    style={[
                      styles.categoryDot,
                      { backgroundColor: getCategoryColor(category.id, categories) },
                    ]}
                  />
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
                  <Ionicons
                    color={colors.textSecondary}
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                  />
                </Pressable>

                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <View style={styles.editFieldsRow}>
                      <TextInput
                        onChangeText={(name) => onChangeCategoryName(category.id, name)}
                        style={[styles.input, styles.nameInput]}
                        value={category.name}
                      />
                      <SortOrderSelector
                        isActive={activeSortOrderSelector === category.id}
                        label="Posição"
                        onOpen={() => setActiveSortOrderSelector(category.id)}
                        value={String(category.sortOrder)}
                      />
                    </View>
                    <ColorPicker
                      selectedColor={getCategoryColor(category.id, categories)}
                      onSelectColor={(color) =>
                        onChangeCategoryColor(category.id, color)
                      }
                    />
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

      <SortOrderModal
        currentValue={
          activeSortOrderSelector === 'new'
            ? newCategorySortOrder || String(categories.length + 1)
            : String(
                categories.find((c) => c.id === activeSortOrderSelector)?.sortOrder ??
                  '',
              )
        }
        maxOrder={
          activeSortOrderSelector === 'new' ? categories.length + 1 : categories.length
        }
        onChangeValue={(value) => {
          if (!activeSortOrderSelector) return;
          if (activeSortOrderSelector === 'new') {
            onChangeNewCategorySortOrder(value);
          } else {
            onChangeCategorySortOrder(activeSortOrderSelector, value);
          }
          closeSelectors();
        }}
        onClose={closeSelectors}
        visible={Boolean(activeSortOrderSelector)}
      />
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

function ColorPicker({
  selectedColor,
  onSelectColor,
}: {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}) {
  return (
    <View style={styles.colorGrid}>
      {chartPalette.map((color) => (
        <Pressable
          key={color}
          onPress={() => onSelectColor(color)}
          style={[
            styles.colorSwatch,
            { backgroundColor: color },
            selectedColor === color && styles.colorSwatchSelected,
          ]}
        />
      ))}
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
        {currentOption.label}{' '}
        <Ionicons color={colors.textSecondary} name="chevron-down" size={13} />
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
    <ModalShell
      cardStyle={styles.pickerModalCard}
      onRequestClose={onClose}
      title="Propagação"
      visible={visible}
    >
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
    </ModalShell>
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
        {formatInstallmentEndDate(value) || 'Mês/ano'}{' '}
        <Ionicons color={colors.textSecondary} name="chevron-down" size={13} />
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
    <ModalShell
      cardStyle={styles.pickerModalCard}
      onRequestClose={onClose}
      title="Encerrar parcelas em"
      visible={visible}
    >
      <View style={styles.yearSelector}>
        <Pressable
          onPress={() => setSelectedYear((currentYear) => currentYear - 1)}
          style={styles.yearButton}
        >
          <Ionicons color={colors.textPrimary} name="chevron-back" size={20} />
        </Pressable>
        <Text style={styles.yearText}>{selectedYear}</Text>
        <Pressable
          onPress={() => setSelectedYear((currentYear) => currentYear + 1)}
          style={styles.yearButton}
        >
          <Ionicons color={colors.textPrimary} name="chevron-forward" size={20} />
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
    </ModalShell>
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

function SortOrderSelector({
  isActive,
  label,
  onOpen,
  value,
}: {
  isActive: boolean;
  label: string;
  onOpen: () => void;
  value: string;
}) {
  return (
    <Pressable
      onPress={onOpen}
      style={[
        styles.selectorButton,
        styles.sortSelectorButton,
        isActive && styles.selectorButtonActive,
      ]}
    >
      <Text style={styles.selectorText}>
        <Text style={styles.selectorLabel}>{label}: </Text>
        {value} <Ionicons color={colors.textSecondary} name="chevron-down" size={13} />
      </Text>
    </Pressable>
  );
}

function SortOrderModal({
  currentValue,
  maxOrder,
  onChangeValue,
  onClose,
  visible,
}: {
  currentValue: string;
  maxOrder: number;
  onChangeValue: (value: string) => void;
  onClose: () => void;
  visible: boolean;
}) {
  const options = Array.from({ length: maxOrder }, (_, i) => i + 1);

  return (
    <ModalShell
      cardStyle={styles.pickerModalCard}
      onRequestClose={onClose}
      title="Posição na lista"
      visible={visible}
    >
      <View style={styles.orderGrid}>
        {options.map((order) => {
          const isSelected = String(order) === currentValue;
          return (
            <Pressable
              key={order}
              onPress={() => onChangeValue(String(order))}
              style={[styles.orderButton, isSelected && styles.orderButtonSelected]}
            >
              <Text
                style={[
                  styles.orderButtonText,
                  isSelected && styles.orderButtonTextSelected,
                ]}
              >
                {order}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <ActionButton label="Cancelar" onPress={onClose} />
    </ModalShell>
  );
}

const styles = StyleSheet.create({
  ...panelStyles,
  ...editorStyles,
  sectionTitle: {
    ...panelStyles.sectionTitle,
    marginBottom: 8,
  },
  categoryDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
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
  editFieldsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorSwatch: {
    borderRadius: 14,
    height: 28,
    width: 28,
  },
  colorSwatchSelected: {
    borderColor: colors.textPrimary,
    borderWidth: 2.5,
  },
  nameInput: {
    flex: 1,
    minWidth: 140,
  },
  sortSelectorButton: {
    minWidth: 110,
  },
  orderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  orderButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 12,
    borderWidth: 1,
    flexBasis: '23%',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 44,
  },
  orderButtonSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  orderButtonText: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.button,
  },
  orderButtonTextSelected: {
    color: colors.accentText,
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
  pickerModalCard: {
    gap: 10,
    maxWidth: 380,
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
