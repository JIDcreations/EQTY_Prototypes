import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import GlossaryText from '../components/GlossaryText';
import OnboardingScreen from '../components/OnboardingScreen';
import ProgressBar from '../components/ProgressBar';
import SectionTitle from '../components/SectionTitle';
import Tag from '../components/Tag';
import { PrimaryButton } from '../components/Button';
import {
  getHomeCopy,
  getLocalizedLessons,
  getLocalizedModules,
} from '../utils/localization';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getLessonStatus } from '../utils/helpers';

export default function LessonsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const scrollRef = useRef(null);
  const lastScrolled = useRef(null);
  const { progress, preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const homeCopy = useMemo(
    () => getHomeCopy(preferences?.language),
    [preferences?.language]
  );
  const localizedLessons = useMemo(
    () => getLocalizedLessons(preferences?.language),
    [preferences?.language]
  );
  const localizedModules = useMemo(
    () => getLocalizedModules(preferences?.language),
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

  const modulesWithLessons = useMemo(() => {
    return localizedModules.map((module) => ({
      ...module,
      lessons: sortedLessons
        .filter((lesson) => lesson.moduleId === module.id)
        .sort((a, b) => a.order - b.order),
    }));
  }, [sortedLessons, localizedModules]);

  const [expandedModules, setExpandedModules] = useState(() => {
    const moduleId = currentLesson?.moduleId;
    return moduleId ? { [moduleId]: true } : {};
  });
  const [moduleOffsets, setModuleOffsets] = useState({});

  const forcedModuleId = useMemo(
    () =>
      route?.params?.moduleId ||
      getModuleIdFromTheme(route?.params?.themeId, localizedModules),
    [localizedModules, route?.params?.moduleId, route?.params?.themeId]
  );

  useEffect(() => {
    if (!forcedModuleId) return;
    setExpandedModules({ [forcedModuleId]: true });
  }, [forcedModuleId]);

  useEffect(() => {
    if (forcedModuleId) return;
    if (!currentLesson?.moduleId) return;
    setExpandedModules((prev) =>
      prev[currentLesson.moduleId] ? prev : { ...prev, [currentLesson.moduleId]: true }
    );
  }, [currentLesson?.moduleId, forcedModuleId]);

  useEffect(() => {
    if (!forcedModuleId) return;
    const offset = moduleOffsets[forcedModuleId];
    if (typeof offset !== 'number') return;
    if (lastScrolled.current === forcedModuleId) return;
    lastScrolled.current = forcedModuleId;
    scrollRef.current?.scrollTo({
      y: Math.max(0, offset - components.layout.spacing.xxl),
      animated: true,
    });
  }, [components.layout.spacing.xxl, forcedModuleId, moduleOffsets]);

  const handleModuleLayout = (moduleId) => (event) => {
    const nextOffset = event.nativeEvent.layout.y;
    setModuleOffsets((prev) =>
      prev[moduleId] === nextOffset ? prev : { ...prev, [moduleId]: nextOffset }
    );
  };

  const currentLessonTitle = currentLesson?.title || homeCopy.lessonFallbackTitle;
  const currentLessonDescription =
    currentLesson?.shortDescription || homeCopy.lessonFallbackDescription;
  const primaryCtaLabel = 'Verdergaan';

  return (
    <OnboardingScreen
      scroll
      backgroundVariant="bg3"
      contentContainerStyle={styles.content}
      scrollRef={scrollRef}
    >
      <View style={styles.headerRow}>
          <AppText style={styles.screenTitle}>Lesoverzicht</AppText>
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

      <SectionTitle title="Nu bezig" />

      <View style={styles.currentCard}>
        <View style={styles.currentMetaRow}>
          <AppText style={styles.currentProgress}>
            {formatLessonProgress(lessonPosition, totalLessons)}
          </AppText>
          <Tag label={STATUS_LABELS.current} tone="accent" />
        </View>
        <GlossaryText text={currentLessonTitle} style={styles.currentTitle} />
        {currentLessonDescription ? (
          <GlossaryText
            text={currentLessonDescription}
            style={styles.currentDescription}
            numberOfLines={2}
          />
        ) : null}
        <PrimaryButton
          label={primaryCtaLabel}
          onPress={() =>
            navigation.navigate('LessonOverview', {
              lessonId: currentLesson?.id,
              entrySource: 'Lessons',
            })
          }
        />
      </View>

      <View style={styles.modulesHeader}>
        <SectionTitle title="Leerpad" />
      </View>

      {modulesWithLessons
        .filter((module) => module.lessons.length > 0)
        .map((module) => {
          const isExpanded = expandedModules[module.id];
          const moduleNumber = getModuleNumber(module.id);
          const moduleCompletedCount = module.lessons.filter((lesson) =>
            completedLessonIds.includes(lesson.id)
          ).length;
          const moduleTotal = module.lessons.length;
          const moduleProgress = moduleTotal > 0 ? moduleCompletedCount / moduleTotal : 0;
          const isModuleCompleted = moduleTotal > 0 && moduleCompletedCount === moduleTotal;
          const progressLabel = formatThemeProgress(moduleCompletedCount, moduleTotal);

          return (
            <View
              key={module.id}
              style={styles.module}
              onLayout={handleModuleLayout(module.id)}
            >
              <Pressable onPress={() => toggleModule(setExpandedModules, module.id)}>
                {({ pressed }) => (
                  <View
                    style={[
                      styles.moduleCard,
                      isExpanded && styles.moduleCardExpanded,
                      pressed && styles.moduleCardPressed,
                    ]}
                  >
                    <View style={styles.moduleHeaderRow}>
                      <View style={styles.moduleHeaderCopy}>
                        <View style={styles.themeTitleRow}>
                          <AppText style={styles.themeLabel}>
                            {`Thema ${moduleNumber}`}
                          </AppText>
                          <AppText style={styles.themeDot}>·</AppText>
                          <GlossaryText text={module.title} style={styles.themeTitle} />
                        </View>
                        {isExpanded ? (
                          <GlossaryText
                            text={module.description}
                            style={styles.moduleSubtitle}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                          />
                        ) : null}
                        <View style={styles.moduleMetaRow}>
                          {isModuleCompleted ? (
                            <AppText style={[styles.moduleMeta, styles.moduleMetaCompleted]}>
                              {progressLabel}
                            </AppText>
                          ) : (
                            <AppText style={styles.moduleMeta}>{progressLabel}</AppText>
                          )}
                        </View>
                      </View>
                      <View style={styles.moduleHeaderRight}>
                        {isModuleCompleted ? (
                          <Tag label="Voltooid" tone="default" style={styles.moduleTag} />
                        ) : null}
                        <Ionicons
                          name="chevron-down"
                          size={components.sizes.icon.md}
                          color={colors.text.secondary}
                          style={[styles.chevron, isExpanded && styles.chevronOpen]}
                        />
                      </View>
                    </View>
                    <View style={styles.themeProgress}>
                      <ProgressBar progress={Math.min(1, Math.max(0, moduleProgress))} />
                    </View>
                  </View>
                )}
              </Pressable>
              {isExpanded ? (
                <View style={styles.moduleLessons}>
                  {module.lessons.map((lesson) => {
                    const status = getLessonStatus(lesson.id, progress);
                    const statusLabel = STATUS_LABELS[status] || STATUS_LABELS.upcoming;
                    const lessonNumber = lesson.order + 1;
                    return (
                      <Pressable
                        key={lesson.id}
                        onPress={() =>
                          navigation.navigate('LessonOverview', {
                            lessonId: lesson.id,
                            entrySource: 'Lessons',
                          })
                        }
                      >
                        {({ pressed }) => (
                          <View
                            style={[
                              styles.lessonCard,
                              isExpanded && styles.lessonCardActive,
                              pressed && styles.lessonCardPressed,
                            ]}
                          >
                            <View style={styles.lessonHeader}>
                              <AppText style={styles.lessonNumber}>
                                {homeCopy.lessonShort(lessonNumber)}
                              </AppText>
                              <Tag
                                label={statusLabel}
                                tone={status === 'current' ? 'accent' : 'default'}
                              />
                            </View>
                            <View style={styles.lessonBody}>
                              <View style={styles.lessonCopy}>
                                <GlossaryText
                                  text={lesson.title}
                                  style={styles.lessonTitle}
                                  numberOfLines={1}
                                  ellipsizeMode="tail"
                                />
                                <GlossaryText
                                  text={lesson.shortDescription}
                                  style={styles.lessonDescription}
                                  numberOfLines={2}
                                  ellipsizeMode="tail"
                                />
                              </View>
                              <Ionicons
                                name="chevron-forward"
                                size={components.sizes.icon.sm}
                                color={colors.text.secondary}
                              />
                            </View>
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}
            </View>
          );
        })}
    </OnboardingScreen>
  );
}

const getModuleNumber = (moduleId) => {
  const raw = moduleId?.split('_')[1];
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) return 1;
  return parsed + 1;
};

const toggleModule = (setExpandedModules, moduleId) => {
  setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
};

const getModuleIdFromTheme = (themeId, modules) => {
  if (!themeId) return null;
  if (typeof themeId === 'string' && themeId.startsWith('module_')) return themeId;
  if (typeof themeId === 'string' && themeId.startsWith('t')) {
    const index = Number(themeId.slice(1));
    if (!Number.isNaN(index)) return `module_${index}`;
  }
  if (modules?.some((module) => module.id === themeId)) return themeId;
  return null;
};

const formatLessonProgress = (position, total) => `Les ${position} / ${total}`;

const formatLessonCount = (total) => (total === 1 ? '1 les' : `${total} lessen`);

const formatThemeProgress = (completed, total) =>
  `${formatLessonCount(total)} · ${completed} afgerond`;

const STATUS_LABELS = {
  current: 'Huidig',
  upcoming: 'Aankomend',
  completed: 'Voltooid',
};

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const createStyles = (colors, components) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingTop: components.layout.safeArea.top + components.layout.spacing.lg,
      gap: components.layout.contentGap,
      paddingBottom: components.layout.safeArea.bottom,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.md,
    },
    screenTitle: {
      ...typography.styles.h1,
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
    currentCard: {
      ...components.input.container,
      backgroundColor: toRgba(colors.background.surface, components.opacity.value55),
      borderColor: toRgba(colors.ui.divider, components.opacity.value35),
      padding: components.layout.spacing.lg,
      gap: components.layout.spacing.md,
    },
    currentMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.sm,
    },
    currentProgress: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    currentTitle: {
      ...typography.styles.h2,
      color: colors.text.primary,
    },
    currentDescription: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    modulesHeader: {
      marginTop: components.layout.spacing.sm,
    },
    module: {
      gap: components.layout.spacing.md,
    },
    moduleCard: {
      ...components.input.container,
      borderColor: toRgba(colors.ui.divider, components.opacity.value35),
      backgroundColor: toRgba(colors.background.surface, components.opacity.value40),
      padding: components.layout.spacing.lg,
      gap: components.layout.spacing.sm,
    },
    moduleCardExpanded: {
      borderColor: toRgba(colors.ui.divider, components.opacity.value45),
      backgroundColor: toRgba(colors.background.surfaceActive, components.opacity.value55),
    },
    moduleCardPressed: {
      opacity: components.opacity.value94,
      transform: [{ scale: components.transforms.scalePressed }],
    },
    moduleHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.md,
    },
    moduleHeaderCopy: {
      flex: 1,
      gap: components.layout.spacing.xs,
    },
    moduleHeaderRight: {
      alignItems: 'center',
      gap: components.layout.spacing.xs,
    },
    moduleTag: {
      alignSelf: 'flex-end',
    },
    themeTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: components.layout.spacing.xs,
    },
    themeLabel: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    themeDot: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    themeTitle: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
      flexShrink: 1,
    },
    moduleSubtitle: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    moduleMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    moduleMeta: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    moduleMetaCompleted: {
      opacity: components.opacity.value60,
    },
    themeProgress: {
      opacity: components.opacity.value90,
    },
    chevron: {
      transform: [{ rotate: '0deg' }],
    },
    chevronOpen: {
      transform: [{ rotate: '180deg' }],
    },
    moduleLessons: {
      gap: components.layout.spacing.md,
      alignItems: 'center',
    },
    lessonCard: {
      ...components.input.container,
      borderColor: toRgba(colors.ui.divider, components.opacity.value35),
      backgroundColor: toRgba(colors.background.surface, components.opacity.value40),
      padding: components.layout.spacing.md,
      gap: components.layout.spacing.sm,
      width: components.layout.contentWidth - components.layout.spacing.xxl,
    },
    lessonCardActive: {
      borderColor: toRgba(colors.ui.divider, components.opacity.value45),
      backgroundColor: toRgba(colors.background.surfaceActive, components.opacity.value55),
    },
    lessonCardPressed: {
      opacity: components.opacity.value94,
      transform: [{ scale: components.transforms.scalePressed }],
    },
    lessonHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: components.layout.spacing.md,
    },
    lessonBody: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.md,
    },
    lessonCopy: {
      flex: 1,
      gap: components.layout.spacing.xs,
      minWidth: 0,
    },
    lessonNumber: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    lessonTitle: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
    },
    lessonDescription: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  });
