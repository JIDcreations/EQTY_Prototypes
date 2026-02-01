import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import OnboardingScreen from '../../components/OnboardingScreen';
import OnboardingStackedCard from '../../components/OnboardingStackedCard';
import { PrimaryButton } from '../../components/Button';
import { typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { getLanguageOptions, getOnboardingCopy } from '../../utils/localization';

export default function OnboardingLanguageScreen({ navigation }) {
  const { preferences, updatePreferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
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
              <Ionicons
                name="chevron-back"
                size={components.sizes.icon.lg}
                color={colors.text.secondary}
              />
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

const createStyles = (colors, components) =>
  StyleSheet.create({
    screen: {
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
    cardContent: {
      minHeight: components.sizes.screen.minPanelHeight,
      justifyContent: 'space-between',
    },
    cardBody: {
      gap: components.layout.spacing.lg,
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
    list: {
      borderRadius: components.radius.card,
      borderWidth: components.borderWidth.thin,
      borderColor: colors.ui.border,
      overflow: 'hidden',
    },
    row: {
      ...components.list.row,
      paddingHorizontal: components.layout.spacing.lg,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.background.surfaceActive,
    },
    rowDivider: {
      borderBottomWidth: components.borderWidth.thin,
      borderBottomColor: colors.ui.divider,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
    },
    rowLabel: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    activeLabel: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    radio: {
      width: components.sizes.track.sm,
      height: components.sizes.track.sm,
      borderRadius: components.radius.pill,
      borderWidth: components.borderWidth.thin,
      borderColor: colors.text.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioActive: {
      borderColor: colors.accent.primary,
    },
    radioDot: {
      width: components.sizes.dot.sm,
      height: components.sizes.dot.sm,
      borderRadius: components.radius.pill,
      backgroundColor: colors.accent.primary,
    },
  });
