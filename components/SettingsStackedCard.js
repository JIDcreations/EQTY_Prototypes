import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import OnboardingStackedCard from './OnboardingStackedCard';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function SettingsStackedCard({
  children,
  contentStyle,
  showHandle = false,
  ...props
}) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);

  return (
    <OnboardingStackedCard
      {...props}
      showHandle={showHandle}
      contentStyle={[styles.card, contentStyle]}
    >
      {children}
    </OnboardingStackedCard>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    card: {
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
  });
