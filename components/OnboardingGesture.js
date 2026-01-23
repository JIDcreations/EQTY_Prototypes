import React, { useMemo } from 'react';
import { PanResponder, Pressable, StyleSheet } from 'react-native';

export default function OnboardingGesture({ children, onContinue, style }) {
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 12 && Math.abs(gesture.dy) < 10,
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx < -40) {
            onContinue?.();
          }
        },
      }),
    [onContinue]
  );

  return (
    <Pressable
      style={[styles.pressable, style]}
      onPress={() => onContinue?.()}
      {...panResponder.panHandlers}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
});
