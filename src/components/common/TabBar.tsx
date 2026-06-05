import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '../../theme/colors';

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
    return (
      <Svg fill="none" height={20} viewBox="0 0 27 28" width={20}>
        <Path
          d="M22.3951 7.69819C22.4547 7.92171 22.5061 8.14439 22.5535 8.37064C23.5574 13.1591 20.5869 17.8243 15.8985 19.0643C13.4824 19.6989 10.9096 19.3427 8.7489 18.0748C6.54405 16.7782 4.94299 14.6573 4.30032 12.1817C3.67179 9.79687 4.04375 7.04365 5.28642 4.91829C6.60995 2.61762 8.80653 0.952087 11.3792 0.298636C13.9636 -0.34444 16.701 0.0601604 18.997 1.4246C19.1898 1.54079 19.3809 1.65976 19.5703 1.78148C19.6687 1.68059 19.7825 1.56233 19.8876 1.46889C19.9808 1.70147 20.073 2.09656 20.1506 2.35659C20.3681 3.07995 20.5743 3.80666 20.7689 4.53646C20.5973 4.46818 20.1287 4.36411 19.9316 4.31621L18.6813 4.00017C18.3926 3.92967 17.9513 3.83544 17.6831 3.74284C17.7803 3.64029 17.8794 3.5331 17.979 3.43354C16.0507 2.21234 14.0516 1.72624 11.7866 2.19431C9.76318 2.61895 7.87657 3.91931 6.7568 5.65204C5.51857 7.57643 5.11197 9.86842 5.64904 12.1001C6.75478 16.6938 11.4702 19.4741 16.0211 18.3017C18.4907 17.6655 20.4553 16.0567 21.6046 13.7883C22.4896 12.0415 22.7991 9.83197 22.3406 7.91498C22.3235 7.84325 22.3057 7.77169 22.287 7.70032C22.2649 7.61815 22.134 7.18906 22.1722 7.13492C22.2799 7.24846 22.3514 7.54374 22.3951 7.69819Z"
          fill={color}
        />
      </Svg>
    );
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
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: 3,
    textAlign: 'center',
  },
  tabButtonTextActive: {
    color: colors.accentText,
  },
});
