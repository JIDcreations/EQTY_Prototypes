import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { typography } from '../theme/typography';
import AppText from './AppText';
import useThemeColors from '../theme/useTheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function usePressScale() {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withTiming(0.98, { duration: 120 });
  };

  const onPressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };

  return { animatedStyle, onPressIn, onPressOut };
}

export function PrimaryButton({ label, onPress, style, disabled }) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  return (
    <AnimatedPressable
      style={[styles.primaryButton, animatedStyle, disabled && styles.disabled, style]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <AppText style={styles.primaryLabel}>{label}</AppText>
    </AnimatedPressable>
  );
}

export function SecondaryButton({ label, onPress, style, disabled, tone = 'default' }) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();
  const isAccent = tone === 'accent';

  return (
    <AnimatedPressable
      style={[styles.secondaryButton, animatedStyle, disabled && styles.disabled, style]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={[styles.secondaryBorder, isAccent && styles.secondaryBorderAccent]} />
      <AppText style={[styles.secondaryLabel, isAccent && styles.secondaryLabelAccent]}>
        {label}
      </AppText>
    </AnimatedPressable>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    primaryButton: {
      backgroundColor: colors.accent,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryLabel: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: typography.body,
      color: colors.background,
      letterSpacing: 0.3,
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    secondaryBorder: {
      position: 'absolute',
      inset: 0,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.surfaceActive,
    },
    secondaryBorderAccent: {
      borderColor: colors.accent,
    },
    secondaryLabel: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
      color: colors.textPrimary,
    },
    secondaryLabelAccent: {
      color: colors.accent,
    },
    disabled: {
      opacity: 0.55,
    },
  });
