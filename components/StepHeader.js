import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import ProgressBar from './ProgressBar';
import GlossaryText from './GlossaryText';
import AppText from './AppText';

export default function StepHeader({ step, total, title, onBack, onPressTerm }) {
  const isPlainTitle = typeof title === 'string' || typeof title === 'number';
  const titleNode = isPlainTitle ? (
    <GlossaryText text={String(title)} style={styles.title} onPressTerm={onPressTerm} />
  ) : (
    title
  );

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <AppText style={styles.stepText}>{`Step ${step} of ${total}`}</AppText>
      </View>
      {titleNode}
      <ProgressBar progress={step / total} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small,
    letterSpacing: 0.4,
  },
  title: {
    fontFamily: typography.fontFamilyDemi,
    color: colors.textPrimary,
    fontSize: typography.h1,
  },
});
