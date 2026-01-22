import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useThemeColors from '../theme/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import AppText from './AppText';

export default function SettingsHeader({ title, subtitle, onBack, rightAction }) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
          </Pressable>
        ) : (
          <View style={styles.backSpacer} />
        )}
        {rightAction ? rightAction : <View style={styles.backSpacer} />}
      </View>
      <AppText style={styles.title}>{title}</AppText>
      {subtitle ? <AppText style={styles.subtitle}>{subtitle}</AppText> : null}
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      gap: spacing.xs,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backSpacer: {
      width: 36,
      height: 36,
    },
    title: {
      fontFamily: typography.fontFamilyDemi,
      color: colors.textPrimary,
      fontSize: typography.h1,
    },
    subtitle: {
      fontFamily: typography.fontFamilyMedium,
      color: colors.textSecondary,
      fontSize: typography.small,
    },
  });
