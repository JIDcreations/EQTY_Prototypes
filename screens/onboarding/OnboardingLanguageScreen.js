import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/AppText';
import OnboardingScreen from '../../components/OnboardingScreen';
import { PrimaryButton } from '../../components/Button';
import { typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { getLanguageOptions, getOnboardingCopy } from '../../utils/localization';

export default function OnboardingLanguageScreen({ navigation, route }) {
  const { preferences, updatePreferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);
  const options = useMemo(
    () => getLanguageOptions(preferences?.language),
    [preferences?.language]
  );
  const [selected, setSelected] = useState(preferences?.language || 'English');

  const nextRoute = route?.params?.nextRoute || 'OnboardingEntry';

  const handleContinue = async () => {
    await updatePreferences({ language: selected });
    navigation.navigate(nextRoute);
  };

  return (
    <OnboardingScreen contentContainerStyle={styles.screen} showGlow={false}>
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
            <AppText style={styles.headerTitle}>{copy.language.title}</AppText>
          </View>
          <AppText style={styles.subtitle}>{copy.language.subtitle}</AppText>
        </View>

        <View style={styles.body}>
          <View style={styles.list}>
            {options.map((option) => {
              const isActive = selected === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setSelected(option.value)}
                  style={[styles.row, isActive && styles.rowActive]}
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

          <PrimaryButton label={copy.language.button} onPress={handleContinue} />
        </View>
      </View>
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
    layout: {
      flex: 1,
      justifyContent: 'space-between',
    },
    topRow: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: components.sizes.input.minHeight,
    },
    header: {
      gap: components.layout.spacing.xs,
    },
    headerTitle: {
      ...typography.styles.h2,
      color: colors.text.primary,
      textAlign: 'center',
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
    subtitle: {
      ...typography.styles.small,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    body: {
      gap: components.layout.spacing.lg,
    },
    list: {
      gap: components.layout.spacing.sm,
    },
    row: {
      ...components.input.container,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.background.surfaceActive,
      borderColor: colors.ui.divider,
    },
    rowActive: {
      borderColor: colors.accent.primary,
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
