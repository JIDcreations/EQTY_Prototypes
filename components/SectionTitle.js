import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import GlossaryText from './GlossaryText';
import { typography, useTheme } from '../theme';

export default function SectionTitle({ title, subtitle }) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  return (
    <View style={styles.container}>
      <GlossaryText text={title} style={styles.title} />
      {subtitle ? <GlossaryText text={subtitle} style={styles.subtitle} /> : null}
    </View>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    container: {
      gap: components.layout.spacing.xs,
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
