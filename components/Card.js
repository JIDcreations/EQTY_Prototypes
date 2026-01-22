import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { lightColors } from '../theme/colors';
import useThemeColors from '../theme/useTheme';

export default function Card({ children, active = false, style }) {
  const colors = useThemeColors();
  const styles = useMemo(
    () => createStyles(colors, colors.background === lightColors.background),
    [colors]
  );
  return <View style={[styles.card, active && styles.active, style]}>{children}</View>;
}

const createStyles = (colors, isLight) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 18,
      shadowColor: colors.background,
      shadowOpacity: isLight ? 0.12 : 0.35,
      shadowRadius: isLight ? 10 : 18,
      shadowOffset: { width: 0, height: isLight ? 6 : 10 },
      elevation: isLight ? 3 : 6,
    },
    active: {
      backgroundColor: colors.surfaceActive,
    },
  });
