import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import AppText from '../../components/AppText';
import OnboardingScreen from '../../components/OnboardingScreen';
import { PrimaryButton } from '../../components/Button';
import useThemeColors from '../../theme/useTheme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useApp } from '../../utils/AppContext';

export default function OnboardingLoginScreen() {
  const { updateAuthUser, updatePreferences } = useApp();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleDone = async () => {
    const trimmed = username.trim();
    if (trimmed) {
      await updateAuthUser({ username: trimmed });
    } else {
      await updateAuthUser({});
    }
    await updatePreferences({ hasOnboarded: true });
  };

  return (
    <OnboardingScreen scroll contentContainerStyle={styles.scrollContent}>
      <KeyboardAvoidingView
        style={styles.form}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <AppText style={styles.title}>Log in to EQTY</AppText>
          <AppText style={styles.subtitle}>Use any details for this prototype.</AppText>
        </View>

        <View style={styles.fields}>
          <View style={styles.field}>
            <AppText style={styles.label}>Username</AppText>
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Your username"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
          <View style={styles.field}>
            <AppText style={styles.label}>Password</AppText>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              style={styles.input}
            />
          </View>
        </View>

        <PrimaryButton label="Done" onPress={handleDone} />
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
