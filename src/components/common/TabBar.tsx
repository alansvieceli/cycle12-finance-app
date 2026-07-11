import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export type TabItem<T extends string> = {
  id: T;
  icon: TabIconName;
  label: string;
};

type TabIconName = 'accounts' | 'adjustments' | 'charts' | 'planning' | 'summary';

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
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => onChangeTab(tab.id)}
            style={[
              styles.tabButton,
              activeTab === tab.id ? styles.tabButtonActive : null,
            ]}
          >
            <TabIcon
              color={activeTab === tab.id ? colors.accentText : colors.textSecondary}
              name={tab.icon}
            />
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
      </View>
    </View>
  );
}

function TabIcon({ color, name }: { color: string; name: TabIconName }) {
  if (name === 'summary') {
    return (
      <Svg fill="none" height={20} viewBox="0 0 22 22" width={20}>
        <Path
          d="M1 11L11 1L21 11M4 11V21H18V11"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        />
      </Svg>
    );
  }

  if (name === 'charts') {
    return (
      <Svg fill="none" height={20} viewBox="0 0 21 24" width={20}>
        <Path
          d="M3 14H2C0.89543 14 0 14.8954 0 16V22C0 23.1046 0.89543 24 2 24H3C4.10457 24 5 23.1046 5 22V16C5 14.8954 4.10457 14 3 14Z"
          fill={color}
        />
        <Path
          d="M11 7H10C8.89543 7 8 7.89543 8 9V22C8 23.1046 8.89543 24 10 24H11C12.1046 24 13 23.1046 13 22V9C13 7.89543 12.1046 7 11 7Z"
          fill={color}
        />
        <Path
          d="M19 0H18C16.8954 0 16 0.89543 16 2V22C16 23.1046 16.8954 24 18 24H19C20.1046 24 21 23.1046 21 22V2C21 0.89543 20.1046 0 19 0Z"
          fill={color}
        />
      </Svg>
    );
  }

  if (name === 'planning') {
    return <Ionicons color={color} name="calendar-outline" size={20} />;
  }

  if (name === 'accounts') {
    return (
      <Svg fill="none" height={20} viewBox="0 0 22 16" width={20}>
        <Path
          d="M18 1H4C2.34315 1 1 2.34315 1 4V12C1 13.6569 2.34315 15 4 15H18C19.6569 15 21 13.6569 21 12V4C21 2.34315 19.6569 1 18 1Z"
          stroke={color}
          strokeWidth={2}
        />
        <Path d="M4 6H18" stroke={color} strokeWidth={2} />
      </Svg>
    );
  }

  return (
    <Svg fill="none" height={20} viewBox="0 0 24 24" width={20}>
      <Path
        d="M9.24995 22L8.84995 18.8C8.63329 18.7167 8.42928 18.6167 8.23795 18.5C8.04662 18.3833 7.85895 18.2583 7.67495 18.125L4.69995 19.375L1.94995 14.625L4.52495 12.675C4.50828 12.5583 4.49995 12.446 4.49995 12.338V11.663C4.49995 11.5543 4.50828 11.4417 4.52495 11.325L1.94995 9.375L4.69995 4.625L7.67495 5.875C7.85828 5.74167 8.04995 5.61667 8.24995 5.5C8.44995 5.38333 8.64995 5.28333 8.84995 5.2L9.24995 2H14.75L15.15 5.2C15.3666 5.28333 15.571 5.38333 15.763 5.5C15.955 5.61667 16.1423 5.74167 16.325 5.875L19.2999 4.625L22.0499 9.375L19.475 11.325C19.4916 11.4417 19.5 11.5543 19.5 11.663V12.337C19.5 12.4457 19.4833 12.5583 19.45 12.675L22.025 14.625L19.275 19.375L16.325 18.125C16.1416 18.2583 15.95 18.3833 15.75 18.5C15.55 18.6167 15.35 18.7167 15.15 18.8L14.75 22H9.24995ZM12.05 15.5C13.0166 15.5 13.8416 15.1583 14.525 14.475C15.2083 13.7917 15.55 12.9667 15.55 12C15.55 11.0333 15.2083 10.2083 14.525 9.525C13.8416 8.84167 13.0166 8.5 12.05 8.5C11.0666 8.5 10.2373 8.84167 9.56195 9.525C8.88662 10.2083 8.54928 11.0333 8.54995 12C8.55062 12.9667 8.88828 13.7917 9.56295 14.475C10.2376 15.1583 11.0666 15.5 12.05 15.5Z"
        fill={color}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderWidth: 1,
    marginHorizontal: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  tabBar: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 7,
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 4,
  },
  tabButtonActive: {
    backgroundColor: colors.accent,
  },
  tabButtonText: {
    color: colors.textSecondary,
    letterSpacing: 0,
    marginTop: 3,
    textAlign: 'center',
    ...typography.tab,
  },
  tabButtonTextActive: {
    color: colors.accentText,
  },
});
