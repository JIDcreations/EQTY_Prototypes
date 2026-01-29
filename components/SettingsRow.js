import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useThemeColors from '../theme/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import AppText from './AppText';

export default function SettingsRow({
  label,
  value,
  onPress,
  right,
  subtitle,
  isLast = false,
  disabled = false,
}) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      disabled={disabled}
      style={[styles.row, !isLast && styles.rowDivider, disabled && styles.rowDisabled]}
    >
      <View style={styles.rowContent}>
        <AppText style={styles.label}>{label}</AppText>
        {subtitle ? <AppText style={styles.subtitle}>{subtitle}</AppText> : null}
      </View>
      <View style={styles.rowRight}>
        {value ? <AppText style={styles.value}>{value}</AppText> : null}
        {right || null}
        {onPress ? (
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        ) : null}
      </View>
    </Container>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    rowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    rowDisabled: {
      opacity: 0.6,
    },
    rowContent: {
      flex: 1,
      gap: 4,
    },
    label: {
      fontFamily: typography.fontFamilyMedium,
      color: colors.textPrimary,
      fontSize: typography.body,
    },
    subtitle: {
      fontFamily: typography.fontFamilyMedium,
      color: colors.textSecondary,
      fontSize: typography.small,
    },
    value: {
      fontFamily: typography.fontFamilyMedium,
      color: colors.textSecondary,
      fontSize: typography.small,
    },
    rowRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
  });
