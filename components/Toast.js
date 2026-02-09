import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
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

export default function Toast({ message, visible, onHide, duration = 1600 }) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(components.layout.spacing.md)).current;
  const toastStyle = useMemo(
    () => [
      styles.toast,
      {
        left: components.layout.pagePaddingHorizontal,
        right: components.layout.pagePaddingHorizontal,
        bottom: components.layout.spacing.none,
      },
    ],
    [components.layout.pagePaddingHorizontal, components.layout.spacing.none, styles.toast]
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
          toValue: components.layout.spacing.md,
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
      marginBottom: components.layout.spacing.xl,
    },
    toastInner: {
      backgroundColor: colors.background.surfaceActive,
      borderRadius: components.radius.input,
      paddingVertical: components.layout.spacing.sm,
      paddingHorizontal: components.layout.spacing.md,
      alignItems: 'center',
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    toastText: {
      ...typography.styles.small,
      color: colors.text.primary,
    },
  });
