import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../../components/AppText';
import OnboardingGesture from '../../components/OnboardingGesture';
import OnboardingProgress from '../../components/OnboardingProgress';
import OnboardingScreen from '../../components/OnboardingScreen';
import OnboardingStackedCard from '../../components/OnboardingStackedCard';
import { typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { getOnboardingCopy } from '../../utils/localization';

export default function OnboardingAIDisclaimerScreen({ navigation }) {
  const { preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);

  return (
    <OnboardingScreen
      gradientColors={[colors.background.app, colors.background.surfaceActive]}
      showGlow={false}
    >
      <OnboardingGesture onContinue={() => navigation.navigate('OnboardingEntry')}>
        <View style={styles.container}>
          <View pointerEvents="none" style={styles.accentOrbTop} />
          <View pointerEvents="none" style={styles.accentOrbBottom} />
          <View style={styles.header}>
            <OnboardingProgress current={3} total={3} label={copy.ai.stepLabel} />
          </View>
          <View style={styles.content}>
            <OnboardingStackedCard>
              <View style={styles.cardHeader}>
                <View style={styles.badge}>
                  <View style={styles.badgeDot} />
                  <AppText style={styles.badgeText}>{copy.ai.badge}</AppText>
                </View>
                <AppText style={styles.title}>{copy.ai.title}</AppText>
              </View>
              <AppText style={styles.subtitle}>{copy.ai.subtitle}</AppText>
              <AppText style={styles.tapHint}>{copy.ai.tapHint}</AppText>
            </OnboardingStackedCard>
          </View>
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
      paddingBottom: components.layout.spacing.xl,
      paddingTop: components.layout.spacing.xl,
    },
    header: {
      paddingBottom: components.layout.spacing.xl,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      transform: [{ translateY: components.offsets.translate.sm }],
    },
    cardHeader: {
      gap: components.layout.spacing.sm,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.xs,
      alignSelf: 'flex-start',
      backgroundColor: colors.background.surfaceActive,
      borderRadius: components.radius.pill,
      paddingHorizontal: components.layout.spacing.sm,
      paddingVertical: components.layout.spacing.xs,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.border, colors.opacity.stroke),
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
    subtitle: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    tapHint: {
      ...typography.styles.small,
      color: colors.text.secondary,
      textAlign: 'right',
    },
    accentOrbTop: {
      position: 'absolute',
      top: components.offsets.onboarding.orbTopMd,
      right: components.offsets.onboarding.orbRightMd,
      width: components.sizes.illustration.smAlt,
      height: components.sizes.illustration.smAlt,
      borderRadius: components.radius.pill,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
    },
    accentOrbBottom: {
      position: 'absolute',
      bottom: components.offsets.onboarding.orbBottomMd,
      left: components.offsets.onboarding.orbLeftLg,
      width: components.sizes.illustration.xl,
      height: components.sizes.illustration.xl,
      borderRadius: components.radius.pill,
      backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint),
    },
  });
