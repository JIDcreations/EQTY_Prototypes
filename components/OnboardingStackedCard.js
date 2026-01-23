import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import useThemeColors from '../theme/useTheme';
import { spacing } from '../theme/spacing';

export default function OnboardingStackedCard({
  children,
  style,
  contentStyle,
  showHandle = true,
}) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.stack, style]}>
      <View pointerEvents="none" style={styles.ghostOne} />
      <View pointerEvents="none" style={styles.ghostTwo} />
      <View style={[styles.card, contentStyle]}>
        {showHandle ? <View style={styles.handle} /> : null}
        {children}
      </View>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    stack: {
      position: 'relative',
      justifyContent: 'flex-end',
    },
    ghostOne: {
      position: 'absolute',
      top: 10,
      left: 10,
      right: 10,
      height: 160,
      borderRadius: 24,
      backgroundColor: colors.surfaceActive,
      opacity: 0.6,
      transform: [{ rotate: '-1deg' }],
    },
    ghostTwo: {
      position: 'absolute',
      top: 22,
      left: 18,
      right: 18,
      height: 160,
      borderRadius: 24,
      backgroundColor: colors.surfaceActive,
      opacity: 0.35,
      transform: [{ rotate: '1.5deg' }],
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 28,
      padding: spacing.lg,
      gap: spacing.lg,
      borderWidth: 1,
      borderColor: colors.surfaceActive,
      shadowColor: '#000',
      shadowOpacity: 0.22,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 10 },
      elevation: 6,
    },
    handle: {
      width: 44,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.surfaceActive,
      alignSelf: 'center',
    },
  });
