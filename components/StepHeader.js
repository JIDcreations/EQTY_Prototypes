import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import ProgressBar from './ProgressBar';
import GlossaryText from './GlossaryText';
import AppText from './AppText';
import useThemeColors from '../theme/useTheme';

export default function StepHeader({
  step,
  total,
  title,
  onBack,
  onPressTerm,
  stepLabel,
  progressText,
  showTitle = true,
}) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isPlainTitle = typeof title === 'string' || typeof title === 'number';
  const titleNode = isPlainTitle ? (
    <GlossaryText text={String(title)} style={styles.title} onPressTerm={onPressTerm} />
  ) : (
    title
  );
  const progressLabel = progressText || `Step ${step} of ${total}`;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <AppText style={styles.stepText}>{progressLabel}</AppText>
      </View>
      {stepLabel ? <AppText style={styles.stepLabel}>{stepLabel}</AppText> : null}
      {showTitle ? titleNode : null}
      <ProgressBar progress={step / total} />
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
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
      fontSize: typography.small - 1,
      letterSpacing: 0.6,
    },
    stepLabel: {
      fontFamily: typography.fontFamilyDemi,
      color: colors.textPrimary,
      fontSize: typography.small,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
    },
    title: {
      fontFamily: typography.fontFamilyDemi,
      color: colors.textPrimary,
      fontSize: typography.h1,
    },
  });
