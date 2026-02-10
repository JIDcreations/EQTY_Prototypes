import React, { useContext, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme';

export default function LessonStepContainer({
  children,
  scrollEnabled = true,
  contentStyle,
}) {
  const { colors, components } = useTheme();
  const tabBarHeight = useContext(BottomTabBarHeightContext) || 0;
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight),
    [colors, components, tabBarHeight]
  );
  const containerStyle = scrollEnabled
    ? [styles.content, styles.contentScroll, contentStyle]
    : [styles.content, styles.contentFixed, contentStyle];
  const wrapperStyle = scrollEnabled ? styles.containerScroll : styles.safeArea;

  return (
    <View style={wrapperStyle}>
      {scrollEnabled ? (
        <ScrollView
          contentContainerStyle={containerStyle}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(280)}>{children}</Animated.View>
        </ScrollView>
      ) : (
        <View style={containerStyle}>
          <Animated.View style={styles.contentInner} entering={FadeInDown.duration(280)}>
            {children}
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const createStyles = (colors, components, tabBarHeight) =>
  StyleSheet.create({
    safeArea: {
      ...components.screen.container,
    },
    containerScroll: {
      ...components.screen.containerScroll,
    },
    content: {
      paddingTop: components.layout.spacing.lg,
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingBottom: components.layout.spacing.none,
      gap: components.layout.contentGap,
    },
    contentScroll: {
      paddingTop: components.layout.safeArea.top + components.layout.spacing.lg,
      paddingBottom: components.layout.safeArea.bottom + tabBarHeight,
    },
    contentFixed: {
      flex: 1,
      paddingBottom: tabBarHeight,
    },
    contentInner: {
      flex: 1,
    },
  });
