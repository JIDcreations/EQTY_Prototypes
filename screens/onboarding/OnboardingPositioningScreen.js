import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../../components/AppText';
import OnboardingGesture from '../../components/OnboardingGesture';
import OnboardingProgress from '../../components/OnboardingProgress';
import OnboardingScreen from '../../components/OnboardingScreen';
import useThemeColors from '../../theme/useTheme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function OnboardingPositioningScreen({ navigation }) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <OnboardingScreen>
      <OnboardingGesture onContinue={() => navigation.navigate('OnboardingAIDisclaimer')}>
        <View style={styles.container}>
          <OnboardingProgress current={2} total={3} label="Step 02" />
          <View style={styles.content}>
            <AppText style={styles.title}>Build to understand investing</AppText>
            <AppText style={styles.subtitle}>
              Clear lessons, calm pacing, and context that grows with you.
            </AppText>
          </View>
          <AppText style={styles.tapHint}>Tap to continue</AppText>
        </View>
      </OnboardingGesture>
    </OnboardingScreen>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      paddingBottom: spacing.xl,
    },
    content: {
      gap: spacing.sm,
      maxWidth: 320,
    },
    title: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: 30,
      color: colors.textPrimary,
      lineHeight: 36,
    },
    subtitle: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    tapHint: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      letterSpacing: 0.4,
    },
  });
