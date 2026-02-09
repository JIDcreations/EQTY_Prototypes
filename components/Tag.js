import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { typography, useTheme } from '../theme';
import AppText from './AppText';

export default function Tag({ label, tone = 'default', style }) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
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

const createStyles = (colors, components) =>
  StyleSheet.create({
    base: {
      paddingHorizontal: components.layout.spacing.md,
      paddingVertical: components.layout.spacing.xs,
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.surfaceActive,
    },
    accent: {
      backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint),
    },
    text: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    textAccent: {
      color: colors.text.primary,
    },
  });
