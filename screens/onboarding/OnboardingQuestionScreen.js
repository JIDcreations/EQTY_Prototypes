import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../components/AppText';
import OnboardingProgress from '../../components/OnboardingProgress';
import OnboardingScreen from '../../components/OnboardingScreen';
import OnboardingStackedCard from '../../components/OnboardingStackedCard';
import { PrimaryButton } from '../../components/Button';
import { spacing, typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { formatOnboardingQuestionLabel, getOnboardingCopy } from '../../utils/localization';

export default function OnboardingQuestionScreen({ navigation, route }) {
  const { question, field, step, total, nextRoute } = route.params;
  const { onboardingContext, updateOnboardingContext, preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const insets = useSafeAreaInsets();
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);
  const [answer, setAnswer] = useState(onboardingContext?.[field] || '');
  const localizedQuestion = copy.question.questions[field] || question;

  const handleNext = async () => {
    await updateOnboardingContext({ [field]: answer.trim() });
    navigation.navigate(nextRoute);
  };

  return (
    <OnboardingScreen contentContainerStyle={styles.screen}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons
              name="chevron-back"
              size={components.sizes.icon.lg}
              color={colors.text.secondary}
            />
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
            placeholderTextColor={colors.text.secondary}
            multiline
            style={styles.input}
          />
          <PrimaryButton label={copy.question.button} onPress={handleNext} />
        </OnboardingStackedCard>
      </KeyboardAvoidingView>
    </OnboardingScreen>
  );
}

const createStyles = (colors, components) =>
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
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.surface,
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
    input: {
      ...components.input.container,
      ...components.input.multiline,
      ...components.input.text,
      textAlignVertical: 'top',
    },
  });
