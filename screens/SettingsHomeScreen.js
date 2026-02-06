import React, { useMemo } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import OnboardingScreen from '../components/OnboardingScreen';
import SettingsHeader from '../components/SettingsHeader';
import SettingsRow from '../components/SettingsRow';
import { PrimaryButton } from '../components/Button';
import { useTheme } from '../theme';
import { useApp } from '../utils/AppContext';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const SETTINGS_CATEGORIES = [
  {
    key: 'account',
    label: 'Account',
    subtitle: 'Username, email, reset password',
    route: 'SettingsAccount',
  },
  {
    key: 'security',
    label: 'Security',
    subtitle: 'Two-factor authentication (coming later)',
    route: 'SettingsSecurity',
  },
  {
    key: 'personal',
    label: 'Personal context (AI)',
    subtitle: 'Onboarding answers and AI context',
    route: 'SettingsPersonalContext',
  },
  {
    key: 'preferences',
    label: 'Preferences',
    subtitle: 'Language, appearance',
    route: 'SettingsPreferences',
  },
  {
    key: 'accessibility',
    label: 'Accessibility',
    subtitle: 'Text size and preview',
    route: 'SettingsAccessibility',
  },
  {
    key: 'support',
    label: 'Help & support',
    subtitle: 'Help center, contact support, FAQ',
    route: 'SettingsSupport',
  },
];

export default function SettingsHomeScreen({ navigation }) {
  const { logOut } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);

  const handleLogOut = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await logOut();
        },
      },
    ]);
  };

  return (
    <OnboardingScreen
      scroll
      backgroundVariant="bg3"
      contentContainerStyle={styles.content}
    >
      <SettingsHeader
        title="Settings"
        subtitle="Account, preferences, and support"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.section}>
        {SETTINGS_CATEGORIES.map((item) => (
          <SettingsRow
            key={item.key}
            label={item.label}
            subtitle={item.subtitle}
            onPress={() => navigation.navigate(item.route)}
            isLast
            containerStyle={styles.rowCard}
          />
        ))}
      </View>
      <PrimaryButton label="Log out" onPress={handleLogOut} style={styles.logoutButton} />
    </OnboardingScreen>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    content: {
      paddingBottom: components.layout.safeArea.bottom + components.layout.spacing.xl,
      gap: components.layout.contentGap,
    },
    section: {
      gap: components.layout.spacing.sm,
    },
    rowCard: {
      ...components.input.container,
      backgroundColor: toRgba(colors.background.surface, components.opacity.value40),
      borderColor: toRgba(colors.ui.divider, components.opacity.value35),
    },
    logoutButton: {
      marginTop: components.layout.spacing.sm,
    },
  });
