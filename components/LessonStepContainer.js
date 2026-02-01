import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../theme';

export default function LessonStepContainer({
  children,
  scrollEnabled = true,
  contentStyle,
}) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const containerStyle = scrollEnabled
    ? [styles.content, contentStyle]
    : [styles.content, styles.contentFixed, contentStyle];

  return (
    <View style={styles.safeArea}>
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

const createStyles = (colors, components) =>
  StyleSheet.create({
    safeArea: {
      ...components.screen.container,
    },
    content: {
      paddingTop: components.layout.spacing.lg,
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingBottom: components.layout.spacing.none,
      gap: components.layout.contentGap,
    },
    contentFixed: {
      flex: 1,
    },
    contentInner: {
      flex: 1,
    },
  });
