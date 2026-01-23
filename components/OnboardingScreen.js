import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import useThemeColors from '../theme/useTheme';
import { spacing } from '../theme/spacing';

const ACCENT_GLOW = 'rgba(255, 213, 0, 0.18)';
const ACCENT_GLOW_SOFT = 'rgba(255, 213, 0, 0.08)';

export default function OnboardingScreen({
  children,
  variant = 'default',
  scroll = false,
  contentContainerStyle,
  style,
  gradientColors,
  showGlow = true,
}) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const resolvedGradientColors =
    variant === 'accent'
      ? [colors.background, ACCENT_GLOW_SOFT, colors.surfaceActive]
      : [colors.background, colors.surface, colors.surfaceActive];

  if (scroll) {
    return (
      <LinearGradient colors={gradientColors || resolvedGradientColors} style={[styles.gradient, style]}>
        {showGlow ? (
          <>
            <View pointerEvents="none" style={styles.glowTop} />
            <View pointerEvents="none" style={styles.glowMid} />
            <View pointerEvents="none" style={styles.glowBottom} />
          </>
        ) : null}
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradientColors || resolvedGradientColors} style={[styles.gradient, style]}>
      {showGlow ? (
        <>
          <View pointerEvents="none" style={styles.glowTop} />
          <View pointerEvents="none" style={styles.glowMid} />
          <View pointerEvents="none" style={styles.glowBottom} />
        </>
      ) : null}
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={[styles.content, contentContainerStyle]}>{children}</View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    gradient: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.xl,
      paddingBottom: spacing.xxxl,
      gap: spacing.lg,
      minHeight: '100%',
    },
    content: {
      flex: 1,
      padding: spacing.xl,
    },
    glowTop: {
      position: 'absolute',
      top: -80,
      right: -120,
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: ACCENT_GLOW,
      opacity: 0.55,
    },
    glowMid: {
      position: 'absolute',
      top: '30%',
      left: -120,
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor: colors.surfaceActive,
      opacity: 0.55,
    },
    glowBottom: {
      position: 'absolute',
      bottom: -120,
      right: -80,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: ACCENT_GLOW,
      opacity: 0.35,
    },
  });
