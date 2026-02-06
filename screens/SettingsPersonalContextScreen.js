import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
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
          subtitle="Your onboarding answers tailor explanations"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.pageHeader}>
          <AppText style={styles.cardTitle}>Answer these questions</AppText>
          <AppText style={styles.cardSubtitle}>
            We use this to adapt examples, pacing, and feedback.
          </AppText>
        </View>

        <View style={styles.field}>
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

        <View style={styles.field}>
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

        <View style={styles.field}>
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

const createStyles = (colors, components) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingBottom: components.layout.safeArea.bottom + components.layout.spacing.xl,
      gap: components.layout.contentGap,
    },
    pageHeader: {
      gap: components.layout.spacing.xs,
    },
    cardTitle: {
      ...typography.styles.h2,
      color: colors.text.primary,
    },
    cardSubtitle: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    field: {
      gap: components.layout.spacing.sm,
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
      textAlignVertical: 'top',
    },
    noteCard: {
      backgroundColor: colors.background.surfaceActive,
      borderRadius: components.radius.card,
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
