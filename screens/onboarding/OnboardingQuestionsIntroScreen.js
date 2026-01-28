import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../../components/AppText';
import OnboardingGesture from '../../components/OnboardingGesture';
import OnboardingScreen from '../../components/OnboardingScreen';
import OnboardingStackedCard from '../../components/OnboardingStackedCard';
import useThemeColors from '../../theme/useTheme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useApp } from '../../utils/AppContext';
import { getOnboardingCopy } from '../../utils/localization';

export default function OnboardingQuestionsIntroScreen({ navigation }) {
  const { preferences } = useApp();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);

  return (
    <OnboardingScreen
      gradientColors={[colors.background, colors.surfaceActive]}
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
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      alignSelf: 'flex-start',
      backgroundColor: colors.surfaceActive,
      borderRadius: 999,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: colors.surfaceActive,
    },
    badgeDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.accent,
    },
    badgeText: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: 11,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
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
      lineHeight: 22,
    },
    tapHint: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      letterSpacing: 0.4,
      textAlign: 'right',
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
      bottom: 90,
      right: -80,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: 'rgba(255, 213, 0, 0.08)',
    },
  });
