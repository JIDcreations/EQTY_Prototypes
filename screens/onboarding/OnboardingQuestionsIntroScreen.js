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
    <OnboardingScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <AppText style={styles.title}>Personalize your path</AppText>
          <AppText style={styles.subtitle}>
            You will answer 3 questions. We use them to adapt explanations and examples.
          </AppText>
        </View>

        <View style={styles.noteCard}>
          <AppText style={styles.noteText}>You can edit these answers later in Profile.</AppText>
        </View>

        <PrimaryButton
          label="Start"
          onPress={() => navigation.navigate('OnboardingQuestionExperience')}
        />
      </View>
    </OnboardingScreen>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      gap: spacing.xl,
    },
    header: {
      gap: spacing.sm,
    },
    title: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: 28,
      color: colors.textPrimary,
    },
    subtitle: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    noteCard: {
      backgroundColor: colors.surfaceActive,
      borderRadius: 16,
      padding: spacing.md,
    },
    noteText: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
    },
  });
