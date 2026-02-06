import React, { useMemo } from 'react';
import { Alert, StyleSheet } from 'react-native';
import OnboardingScreen from '../components/OnboardingScreen';
import SettingsStackedCard from '../components/SettingsStackedCard';
import SettingsHeader from '../components/SettingsHeader';
import SettingsRow from '../components/SettingsRow';
import { PrimaryButton } from '../components/Button';
import { useTheme } from '../theme';
import { useApp } from '../utils/AppContext';

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
  const { components } = useTheme();
  const styles = useMemo(() => createStyles(components), [components]);

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
      <SettingsStackedCard contentStyle={styles.cardContent}>
        {SETTINGS_CATEGORIES.map((item, index) => (
          <SettingsRow
            key={item.key}
            label={item.label}
            subtitle={item.subtitle}
            onPress={() => navigation.navigate(item.route)}
            isLast={index === SETTINGS_CATEGORIES.length - 1}
          />
        ))}
      </SettingsStackedCard>
      <PrimaryButton label="Log out" onPress={handleLogOut} style={styles.logoutButton} />
    </OnboardingScreen>
  );
}

const createStyles = (components) =>
  StyleSheet.create({
    content: {
      paddingBottom: components.layout.safeArea.bottom + components.layout.spacing.xl,
      gap: components.layout.contentGap,
    },
    cardContent: {
      gap: components.layout.cardGap,
    },
    logoutButton: {
      marginTop: components.layout.spacing.sm,
    },
  });
