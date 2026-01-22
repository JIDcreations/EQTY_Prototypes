import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import useThemeColors from '../theme/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import AppText from './AppText';

export default function SettingsSection({ title, helper, children }) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.section}>
      <AppText style={styles.title}>{title}</AppText>
      {helper ? <AppText style={styles.helper}>{helper}</AppText> : null}
      {children}
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    section: {
      gap: spacing.sm,
    },
    title: {
      fontFamily: typography.fontFamilyDemi,
      color: colors.textSecondary,
      fontSize: typography.small,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    helper: {
      fontFamily: typography.fontFamilyMedium,
      color: colors.textSecondary,
      fontSize: typography.small,
    },
  });
