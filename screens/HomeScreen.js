import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import Card from '../components/Card';
import { PrimaryButton } from '../components/Button';
import GlossaryText from '../components/GlossaryText';
import OnboardingScreen from '../components/OnboardingScreen';
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
  const { progress, authUser, preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
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

  const greeting = getGreeting(homeCopy);
  const displayName = getDisplayName(authUser, homeCopy);
  const lessonTitle = currentLesson?.title || homeCopy.lessonFallbackTitle;
  const lessonDescription = currentLesson?.shortDescription || homeCopy.lessonFallbackDescription;
  const primaryCtaLabel =
    completedCount > 0 ? homeCopy.continueLesson : homeCopy.startLesson;
  const heroDescription = shortenToLine(lessonDescription, 60);
  const greetingLine = `${greeting}, ${displayName}`;
  const learningPathLessons = sortedLessons
    .slice(currentLessonIndex + 1, currentLessonIndex + 4)
    .map((lesson, index) => ({
      id: lesson.id,
      position: currentLessonIndex + 2 + index,
      title: lesson.title,
    }));

  return (
    <OnboardingScreen
      scroll
      backgroundVariant="bg3"
      contentContainerStyle={styles.content}
    >
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
          text={homeCopy.lessonPosition(lessonPosition, totalLessons)}
          style={styles.trajectoryMeta}
        />
        <ProgressBar progress={seriesProgress} />
      </View>

      <View style={styles.section}>
        <Card style={styles.heroCard}>
          <GlossaryText
            text={homeCopy.lessonShort(lessonPosition)}
            style={styles.heroStepLabel}
            numberOfLines={1}
          />
          <GlossaryText text={lessonTitle} style={styles.heroTitle} />
          {heroDescription ? (
            <AppText style={styles.heroSubtitle} numberOfLines={1}>
              {heroDescription}
            </AppText>
          ) : null}
          <PrimaryButton
            label={primaryCtaLabel}
            onPress={() =>
              navigation.navigate('LessonOverview', {
                lessonId: currentLesson?.id,
                entrySource: 'Home',
              })
            }
            style={styles.heroButton}
          />
        </Card>
      </View>

      <View style={styles.section}>
        <View style={styles.learningHeader}>
          <SectionTitle title={homeCopy.learningPathTitle} />
          <Pressable onPress={() => navigation.navigate('Lessons')}>
            <AppText style={styles.viewAll}>{homeCopy.viewAll}</AppText>
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.learningList}
        >
          {learningPathLessons.map((lesson) => (
            <Pressable
              key={lesson.id}
              onPress={() =>
                navigation.navigate('LessonOverview', {
                  lessonId: lesson.id,
                  entrySource: 'HomeUpcoming',
                })
              }
              style={({ pressed }) => [
                styles.learningItem,
                pressed && styles.learningItemPressed,
              ]}
            >
              <Card style={styles.learningCard}>
                <GlossaryText
                  text={homeCopy.lessonShort(lesson.position)}
                  style={styles.learningMeta}
                />
                <GlossaryText text={lesson.title} style={styles.learningTitle} />
              </Card>
            </Pressable>
          ))}
        </ScrollView>
      </View>

    </OnboardingScreen>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    content: {
      paddingTop: components.layout.safeArea.top + components.layout.spacing.lg,
      paddingBottom: components.layout.safeArea.bottom,
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
      ...typography.styles.h2,
      color: colors.text.primary,
    },
    profileButton: {
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      borderRadius: components.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, components.opacity.value35),
      backgroundColor: toRgba(colors.background.surface, components.opacity.value60),
    },
    section: {
      gap: components.layout.spacing.md,
    },
    trajectoryBlock: {
      gap: components.layout.spacing.sm,
    },
    trajectoryMeta: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    heroCard: {
      ...components.card.base,
      padding: components.layout.spacing.xl,
      gap: components.layout.spacing.lg,
      width: '100%',
      maxWidth: components.layout.contentWidth,
      alignSelf: 'center',
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, components.opacity.value35),
      backgroundColor: toRgba(colors.background.surfaceActive, components.opacity.value60),
      overflow: 'hidden',
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
    learningHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.md,
    },
    viewAll: {
      ...typography.styles.small,
      color: colors.accent.primary,
    },
    learningList: {
      gap: components.layout.spacing.md,
      paddingBottom: components.layout.spacing.xs,
      paddingRight: components.layout.spacing.lg,
    },
    learningItem: {
      borderRadius: components.radius.card,
    },
    learningItemPressed: {
      opacity: components.opacity.value94,
      transform: [{ scale: components.transforms.scalePressed }],
    },
    learningCard: {
      ...components.card.base,
      width: components.sizes.illustration.xl,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, components.opacity.value35),
      backgroundColor: toRgba(colors.background.surface, components.opacity.value55),
      padding: components.layout.spacing.lg,
      gap: components.layout.spacing.sm,
    },
    learningMeta: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    learningTitle: {
      ...typography.styles.h3,
      color: colors.text.primary,
      flexShrink: 1,
    },
  });

const getGreeting = (homeCopy) => homeCopy.greetingHi || 'Hi';

const shortenToLine = (value, maxChars) => {
  if (!value) return '';
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (normalized.length <= maxChars) return normalized;
  const slice = normalized.slice(0, maxChars);
  const lastSpace = slice.lastIndexOf(' ');
  const trimmed = lastSpace > 20 ? slice.slice(0, lastSpace) : slice;
  return trimmed.replace(/[.,;:]$/, '');
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
