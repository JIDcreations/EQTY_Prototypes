import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import Card from '../components/Card';
import { PrimaryButton } from '../components/Button';
import GlossaryText from '../components/GlossaryText';
import SectionTitle from '../components/SectionTitle';
import Tag from '../components/Tag';
import {
  formatHomeLessonCount,
  formatHomeModuleLabel,
  getHomeCopy,
  getLocalizedLessons,
  getLocalizedModules,
} from '../utils/localization';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { progress, authUser, userContext, preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const [expandedFocus, setExpandedFocus] = useState(null);
  const homeCopy = useMemo(() => getHomeCopy(preferences?.language), [preferences?.language]);

  const localizedLessons = useMemo(
    () => getLocalizedLessons(preferences?.language),
    [preferences?.language]
  );
  const localizedModules = useMemo(
    () => getLocalizedModules(preferences?.language),
    [preferences?.language]
  );
  const totalLessons = localizedLessons.length;
  const currentLesson =
    localizedLessons.find((lesson) => lesson.id === progress.currentLessonId) ||
    localizedLessons[0];
  const currentOrder = currentLesson?.order || 1;
  const currentModuleIndex = localizedModules.findIndex(
    (module) => module.id === currentLesson?.moduleId
  );
  const currentModule = localizedModules[currentModuleIndex];

  const greeting = getGreeting(homeCopy);
  const displayName = getDisplayName(authUser, homeCopy);
  const moduleNumber = currentModule?.id?.split('_')[1];
  const moduleLabel =
    currentModuleIndex >= 0 && currentModule
      ? formatHomeModuleLabel(
          preferences?.language,
          moduleNumber,
          currentModule.title,
          currentModuleIndex
        )
      : homeCopy.moduleFocus;
  const moduleDescription = currentModule?.description || homeCopy.moduleFallbackDescription;
  const motivation = formatSentence(userContext?.motivation, homeCopy.defaultMotivation);

  const focusSections = [
    {
      id: 'concept',
      label: homeCopy.labels.concept,
      title: currentLesson?.title || homeCopy.coreConceptFallback,
      summary: currentLesson?.shortDescription,
      detail: homeCopy.conceptDetail(currentLesson?.title),
    },
    {
      id: 'scenario',
      label: homeCopy.labels.scenario,
      title: homeCopy.titles.scenario,
      summary: homeCopy.scenarioSummary(moduleLabel),
      detail: homeCopy.scenarioDetail(currentLesson?.title, moduleDescription),
    },
    {
      id: 'exercise',
      label: homeCopy.labels.exercise,
      title: homeCopy.titles.exercise,
      summary: homeCopy.exerciseSummary(motivation),
      detail: homeCopy.exerciseDetail,
    },
  ].filter((item) => item.summary);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerMainRow}>
            <View style={styles.headerGreeting}>
              <GlossaryText text={`${greeting},`} style={styles.greeting} />
              <GlossaryText text={displayName} style={styles.name} />
            </View>
          </View>
        </View>

        <GlossaryText text={moduleLabel} style={styles.moduleLabel} numberOfLines={2} />

        <Card style={styles.heroCard}>
          <View style={styles.heroMetaRow}>
            <Tag label={homeCopy.todaysLessonTag} style={styles.heroTag} />
            <GlossaryText
              text={formatHomeLessonCount(preferences?.language, currentOrder, totalLessons)}
              style={styles.heroMetaText}
            />
          </View>
          <AppText style={styles.heroTitle}>{currentLesson?.title}</AppText>
          <AppText style={styles.heroSubtitle}>{currentLesson?.shortDescription}</AppText>
          <PrimaryButton
            label={homeCopy.startLesson}
            onPress={() =>
              navigation.navigate('LessonOverview', {
                lessonId: currentLesson?.id,
                entrySource: 'Home',
              })
            }
            style={styles.heroButton}
          />
        </Card>

        <SectionTitle title={homeCopy.todaysFocusTitle} subtitle={homeCopy.todaysFocusSubtitle} />
        <View style={styles.focusList}>
          {focusSections.map((section) => {
            const isExpanded = expandedFocus === section.id;
            return (
              <Pressable
                key={section.id}
                onPress={() =>
                  setExpandedFocus((current) =>
                    current === section.id ? null : section.id
                  )
                }
                style={({ pressed }) => [
                  styles.focusPressable,
                  pressed && styles.focusPressablePressed,
                ]}
              >
                <Card style={[styles.focusCard, isExpanded && styles.focusCardExpanded]}>
                  <View style={styles.focusHeader}>
                    <GlossaryText text={section.label} style={styles.focusLabel} />
                    <View style={styles.focusActionPill}>
                      <GlossaryText
                        text={isExpanded ? homeCopy.hideDetails : homeCopy.viewDetails}
                        style={styles.focusActionText}
                      />
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={components.sizes.icon.xs}
                        color={colors.text.secondary}
                        style={styles.focusActionIcon}
                      />
                    </View>
                  </View>
                  <GlossaryText text={section.title} style={styles.focusTitle} />
                  <GlossaryText text={section.summary} style={styles.focusSummary} />
                  {isExpanded ? (
                    <GlossaryText text={section.detail} style={styles.focusDetail} />
                  ) : null}
                </Card>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors, components) =>
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
      paddingBottom: components.layout.safeArea.bottom,
    },
    header: {
      gap: components.layout.spacing.sm,
    },
    headerMainRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    headerGreeting: {
      flex: 1,
      gap: components.layout.spacing.xs,
    },
    greeting: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    name: {
      ...typography.styles.display,
      color: colors.text.primary,
    },
    moduleLabel: {
      ...typography.styles.small,
      color: colors.text.secondary,
      textAlign: 'left',
    },
    heroCard: {
      ...components.card.base,
      borderWidth: components.borderWidth.thin,
      borderColor: colors.ui.divider,
    },
    heroMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.sm,
    },
    heroTag: {
      backgroundColor: toRgba(colors.text.primary, 0.06),
      borderWidth: components.borderWidth.thin,
      borderColor: colors.ui.divider,
    },
    heroMetaText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    heroTitle: {
      ...typography.styles.h2,
      color: colors.text.primary,
    },
    heroSubtitle: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    heroButton: {
      alignSelf: 'stretch',
    },
    focusList: {
      gap: components.layout.spacing.md,
    },
    focusPressable: {
      borderRadius: components.radius.card,
    },
    focusPressablePressed: {
      opacity: components.opacity.value94,
      transform: [{ scale: components.transforms.scalePressed }],
    },
    focusCard: {
      ...components.card.base,
      borderWidth: components.borderWidth.thin,
      borderColor: colors.ui.divider,
    },
    focusCardExpanded: {
      borderColor: toRgba(colors.text.primary, 0.22),
      backgroundColor: colors.background.surfaceActive,
    },
    focusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.md,
    },
    focusLabel: {
      ...typography.styles.stepLabel,
      color: colors.text.secondary,
    },
    focusActionPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.xs,
      paddingHorizontal: components.layout.spacing.sm,
      paddingVertical: components.layout.spacing.xs,
      borderRadius: components.radius.pill,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.text.primary, 0.16),
      backgroundColor: toRgba(colors.text.primary, 0.06),
    },
    focusActionText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    focusActionIcon: {
      marginTop: components.layout.spacing.none,
    },
    focusTitle: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    focusSummary: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    focusDetail: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  });

const getGreeting = (homeCopy) => {
  const hour = new Date().getHours();
  if (hour < 12) return homeCopy.greetingMorning;
  if (hour < 18) return homeCopy.greetingAfternoon;
  return homeCopy.greetingEvening;
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

const formatSentence = (value, fallback) => {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;
  return trimmed.endsWith('.') ? trimmed : `${trimmed}.`;
};

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
