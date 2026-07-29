import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { maskCurrency } from '../../lib/formatters';
import {
  groupSubscriptionsByTag,
  UNTAGGED_SUBSCRIPTION_GROUP,
} from '../../lib/subscriptions';
import { chartPalette, colors } from '../../theme/colors';
import { editorStyles, panelStyles } from '../../theme/sharedStyles';
import { typography } from '../../theme/typography';
import type { Subscription } from '../../types/finance';
import { ActionButton } from '../common/ActionButton';
import { EditableAmountInput } from '../common/EditableAmountInput';

type SubscriptionEditorProps = {
  newSubscriptionAmount: number;
  newSubscriptionName: string;
  newSubscriptionTag: string;
  onChangeNewSubscriptionAmount: (amount: number) => void;
  onChangeNewSubscriptionName: (name: string) => void;
  onChangeNewSubscriptionTag: (tag: string) => void;
  onChangeSubscriptionAmount: (subscriptionId: string, amount: number) => void;
  onChangeSubscriptionName: (subscriptionId: string, name: string) => void;
  onChangeSubscriptionTag: (subscriptionId: string, tag: string) => void;
  onCreateSubscription: () => void;
  onDeleteSubscription: (subscriptionId: string) => void;
  subscriptions: Subscription[];
  valuesHidden: boolean;
};

function resolveTag(subscription: Subscription): string {
  return subscription.tag?.trim() || UNTAGGED_SUBSCRIPTION_GROUP;
}

