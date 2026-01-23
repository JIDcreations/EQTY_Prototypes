import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../../components/AppText';
import OnboardingScreen from '../../components/OnboardingScreen';
import { PrimaryButton } from '../../components/Button';
import useThemeColors from '../../theme/useTheme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function OnboardingQuestionsIntroScreen({ navigation }) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <OnboardingScreen scroll contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <AppText style={styles.badgeText}>Personal context</AppText>
          </View>
          <View style={styles.heroText}>
            <AppText style={styles.title}>Personalize your path</AppText>
            <AppText style={styles.subtitle}>
              You will answer 3 questions.
              {'\n'}We use them to adapt explanations and examples.
            </AppText>
          </View>
        </View>

        <View style={styles.stack}>
          <View style={styles.cardGhostOne} />
          <View style={styles.cardGhostTwo} />
          <View style={styles.cardMain}>
            <View style={styles.cardHeader}>
              <AppText style={styles.cardTitle}>Your story in three beats</AppText>
              <AppText style={styles.cardSubtitle}>Short, honest, and easy.</AppText>
            </View>
            <View style={styles.cardList}>
              <View style={styles.cardRow}>
                <View style={styles.cardBullet} />
                <AppText style={styles.cardText}>Your current experience.</AppText>
              </View>
              <View style={styles.cardRow}>
                <View style={styles.cardBullet} />
                <AppText style={styles.cardText}>What you already understand.</AppText>
              </View>
              <View style={styles.cardRow}>
                <View style={styles.cardBullet} />
                <AppText style={styles.cardText}>Why you want to start now.</AppText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.notePill}>
            <AppText style={styles.noteText}>Editable later in Profile.</AppText>
          </View>
          <PrimaryButton
            label="Start"
            onPress={() => navigation.navigate('OnboardingQuestionExperience')}
          />
        </View>
      </View>
    </OnboardingScreen>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    scrollContent: {
      minHeight: '100%',
      paddingBottom: spacing.xl,
    },
    container: {
      flex: 1,
      justifyContent: 'space-between',
      gap: spacing.xl,
      paddingBottom: spacing.xl,
    },
    hero: {
      gap: spacing.md,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      alignSelf: 'flex-start',
      backgroundColor: colors.surface,
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
    heroText: {
      flex: 1,
      gap: spacing.sm,
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
    stack: {
      position: 'relative',
      minHeight: 220,
      justifyContent: 'flex-end',
    },
    cardGhostOne: {
      position: 'absolute',
      top: 8,
      left: 12,
      right: 12,
      height: 160,
      borderRadius: 22,
      backgroundColor: colors.surfaceActive,
      opacity: 0.6,
      transform: [{ rotate: '-1deg' }],
    },
    cardGhostTwo: {
      position: 'absolute',
      top: 20,
      left: 20,
      right: 20,
      height: 160,
      borderRadius: 22,
      backgroundColor: colors.surfaceActive,
      opacity: 0.35,
      transform: [{ rotate: '1.5deg' }],
    },
    cardMain: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: spacing.lg,
      gap: spacing.md,
      borderWidth: 1,
      borderColor: colors.surfaceActive,
      shadowColor: '#000',
      shadowOpacity: 0.22,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6,
    },
    cardHeader: {
      gap: 4,
    },
    cardTitle: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: typography.h2,
      color: colors.textPrimary,
    },
    cardSubtitle: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
    },
    cardList: {
      gap: spacing.sm,
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    cardBullet: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.accent,
    },
    cardText: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
      color: colors.textPrimary,
    },
    footer: {
      gap: spacing.md,
    },
    notePill: {
      alignSelf: 'flex-start',
      backgroundColor: colors.surfaceActive,
      paddingHorizontal: spacing.md,
      paddingVertical: 6,
      borderRadius: 999,
    },
    noteText: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
    },
  });
