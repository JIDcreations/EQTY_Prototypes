import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function BottomSheet({ visible, title, onClose, children }) {
  const insets = useSafeAreaInsets();
  const [isMounted, setIsMounted] = useState(visible);
  const translateY = useSharedValue(120);
  const scrimOpacity = useSharedValue(0);

  const handleClose = () => {
    if (onClose) onClose();
  };

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      translateY.value = 120;
      scrimOpacity.value = 0;
      translateY.value = withTiming(0, { duration: 220 });
      scrimOpacity.value = withTiming(1, { duration: 220 });
    } else if (isMounted) {
      translateY.value = withTiming(120, { duration: 180 }, (finished) => {
        if (finished) runOnJS(setIsMounted)(false);
      });
      scrimOpacity.value = withTiming(0, { duration: 180 });
    }
  }, [visible, isMounted, scrimOpacity, translateY]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const scrimStyle = useAnimatedStyle(() => ({
    opacity: scrimOpacity.value,
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = Math.max(0, event.translationY);
      const nextOpacity = 1 - Math.min(event.translationY / 240, 1) * 0.5;
      scrimOpacity.value = Math.max(0, nextOpacity);
    })
    .onEnd((event) => {
      const shouldClose = event.translationY > 120 || event.velocityY > 1200;
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
          <Animated.View
            style={[
              styles.sheet,
              sheetStyle,
              { paddingBottom: spacing.xxl + insets.bottom },
            ]}
          >
            <View style={styles.handle} />
            <View style={styles.headerRow}>
              {title ? <Text style={styles.title}>{title}</Text> : <View />}
              <Pressable onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>
            <View style={styles.content}>{children}</View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 22, 28, 0.65)',
  },
  scrimPressable: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.surfaceActive,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surface,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: typography.fontFamilyDemi,
    color: colors.textPrimary,
    fontSize: typography.h2,
    flex: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    marginLeft: spacing.sm,
  },
  content: {
    gap: spacing.sm,
  },
});
