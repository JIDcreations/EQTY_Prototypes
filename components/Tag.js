import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { typography } from '../theme/typography';
import AppText from './AppText';
import useThemeColors from '../theme/useTheme';

export default function Tag({ label, tone = 'default', style }) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={[styles.base, tone === 'accent' && styles.accent, style]}>
      <AppText style={[styles.text, tone === 'accent' && styles.textAccent]}>{label}</AppText>
    </View>
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

const createStyles = (colors) =>
  StyleSheet.create({
    base: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: colors.surfaceActive,
    },
    accent: {
      backgroundColor: toRgba(colors.accent, 0.18),
    },
    text: {
      fontFamily: typography.fontFamilyMedium,
      color: colors.textSecondary,
      fontSize: typography.small,
    },
    textAccent: {
      color: colors.accent,
    },
  });
