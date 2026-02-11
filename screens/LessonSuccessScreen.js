import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import OnboardingScreen from '../components/OnboardingScreen';
import OnboardingStackedCard from '../components/OnboardingStackedCard';
import AppText from '../components/AppText';
import { PrimaryButton } from '../components/Button';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getLessonContent, getLessonStepCopy } from '../utils/localization';

export default function LessonSuccessScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { lessonId } = route.params || {};
  const { preferences } = useApp();
  const { colors, components } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight),
    [colors, components, tabBarHeight]
  );
  const copy = useMemo(() => getLessonStepCopy(preferences?.language), [preferences?.language]);
  const content = getLessonContent(lessonId, preferences?.language);
  const lessonTitle = content?.title || copy.lessonSuccess.fallbackTitle;
  const subtitle = copy.lessonSuccess.subtitle
    ? copy.lessonSuccess.subtitle(lessonTitle)
    : '';
  const detail =
    lessonId === 'lesson_0' ? copy.lessonSuccess.introDetail : copy.lessonSuccess.detail;
  const handleReturnHome = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('Home');
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <OnboardingScreen
      backgroundVariant="bg3"
      showGlow={false}
      contentContainerStyle={styles.screen}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <OnboardingStackedCard>
            <View style={styles.cardHeader}>
              <AppText style={styles.title}>{copy.lessonSuccess.title}</AppText>
            </View>
            <AppText style={styles.subtitle}>{subtitle}</AppText>
            <AppText style={styles.detail}>{detail}</AppText>
          </OnboardingStackedCard>
        </View>
        <View style={styles.footer}>
          <PrimaryButton
            label={copy.lessonSuccess.cta}
            onPress={handleReturnHome}
          />
        </View>
      </View>
    </OnboardingScreen>
  );
}

const createStyles = (colors, components, tabBarHeight) =>
  StyleSheet.create({
    screen: {
      paddingBottom: tabBarHeight,
    },
    container: {
      flex: 1,
      paddingBottom: components.layout.spacing.xl,
      paddingTop: components.layout.spacing.xl,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      transform: [{ translateY: components.offsets.translate.sm }],
    },
    cardHeader: {
      gap: components.layout.spacing.sm,
    },
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
    },
    subtitle: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    detail: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    footer: {
      paddingTop: components.layout.spacing.lg,
    },
  });
