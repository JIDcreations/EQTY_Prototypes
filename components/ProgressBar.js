import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme';

export default function ProgressBar({ progress }) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const width = Math.min(1, Math.max(0, progress)) * 100;
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${width}%` }]} />
    </View>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    track: {
      height: components.layout.spacing.sm,
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.surfaceActive,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      backgroundColor: colors.accent.primary,
    },
  });
