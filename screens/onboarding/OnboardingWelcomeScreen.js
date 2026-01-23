import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../../components/AppText';
import OnboardingGesture from '../../components/OnboardingGesture';
import OnboardingScreen from '../../components/OnboardingScreen';
import useThemeColors from '../../theme/useTheme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function OnboardingWelcomeScreen({ navigation }) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <OnboardingScreen variant="accent">
      <OnboardingGesture onContinue={() => navigation.navigate('OnboardingPositioning')}>
        <View style={styles.container}>
          <AppText style={styles.kicker}>Welcome to EQTY</AppText>
          <View style={styles.logoWrap}>
            <AppText style={styles.logo}>EQTY</AppText>
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
    kicker: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    logoWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: 48,
      color: colors.textPrimary,
      letterSpacing: 6,
    },
    tapHint: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      letterSpacing: 0.4,
    },
  });
