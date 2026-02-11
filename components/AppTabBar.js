import React, { useMemo } from 'react';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme';

export default function AppTabBar(props) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);

  return <BottomTabBar {...props} style={[styles.tabBar, props.style]} />;
}

const createStyles = (colors, components) => ({
  tabBar: {
    position: 'absolute',
    left: components.tabBar.inset,
    right: components.tabBar.inset,
    bottom: components.layout.safeArea.bottom + components.tabBar.bottomOffset,
    height: components.tabBar.height,
    paddingTop: components.tabBar.paddingTop,
    paddingBottom: components.tabBar.paddingBottom,
    paddingHorizontal: components.tabBar.paddingHorizontal,
    borderRadius: components.tabBar.radius,
    backgroundColor: components.tabBar.background,
    borderWidth: components.tabBar.borderWidth,
    borderColor: components.tabBar.borderColor,
    shadowColor: colors.ui.divider,
    shadowOpacity: components.shadows.tabBar.opacity,
    shadowRadius: components.shadows.tabBar.radius,
    shadowOffset: {
      width: components.shadows.tabBar.offsetX,
      height: components.shadows.tabBar.offsetY,
    },
    elevation: components.shadows.tabBar.elevation,
  },
});
