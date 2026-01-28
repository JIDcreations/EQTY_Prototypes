import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import OnboardingScreen from '../../components/OnboardingScreen';
import OnboardingStackedCard from '../../components/OnboardingStackedCard';
import { PrimaryButton } from '../../components/Button';
import useThemeColors from '../../theme/useTheme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useApp } from '../../utils/AppContext';
import { getLanguageOptions, getOnboardingCopy } from '../../utils/localization';

export default function OnboardingLanguageScreen({ navigation }) {
  const { preferences, updatePreferences } = useApp();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);
  const options = useMemo(
    () => getLanguageOptions(preferences?.language),
    [preferences?.language]
  );
  const [selected, setSelected] = useState(preferences?.language || 'English');

  const handleContinue = async () => {
    await updatePreferences({ language: selected });
    navigation.navigate('OnboardingPositioning');
  };

  return (
    <OnboardingScreen contentContainerStyle={styles.screen}>
      <View style={styles.layout}>
        <View style={styles.topArea}>
          <View style={styles.topRow}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={20} color={colors.textSecondary} />
            </Pressable>
            <AppText style={styles.logo}>EQTY</AppText>
          </View>
        </View>

        <OnboardingStackedCard contentStyle={styles.cardContent}>
          <View style={styles.cardBody}>
            <View style={styles.cardHeader}>
              <View style={styles.badge}>
                <View style={styles.badgeDot} />
                <AppText style={styles.badgeText}>{copy.language.badge}</AppText>
              </View>
              <AppText style={styles.title}>{copy.language.title}</AppText>
              <AppText style={styles.subtitle}>{copy.language.subtitle}</AppText>
            </View>

            <View style={styles.list}>
              {options.map((option, index) => {
                const isActive = selected === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setSelected(option.value)}
                    style={[styles.row, index !== options.length - 1 && styles.rowDivider]}
                  >
                    <View style={styles.rowLeft}>
                      <View style={[styles.radio, isActive && styles.radioActive]}>
                        {isActive ? <View style={styles.radioDot} /> : null}
                      </View>
                      <AppText style={styles.rowLabel}>{option.label}</AppText>
                    </View>
                    {isActive ? (
                      <AppText style={styles.activeLabel}>{copy.language.selected}</AppText>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </View>

          <PrimaryButton label={copy.language.button} onPress={handleContinue} />
        </OnboardingStackedCard>
      </View>
    </OnboardingScreen>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    screen: {
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
    cardContent: {
      minHeight: 330,
      justifyContent: 'space-between',
    },
    cardBody: {
      gap: spacing.lg,
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
    list: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.surfaceActive,
      overflow: 'hidden',
    },
    row: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.surfaceActive,
    },
    rowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.surface,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    rowLabel: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
      color: colors.textPrimary,
    },
    activeLabel: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
    },
    radio: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 1,
      borderColor: colors.textSecondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioActive: {
      borderColor: colors.accent,
    },
    radioDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.accent,
    },
  });
