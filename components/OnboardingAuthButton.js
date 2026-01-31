import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import { spacing, useTheme } from '../theme';

export default function OnboardingAuthButton({ label, iconName, onPress }) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);

  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
    >
      <View style={styles.iconWrap}>
        <Ionicons
          name={iconName}
          size={components.sizes.icon.md}
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
      gap: spacing.md,
    },
    iconWrap: {
      width: components.sizes.square.md,
      height: components.sizes.square.md,
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.surfaceActive,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      ...components.button.label,
    },
  });
