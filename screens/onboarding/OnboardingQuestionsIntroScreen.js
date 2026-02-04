import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../../components/AppText';
import OnboardingScreen from '../../components/OnboardingScreen';
import { PrimaryButton, SecondaryButton } from '../../components/Button';
import { typography, useTheme } from '../../theme';
import { useApp } from '../../utils/AppContext';
import { getOnboardingCopy } from '../../utils/localization';

export default function OnboardingQuestionsIntroScreen({ navigation }) {
  const { preferences, updatePreferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);

  const handleSkip = async () => {
    await updatePreferences({ hasOnboarded: true });
  };

  return (
    <OnboardingScreen
      gradientColors={[colors.background.app, colors.background.surfaceActive]}
      showGlow={false}
      contentContainerStyle={styles.screen}
    >
      <View style={styles.container}>
        <View pointerEvents="none" style={styles.accentOrbTop} />
        <View pointerEvents="none" style={styles.accentOrbBottom} />
        <View style={styles.logoWrap}>
          <AppText style={styles.logo}>EQTY</AppText>
        </View>
        <View style={styles.copyBlock}>
          <AppText style={styles.title}>{copy.questionsIntro.title}</AppText>
          <AppText style={styles.subtitle}>{copy.questionsIntro.subtitle}</AppText>
        </View>
        <View style={styles.actions}>
          <PrimaryButton
            label={copy.questionsIntro.primaryButton}
            onPress={() =>
              navigation.navigate({
                name: 'OnboardingQuestionExperience',
                params: {
                  exitToTabs: true,
                  setHasOnboardedOnComplete: true,
                },
                merge: true,
              })
            }
          />
          <SecondaryButton label={copy.questionsIntro.secondaryButton} onPress={handleSkip} />
        </View>
      </View>
    </OnboardingScreen>
  );
}

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const createStyles = (colors, components) =>
  StyleSheet.create({
    screen: {
      paddingBottom: 0,
    },
    container: {
      flex: 1,
      justifyContent: 'space-between',
    },
    logoWrap: {
      marginTop: components.layout.spacing.xxl,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    logo: {
      ...typography.styles.display,
      color: colors.text.primary,
    },
    copyBlock: {
      width: '100%',
      gap: components.layout.spacing.sm,
    },
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
    },
    subtitle: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    actions: {
      gap: components.layout.spacing.md,
    },
    accentOrbTop: {
      position: 'absolute',
      top: components.offsets.onboarding.orbTopMd,
      left: components.offsets.onboarding.orbLeftLg,
      width: components.sizes.illustration.md,
      height: components.sizes.illustration.md,
      borderRadius: components.radius.pill,
      backgroundColor: toRgba(colors.background.surface, 0.6),
    },
    accentOrbBottom: {
      position: 'absolute',
      bottom: components.offsets.onboarding.orbBottomMd,
      right: components.offsets.onboarding.orbRightSm,
      width: components.sizes.illustration.lg,
      height: components.sizes.illustration.lg,
      borderRadius: components.radius.pill,
      backgroundColor: toRgba(colors.accent.primary, 0.08),
    },
  });
