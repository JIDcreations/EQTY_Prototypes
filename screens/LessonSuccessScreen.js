import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import OnboardingScreen from '../components/OnboardingScreen';
import OnboardingStackedCard from '../components/OnboardingStackedCard';
import AppText from '../components/AppText';
import { PrimaryButton } from '../components/Button';
import { spacing, typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getLessonContent, getLessonStepCopy } from '../utils/localization';

export default function LessonSuccessScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { lessonId } = route.params || {};
  const { preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const copy = useMemo(() => getLessonStepCopy(preferences?.language), [preferences?.language]);
  const content = getLessonContent(lessonId, preferences?.language);
  const lessonTitle = content?.title || copy.lessonSuccess.fallbackTitle;
  const subtitle = copy.lessonSuccess.subtitle
    ? copy.lessonSuccess.subtitle(lessonTitle)
    : '';
  const detail =
    lessonId === 'lesson_0' ? copy.lessonSuccess.introDetail : copy.lessonSuccess.detail;

  return (
    <OnboardingScreen
      gradientColors={[colors.background.app, colors.background.surfaceActive]}
      showGlow={false}
    >
      <View style={styles.container}>
        <View pointerEvents="none" style={styles.accentOrbTop} />
        <View pointerEvents="none" style={styles.accentOrbBottom} />
        <View style={styles.content}>
          <OnboardingStackedCard>
            <View style={styles.cardHeader}>
              <AppText style={styles.title}>{copy.lessonSuccess.title}</AppText>
            </View>
            <AppText style={styles.subtitle}>{subtitle}</AppText>
            <AppText style={styles.detail}>{detail}</AppText>
          </OnboardingStackedCard>
        </View>
        <View style={styles.footer}>
          <PrimaryButton
            label={copy.lessonSuccess.cta}
            onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
          />
        </View>
      </View>
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
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
    },
    subtitle: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    detail: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    footer: {
      paddingTop: spacing.lg,
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
      bottom: components.offsets.onboarding.orbBottomSm,
      right: components.offsets.onboarding.orbRightLg,
      width: components.sizes.illustration.xxl,
      height: components.sizes.illustration.xxl,
      borderRadius: components.radius.pill,
      backgroundColor: toRgba(colors.accent.primary, 0.08),
    },
  });
