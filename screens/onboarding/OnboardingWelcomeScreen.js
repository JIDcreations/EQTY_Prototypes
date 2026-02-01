import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../../components/AppText';
import OnboardingGesture from '../../components/OnboardingGesture';
import OnboardingScreen from '../../components/OnboardingScreen';
import { typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { getOnboardingCopy } from '../../utils/localization';

export default function OnboardingWelcomeScreen({ navigation }) {
  const { preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);

  return (
    <OnboardingScreen
      gradientColors={[colors.background.app, colors.background.surfaceActive]}
      showGlow={false}
    >
      <OnboardingGesture onContinue={() => navigation.navigate('OnboardingLanguage')}>
        <View style={styles.container}>
          <View pointerEvents="none" style={styles.accentOrbTop} />
          <View pointerEvents="none" style={styles.accentOrbBottom} />
          <View style={styles.logoWrap}>
            <AppText style={styles.logo}>EQTY</AppText>
          </View>
          <View style={styles.copyBlock}>
            <AppText style={styles.title}>{copy.welcome.title}</AppText>
            <AppText style={styles.subtitle}>{copy.welcome.subtitle}</AppText>
          </View>
          <AppText style={styles.tapHint}>{copy.welcome.tapHint}</AppText>
        </View>
      </OnboardingGesture>
    </OnboardingScreen>
  );
}

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const createStyles = (colors, components) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      paddingBottom: components.layout.spacing.xl,
    },
    logoWrap: {
      marginTop: components.layout.spacing.xxl,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    logo: {
      ...typography.styles.display,
      color: colors.text.primary,
    },
    copyBlock: {
      marginTop: 'auto',
      transform: [{ translateY: components.offsets.translate.lg }],
      width: '100%',
      gap: components.layout.spacing.sm,
    },
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
      textAlign: 'left',
    },
    subtitle: {
      ...typography.styles.body,
      color: colors.text.secondary,
      textAlign: 'left',
    },
    tapHint: {
      marginTop: components.layout.spacing.xl,
      ...typography.styles.small,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    accentOrbTop: {
      position: 'absolute',
      top: components.offsets.onboarding.orbTopSm,
      left: components.offsets.onboarding.orbLeftSm,
      width: components.sizes.illustration.sm,
      height: components.sizes.illustration.sm,
      borderRadius: components.radius.pill,
      backgroundColor: toRgba(colors.background.surfaceActive, 0.6),
    },
    accentOrbBottom: {
      position: 'absolute',
      bottom: components.offsets.onboarding.orbBottomLg,
      right: components.offsets.onboarding.orbRightSm,
      width: components.sizes.illustration.lg,
      height: components.sizes.illustration.lg,
      borderRadius: components.radius.pill,
      backgroundColor: toRgba(colors.background.surface, 0.7),
    },
  });
