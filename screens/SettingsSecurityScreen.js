import React, { useMemo } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import AppText from '../components/AppText';
import OnboardingScreen from '../components/OnboardingScreen';
import SettingsHeader from '../components/SettingsHeader';
import SettingsRow from '../components/SettingsRow';
import { typography, useTheme } from '../theme';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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
      <View style={styles.section}>
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
          containerStyle={styles.rowCard}
        />
        <AppText style={styles.inlineHint}>Coming later</AppText>
      </View>
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
    inlineHint: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  });
