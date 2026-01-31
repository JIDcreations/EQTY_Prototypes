import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, useTheme } from '../theme';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function OnboardingScreen({
  children,
  variant = 'default',
  scroll = false,
  contentContainerStyle,
  style,
  gradientColors,
  showGlow = true,
}) {
  const { colors, components } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const resolvedGradientColors =
    variant === 'accent'
      ? [
          colors.background.app,
          toRgba(colors.accent.primary, 0.08),
          colors.background.surfaceActive,
        ]
      : [colors.background.app, colors.background.surface, colors.background.surfaceActive];

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
            contentContainerStyle={[
              styles.scrollContent,
              contentContainerStyle,
              { paddingBottom: insets.bottom },
            ]}
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
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <View style={[styles.content, contentContainerStyle]}>{children}</View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    gradient: {
      flex: 1,
      backgroundColor: colors.background.app,
    },
    safeArea: {
      flex: 1,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingTop: spacing.xl,
      paddingBottom: spacing.none,
      gap: components.layout.contentGap,
      minHeight: '100%',
    },
    content: {
      flex: 1,
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingVertical: spacing.xl,
    },
    glowTop: {
      position: 'absolute',
      top: components.offsets.glow.top,
      right: components.offsets.glow.rightLg,
      width: components.sizes.illustration.xxxl,
      height: components.sizes.illustration.xxxl,
      borderRadius: components.radius.pill,
      backgroundColor: toRgba(colors.accent.primary, 0.18),
      opacity: components.opacity.value55,
    },
    glowMid: {
      position: 'absolute',
      top: '30%',
      left: components.offsets.glow.leftLg,
      width: components.sizes.illustration.xxl,
      height: components.sizes.illustration.xxl,
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.surfaceActive,
      opacity: components.opacity.value55,
    },
    glowBottom: {
      position: 'absolute',
      bottom: components.offsets.glow.bottomLg,
      right: components.offsets.glow.rightSm,
      width: components.sizes.illustration.lg,
      height: components.sizes.illustration.lg,
      borderRadius: components.radius.pill,
      backgroundColor: toRgba(colors.accent.primary, 0.18),
      opacity: components.opacity.value35,
    },
  });
