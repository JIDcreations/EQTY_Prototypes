import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import AppTextInput from '../../components/AppTextInput';
import OnboardingProgress from '../../components/OnboardingProgress';
import OnboardingScreen from '../../components/OnboardingScreen';
import { PrimaryButton } from '../../components/Button';
import { typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { formatOnboardingQuestionLabel, getOnboardingCopy } from '../../utils/localization';

export default function OnboardingQuestionScreen({ navigation, route }) {
  const { question, field, step, total, nextRoute, isLast, returnTo, returnParams, exitToTabs, setHasOnboardedOnComplete } =
    route.params;
  const { onboardingContext, updateOnboardingContext, updatePreferences, preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);
  const [answer, setAnswer] = useState(onboardingContext?.[field] || '');
  const localizedQuestion = copy.question.questions[field] || question;
  const primaryLabel = isLast ? copy.question.finishButton : copy.question.button;

  const handleNext = async () => {
    const trimmed = answer.trim();
    const updates = { [field]: trimmed };
    if (isLast) {
      updates.onboardingComplete = true;
    }
    await updateOnboardingContext(updates);
    if (isLast) {
      if (setHasOnboardedOnComplete) {
        await updatePreferences({ hasOnboarded: true });
      }
      if (returnTo) {
        navigation.navigate(returnTo, returnParams || {});
        return;
      }
      if (exitToTabs || setHasOnboardedOnComplete) {
        navigation.navigate('Tabs', { screen: 'Home' });
        return;
      }
      if (navigation.canGoBack()) {
        navigation.goBack();
        return;
      }
      navigation.navigate('Tabs', { screen: 'Home' });
      return;
    }
    navigation.navigate({
      name: nextRoute,
      params: {
        returnTo,
        returnParams,
        exitToTabs,
        setHasOnboardedOnComplete,
      },
      merge: true,
    });
  };

  return (
    <OnboardingScreen contentContainerStyle={styles.screen}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={components.layout.safeArea.top}
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
        <View style={styles.contentBlock}>
          <View style={styles.content}>
            <AppText style={styles.title}>{localizedQuestion}</AppText>
            <AppTextInput
              value={answer}
              onChangeText={setAnswer}
              placeholder={copy.question.placeholder}
              placeholderTextColor={colors.text.secondary}
              multiline
              style={styles.input}
            />
          </View>
          <PrimaryButton
            label={primaryLabel}
            onPress={handleNext}
            style={styles.primaryButton}
          />
        </View>
      </KeyboardAvoidingView>
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
    screen: {
      flex: 1,
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      gap: components.layout.spacing.xxl,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.md,
    },
    backButton: {
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.app,
      borderWidth: components.borderWidth.thin,
      borderColor: colors.ui.divider,
      alignItems: 'center',
      justifyContent: 'center',
    },
    progress: {
      flex: 1,
    },
    contentBlock: {
      flex: 1,
      justifyContent: 'flex-start',
      gap: components.layout.spacing.xxl,
    },
    content: {
      gap: components.layout.spacing.lg,
    },
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
    },
    input: {
      ...components.input.container,
      ...components.input.multiline,
      ...components.input.text,
      backgroundColor: toRgba(colors.background.surface, components.opacity.value40),
      borderColor: toRgba(colors.background.surface, components.opacity.value35),
      textAlignVertical: 'top',
    },
    primaryButton: {
      paddingVertical: components.layout.spacing.md,
      minHeight: components.sizes.input.minHeight,
    },
  });
