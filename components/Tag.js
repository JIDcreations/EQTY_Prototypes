import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import AppText from './AppText';

export default function Tag({ label, tone = 'default', style }) {
  return (
    <View style={[styles.base, tone === 'accent' && styles.accent, style]}>
      <AppText style={[styles.text, tone === 'accent' && styles.textAccent]}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.surfaceActive,
  },
  accent: {
    backgroundColor: 'rgba(198, 146, 29, 0.18)',
  },
  text: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small,
  },
  textAccent: {
    color: colors.accent,
  },
});
