import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AppText from '../components/AppText';
import Card from '../components/Card';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import GlossaryText from '../components/GlossaryText';
import SectionTitle from '../components/SectionTitle';
import { useApp } from '../utils/AppContext';
import { getLessonContent, getLessonOverviewCopy, getLocalizedLessons, formatLessonModuleLabel } from '../utils/localization';
import { typography, useTheme } from '../theme';

export default function LessonOverviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const tabBarHeight = useBottomTabBarHeight();
  const { lessonId, entrySource } = route.params || {};
  const { preferences, onboardingContext } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight),
    [colors, components, tabBarHeight]
  );
  const [isStructureOpen, setIsStructureOpen] = useState(false);
  const overviewCopy = useMemo(
    () => getLessonOverviewCopy(preferences?.language),
    [preferences?.language]
  );
  const localizedLessons = useMemo(
    () => getLocalizedLessons(preferences?.language),
    [preferences?.language]
  );
  const lesson = localizedLessons.find((item) => item.id === lessonId);
  if (!lesson) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <AppText style={styles.fallbackTitle}>Lesson not found</AppText>
          <SecondaryButton label={overviewCopy.back} onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }
  const content = getLessonContent(lesson.id, preferences?.language);
  const moduleNumber = lesson.moduleId?.split('_')[1];
  const moduleLabel = formatLessonModuleLabel(preferences?.language, moduleNumber, lesson.order);
  const takeaways =
    content?.steps?.summary?.takeaways?.length > 0
      ? content.steps.summary.takeaways
      : [lesson.shortDescription];
  const isLessonGateRequired =
    lesson.id === 'lesson_1' && !onboardingContext?.onboardingComplete;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppText style={styles.moduleLabel}>{moduleLabel}</AppText>
          <GlossaryText text={lesson.title} style={styles.title} />
          <GlossaryText text={lesson.shortDescription} style={styles.subtitle} />
        </View>

        <Card style={styles.learnCard}>
          <SectionTitle title={overviewCopy.whatYoullLearn} subtitle={overviewCopy.keyTakeaways} />
          <View style={styles.bulletList}>
            {takeaways.map((item, index) => (
              <View key={`${index}-${item}`} style={styles.bulletRow}>
                <View style={styles.bulletIndex}>
                  <AppText style={styles.bulletIndexText}>{index + 1}</AppText>
                </View>
                <GlossaryText text={item} style={styles.bulletText} />
              </View>
            ))}
          </View>
        </Card>

        <View style={styles.structureContainer}>
          <Card style={styles.structureCard}>
            <Pressable
              onPress={() => setIsStructureOpen((prev) => !prev)}
              style={({ pressed }) => [styles.structureRow, pressed && styles.structurePressed]}
            >
              <AppText style={styles.structureTitle}>{overviewCopy.lessonStructure}</AppText>
              <View style={styles.structureToggle}>
                <Ionicons
                  name={isStructureOpen ? 'chevron-up' : 'chevron-down'}
                  size={components.sizes.icon.md}
                  color={colors.text.secondary}
                />
              </View>
            </Pressable>
            {isStructureOpen ? (
              <View style={styles.stepList}>
                <AppText style={styles.flowHeader}>{overviewCopy.lessonFlowHeader}</AppText>
                {overviewCopy.stepLabels.map((label, index) => (
                  <View key={label} style={styles.stepRow}>
                    <View style={styles.stepIndex}>
                      <GlossaryText text={index + 1} style={styles.stepNumber} />
                    </View>
                    <GlossaryText text={label} style={styles.stepLabel} />
                  </View>
                ))}
              </View>
            ) : null}
          </Card>
        </View>

        <View style={styles.ctaStack}>
          <PrimaryButton
            label={overviewCopy.startLesson}
            onPress={() => {
              if (isLessonGateRequired) {
                navigation.navigate('OnboardingRequired', { entrySource });
                return;
              }
              navigation.navigate('LessonStep', {
                lessonId: lesson.id,
                step: 1,
                entrySource,
              });
            }}
          />
          <SecondaryButton label={overviewCopy.back} onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors, components, tabBarHeight) =>
  StyleSheet.create({
    container: {
      ...components.screen.containerScroll,
      flex: 1,
      backgroundColor: colors.background.app,
    },
    content: {
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingTop: components.layout.safeArea.top + components.layout.spacing.lg,
      gap: components.layout.contentGap,
      paddingBottom: components.layout.safeArea.bottom + tabBarHeight,
    },
    header: {
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
    fallbackTitle: {
      ...typography.styles.h2,
      color: colors.text.primary,
    },
    moduleLabel: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    learnCard: {
      ...components.card.base,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.border, colors.opacity.stroke),
      backgroundColor: colors.background.surfaceActive,
    },
    bulletList: {
      gap: components.layout.spacing.sm,
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: components.layout.spacing.sm,
    },
    bulletIndex: {
      width: components.sizes.square.xs,
      height: components.sizes.square.xs,
      borderRadius: components.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: toRgba(colors.accent.primary, colors.opacity.tint),
      marginTop: components.layout.spacing.none,
    },
    bulletIndexText: {
      ...typography.styles.small,
      color: colors.text.primary,
    },
    bulletText: {
      flex: 1,
      ...typography.styles.body,
      color: colors.text.primary,
    },
    structureContainer: {
      gap: components.layout.spacing.sm,
    },
    structureCard: {
      ...components.card.base,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    structureTitle: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    structureToggle: {
      width: components.sizes.square.xs,
      height: components.sizes.square.xs,
      borderRadius: components.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      backgroundColor: colors.background.surfaceActive,
    },
    structurePressed: {
      opacity: colors.opacity.emphasis,
    },
    structureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.md,
    },
    stepList: {
      gap: components.layout.spacing.xs,
      paddingTop: components.layout.spacing.sm,
    },
    flowHeader: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    stepRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.md,
    },
    stepIndex: {
      width: components.sizes.square.xs,
      height: components.sizes.square.xs,
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.surfaceActive,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepNumber: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    stepLabel: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    ctaStack: {
      gap: components.layout.spacing.md,
      paddingTop: components.layout.spacing.md,
    },
  });

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
