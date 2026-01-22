import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import useThemeColors from '../theme/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import AppText from './AppText';

export default function Toast({ message, visible, onHide, duration = 1600 }) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 12,
            duration: 180,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (onHide) onHide();
        });
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onHide, opacity, translateY, visible]);

  if (!visible || !message) return null;

  return (
    <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.toastInner}>
        <AppText style={styles.toastText}>{message}</AppText>
      </View>
    </Animated.View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    toast: {
      position: 'absolute',
      left: spacing.lg,
      right: spacing.lg,
      bottom: spacing.xl,
    },
    toastInner: {
      backgroundColor: colors.surfaceActive,
      borderRadius: 14,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.divider,
    },
    toastText: {
      fontFamily: typography.fontFamilyMedium,
      color: colors.textPrimary,
      fontSize: typography.small,
    },
  });
