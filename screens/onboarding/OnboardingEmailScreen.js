import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import AppTextInput from '../../components/AppTextInput';
import OnboardingScreen from '../../components/OnboardingScreen';
import OnboardingStackedCard from '../../components/OnboardingStackedCard';
import { PrimaryButton } from '../../components/Button';
import { typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { getOnboardingCopy } from '../../utils/localization';

export default function OnboardingEmailScreen({ navigation }) {
  const { updateAuthUser, preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleContinue = async () => {
    const trimmed = email.trim();
    if (trimmed) {
      await updateAuthUser({ email: trimmed });
    }
    navigation.navigate('OnboardingBasicInfo');
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
                <Ionicons
                  name="chevron-back"
                  size={components.sizes.icon.lg}
                  color={colors.text.secondary}
                />
              </Pressable>
              <AppText style={styles.logo}>EQTY</AppText>
            </View>
          </View>

          <OnboardingStackedCard>
            <View style={styles.cardHeader}>
              <View style={styles.badge}>
                <View style={styles.badgeDot} />
                <AppText style={styles.badgeText}>{copy.email.badge}</AppText>
              </View>
              <AppText style={styles.title}>{copy.email.title}</AppText>
              <AppText style={styles.subtitle}>{copy.email.subtitle}</AppText>
            </View>

            <View style={styles.fields}>
              <View style={styles.field}>
                <AppText style={styles.label}>{copy.email.emailLabel}</AppText>
                <AppTextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder={copy.email.emailPlaceholder}
                  placeholderTextColor={colors.text.secondary}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                />
              </View>
              <View style={styles.field}>
                <AppText style={styles.label}>{copy.email.passwordLabel}</AppText>
                <AppTextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder={copy.email.passwordPlaceholder}
                  placeholderTextColor={colors.text.secondary}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
              <View style={styles.field}>
                <AppText style={styles.label}>{copy.email.confirmLabel}</AppText>
                <AppTextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder={copy.email.confirmPlaceholder}
                  placeholderTextColor={colors.text.secondary}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.ctaBlock}>
              <PrimaryButton label={copy.email.button} onPress={handleContinue} />
              <Pressable onPress={() => navigation.navigate('OnboardingLogin')}>
                <AppText style={styles.loginLink}>{copy.email.link}</AppText>
              </Pressable>
            </View>
          </OnboardingStackedCard>
        </View>
      </KeyboardAvoidingView>
    </OnboardingScreen>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    scrollContent: {
      flexGrow: 1,
      paddingBottom: components.layout.spacing.xxl,
    },
    keyboard: {
      flex: 1,
    },
    layout: {
      flex: 1,
      justifyContent: 'space-between',
      paddingTop: components.layout.spacing.lg,
      paddingBottom: components.layout.spacing.md,
    },
    topArea: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    topRow: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: components.layout.spacing.md,
      minHeight: components.sizes.input.minHeight,
    },
    logo: {
      ...typography.styles.display,
      color: colors.text.primary,
    },
    backButton: {
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.surface,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      left: components.layout.spacing.none,
    },
    cardHeader: {
      gap: components.layout.spacing.xs,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.xs,
      alignSelf: 'flex-start',
      backgroundColor: colors.background.surfaceActive,
      borderRadius: components.radius.pill,
      paddingHorizontal: components.layout.spacing.sm,
      paddingVertical: components.layout.spacing.xs,
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
    subtitle: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    fields: {
      gap: components.layout.spacing.md,
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
      ...components.input.text,
    },
    ctaBlock: {
      gap: components.layout.spacing.sm,
      marginTop: components.layout.spacing.sm,
    },
    loginLink: {
      ...typography.styles.small,
      color: colors.text.secondary,
      textAlign: 'center',
    },
  });
