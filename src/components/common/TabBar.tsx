import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';

export type TabItem<T extends string> = {
  id: T;
  label: string;
};

type TabBarProps<T extends string> = {
  activeTab: T;
  onChangeTab: (tab: T) => void;
  tabs: TabItem<T>[];
};

export function TabBar<T extends string>({
  activeTab,
  onChangeTab,
  tabs,
}: TabBarProps<T>) {
  return (
    <View style={styles.tabBarContainer}>
      <ScrollView
        contentContainerStyle={styles.tabBar}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => onChangeTab(tab.id)}
            style={[
              styles.tabButton,
              activeTab === tab.id ? styles.tabButtonActive : null,
            ]}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === tab.id ? styles.tabButtonTextActive : null,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  tabBar: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 40,
    minWidth: 104,
    paddingHorizontal: 12,
  },
  tabButtonActive: {
    backgroundColor: colors.accent,
  },
  tabButtonText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    textAlign: 'center',
  },
  tabButtonTextActive: {
    color: colors.accentText,
  },
});
