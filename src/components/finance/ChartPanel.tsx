import type { ReactNode } from 'react';
import { type StyleProp, StyleSheet, Text, type TextStyle, View } from 'react-native';

import { colors } from '../../theme/colors';
import { panelStyles } from '../../theme/sharedStyles';
import { typography } from '../../theme/typography';

type ChartPanelProps = {
  children: ReactNode;
  emptyText: string;
  hasData: boolean;
  secondaryTotalAmountStyle?: StyleProp<TextStyle>;
  secondaryTotalLabel?: string;
  secondaryTotalText?: string;
  title: string;
  totalAmountStyle?: StyleProp<TextStyle>;
  totalLabel: string;
  totalText: string;
};

export function ChartPanel({
  children,
  emptyText,
  hasData,
  secondaryTotalAmountStyle,
  secondaryTotalLabel,
  secondaryTotalText,
  title,
  totalAmountStyle,
  totalLabel,
  totalText,
}: ChartPanelProps) {
  const hasSecondaryTotal = Boolean(secondaryTotalLabel && secondaryTotalText);

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {hasData ? (
        <>
          <View style={[styles.totals, hasSecondaryTotal && styles.pairedTotals]}>
            <View style={styles.totalBox}>
              <Text
                style={[
                  styles.totalLabel,
                  hasSecondaryTotal && styles.pairedTotalLabel,
                ]}
              >
                {totalLabel}
              </Text>
              <Text style={[styles.totalAmount, totalAmountStyle]}>{totalText}</Text>
            </View>
            {hasSecondaryTotal ? (
              <View style={styles.totalBox}>
                <Text style={[styles.totalLabel, styles.pairedTotalLabel]}>
                  {secondaryTotalLabel}
                </Text>
                <Text style={[styles.totalAmount, secondaryTotalAmountStyle]}>
                  {secondaryTotalText}
                </Text>
              </View>
            ) : null}
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
  totals: {
    marginTop: 14,
  },
  pairedTotals: {
    flexDirection: 'row',
    gap: 12,
  },
  totalBox: {
    flex: 1,
    minHeight: 64,
  },
  pairedTotalLabel: {
    minHeight: 36,
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
