import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, typography, useTheme } from '../theme';
import AppText from './AppText';

export default function Toast({ message, visible, onHide, duration = 1600 }) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(spacing.md)).current;
  const toastStyle = useMemo(
    () => [
      styles.toast,
      {
        left: components.layout.pagePaddingHorizontal,
        right: components.layout.pagePaddingHorizontal,
        bottom: insets.bottom,
      },
    ],
    [components.layout.pagePaddingHorizontal, insets.bottom, styles.toast]
  );

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
          toValue: spacing.md,
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
    <Animated.View style={[toastStyle, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.toastInner}>
        <AppText style={styles.toastText}>{message}</AppText>
      </View>
    </Animated.View>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    toast: {
      position: 'absolute',
      marginBottom: spacing.xl,
    },
    toastInner: {
      backgroundColor: colors.background.surfaceActive,
      borderRadius: components.radius.input,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      alignItems: 'center',
      borderWidth: components.borderWidth.thin,
      borderColor: colors.ui.divider,
    },
    toastText: {
      ...typography.styles.small,
      color: colors.text.primary,
    },
  });
