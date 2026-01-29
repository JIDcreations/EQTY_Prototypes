import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import useThemeColors from '../theme/useTheme';
import { layout } from '../theme/layout';
import { spacing } from '../theme/spacing';

export default function LessonStepContainer({
  children,
  scrollEnabled = true,
  contentStyle,
}) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
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

const createStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingTop: spacing.lg,
      paddingHorizontal: layout.sideMargin,
      paddingBottom: 0,
      gap: spacing.lg,
    },
    contentFixed: {
      flex: 1,
    },
    contentInner: {
      flex: 1,
    },
  });
