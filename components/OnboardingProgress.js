import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from './AppText';
import { typography, useTheme } from '../theme';

export default function OnboardingProgress({ current, total, label, style }) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);

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

const createStyles = (colors, components) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.md,
    },
    label: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    dots: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
    },
    dot: {
      width: components.sizes.track.sm,
      height: components.sizes.line.thick,
      borderRadius: components.radius.pill,
    },
    dotActive: {
      backgroundColor: colors.accent.primary,
    },
    dotInactive: {
      backgroundColor: colors.background.surfaceActive,
    },
  });
