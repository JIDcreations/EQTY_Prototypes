import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import { PrimaryButton } from '../components/Button';
import GlossaryText from '../components/GlossaryText';
import OnboardingScreen from '../components/OnboardingScreen';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import SectionTitle from '../components/SectionTitle';
import {
  getHomeCopy,
  getLocalizedLessons,
} from '../utils/localization';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';

export default function HomeScreen() {
  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const { progress, authUser, preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight),
    [colors, components, tabBarHeight]
  );
  const homeCopy = useMemo(() => getHomeCopy(preferences?.language), [preferences?.language]);

  const localizedLessons = useMemo(
    () => getLocalizedLessons(preferences?.language),
    [preferences?.language]
  );
  const sortedLessons = useMemo(
    () => [...localizedLessons].sort((a, b) => a.order - b.order),
    [localizedLessons]
  );
  const totalLessons = sortedLessons.length;
  const currentLesson =
    sortedLessons.find((lesson) => lesson.id === progress.currentLessonId) ||
    sortedLessons[0];
  const currentLessonIndex = sortedLessons.findIndex(
    (lesson) => lesson.id === currentLesson?.id
  );
  const lessonPosition = currentLessonIndex >= 0 ? currentLessonIndex + 1 : 1;
  const completedLessonIds = progress.completedLessonIds || [];
  const completedCount = Math.min(
    completedLessonIds.filter((lessonId) =>
      sortedLessons.some((lesson) => lesson.id === lessonId)
    ).length,
    totalLessons
  );
  const seriesProgress = totalLessons > 0 ? completedCount / totalLessons : 0;
  const displaySeriesProgress =
    seriesProgress === 0 ? 0.06 : Math.min(1, Math.max(0, seriesProgress));

  const greeting = getGreeting(homeCopy);
  const displayName = getDisplayName(authUser, homeCopy);
  const lessonTitle = currentLesson?.title || homeCopy.lessonFallbackTitle;
  const lessonDescription = currentLesson?.shortDescription || homeCopy.lessonFallbackDescription;
  const primaryCtaLabel =
    completedCount > 0 ? homeCopy.continueLesson : homeCopy.startLesson;
  const heroDescription = lessonDescription;
  const greetingLine = `${greeting}, ${displayName}`;
  const themes = useMemo(
    () => [
      { id: 't0', order: 0, title: 'Fundament', lessons: 1, state: 'in-progress' },
      { id: 't1', order: 1, title: 'Target', lessons: 2, state: 'upcoming' },
      {
        id: 't2',
        order: 2,
        title: 'Drivers',
        lessons: 4,
        state: 'upcoming',
      },
      {
        id: 't3',
        order: 3,
        title: 'Financial Investment Strategy',
        lessons: 6,
        state: 'upcoming',
      },
      { id: 't4', order: 4, title: 'Capital Allocation', lessons: 4, state: 'upcoming' },
      { id: 't5', order: 5, title: 'Investment Vehicles', lessons: 5, state: 'upcoming' },
      {
        id: 't6',
        order: 6,
        title: 'Execution',
        lessons: 3,
        state: 'upcoming',
      },
      { id: 't7', order: 7, title: 'Afsluitende module', lessons: 1, state: 'upcoming' },
    ],
    []
  );
  const quickActions = useMemo(
    () => [
      {
        id: 'resources',
        title: 'Extra info',
        subtitle: 'Sources and deeper context',
        icon: 'book-outline',
        target: 'Glossary',
      },
      {
        id: 'videos',
        title: 'Videos',
        subtitle: 'Quick visual explainers',
        icon: 'play-circle-outline',
        target: 'Lessons',
      },
    ],
    []
  );

  return (
    <OnboardingScreen
      scroll
      backgroundVariant="bg3"
      contentContainerStyle={styles.content}
    >
      <View style={styles.topBlock}>
        <View style={styles.header}>
          <View style={styles.headerMainRow}>
            <View style={styles.headerGreeting}>
              <GlossaryText text={greetingLine} style={styles.greeting} />
            </View>
            <Pressable
              onPress={() => navigation.navigate('Profile')}
              style={styles.profileButton}
              hitSlop={components.layout.spacing.sm}
            >
              <Ionicons
                name="person-outline"
                size={components.sizes.icon.lg}
                color={colors.text.primary}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.trajectoryBlock}>
          <GlossaryText
            text={formatLessonPosition(lessonPosition, totalLessons)}
            style={styles.trajectoryMeta}
          />
          <View style={styles.trajectoryBar}>
            <ProgressBar progress={displaySeriesProgress} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Card style={[styles.heroStack, styles.heroCard]}>
          <GlossaryText
            text={homeCopy.lessonShort(lessonPosition)}
            style={styles.heroStepLabel}
            numberOfLines={1}
          />
          <GlossaryText text={lessonTitle} style={styles.heroTitle} />
          {heroDescription ? (
            <AppText style={styles.heroSubtitle}>{heroDescription}</AppText>
          ) : null}
          <PrimaryButton
            label={primaryCtaLabel}
            onPress={() =>
              navigation.navigate('Lessons', {
                screen: 'LessonOverview',
                params: {
                  lessonId: currentLesson?.id,
                  entrySource: 'Home',
                },
              })
            }
            style={styles.heroButton}
          />
        </Card>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <SectionTitle title="Verken het leerpad" />
          <Pressable onPress={() => navigation.navigate('Lessons')}>
            <AppText style={styles.viewAll}>Bekijk alles</AppText>
          </Pressable>
        </View>
        <View style={styles.themeList}>
          {themes.slice(0, 3).map((theme) => (
            <Pressable
              key={theme.id}
              onPress={() =>
                navigation.navigate('Lessons', {
                  screen: 'LessonsHome',
                  params: { moduleId: `module_${theme.order}` },
                })
              }
              style={({ pressed }) => [
                styles.themeItem,
                pressed && styles.themeItemPressed,
              ]}
            >
              <View style={styles.themeCard}>
                <View style={styles.themeHeader}>
                  <AppText style={styles.themeLabel}>{`Thema ${theme.order + 1}`}</AppText>
                  <View style={styles.themeHeaderRight}>
                    <AppText style={styles.themeState}>
                      {getThemeStateLabel(theme.state)}
                    </AppText>
                    <Ionicons
                      name="chevron-forward"
                      size={components.sizes.icon.sm}
                      color={colors.text.secondary}
                    />
                  </View>
                </View>
                <GlossaryText text={theme.title} style={styles.themeTitle} />
                <View style={styles.themeMetaRow}>
                  <AppText style={styles.themeMeta}>
                    {formatLessonCount(theme.lessons)}
                  </AppText>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Hulpmiddelen" />
        <View style={styles.actionRow}>
          {quickActions.map((action) => (
            <Pressable
              key={action.id}
              onPress={() => navigation.navigate(action.target)}
              style={({ pressed }) => [
                styles.actionItem,
                pressed && styles.actionItemPressed,
              ]}
            >
              <View style={styles.actionCard}>
                <Ionicons
                  name={action.icon}
                  size={components.sizes.icon.lg}
                  color={colors.text.secondary}
                />
                <AppText style={styles.actionTitle}>{action.title}</AppText>
                <AppText style={styles.actionSubtitle}>{action.subtitle}</AppText>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

    </OnboardingScreen>
  );
}

const createStyles = (colors, components, tabBarHeight) =>
  StyleSheet.create({
    content: {
      paddingTop: components.layout.safeArea.top + components.layout.spacing.xl,
      paddingBottom:
        components.layout.safeArea.bottom + tabBarHeight + components.layout.spacing.md,
    },
    topBlock: {
      gap: components.layout.spacing.md,
    },
    header: {
      gap: components.layout.spacing.sm,
    },
    headerMainRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.md,
    },
    headerGreeting: {
      flex: 1,
    },
    greeting: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    profileButton: {
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      borderRadius: components.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
    },
    section: {
      gap: components.layout.spacing.md,
    },
    trajectoryBlock: {
      gap: components.layout.spacing.sm,
    },
    heroStack: {
      width: '100%',
      maxWidth: components.layout.contentWidth,
      alignSelf: 'center',
    },
    heroCard: {
      padding: components.layout.spacing.xxl,
      gap: components.layout.spacing.lg,
      backgroundColor: toRgba(colors.background.surfaceActive, colors.opacity.surface),
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    heroStepLabel: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
      maxWidth: '100%',
    },
    heroTitle: {
      ...typography.styles.h1,
      color: colors.text.primary,
      flexShrink: 1,
      maxWidth: '100%',
      width: '100%',
    },
    heroSubtitle: {
      ...typography.styles.body,
      color: colors.text.secondary,
      flexShrink: 1,
      maxWidth: '100%',
      width: '100%',
    },
    heroButton: {
      alignSelf: 'stretch',
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.md,
    },
    viewAll: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    themeList: {
      gap: components.layout.spacing.md,
    },
    themeItem: {
      borderRadius: components.radius.card,
    },
    themeItemPressed: {
      opacity: colors.opacity.emphasis,
      transform: [{ scale: components.transforms.scalePressed }],
    },
    themeCard: {
      ...components.input.container,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      padding: components.layout.spacing.lg,
      gap: components.layout.spacing.xs,
    },
    themeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.sm,
    },
    themeHeaderRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.xs,
    },
    themeLabel: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    themeState: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    themeTitle: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
      flexShrink: 1,
    },
    themeMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
    },
    themeMeta: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    actionRow: {
      flexDirection: 'row',
      gap: components.layout.spacing.md,
    },
    actionItem: {
      flex: 1,
      borderRadius: components.radius.card,
    },
    actionItemPressed: {
      opacity: colors.opacity.emphasis,
      transform: [{ scale: components.transforms.scalePressed }],
    },
    actionCard: {
      ...components.input.container,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      padding: components.layout.spacing.lg,
      gap: components.layout.spacing.sm,
      alignItems: 'flex-start',
      minHeight: components.sizes.list.minItemHeight,
    },
    actionTitle: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
    },
    actionSubtitle: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    trajectoryBar: {
    },
    trajectoryMeta: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
  });

const getGreeting = (homeCopy) => homeCopy.greetingHi || 'Hi';

const formatLessonCount = (count) => `${count} ${count === 1 ? 'lesson' : 'lessons'}`;

const formatLessonPosition = (position, total) => `Les ${position} / ${total}`;

const getThemeStateLabel = (state) => {
  if (state === 'completed') return 'Afgerond';
  if (state === 'in-progress') return 'Bezig';
  return 'Nog te starten';
};

const getDisplayName = (authUser, homeCopy) => {
  const raw =
    authUser?.name ||
    authUser?.username ||
    (authUser?.email ? authUser.email.split('@')[0] : '');
  const cleaned = raw.trim().replace(/[_\-.]+/g, ' ');
  const first = cleaned.split(' ').filter(Boolean)[0];
  if (!first) return homeCopy.defaultName;
  return first.charAt(0).toUpperCase() + first.slice(1);
};

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
