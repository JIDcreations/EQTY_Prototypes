import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../../components/AppText';
import OnboardingScreen from '../../components/OnboardingScreen';
import OnboardingStackedCard from '../../components/OnboardingStackedCard';
import { PrimaryButton } from '../../components/Button';
import { spacing, typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { getOnboardingCopy } from '../../utils/localization';

export default function OnboardingConfirmationScreen() {
  const { updatePreferences, updateAuthUser, preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);

  const handleFinish = async () => {
    await updateAuthUser({});
    await updatePreferences({ hasOnboarded: true });
  };

  return (
    <OnboardingScreen>
      <View style={styles.container}>
        <View style={styles.topArea}>
          <AppText style={styles.logo}>EQTY</AppText>
        </View>
        <OnboardingStackedCard>
          <View style={styles.cardHeader}>
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <AppText style={styles.badgeText}>{copy.confirmation.badge}</AppText>
            </View>
            <AppText style={styles.title}>{copy.confirmation.title}</AppText>
          </View>
          {copy.confirmation.lines.map((line) => (
            <AppText key={line} style={styles.text}>
              {line}
            </AppText>
          ))}
          <PrimaryButton label={copy.confirmation.button} onPress={handleFinish} />
        </OnboardingStackedCard>
      </View>
    </OnboardingScreen>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      gap: spacing.xl,
      paddingBottom: spacing.xl,
    },
    topArea: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      ...typography.styles.display,
      color: colors.text.primary,
    },
    cardHeader: {
      gap: spacing.sm,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      alignSelf: 'flex-start',
      backgroundColor: colors.background.surfaceActive,
      borderRadius: components.radius.pill,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderWidth: components.borderWidth.thin,
      borderColor: colors.ui.border,
    },
    badgeDot: {
      width: components.sizes.dot.xs,
      height: components.sizes.dot.xs,
      borderRadius: components.radius.pill,
      backgroundColor: colors.accent.primary,
    },
    badgeText: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
    },
    text: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
  });
