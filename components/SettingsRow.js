import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography, useTheme } from '../theme';
import AppText from './AppText';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function SettingsRow({
  label,
  value,
  onPress,
  right,
  subtitle,
  isLast = false,
  disabled = false,
  containerStyle,
}) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.row,
        !isLast && styles.rowDivider,
        disabled && styles.rowDisabled,
        containerStyle,
      ]}
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
      gap: components.layout.spacing.sm,
    },
    rowDivider: {
      borderBottomWidth: components.borderWidth.thin,
      borderBottomColor: toRgba(colors.text.primary, components.opacity.value20),
    },
    rowDisabled: {
      opacity: components.opacity.value60,
    },
    rowContent: {
      flex: 1,
      gap: components.layout.spacing.xs,
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
      gap: components.layout.spacing.xs,
    },
  });
