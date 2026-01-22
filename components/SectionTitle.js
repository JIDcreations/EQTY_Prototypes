import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function SectionTitle({ title, subtitle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
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
