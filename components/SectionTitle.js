import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import GlossaryText from './GlossaryText';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import useThemeColors from '../theme/useTheme';

export default function SectionTitle({ title, subtitle }) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.container}>
      <GlossaryText text={title} style={styles.title} />
      {subtitle ? <GlossaryText text={subtitle} style={styles.subtitle} /> : null}
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      gap: spacing.xs,
    },
    title: {
      fontFamily: typography.fontFamilyDemi,
      color: colors.textPrimary,
      fontSize: typography.h2,
    },
    subtitle: {
      fontFamily: typography.fontFamilyMedium,
      color: colors.textSecondary,
      fontSize: typography.small,
    },
  });