function TagChips({
  onSelect,
  tags,
  value,
}: {
  onSelect: (tag: string) => void;
  tags: string[];
  value: string;
}) {
  if (tags.length === 0) {
    return null;
  }

  const trimmedValue = value.trim();

  return (
    <View style={styles.chipRow}>
      {tags.map((tag) => {
        const isSelected = tag === trimmedValue;

        return (
          <Pressable
            key={tag}
            onPress={() => onSelect(tag)}
            style={[styles.chip, isSelected && styles.chipSelected]}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {tag}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function SubscriptionEditor({
  newSubscriptionAmount,
  newSubscriptionName,
  newSubscriptionTag,
  onChangeNewSubscriptionAmount,
  onChangeNewSubscriptionName,
  onChangeNewSubscriptionTag,
  onChangeSubscriptionAmount,
  onChangeSubscriptionName,
  onChangeSubscriptionTag,
  onCreateSubscription,
  onDeleteSubscription,
  subscriptions,
  valuesHidden,
}: SubscriptionEditorProps) {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string>();
  const [openOrder, setOpenOrder] = useState<string[]>();
  const [isCreateOpen, setIsCreateOpen] = useState(subscriptions.length === 0);

  const canCreate = newSubscriptionName.trim().length > 0 && newSubscriptionAmount > 0;

  const groups = groupSubscriptionsByTag(subscriptions);
  const groupColorByTag = new Map(
    groups.map((group, index) => [
      group.tag,
      chartPalette[index % chartPalette.length],
    ]),
  );
  const groupTotalByTag = new Map(groups.map((group) => [group.tag, group.total]));
  const distinctTags = groups
    .map((group) => group.tag)
    .filter((tag) => tag !== UNTAGGED_SUBSCRIPTION_GROUP);
  // grouped by tag total descending, subscriptions within a group by amount descending
  const byGroup = groups.flatMap((group) => group.subscriptions);
  // while a row is open its order is frozen, otherwise editing an amount or tag
  // would re-sort the list and move the row away from under the user
  const frozenIndex = (id: string) => {
    const index = openOrder?.indexOf(id) ?? -1;
    // anything added while a row is open goes last instead of jumping to the top
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };
  const sortedSubscriptions = openOrder
    ? [...subscriptions].sort((a, b) => frozenIndex(a.id) - frozenIndex(b.id))
    : byGroup;

  function toggleExpand(subscriptionId: string) {
    const isClosing = expandedSubscriptionId === subscriptionId;

    setExpandedSubscriptionId(isClosing ? undefined : subscriptionId);
    setOpenOrder(isClosing ? undefined : byGroup.map((s) => s.id));
  }

  function confirmDeleteSubscription(subscription: Subscription) {
    Alert.alert('Excluir assinatura', `Deseja excluir "${subscription.name}"?`, [
      { style: 'cancel', text: 'Cancelar' },
      {
        onPress: () => onDeleteSubscription(subscription.id),
        style: 'destructive',
        text: 'Excluir',
      },
    ]);
  }

  let previousTag: string | undefined;

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Assinaturas</Text>

      <Pressable
        onPress={() => setIsCreateOpen((previous) => !previous)}
        style={[styles.createToggle, isCreateOpen && styles.createToggleOpen]}
      >
        <Text style={styles.createToggleText}>Nova assinatura</Text>
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
              onChangeText={onChangeNewSubscriptionName}
              placeholder="Nome"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, styles.createInput]}
              value={newSubscriptionName}
            />
            <EditableAmountInput
              immediate
              onChangeValue={onChangeNewSubscriptionAmount}
              style={[styles.input, styles.amountInput]}
              value={newSubscriptionAmount}
            />
          </View>
          <TagChips
            onSelect={onChangeNewSubscriptionTag}
            tags={distinctTags}
            value={newSubscriptionTag}
          />
          <TextInput
            onChangeText={onChangeNewSubscriptionTag}
            placeholder="Grupo (opcional)"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            value={newSubscriptionTag}
          />
          <ActionButton
            disabled={!canCreate}
            label="Adicionar"
            onPress={onCreateSubscription}
          />
        </View>
      )}

      {sortedSubscriptions.length > 0 && (
        <View style={styles.listSection}>
          {sortedSubscriptions.map((subscription) => {
            const isExpanded = expandedSubscriptionId === subscription.id;
            const tag = resolveTag(subscription);
            const showHeader = tag !== previousTag;
            previousTag = tag;

            return (
              <View key={subscription.id}>
                {showHeader && (
                  <View style={styles.groupHeaderRow}>
                    <View style={styles.groupHeaderLeft}>
                      <View
                        style={[
                          styles.groupDot,
                          {
                            backgroundColor:
                              groupColorByTag.get(tag) ?? chartPalette[0],
                          },
                        ]}
                      />
                      <Text style={styles.groupHeaderText}>{tag}</Text>
                    </View>
                    <Text style={styles.groupHeaderTotal}>
                      {maskCurrency(groupTotalByTag.get(tag) ?? 0, valuesHidden)}
                    </Text>
                  </View>
                )}

                <View style={styles.listItem}>
                  <Pressable
                    onPress={() => toggleExpand(subscription.id)}
                    style={styles.compactRow}
                  >
                    <Text numberOfLines={1} style={styles.itemName}>
                      {subscription.name}
                    </Text>
                    <Text style={styles.amount}>
                      {maskCurrency(subscription.amount, valuesHidden)}
                    </Text>
                    <Ionicons
                      color={colors.textSecondary}
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                    />
                  </Pressable>

                  {isExpanded && (
                    <View style={styles.expandedContent}>
                      <View style={styles.createRow}>
                        <TextInput
                          onChangeText={(name) =>
                            onChangeSubscriptionName(subscription.id, name)
                          }
                          style={[styles.input, styles.createInput]}
                          value={subscription.name}
                        />
                        <EditableAmountInput
                          onChangeValue={(amount) =>
                            onChangeSubscriptionAmount(subscription.id, amount)
                          }
                          style={[styles.input, styles.amountInput]}
                          value={subscription.amount}
                          valuesHidden={valuesHidden}
                        />
                      </View>
                      <TagChips
                        onSelect={(newTag) =>
                          onChangeSubscriptionTag(subscription.id, newTag)
                        }
                        tags={distinctTags}
                        value={subscription.tag ?? ''}
                      />
                      <TextInput
                        onChangeText={(newTag) =>
                          onChangeSubscriptionTag(subscription.id, newTag)
                        }
                        placeholder="Grupo (opcional)"
                        placeholderTextColor={colors.textSecondary}
                        style={styles.input}
                        value={subscription.tag ?? ''}
                      />
                      <ActionButton
                        label="Excluir assinatura"
                        onPress={() => confirmDeleteSubscription(subscription)}
                        variant="ghost-danger"
                      />
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ...panelStyles,
  ...editorStyles,
  sectionTitle: {
    ...panelStyles.sectionTitle,
    marginBottom: 8,
  },
  amount: {
    color: colors.textPrimary,
    letterSpacing: 0,
    ...typography.amountSmall,
  },
  amountInput: {
    minWidth: 120,
    textAlign: 'right',
  },
  createRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.label,
  },
  chipTextSelected: {
    color: colors.accentText,
  },
  groupHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  groupHeaderLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  groupDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  groupHeaderText: {
    color: colors.textSecondary,
    letterSpacing: 0,
    textTransform: 'uppercase',
    ...typography.label,
  },
  groupHeaderTotal: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.label,
  },
});
