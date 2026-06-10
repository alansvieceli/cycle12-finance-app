import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';

import { colors } from '../../theme/colors';
import { panelStyles } from '../../theme/sharedStyles';
import { typography } from '../../theme/typography';

type ChartPanelProps = {
  children: ReactNode;
  emptyText: string;
  hasData: boolean;
  title: string;
  totalAmountStyle?: StyleProp<TextStyle>;
  totalLabel: string;
  totalText: string;
};

export function ChartPanel({
  children,
  emptyText,
  hasData,
  title,
  totalAmountStyle,
  totalLabel,
  totalText,
}: ChartPanelProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {hasData ? (
        <>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>{totalLabel}</Text>
            <Text style={[styles.totalAmount, totalAmountStyle]}>{totalText}</Text>
          </View>
          {children}
        </>
      ) : (
        <Text style={styles.emptyText}>{emptyText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ...panelStyles,
  totalBox: {
    marginTop: 14,
    minHeight: 64,
  },
  totalLabel: {
    color: colors.textSecondary,
    letterSpacing: 0,
    ...typography.bodySmall,
  },
  totalAmount: {
    color: colors.textPrimary,
    letterSpacing: 0,
    marginTop: 8,
    ...typography.amountMedium,
  },
});
