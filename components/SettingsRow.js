import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, typography, useTheme } from '../theme';
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
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
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
          <Ionicons
            name="chevron-forward"
            size={components.sizes.icon.md}
            color={colors.text.secondary}
          />
        ) : null}
      </View>
    </Container>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    row: {
      ...components.list.row,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    rowDivider: {
      borderBottomWidth: components.borderWidth.thin,
      borderBottomColor: colors.ui.divider,
    },
    rowDisabled: {
      opacity: components.opacity.value60,
    },
    rowContent: {
      flex: 1,
      gap: spacing.xs,
    },
    label: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    subtitle: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    value: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    rowRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
  });
