import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import OnboardingScreen from '../components/OnboardingScreen';
import OnboardingStackedCard from '../components/OnboardingStackedCard';
import AppText from '../components/AppText';
import { PrimaryButton } from '../components/Button';
import useThemeColors from '../theme/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../utils/AppContext';
import { getLessonContent, getLessonStepCopy } from '../utils/localization';

export default function LessonSuccessScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { lessonId } = route.params || {};
  const { preferences } = useApp();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
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
      gradientColors={[colors.background, colors.surfaceActive]}
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

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: spacing.xl,
      paddingTop: spacing.xl,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      transform: [{ translateY: -10 }],
    },
    cardHeader: {
      gap: spacing.sm,
    },
    title: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: 28,
      color: colors.textPrimary,
      lineHeight: 36,
    },
    subtitle: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    detail: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    footer: {
      paddingTop: spacing.lg,
    },
    accentOrbTop: {
      position: 'absolute',
      top: 60,
      left: -80,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: 'rgba(31, 39, 56, 0.6)',
    },
    accentOrbBottom: {
      position: 'absolute',
      bottom: 80,
      right: -90,
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor: 'rgba(255, 213, 0, 0.08)',
    },
  });
