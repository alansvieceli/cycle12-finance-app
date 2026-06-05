import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { ActionButton } from '../common/ActionButton';
import { Category } from '../../types/finance';
import { sortCategories } from '../../lib/sorting';
import { colors } from '../../theme/colors';

type CategoryEditorProps = {
  categories: Category[];
  newCategoryName: string;
  newCategorySortOrder: string;
  onChangeCategoryName: (categoryId: string, name: string) => void;
  onChangeCategorySortOrder: (categoryId: string, sortOrder: string) => void;
  onChangeNewCategoryName: (name: string) => void;
  onChangeNewCategorySortOrder: (sortOrder: string) => void;
  onCreateCategory: () => void;
  onDeleteCategory: (categoryId: string) => void;
};

export function CategoryEditor({
  categories,
  newCategoryName,
  newCategorySortOrder,
  onChangeCategoryName,
  onChangeCategorySortOrder,
  onChangeNewCategoryName,
  onChangeNewCategorySortOrder,
  onCreateCategory,
  onDeleteCategory,
}: CategoryEditorProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Categorias</Text>
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
        <ActionButton label="Adicionar" onPress={onCreateCategory} />
      </View>

      {sortCategories(categories).map((category) => (
        <View key={category.id} style={styles.editorRow}>
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
      ))}
    </View>
  );
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
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  createRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderStrong,
    borderRadius: 8,
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
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    paddingTop: 10,
  },
  rowInput: {
    flex: 1,
  },
});
