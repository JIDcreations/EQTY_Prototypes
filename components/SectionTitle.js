import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import GlossaryText from './GlossaryText';
import { spacing, typography, useTheme } from '../theme';

export default function SectionTitle({ title, subtitle }) {
  const { colors } = useTheme();
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
      ...typography.styles.h2,
      color: colors.text.primary,
    },
    subtitle: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  });
