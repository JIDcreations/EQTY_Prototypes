import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import OnboardingProgress from '../../components/OnboardingProgress';
import OnboardingScreen from '../../components/OnboardingScreen';
import OnboardingStackedCard from '../../components/OnboardingStackedCard';
import { PrimaryButton } from '../../components/Button';
import useThemeColors from '../../theme/useTheme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useApp } from '../../utils/AppContext';
import { formatOnboardingQuestionLabel, getOnboardingCopy } from '../../utils/localization';

export default function OnboardingQuestionScreen({ navigation, route }) {
  const { question, field, step, total, nextRoute } = route.params;
  const { onboardingContext, updateOnboardingContext, preferences } = useApp();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);
  const [answer, setAnswer] = useState(onboardingContext?.[field] || '');
  const localizedQuestion = copy.question.questions[field] || question;

  const handleNext = async () => {
    await updateOnboardingContext({ [field]: answer.trim() });
    navigation.navigate(nextRoute);
  };

  return (
    <OnboardingScreen contentContainerStyle={styles.screen}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
          </Pressable>
          <OnboardingProgress
            current={step}
            total={total}
            label={formatOnboardingQuestionLabel(preferences?.language, step)}
            style={styles.progress}
          />
        </View>
        <OnboardingStackedCard>
          <View style={styles.cardHeader}>
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <AppText style={styles.badgeText}>{copy.question.badge}</AppText>
            </View>
            <AppText style={styles.title}>{localizedQuestion}</AppText>
          </View>
          <TextInput
            value={answer}
            onChangeText={setAnswer}
            placeholder={copy.question.placeholder}
            placeholderTextColor={colors.textSecondary}
            multiline
            style={styles.input}
          />
          <PrimaryButton label={copy.question.button} onPress={handleNext} />
        </OnboardingStackedCard>
      </View>
    </OnboardingScreen>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
    },
    container: {
      flex: 1,
      justifyContent: 'space-between',
      paddingBottom: spacing.xl,
      gap: spacing.xl,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    progress: {
      flex: 1,
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
      fontSize: 24,
      color: colors.textPrimary,
      lineHeight: 30,
    },
    input: {
      minHeight: 160,
      borderRadius: 18,
      padding: spacing.md,
      backgroundColor: colors.surfaceActive,
      color: colors.textPrimary,
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
      textAlignVertical: 'top',
    },
  });
