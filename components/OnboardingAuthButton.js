import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import { useTheme } from '../theme';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function OnboardingAuthButton({
  label,
  iconName,
  onPress,
  iconSize,
  iconContainerSize,
  bordered = false,
}) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const resolvedIconSize = iconSize ?? components.sizes.icon.md;
  const resolvedIconContainerSize = iconContainerSize ?? components.sizes.square.md;

  return (
    <Pressable
      style={[styles.button, bordered && styles.bordered]}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconWrap,
          {
            width: resolvedIconContainerSize,
            height: resolvedIconContainerSize,
          },
        ]}
      >
        <Ionicons
          name={iconName}
          size={resolvedIconSize}
          color={colors.text.primary}
        />
      </View>
      <AppText style={styles.label}>{label}</AppText>
    </Pressable>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    button: {
      ...components.button.base,
      ...components.button.secondary,
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.md,
    },
    bordered: {
      borderColor: toRgba(colors.text.primary, components.opacity.value35),
    },
    iconWrap: {
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.surfaceActive,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      ...components.button.label,
    },
  });
