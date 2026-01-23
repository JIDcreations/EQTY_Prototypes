import React, { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import AppText from '../../components/AppText';
import OnboardingProgress from '../../components/OnboardingProgress';
import OnboardingScreen from '../../components/OnboardingScreen';
import { PrimaryButton } from '../../components/Button';
import useThemeColors from '../../theme/useTheme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useApp } from '../../utils/AppContext';

export default function OnboardingQuestionScreen({ navigation, route }) {
  const { question, field, step, total, nextRoute } = route.params;
  const { onboardingContext, updateOnboardingContext } = useApp();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [answer, setAnswer] = useState(onboardingContext?.[field] || '');

  const handleNext = async () => {
    await updateOnboardingContext({ [field]: answer.trim() });
    navigation.navigate(nextRoute);
  };

  return (
    <OnboardingScreen scroll contentContainerStyle={styles.scrollContent}>
      <OnboardingProgress
        current={step}
        total={total}
        label={`Question 0${step}`}
      />
      <View style={styles.content}>
        <AppText style={styles.title}>{question}</AppText>
        <TextInput
          value={answer}
          onChangeText={setAnswer}
          placeholder="Share a few thoughts..."
          placeholderTextColor={colors.textSecondary}
          multiline
          style={styles.input}
        />
      </View>
      <PrimaryButton label="Next" onPress={handleNext} />
    </OnboardingScreen>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    scrollContent: {
      gap: spacing.xl,
    },
    content: {
      gap: spacing.md,
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
