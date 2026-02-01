import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import Toast from '../components/Toast';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import useToast from '../utils/useToast';

export default function EditPersonalContextScreen({ navigation }) {
  const { onboardingContext, updateOnboardingContext } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const [experienceAnswer, setExperienceAnswer] = useState(
    onboardingContext?.experienceAnswer || ''
  );
  const [knowledgeAnswer, setKnowledgeAnswer] = useState(
    onboardingContext?.knowledgeAnswer || ''
  );
  const [motivationAnswer, setMotivationAnswer] = useState(
    onboardingContext?.motivationAnswer || ''
  );
  const toast = useToast();

  const handleSave = async () => {
    await updateOnboardingContext({
      experienceAnswer: experienceAnswer.trim(),
      knowledgeAnswer: knowledgeAnswer.trim(),
      motivationAnswer: motivationAnswer.trim(),
    });
    toast.show('Saved');
    setTimeout(() => navigation.goBack(), 500);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <AppText style={styles.title}>Personal context</AppText>
          <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons
              name="close"
              size={components.sizes.icon.lg}
              color={colors.text.secondary}
            />
          </Pressable>
        </View>
        <AppText style={styles.subtitle}>
          You can update this at any time. Changes affect future lessons and feedback.
        </AppText>

        <View style={styles.field}>
          <AppText style={styles.label}>
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
          <AppText style={styles.label}>
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
          <AppText style={styles.label}>Why do you want to start investing?</AppText>
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

        <View style={styles.actions}>
          <SecondaryButton label="Cancel" onPress={() => navigation.goBack()} style={styles.flex} />
          <PrimaryButton label="Save changes" onPress={handleSave} style={styles.flex} />
        </View>
      </ScrollView>
      <Toast message={toast.message} visible={toast.visible} onHide={toast.hide} />
    </View>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    container: {
      ...components.screen.container,
      flex: 1,
      backgroundColor: colors.background.app,
    },
    content: {
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingTop: components.layout.spacing.lg,
      gap: components.layout.contentGap,
      paddingBottom: components.layout.spacing.none,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
    },
    closeButton: {
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    subtitle: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    field: {
      gap: components.layout.spacing.xs,
    },
    label: {
      ...typography.styles.small,
      color: colors.text.secondary,
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
