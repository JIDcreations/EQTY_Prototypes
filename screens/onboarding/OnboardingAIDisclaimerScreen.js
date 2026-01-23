import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../../components/AppText';
import OnboardingGesture from '../../components/OnboardingGesture';
import OnboardingProgress from '../../components/OnboardingProgress';
import OnboardingScreen from '../../components/OnboardingScreen';
import useThemeColors from '../../theme/useTheme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function OnboardingAIDisclaimerScreen({ navigation }) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <OnboardingScreen>
      <OnboardingGesture onContinue={() => navigation.navigate('OnboardingEntry')}>
        <View style={styles.container}>
          <OnboardingProgress current={3} total={3} label="Step 03" />
          <View style={styles.content}>
            <AppText style={styles.title}>How AI works in EQTY</AppText>
            <AppText style={styles.subtitle}>
              AI adapts explanations and examples.
              {'\n'}No advice, no predictions.
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
