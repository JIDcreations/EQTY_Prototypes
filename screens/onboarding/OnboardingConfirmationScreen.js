import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../../components/AppText';
import OnboardingScreen from '../../components/OnboardingScreen';
import OnboardingStackedCard from '../../components/OnboardingStackedCard';
import { PrimaryButton } from '../../components/Button';
import useThemeColors from '../../theme/useTheme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useApp } from '../../utils/AppContext';

export default function OnboardingConfirmationScreen() {
  const { updatePreferences, updateAuthUser } = useApp();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
              <AppText style={styles.badgeText}>All set</AppText>
            </View>
            <AppText style={styles.title}>You are all set</AppText>
          </View>
          <AppText style={styles.text}>Your answers are saved in your profile.</AppText>
          <AppText style={styles.text}>You can edit them later.</AppText>
          <AppText style={styles.text}>
            They are used to adapt explanations and examples.
          </AppText>
          <PrimaryButton label="Go to EQTY" onPress={handleFinish} />
        </OnboardingStackedCard>
      </View>
    </OnboardingScreen>
  );
}

const createStyles = (colors) =>
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
      fontFamily: typography.fontFamilyDemi,
      fontSize: 32,
      color: colors.textPrimary,
      letterSpacing: 6,
      textShadowColor: 'rgba(255, 213, 0, 0.2)',
      textShadowOffset: { width: 0, height: 6 },
      textShadowRadius: 14,
    },
    cardHeader: {
      gap: spacing.sm,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      alignSelf: 'flex-start',
      backgroundColor: colors.surfaceActive,
      borderRadius: 999,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: colors.surfaceActive,
    },
    badgeDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.accent,
    },
    badgeText: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: 11,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
    },
    title: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: 24,
      color: colors.textPrimary,
    },
    text: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },
  });
