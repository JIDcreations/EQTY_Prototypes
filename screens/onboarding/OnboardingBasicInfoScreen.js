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
import { spacing, typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { getOnboardingCopy } from '../../utils/localization';

export default function OnboardingBasicInfoScreen({ navigation }) {
  const { updateAuthUser, preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);
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
                <AppText style={styles.badgeText}>{copy.basicInfo.badge}</AppText>
              </View>
              <AppText style={styles.title}>{copy.basicInfo.title}</AppText>
              <AppText style={styles.subtitle}>{copy.basicInfo.subtitle}</AppText>
            </View>

            <View style={styles.fields}>
              <View style={styles.field}>
                <AppText style={styles.label}>{copy.basicInfo.nameLabel}</AppText>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder={copy.basicInfo.namePlaceholder}
                  placeholderTextColor={colors.text.secondary}
                  style={styles.input}
                />
              </View>
              <View style={styles.field}>
                <AppText style={styles.label}>{copy.basicInfo.birthLabel}</AppText>
                <TextInput
                  value={birthdate}
                  onChangeText={setBirthdate}
                  placeholder={copy.basicInfo.birthPlaceholder}
                  placeholderTextColor={colors.text.secondary}
                  style={styles.input}
                />
              </View>
            </View>

            <PrimaryButton label={copy.basicInfo.button} onPress={handleContinue} />
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
      left: spacing.none,
    },
    cardHeader: {
      gap: spacing.xs,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      alignSelf: 'flex-start',
      backgroundColor: colors.background.surfaceActive,
      borderRadius: components.radius.pill,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
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
      gap: spacing.md,
    },
    field: {
      gap: spacing.xs,
    },
    label: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    input: {
      ...components.input.container,
      ...components.input.text,
    },
  });
