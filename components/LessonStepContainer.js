import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { spacing, useTheme } from '../theme';

export default function LessonStepContainer({
  children,
  scrollEnabled = true,
  contentStyle,
}) {
  const { colors, components } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const containerStyle = scrollEnabled
    ? [styles.content, contentStyle, { paddingBottom: insets.bottom }]
    : [styles.content, styles.contentFixed, contentStyle, { paddingBottom: insets.bottom }];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
    </SafeAreaView>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background.app,
    },
    content: {
      paddingTop: spacing.lg,
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingBottom: spacing.none,
      gap: components.layout.contentGap,
    },
    contentFixed: {
      flex: 1,
    },
    contentInner: {
      flex: 1,
    },
  });
