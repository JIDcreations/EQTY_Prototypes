import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../../components/AppText';
import OnboardingGesture from '../../components/OnboardingGesture';
import OnboardingScreen from '../../components/OnboardingScreen';
import OnboardingStackedCard from '../../components/OnboardingStackedCard';
import { spacing, typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { getOnboardingCopy } from '../../utils/localization';

export default function OnboardingQuestionsIntroScreen({ navigation }) {
  const { preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);

  return (
    <OnboardingScreen
      gradientColors={[colors.background.app, colors.background.surfaceActive]}
      showGlow={false}
    >
      <OnboardingGesture onContinue={() => navigation.navigate('OnboardingQuestionExperience')}>
        <View style={styles.container}>
          <View pointerEvents="none" style={styles.accentOrbTop} />
          <View pointerEvents="none" style={styles.accentOrbBottom} />
          <View style={styles.content}>
            <OnboardingStackedCard>
              <View style={styles.cardHeader}>
                <View style={styles.badge}>
                  <View style={styles.badgeDot} />
                  <AppText style={styles.badgeText}>{copy.questionsIntro.badge}</AppText>
                </View>
                <AppText style={styles.title}>{copy.questionsIntro.title}</AppText>
              </View>
              <AppText style={styles.subtitle}>{copy.questionsIntro.subtitle}</AppText>
              <AppText style={styles.tapHint}>{copy.questionsIntro.tapHint}</AppText>
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
      paddingBottom: spacing.xl,
      paddingTop: spacing.xl,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      transform: [{ translateY: components.offsets.translate.sm }],
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
      left: components.offsets.onboarding.orbLeftLg,
      width: components.sizes.illustration.md,
      height: components.sizes.illustration.md,
      borderRadius: components.radius.pill,
      backgroundColor: toRgba(colors.background.surface, 0.6),
    },
    accentOrbBottom: {
      position: 'absolute',
      bottom: components.offsets.onboarding.orbBottomMd,
      right: components.offsets.onboarding.orbRightSm,
      width: components.sizes.illustration.lg,
      height: components.sizes.illustration.lg,
      borderRadius: components.radius.pill,
      backgroundColor: toRgba(colors.accent.primary, 0.08),
    },
  });
