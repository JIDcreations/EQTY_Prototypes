import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme';

export default function OnboardingStackedCard({
  children,
  style,
  contentStyle,
  showHandle = true,
}) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);

  return (
    <View style={[styles.stack, style]}>
      <View pointerEvents="none" style={styles.ghostOne} />
      <View pointerEvents="none" style={styles.ghostTwo} />
      <View style={[styles.card, contentStyle]}>
        {showHandle ? <View style={styles.handle} /> : null}
        {children}
      </View>
    </View>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    stack: {
      position: 'relative',
      justifyContent: 'flex-end',
    },
    ghostOne: {
      position: 'absolute',
      top: components.offsets.stackedCard.insetSm,
      left: components.offsets.stackedCard.insetSm,
      right: components.offsets.stackedCard.insetSm,
      height: components.sizes.card.stackHeight,
      borderRadius: components.radius.card,
      backgroundColor: colors.background.surfaceActive,
      opacity: components.opacity.value60,
      transform: [{ rotate: '-1deg' }],
    },
    ghostTwo: {
      position: 'absolute',
      top: components.offsets.stackedCard.insetLg,
      left: components.offsets.stackedCard.insetMd,
      right: components.offsets.stackedCard.insetMd,
      height: components.sizes.card.stackHeight,
      borderRadius: components.radius.card,
      backgroundColor: colors.background.surfaceActive,
      opacity: components.opacity.value35,
      transform: [{ rotate: '1.5deg' }],
    },
    card: {
      backgroundColor: colors.background.surface,
      borderRadius: components.radius.card,
      padding: components.layout.spacing.lg,
      gap: components.layout.cardGap,
      borderWidth: components.borderWidth.thin,
      borderColor: colors.ui.border,
      shadowColor: colors.background.app,
      shadowOpacity: components.shadows.stackedCard.opacity,
      shadowRadius: components.shadows.stackedCard.radius,
      shadowOffset: {
        width: components.shadows.stackedCard.offsetX,
        height: components.shadows.stackedCard.offsetY,
      },
      elevation: components.shadows.stackedCard.elevation,
    },
    handle: {
      width: components.sizes.handle.widthLg,
      height: components.sizes.handle.height,
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.surfaceActive,
      alignSelf: 'center',
    },
  });
