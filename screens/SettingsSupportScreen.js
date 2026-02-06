import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import OnboardingScreen from '../components/OnboardingScreen';
import SettingsStackedCard from '../components/SettingsStackedCard';
import SettingsHeader from '../components/SettingsHeader';
import SettingsRow from '../components/SettingsRow';
import { useTheme } from '../theme';

export default function SettingsSupportScreen({ navigation }) {
  const { components } = useTheme();
  const styles = useMemo(() => createStyles(components), [components]);

  return (
    <OnboardingScreen
      scroll
      backgroundVariant="bg3"
      contentContainerStyle={styles.content}
    >
      <SettingsHeader
        title="Help & support"
        subtitle="Find answers or get in touch"
        onBack={() => navigation.goBack()}
      />
      <SettingsStackedCard contentStyle={styles.cardContent}>
        <SettingsRow
          label="Help center"
          onPress={() => navigation.navigate('HelpCenter')}
        />
        <SettingsRow
          label="Contact support"
          onPress={() => navigation.navigate('ContactSupport')}
        />
        <SettingsRow
          label="FAQ"
          onPress={() => navigation.navigate('FAQ')}
          isLast
        />
      </SettingsStackedCard>
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
  });
