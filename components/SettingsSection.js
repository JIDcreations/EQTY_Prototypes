import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing, typography, useTheme } from '../theme';
import AppText from './AppText';

export default function SettingsSection({ title, helper, children }) {
  const { colors } = useTheme();
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
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    helper: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  });
