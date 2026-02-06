import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { typography, useTheme } from '../theme';
import AppText from './AppText';

export default function BottomSheet({
  visible,
  title,
  onClose,
  children,
  scrimOpacity: scrimOpacityOverride,
  sheetStyle: sheetStyleOverride,
  contentStyle,
}) {
  const { colors, components } = useTheme();
  const scrimMaxOpacity =
    typeof scrimOpacityOverride === 'number'
      ? scrimOpacityOverride
      : components.opacity.value50;
  const styles = useMemo(
    () => createStyles(colors, components, scrimMaxOpacity),
    [colors, components, scrimMaxOpacity]
  );
  const sheetTranslateDistance =
    components.layout.spacing.xxl * 2 +
    components.layout.spacing.xl +
    components.layout.spacing.md +
    components.layout.spacing.sm +
    components.layout.baseline;
  const scrimFadeDistance = sheetTranslateDistance * 2;
  const velocityCloseThreshold = sheetTranslateDistance * 10;
  const [isMounted, setIsMounted] = useState(visible);
  const translateY = useSharedValue(sheetTranslateDistance);
  const scrimOpacity = useSharedValue(0);

  const handleClose = () => {
    if (onClose) onClose();
  };

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      translateY.value = sheetTranslateDistance;
      scrimOpacity.value = 0;
      translateY.value = withTiming(0, { duration: 220 });
      scrimOpacity.value = withTiming(1, { duration: 220 });
    } else if (isMounted) {
      translateY.value = withTiming(sheetTranslateDistance, { duration: 180 }, (finished) => {
        if (finished) runOnJS(setIsMounted)(false);
      });
      scrimOpacity.value = withTiming(0, { duration: 180 });
    }
  }, [visible, isMounted, scrimOpacity, sheetTranslateDistance, translateY]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const scrimStyle = useAnimatedStyle(() => ({
    opacity: scrimOpacity.value,
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = Math.max(0, event.translationY);
      const nextOpacity = 1 - Math.min(event.translationY / scrimFadeDistance, 1) * 0.5;
      scrimOpacity.value = Math.max(0, nextOpacity);
    })
    .onEnd((event) => {
      const shouldClose =
        event.translationY > sheetTranslateDistance ||
        event.velocityY > velocityCloseThreshold;
      if (shouldClose) {
        runOnJS(handleClose)();
      } else {
        translateY.value = withTiming(0, { duration: 180 });
        scrimOpacity.value = withTiming(1, { duration: 180 });
      }
    });

  if (!isMounted) return null;

  return (
    <Modal visible={isMounted} transparent animationType="none" onRequestClose={handleClose}>
      <View style={styles.container}>
        <Animated.View style={[styles.scrim, scrimStyle]}>
          <Pressable style={styles.scrimPressable} onPress={handleClose} />
        </Animated.View>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.sheet, sheetStyleOverride, sheetStyle]}>
            <View style={styles.handle} />
            <View style={styles.headerRow}>
              {title ? <AppText style={styles.title}>{title}</AppText> : <View />}
              <Pressable onPress={handleClose} style={styles.closeButton}>
                <Ionicons
                  name="close"
                  size={components.sizes.icon.lg}
                  color={colors.text.secondary}
                />
              </Pressable>
            </View>
            <View style={[styles.content, contentStyle]}>{children}</View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const createStyles = (colors, components, scrimMaxOpacity) => {
  const scrimColor = toRgba(colors.text.primary, scrimMaxOpacity);

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    scrim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: scrimColor,
    },
    scrimPressable: {
      flex: 1,
    },
    sheet: {
      backgroundColor: colors.background.surfaceActive,
      borderTopLeftRadius: components.radius.card,
      borderTopRightRadius: components.radius.card,
      borderWidth: components.borderWidth.thin,
      borderColor: colors.ui.divider,
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingTop: components.layout.spacing.md,
      paddingBottom: components.layout.spacing.xxl + components.layout.safeArea.bottom,
    },
    handle: {
      width: components.sizes.handle.width,
      height: components.sizes.handle.height,
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.surface,
      alignSelf: 'center',
      marginBottom: components.layout.spacing.md,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: components.layout.spacing.sm,
    },
    title: {
      ...typography.styles.h2,
      color: colors.text.primary,
      flex: 1,
    },
    closeButton: {
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      borderRadius: components.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background.surface,
      marginLeft: components.layout.spacing.sm,
    },
    content: {
      gap: components.layout.spacing.sm,
    },
  });
};
