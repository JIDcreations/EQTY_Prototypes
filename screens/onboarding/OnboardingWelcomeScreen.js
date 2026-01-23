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
    <OnboardingScreen
      gradientColors={[colors.background, colors.surfaceActive]}
      showGlow={false}
    >
      <OnboardingGesture onContinue={() => navigation.navigate('OnboardingPositioning')}>
        <View style={styles.container}>
          <View pointerEvents="none" style={styles.accentOrbTop} />
          <View pointerEvents="none" style={styles.accentOrbBottom} />
          <View style={styles.logoWrap}>
            <AppText style={styles.logo}>EQTY</AppText>
          </View>
          <View style={styles.copyBlock}>
            <AppText style={styles.title}>Welcome to EQTY</AppText>
            <AppText style={styles.subtitle}>
              A calm space to understand investing, shaped around your pace and goals.
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
      justifyContent: 'flex-start',
      paddingBottom: spacing.xl,
    },
    logoWrap: {
      marginTop: spacing.xxl,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    logo: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: 64,
      color: colors.textPrimary,
      letterSpacing: 8,
      textShadowColor: 'rgba(255, 213, 0, 0.2)',
      textShadowOffset: { width: 0, height: 8 },
      textShadowRadius: 18,
    },
    copyBlock: {
      marginTop: 'auto',
      transform: [{ translateY: -190 }],
      alignSelf: 'center',
      width: '100%',
      maxWidth: 320,
      gap: spacing.sm,
    },
    title: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: 26,
      color: colors.textPrimary,
      lineHeight: 32,
      textAlign: 'left',
    },
    subtitle: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
      textAlign: 'left',
    },
    tapHint: {
      marginTop: spacing.xl,
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      letterSpacing: 0.4,
      textAlign: 'center',
    },
    accentOrbTop: {
      position: 'absolute',
      top: 40,
      left: -60,
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: 'rgba(30, 39, 56, 0.6)',
    },
    accentOrbBottom: {
      position: 'absolute',
      bottom: 120,
      right: -80,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: 'rgba(31, 37, 46, 0.7)',
    },
  });
