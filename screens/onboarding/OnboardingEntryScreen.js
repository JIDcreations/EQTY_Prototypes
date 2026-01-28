import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../components/AppText';
import BottomSheet from '../../components/BottomSheet';
import OnboardingAuthButton from '../../components/OnboardingAuthButton';
import OnboardingScreen from '../../components/OnboardingScreen';
import OnboardingStackedCard from '../../components/OnboardingStackedCard';
import { PrimaryButton } from '../../components/Button';
import useThemeColors from '../../theme/useTheme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useApp } from '../../utils/AppContext';
import { getOnboardingCopy } from '../../utils/localization';

export default function OnboardingEntryScreen({ navigation }) {
  const { preferences } = useApp();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [sheetVisible, setSheetVisible] = useState(false);
  const copy = useMemo(() => getOnboardingCopy(preferences?.language), [preferences?.language]);

  const handleApple = () => {
    setSheetVisible(false);
    navigation.navigate('OnboardingBasicInfo');
  };

  const handleGoogle = () => {
    setSheetVisible(false);
    navigation.navigate('OnboardingBasicInfo');
  };

  const handleEmail = () => {
    setSheetVisible(false);
    navigation.navigate('OnboardingEmail');
  };

  return (
    <OnboardingScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <AppText style={styles.logo}>EQTY</AppText>
          <View style={styles.kickerRow}>
            <View style={styles.kickerDot} />
            <AppText style={styles.kicker}>{copy.entry.kicker}</AppText>
          </View>
          <AppText style={styles.title}>{copy.entry.title}</AppText>
          <AppText style={styles.subtitle}>{copy.entry.subtitle}</AppText>
        </View>

        <OnboardingStackedCard>
          <View style={styles.cardHeader}>
            <AppText style={styles.cardTitle}>{copy.entry.cardTitle}</AppText>
            <AppText style={styles.cardSubtitle}>{copy.entry.cardSubtitle}</AppText>
          </View>
          <View style={styles.actions}>
            <PrimaryButton label={copy.entry.button} onPress={() => setSheetVisible(true)} />
            <Pressable onPress={() => navigation.navigate('OnboardingLogin')}>
              <AppText style={styles.link}>{copy.entry.loginLink}</AppText>
            </Pressable>
          </View>
        </OnboardingStackedCard>
      </View>

      <BottomSheet
        visible={sheetVisible}
        title={copy.entry.sheetTitle}
        onClose={() => setSheetVisible(false)}
      >
        <OnboardingAuthButton
          label={copy.entry.apple}
          iconName="logo-apple"
          variant="light"
          onPress={handleApple}
        />
        <OnboardingAuthButton
          label={copy.entry.google}
          iconName="logo-google"
          onPress={handleGoogle}
        />
        <OnboardingAuthButton
          label={copy.entry.email}
          iconName="mail-outline"
          onPress={handleEmail}
        />
      </BottomSheet>
    </OnboardingScreen>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      paddingBottom: spacing.xl,
    },
    header: {
      gap: spacing.sm,
      maxWidth: 320,
    },
    logo: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: 34,
      color: colors.textPrimary,
      letterSpacing: 6,
      textShadowColor: 'rgba(255, 213, 0, 0.2)',
      textShadowOffset: { width: 0, height: 6 },
      textShadowRadius: 14,
    },
    kickerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    kickerDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.accent,
    },
    kicker: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    title: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: 28,
      color: colors.textPrimary,
      lineHeight: 34,
    },
    subtitle: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    cardHeader: {
      gap: 4,
    },
    cardTitle: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: typography.h2,
      color: colors.textPrimary,
    },
    cardSubtitle: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
    },
    actions: {
      gap: spacing.md,
    },
    link: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
