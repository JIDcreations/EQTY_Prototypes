import React, { useMemo } from 'react';
import { StyleSheet, Switch } from 'react-native';
import AppText from '../components/AppText';
import OnboardingScreen from '../components/OnboardingScreen';
import SettingsHeader from '../components/SettingsHeader';
import SettingsRow from '../components/SettingsRow';
import SettingsStackedCard from '../components/SettingsStackedCard';
import { typography, useTheme } from '../theme';

export default function SettingsSecurityScreen({ navigation }) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);

  return (
    <OnboardingScreen
      scroll
      backgroundVariant="bg3"
      contentContainerStyle={styles.content}
    >
      <SettingsHeader
        title="Security"
        subtitle="Account protection"
        onBack={() => navigation.goBack()}
      />
      <SettingsStackedCard contentStyle={styles.cardContent}>
        <SettingsRow
          label="Two-factor authentication"
          subtitle="Extra security for your account"
          value="Off"
          right={
            <Switch
              value={false}
              disabled
              trackColor={{
                false: colors.background.surface,
                true: colors.accent.primary,
              }}
              thumbColor={colors.background.app}
            />
          }
          isLast
          disabled
        />
        <AppText style={styles.inlineHint}>Coming later</AppText>
      </SettingsStackedCard>
    </OnboardingScreen>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    content: {
      paddingBottom: components.layout.safeArea.bottom + components.layout.spacing.xl,
      gap: components.layout.contentGap,
    },
    cardContent: {
      gap: components.layout.cardGap,
    },
    inlineHint: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  });
