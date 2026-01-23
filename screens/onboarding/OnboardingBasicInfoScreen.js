import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import AppText from '../../components/AppText';
import OnboardingScreen from '../../components/OnboardingScreen';
import { PrimaryButton } from '../../components/Button';
import useThemeColors from '../../theme/useTheme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useApp } from '../../utils/AppContext';

export default function OnboardingBasicInfoScreen({ navigation }) {
  const { updateAuthUser } = useApp();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');

  const handleContinue = async () => {
    const trimmed = name.trim();
    if (trimmed) {
      await updateAuthUser({ username: trimmed, name: trimmed, birthdate: birthdate.trim() });
    }
    navigation.navigate('OnboardingQuestionsIntro');
  };

  return (
    <OnboardingScreen scroll contentContainerStyle={styles.scrollContent}>
      <KeyboardAvoidingView
        style={styles.form}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <AppText style={styles.title}>Basic info</AppText>
          <AppText style={styles.subtitle}>This helps personalize your experience.</AppText>
        </View>

        <View style={styles.fields}>
          <View style={styles.field}>
            <AppText style={styles.label}>Name</AppText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
            />
          </View>
          <View style={styles.field}>
            <AppText style={styles.label}>Date of birth</AppText>
            <TextInput
              value={birthdate}
              onChangeText={setBirthdate}
              placeholder="DD / MM / YYYY"
              placeholderTextColor={colors.textSecondary}
              style={styles.input}
            />
          </View>
        </View>

        <PrimaryButton label="Create account" onPress={handleContinue} />
      </KeyboardAvoidingView>
    </OnboardingScreen>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    scrollContent: {
      gap: spacing.xl,
    },
    form: {
      gap: spacing.lg,
    },
    header: {
      gap: spacing.xs,
    },
    title: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: 26,
      color: colors.textPrimary,
    },
    subtitle: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
    },
    fields: {
      gap: spacing.md,
    },
    field: {
      gap: spacing.xs,
    },
    label: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
    },
    input: {
      borderRadius: 16,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.surfaceActive,
      color: colors.textPrimary,
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
    },
  });
