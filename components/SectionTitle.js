import React from 'react';
import { StyleSheet, View } from 'react-native';
import GlossaryText from './GlossaryText';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function SectionTitle({ title, subtitle }) {
  return (
    <View style={styles.container}>
      <GlossaryText text={title} style={styles.title} />
      {subtitle ? <GlossaryText text={subtitle} style={styles.subtitle} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
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
