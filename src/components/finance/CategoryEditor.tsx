import { StyleSheet, Text, TextInput, View } from 'react-native';

import { ActionButton } from '../common/ActionButton';
import { Category } from '../../types/finance';

type CategoryEditorProps = {
  categories: Category[];
  newCategoryName: string;
  onChangeCategoryName: (categoryId: string, name: string) => void;
  onChangeNewCategoryName: (name: string) => void;
  onCreateCategory: () => void;
  onDeleteCategory: (categoryId: string) => void;
};

export function CategoryEditor({
  categories,
  newCategoryName,
  onChangeCategoryName,
  onChangeNewCategoryName,
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
          style={[styles.input, styles.createInput]}
          value={newCategoryName}
        />
        <ActionButton label="Adicionar" onPress={onCreateCategory} />
      </View>

      {categories
        .slice()
        .sort(
          (firstCategory, secondCategory) =>
            firstCategory.sortOrder - secondCategory.sortOrder,
        )
        .map((category) => (
          <View key={category.id} style={styles.editorRow}>
            <TextInput
              onChangeText={(name) => onChangeCategoryName(category.id, name)}
              style={[styles.input, styles.rowInput]}
              value={category.name}
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

const styles = StyleSheet.create({
  panel: {
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
  createRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
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
});
