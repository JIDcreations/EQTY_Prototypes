import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import OnboardingScreen from '../../components/OnboardingScreen';
import OnboardingStackedCard from '../../components/OnboardingStackedCard';
import { PrimaryButton } from '../../components/Button';
import useThemeColors from '../../theme/useTheme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useApp } from '../../utils/AppContext';
import { getOnboardingCopy } from '../../utils/localization';

export default function OnboardingLoginScreen({ navigation }) {
  const { updateAuthUser, updatePreferences, preferences } = useApp();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);
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
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.layout}>
          <View style={styles.topArea}>
            <View style={styles.topRow}>
              <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
              </Pressable>
              <AppText style={styles.logo}>EQTY</AppText>
            </View>
          </View>

          <OnboardingStackedCard>
            <View style={styles.cardHeader}>
              <View style={styles.badge}>
                <View style={styles.badgeDot} />
                <AppText style={styles.badgeText}>{copy.login.badge}</AppText>
              </View>
              <AppText style={styles.title}>{copy.login.title}</AppText>
              <AppText style={styles.subtitle}>{copy.login.subtitle}</AppText>
            </View>

            <View style={styles.fields}>
              <View style={styles.field}>
                <AppText style={styles.label}>{copy.login.usernameLabel}</AppText>
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder={copy.login.usernamePlaceholder}
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
              <View style={styles.field}>
                <AppText style={styles.label}>{copy.login.passwordLabel}</AppText>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder={copy.login.passwordPlaceholder}
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.ctaBlock}>
              <PrimaryButton label={copy.login.button} onPress={handleDone} />
              <Pressable onPress={() => navigation.navigate('OnboardingEntry')}>
                <AppText style={styles.loginLink}>{copy.login.link}</AppText>
              </Pressable>
            </View>
          </OnboardingStackedCard>
        </View>
      </KeyboardAvoidingView>
    </OnboardingScreen>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingBottom: spacing.xxl,
    },
    keyboard: {
      flex: 1,
    },
    layout: {
      flex: 1,
      justifyContent: 'space-between',
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
    },
    topArea: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    topRow: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
      minHeight: 48,
    },
    logo: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: 32,
      color: colors.textPrimary,
      letterSpacing: 6,
      textShadowColor: 'rgba(255, 213, 0, 0.2)',
      textShadowOffset: { width: 0, height: 6 },
      textShadowRadius: 14,
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      left: 0,
    },
    cardHeader: {
      gap: spacing.xs,
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
    ctaBlock: {
      gap: spacing.sm,
    },
    loginLink: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      textAlign: 'center',
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
