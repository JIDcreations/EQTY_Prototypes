import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import OnboardingScreen from '../components/OnboardingScreen';
import SettingsHeader from '../components/SettingsHeader';
import Toast from '../components/Toast';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import useToast from '../utils/useToast';

export default function SettingsPersonalContextScreen({ navigation }) {
  const { onboardingContext, updateOnboardingContext } = useApp();
  const { colors, components } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight),
    [colors, components, tabBarHeight]
  );
  const toast = useToast();
  const [experienceAnswer, setExperienceAnswer] = useState(
    onboardingContext?.experienceAnswer || ''
  );
  const [knowledgeAnswer, setKnowledgeAnswer] = useState(
    onboardingContext?.knowledgeAnswer || ''
  );
  const [motivationAnswer, setMotivationAnswer] = useState(
    onboardingContext?.motivationAnswer || ''
  );

  const storedExperience = onboardingContext?.experienceAnswer || '';
  const storedKnowledge = onboardingContext?.knowledgeAnswer || '';
  const storedMotivation = onboardingContext?.motivationAnswer || '';

  const hasChanges =
    experienceAnswer.trim() !== storedExperience.trim() ||
    knowledgeAnswer.trim() !== storedKnowledge.trim() ||
    motivationAnswer.trim() !== storedMotivation.trim();

  const handleCancel = () => {
    setExperienceAnswer(storedExperience);
    setKnowledgeAnswer(storedKnowledge);
    setMotivationAnswer(storedMotivation);
  };

  const handleSave = async () => {
    await updateOnboardingContext({
      experienceAnswer: experienceAnswer.trim(),
      knowledgeAnswer: knowledgeAnswer.trim(),
      motivationAnswer: motivationAnswer.trim(),
    });
    toast.show('Saved');
  };

  return (
    <View style={styles.container}>
      <OnboardingScreen
        scroll
        backgroundVariant="bg3"
        contentContainerStyle={styles.content}
      >
        <SettingsHeader
          title="Personal context (AI)"
          subtitle="Answer these questions to adapt examples, pacing, and feedback. No financial advice."
          onBack={() => navigation.goBack()}
        />
        <View style={[styles.questionBlock, styles.questionDivider]}>
          <AppText style={styles.questionLabel}>Question 01</AppText>
          <AppText style={styles.question}>
            What have you already done in terms of investing?
          </AppText>
          <AppTextInput
            value={experienceAnswer}
            onChangeText={setExperienceAnswer}
            placeholder="e.g. nothing yet, crypto, ETFs, savings..."
            placeholderTextColor={colors.text.secondary}
            multiline
            style={styles.input}
          />
        </View>

        <View style={[styles.questionBlock, styles.questionDivider]}>
          <AppText style={styles.questionLabel}>Question 02</AppText>
          <AppText style={styles.question}>
            What do you already know about investing today?
          </AppText>
          <AppTextInput
            value={knowledgeAnswer}
            onChangeText={setKnowledgeAnswer}
            placeholder="e.g. basic terms, risks, returns..."
            placeholderTextColor={colors.text.secondary}
            multiline
            style={styles.input}
          />
        </View>

        <View style={styles.questionBlock}>
          <AppText style={styles.questionLabel}>Question 03</AppText>
          <AppText style={styles.question}>Why do you want to start investing?</AppText>
          <AppTextInput
            value={motivationAnswer}
            onChangeText={setMotivationAnswer}
            placeholder="e.g. long-term growth, curiosity, financial independence..."
            placeholderTextColor={colors.text.secondary}
            multiline
            style={styles.input}
          />
        </View>

        <View style={styles.noteCard}>
          <AppText style={styles.noteText}>
            Changes apply to future explanations and scenarios only.
          </AppText>
        </View>

        {hasChanges ? (
          <View style={styles.actions}>
            <SecondaryButton label="Cancel" onPress={handleCancel} style={styles.flex} />
            <PrimaryButton label="Save changes" onPress={handleSave} style={styles.flex} />
          </View>
        ) : null}
      </OnboardingScreen>
      <Toast message={toast.message} visible={toast.visible} onHide={toast.hide} />
    </View>
  );
}

const createStyles = (colors, components, tabBarHeight) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingBottom:
        components.layout.safeArea.bottom +
        tabBarHeight +
        components.layout.spacing.xl,
      gap: components.layout.contentGap,
    },
    questionBlock: {
      gap: components.layout.spacing.sm,
    },
    questionDivider: {
      borderBottomWidth: components.borderWidth.thin,
      borderBottomColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      paddingBottom: components.layout.spacing.lg,
      marginBottom: components.layout.spacing.lg,
    },
    questionLabel: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    question: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    input: {
      ...components.input.container,
      ...components.input.multiline,
      ...components.input.text,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      textAlignVertical: 'top',
    },
    noteCard: {
      ...components.input.container,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      padding: components.layout.spacing.md,
    },
    noteText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    actions: {
      flexDirection: 'row',
      gap: components.layout.spacing.sm,
    },
    flex: {
      flex: 1,
    },
  });

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
