import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../../components/AppText';
import OnboardingScreen from '../../components/OnboardingScreen';
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
        <View style={styles.card}>
          <AppText style={styles.title}>You are all set</AppText>
          <AppText style={styles.text}>Your answers are saved in your profile.</AppText>
          <AppText style={styles.text}>You can edit them later.</AppText>
          <AppText style={styles.text}>
            They are used to adapt explanations and examples.
          </AppText>
        </View>
        <PrimaryButton label="Go to EQTY" onPress={handleFinish} />
      </View>
    </OnboardingScreen>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      gap: spacing.xl,
    },
    card: {
      backgroundColor: colors.surfaceActive,
      borderRadius: 18,
      padding: spacing.lg,
      gap: spacing.sm,
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
