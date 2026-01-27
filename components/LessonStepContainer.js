import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import useThemeColors from '../theme/useTheme';
import { spacing } from '../theme/spacing';

export default function LessonStepContainer({
  children,
  scrollEnabled = true,
  contentStyle,
}) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const containerStyle = scrollEnabled
    ? [styles.content, contentStyle]
    : [styles.content, styles.contentFixed, contentStyle];

  return (
    <SafeAreaView style={styles.safeArea}>
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
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xxxl,
      gap: spacing.lg,
    },
    contentFixed: {
      flex: 1,
    },
    contentInner: {
      flex: 1,
    },
  });
