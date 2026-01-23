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
                <AppText style={styles.badgeText}>Account setup</AppText>
              </View>
              <AppText style={styles.title}>About you</AppText>
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
