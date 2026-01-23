import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import useThemeColors from '../theme/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function OnboardingProgress({ current, total, label, style }) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.container, style]}>
      {label ? <AppText style={styles.label}>{label}</AppText> : null}
      <View style={styles.dots}>
        {Array.from({ length: total }).map((_, index) => (
          <View
            key={`dot-${index}`}
            style={[styles.dot, index < current ? styles.dotActive : styles.dotInactive]}
          />
        ))}
      </View>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    label: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1.4,
    },
    dots: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    dot: {
      width: 18,
      height: 3,
      borderRadius: 999,
    },
    dotActive: {
      backgroundColor: colors.accent,
    },
    dotInactive: {
      backgroundColor: colors.surfaceActive,
    },
  });
