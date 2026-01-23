import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../../components/AppText';
import OnboardingGesture from '../../components/OnboardingGesture';
import OnboardingProgress from '../../components/OnboardingProgress';
import OnboardingScreen from '../../components/OnboardingScreen';
import OnboardingStackedCard from '../../components/OnboardingStackedCard';
import useThemeColors from '../../theme/useTheme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function OnboardingPositioningScreen({ navigation }) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <OnboardingScreen
      gradientColors={[colors.background, colors.surfaceActive]}
      showGlow={false}
    >
      <OnboardingGesture onContinue={() => navigation.navigate('OnboardingAIDisclaimer')}>
        <View style={styles.container}>
          <View pointerEvents="none" style={styles.accentOrbTop} />
          <View pointerEvents="none" style={styles.accentOrbBottom} />
          <OnboardingProgress current={2} total={3} label="Step 02" />
          <OnboardingStackedCard>
            <View style={styles.cardHeader}>
              <View style={styles.badge}>
                <View style={styles.badgeDot} />
                <AppText style={styles.badgeText}>EQTY positioning</AppText>
              </View>
              <AppText style={styles.title}>Build to understand investing</AppText>
            </View>
            <AppText style={styles.subtitle}>
              Clear lessons, calm pacing, and context that grows with you.
            </AppText>
            <AppText style={styles.tapHint}>Tap to continue</AppText>
          </OnboardingStackedCard>
        </View>
      </OnboardingGesture>
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
    cardHeader: {
      gap: spacing.sm,
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
      fontSize: 28,
      color: colors.textPrimary,
      lineHeight: 36,
    },
    subtitle: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    tapHint: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      letterSpacing: 0.4,
      textAlign: 'right',
    },
    accentOrbTop: {
      position: 'absolute',
      top: 60,
      left: -80,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: 'rgba(31, 39, 56, 0.6)',
    },
    accentOrbBottom: {
      position: 'absolute',
      bottom: 80,
      right: -90,
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor: 'rgba(255, 213, 0, 0.08)',
    },
  });
