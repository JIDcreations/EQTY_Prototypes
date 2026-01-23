import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import useThemeColors from '../theme/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function OnboardingAuthButton({ label, iconName, onPress, variant = 'dark' }) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isLight = variant === 'light';

  return (
    <Pressable
      style={[styles.button, isLight && styles.buttonLight]}
      onPress={onPress}
    >
      <View style={[styles.iconWrap, isLight && styles.iconWrapLight]}>
        <Ionicons
          name={iconName}
          size={18}
          color={isLight ? colors.background : colors.textPrimary}
        />
      </View>
      <AppText style={[styles.label, isLight && styles.labelLight]}>{label}</AppText>
    </Pressable>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    button: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      borderWidth: 1,
      borderColor: colors.surfaceActive,
    },
    buttonLight: {
      backgroundColor: colors.textPrimary,
      borderColor: 'transparent',
    },
    iconWrap: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.surfaceActive,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconWrapLight: {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
    label: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: typography.body,
      color: colors.textPrimary,
    },
    labelLight: {
      color: colors.background,
    },
  });
