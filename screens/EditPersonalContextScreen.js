import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import Toast from '../components/Toast';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../utils/AppContext';
import useToast from '../utils/useToast';

export default function EditPersonalContextScreen({ navigation }) {
  const { onboardingContext, updateOnboardingContext } = useApp();
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <AppText style={styles.title}>Personal context</AppText>
          <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
        <AppText style={styles.subtitle}>
          You can update this at any time. Changes affect future lessons and feedback.
        </AppText>

        <View style={styles.field}>
          <AppText style={styles.label}>
            What have you already done in terms of investing?
          </AppText>
          <TextInput
            value={experienceAnswer}
            onChangeText={setExperienceAnswer}
            placeholder="e.g. nothing yet, crypto, ETFs, savings..."
            placeholderTextColor={colors.textSecondary}
            multiline
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <AppText style={styles.label}>
            What do you already know about investing today?
          </AppText>
          <TextInput
            value={knowledgeAnswer}
            onChangeText={setKnowledgeAnswer}
            placeholder="e.g. basic terms, risks, returns..."
            placeholderTextColor={colors.textSecondary}
            multiline
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <AppText style={styles.label}>Why do you want to start investing?</AppText>
          <TextInput
            value={motivationAnswer}
            onChangeText={setMotivationAnswer}
            placeholder="e.g. long-term growth, curiosity, financial independence..."
            placeholderTextColor={colors.textSecondary}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: typography.fontFamilyDemi,
    fontSize: typography.h1,
    color: colors.textPrimary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.body,
    color: colors.textPrimary,
  },
  input: {
    minHeight: 96,
    borderRadius: 16,
    padding: spacing.md,
    backgroundColor: colors.surfaceActive,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.body,
    textAlignVertical: 'top',
  },
  noteCard: {
    backgroundColor: colors.surfaceActive,
    borderRadius: 14,
    padding: spacing.md,
  },
  noteText: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
});
