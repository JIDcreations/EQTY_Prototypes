import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

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
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  return (
    <AnimatedPressable
      style={[styles.primaryButton, animatedStyle, disabled && styles.disabled, style]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.primaryLabel}>{label}</Text>
    </AnimatedPressable>
  );
}

export function SecondaryButton({ label, onPress, style, disabled }) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale();

  return (
    <AnimatedPressable
      style={[styles.secondaryButton, animatedStyle, disabled && styles.disabled, style]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.secondaryBorder} />
      <Text style={styles.secondaryLabel}>{label}</Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 14,
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
    paddingVertical: 14,
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
  secondaryLabel: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.body,
    color: colors.textPrimary,
  },
  disabled: {
    opacity: 0.55,
  },
});
