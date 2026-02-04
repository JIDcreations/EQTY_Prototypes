import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import AppTextInput from '../../components/AppTextInput';
import OnboardingScreen from '../../components/OnboardingScreen';
import { PrimaryButton } from '../../components/Button';
import { typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { getOnboardingCopy } from '../../utils/localization';

export default function OnboardingEmailScreen({ navigation }) {
  const { updateAuthUser, updatePreferences, preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const passwordMismatch =
    password && confirmPassword && password.trim() !== confirmPassword.trim();
  const showMismatch = passwordMismatch && (hasSubmitted || confirmTouched);

  const handleContinue = async () => {
    setHasSubmitted(true);
    if (passwordMismatch) {
      return;
    }
    await updatePreferences({ hasOnboarded: false });
    const trimmedUsername = username.trim();
    const trimmed = email.trim();
    if (trimmedUsername) {
      await updateAuthUser({ username: trimmedUsername });
    }
    if (trimmed) {
      await updateAuthUser({ email: trimmed });
    }
    navigation.navigate('OnboardingQuestionsIntro');
  };

  const handleApple = async () => {
    await updatePreferences({ hasOnboarded: false });
    const trimmedUsername = username.trim();
    if (trimmedUsername) {
      await updateAuthUser({ username: trimmedUsername });
    }
    navigation.navigate('OnboardingQuestionsIntro');
  };

  const handleGoogle = async () => {
    await updatePreferences({ hasOnboarded: false });
    const trimmedUsername = username.trim();
    if (trimmedUsername) {
      await updateAuthUser({ username: trimmedUsername });
    }
    navigation.navigate('OnboardingQuestionsIntro');
  };

  return (
    <OnboardingScreen contentContainerStyle={styles.screen} showGlow={false}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.layout}>
          <View style={styles.header}>
            <View style={styles.topRow}>
              <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons
                  name="chevron-back"
                  size={components.sizes.icon.lg}
                  color={colors.text.secondary}
                />
              </Pressable>
              <AppText style={styles.headerTitle}>{copy.email.title}</AppText>
            </View>
            <View style={styles.headerText} />
          </View>

          <View style={styles.body}>
            <View style={styles.form}>
              <View style={styles.field}>
                <AppText style={styles.labelMuted}>{copy.email.usernameLabel}</AppText>
                <AppTextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder={copy.email.usernamePlaceholder}
                  placeholderTextColor={colors.text.secondary}
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
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
                <View style={styles.inputRow}>
                  <AppTextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder={copy.email.passwordPlaceholder}
                    placeholderTextColor={colors.text.secondary}
                    secureTextEntry={!showPassword}
                    style={styles.inputField}
                  />
                  <Pressable
                    onPress={() => setShowPassword((current) => !current)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={components.sizes.icon.sm}
                      color={colors.text.secondary}
                    />
                  </Pressable>
                </View>
                <AppText style={styles.hint}>{copy.email.passwordHint}</AppText>
              </View>
              <View style={styles.field}>
                <AppText style={styles.label}>{copy.email.confirmLabel}</AppText>
                <View style={styles.inputRow}>
                  <AppTextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder={copy.email.confirmPlaceholder}
                    placeholderTextColor={colors.text.secondary}
                    secureTextEntry={!showConfirmPassword}
                    style={styles.inputField}
                    onBlur={() => setConfirmTouched(true)}
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword((current) => !current)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={components.sizes.icon.sm}
                      color={colors.text.secondary}
                    />
                  </Pressable>
                </View>
                {showMismatch ? (
                  <AppText style={styles.error}>{copy.email.passwordMismatch}</AppText>
                ) : null}
              </View>
            </View>

            <View style={styles.actions}>
              <PrimaryButton label={copy.email.button} onPress={handleContinue} />
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <AppText style={styles.dividerText}>{copy.email.divider}</AppText>
                <View style={styles.dividerLine} />
              </View>
              <View style={styles.socialRow}>
                <Pressable onPress={handleApple} style={styles.socialButton}>
                  <Ionicons
                    name="logo-apple"
                    size={components.sizes.icon.sm}
                    color={colors.text.secondary}
                  />
                  <AppText style={styles.socialText}>{copy.email.socialApple}</AppText>
                </Pressable>
                <Pressable onPress={handleGoogle} style={styles.socialButton}>
                  <Ionicons
                    name="logo-google"
                    size={components.sizes.icon.sm}
                    color={colors.text.secondary}
                  />
                  <AppText style={styles.socialText}>{copy.email.socialGoogle}</AppText>
                </Pressable>
              </View>
              <Pressable
                onPress={() => navigation.navigate('OnboardingLogin')}
                style={styles.linkInline}
              >
                <AppText style={styles.loginLink}>{copy.email.link}</AppText>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </OnboardingScreen>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      paddingTop: 0,
      paddingBottom: 0,
    },
    keyboard: {
      flex: 1,
    },
    layout: {
      flex: 1,
      justifyContent: 'flex-start',
      gap: components.layout.spacing.lg,
    },
    header: {
      gap: components.layout.spacing.xs,
    },
    topRow: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: components.layout.spacing.none,
      minHeight: components.sizes.input.minHeight,
    },
    headerTitle: {
      ...typography.styles.h2,
      color: colors.text.primary,
    },
    headerText: {
      alignItems: 'center',
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
    body: {
      flex: 1,
      gap: components.layout.spacing.lg,
    },
    form: {
      gap: components.layout.spacing.sm,
    },
    field: {
      gap: components.layout.spacing.xs,
    },
    label: {
      ...typography.styles.small,
      color: colors.text.primary,
    },
    labelMuted: {
      ...typography.styles.meta,
      color: colors.text.primary,
    },
    input: {
      ...components.input.container,
      ...components.input.text,
      backgroundColor: colors.background.surfaceActive,
      borderColor: colors.background.surfaceActive,
    },
    inputRow: {
      ...components.input.container,
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
      backgroundColor: colors.background.surfaceActive,
      borderColor: colors.background.surfaceActive,
    },
    inputField: {
      ...components.input.text,
      flex: 1,
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
    eyeButton: {
      padding: components.layout.spacing.xs,
    },
    hint: {
      ...typography.styles.meta,
      color: colors.text.secondary,
    },
    error: {
      ...typography.styles.meta,
      color: colors.accent.primary,
    },
    actions: {
      gap: components.layout.spacing.md,
    },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
      paddingVertical: components.layout.spacing.sm,
    },
    dividerLine: {
      flex: 1,
      borderBottomWidth: components.borderWidth.thin,
      borderBottomColor: colors.ui.divider,
      opacity: components.opacity.value35,
    },
    dividerText: {
      ...typography.styles.meta,
      color: colors.text.secondary,
    },
    socialRow: {
      flexDirection: 'row',
      gap: components.layout.spacing.sm,
    },
    socialButton: {
      flex: 1,
      paddingVertical: components.layout.spacing.sm,
      paddingHorizontal: components.layout.spacing.sm,
      borderRadius: components.radius.input,
      borderWidth: components.borderWidth.thin,
      borderColor: colors.ui.divider,
      backgroundColor: colors.background.surface,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: components.layout.spacing.sm,
    },
    socialText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    linkInline: {
      paddingTop: components.layout.spacing.sm,
    },
    loginLink: {
      ...typography.styles.small,
      color: colors.text.secondary,
      textAlign: 'center',
    },
  });
