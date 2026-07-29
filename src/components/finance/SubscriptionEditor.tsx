import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { maskCurrency } from '../../lib/formatters';
import { colors } from '../../theme/colors';
import { editorStyles, panelStyles } from '../../theme/sharedStyles';
import { typography } from '../../theme/typography';
import type { Subscription } from '../../types/finance';
import { ActionButton } from '../common/ActionButton';
import { EditableAmountInput } from '../common/EditableAmountInput';

type SubscriptionEditorProps = {
  newSubscriptionAmount: number;
  newSubscriptionName: string;
  onChangeNewSubscriptionAmount: (amount: number) => void;
  onChangeNewSubscriptionName: (name: string) => void;
  onChangeSubscriptionAmount: (subscriptionId: string, amount: number) => void;
  onChangeSubscriptionName: (subscriptionId: string, name: string) => void;
  onCreateSubscription: () => void;
  onDeleteSubscription: (subscriptionId: string) => void;
  subscriptions: Subscription[];
  valuesHidden: boolean;
};

export function SubscriptionEditor({
  newSubscriptionAmount,
  newSubscriptionName,
  onChangeNewSubscriptionAmount,
  onChangeNewSubscriptionName,
  onChangeSubscriptionAmount,
  onChangeSubscriptionName,
  onCreateSubscription,
  onDeleteSubscription,
  subscriptions,
  valuesHidden,
}: SubscriptionEditorProps) {
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string>();
  const [isCreateOpen, setIsCreateOpen] = useState(subscriptions.length === 0);

  const canCreate = newSubscriptionName.trim().length > 0 && newSubscriptionAmount > 0;
  // sorted by amount so the most expensive subscription is the first thing read
  const sortedSubscriptions = [...subscriptions].sort((a, b) => b.amount - a.amount);

  function toggleExpand(subscriptionId: string) {
    setExpandedSubscriptionId((previous) =>
      previous === subscriptionId ? undefined : subscriptionId,
    );
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

            return (
              <View key={subscription.id} style={styles.listItem}>
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
                    <ActionButton
                      label="Excluir assinatura"
                      onPress={() => confirmDeleteSubscription(subscription)}
                      variant="ghost-danger"
                    />
                  </View>
                )}
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
});
