import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Card from '../components/Card';
import { PrimaryButton } from '../components/Button';
import GlossaryText from '../components/GlossaryText';
import SectionTitle from '../components/SectionTitle';
import Tag from '../components/Tag';
import { lessons, modules } from '../data/curriculum';
import useThemeColors from '../theme/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../utils/AppContext';
import { getLessonById } from '../utils/helpers';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { progress, authUser, userContext } = useApp();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [expandedFocus, setExpandedFocus] = useState(null);

  const totalLessons = lessons.length;
  const currentLesson = getLessonById(progress.currentLessonId) || lessons[0];
  const currentOrder = currentLesson?.order || 1;
  const currentModuleIndex = modules.findIndex((module) => module.id === currentLesson?.moduleId);
  const currentModule = modules[currentModuleIndex];

  const greeting = getGreeting();
  const displayName = getDisplayName(authUser);
  const moduleLabel =
    currentModuleIndex >= 0 && currentModule
      ? `Module ${currentModuleIndex + 1} ${currentModule.title}`
      : 'Module focus';
  const moduleDescription = currentModule?.description || 'Build the foundation for today.';
  const motivation = formatSentence(userContext?.motivation, 'invest with confidence.');

  const focusSections = [
    {
      id: 'concept',
      label: 'Concept',
      title: currentLesson?.title || 'Core concept',
      summary: currentLesson?.shortDescription,
      detail: `We break down ${currentLesson?.title || 'the main idea'} so you can spot the decision lever and apply it consistently.`,
    },
    {
      id: 'scenario',
      label: 'Scenario',
      title: 'Real-world lens',
      summary: `${moduleLabel} applied to a practical decision.`,
      detail: `You will walk through a realistic case that shows how ${currentLesson?.title || 'this idea'} shapes a real choice. ${moduleDescription}`,
    },
    {
      id: 'exercise',
      label: 'Exercise',
      title: 'Personal application',
      summary: `A short reflection aligned with your goal: ${motivation}`,
      detail:
        'Write down one action you can take this week to apply the lesson. Keep it small, specific, and measurable.',
    },
  ].filter((item) => item.summary);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
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
            <Tag label="TODAY'S LESSON" style={styles.heroTag} />
            <GlossaryText
              text={`Lesson ${currentOrder}/${totalLessons}`}
              style={styles.heroMetaText}
            />
          </View>
          <GlossaryText text={currentLesson?.title} style={styles.heroTitle} />
          <GlossaryText text={currentLesson?.shortDescription} style={styles.heroSubtitle} />
          <PrimaryButton
            label="Start lesson"
            onPress={() =>
              navigation.navigate('LessonOverview', {
                lessonId: currentLesson?.id,
                entrySource: 'Home',
              })
            }
            style={styles.heroButton}
          />
        </Card>

        <SectionTitle
          title="Today's focus"
          subtitle="What you will cover in this lesson."
        />
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
                    <GlossaryText
                      text={isExpanded ? 'Hide details' : 'View details'}
                      style={styles.focusAction}
                    />
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
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#12161C',
    },
    container: {
      flex: 1,
      backgroundColor: '#12161C',
    },
    content: {
      padding: spacing.lg,
      gap: spacing.xl,
      paddingBottom: spacing.xxxl,
    },
    header: {
      gap: spacing.sm,
    },
    headerMainRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    headerGreeting: {
      flex: 1,
      gap: spacing.xs,
    },
    greeting: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.title - 2,
      color: colors.textSecondary,
    },
    name: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: typography.title + 12,
      color: colors.textPrimary,
      lineHeight: 40,
    },
    moduleLabel: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      textAlign: 'left',
      letterSpacing: 0.4,
    },
    heroCard: {
      borderRadius: 28,
      paddingVertical: spacing.xl,
      gap: spacing.lg,
      borderWidth: 1,
      borderColor: colors.divider,
      backgroundColor: colors.surface,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 16 },
      elevation: 10,
    },
    heroMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    heroTag: {
      backgroundColor: toRgba(colors.textPrimary, 0.06),
      borderWidth: 1,
      borderColor: colors.divider,
    },
    heroMetaText: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    heroTitle: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: 30,
      color: colors.textPrimary,
    },
    heroSubtitle: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    heroButton: {
      alignSelf: 'stretch',
    },
    focusList: {
      gap: spacing.md,
    },
    focusPressable: {
      borderRadius: 22,
    },
    focusPressablePressed: {
      opacity: 0.94,
      transform: [{ scale: 0.99 }],
    },
    focusCard: {
      borderRadius: 22,
      gap: spacing.sm,
      borderWidth: 1,
      borderColor: colors.divider,
      backgroundColor: colors.surface,
      shadowColor: '#000',
      shadowOpacity: 0.22,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 12 },
      elevation: 6,
    },
    focusCardExpanded: {
      borderColor: toRgba(colors.textPrimary, 0.22),
      backgroundColor: colors.surfaceActive,
      shadowOpacity: 0.3,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 14 },
      elevation: 8,
    },
    focusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    focusLabel: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
    },
    focusAction: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
    },
    focusTitle: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: typography.h2,
      color: colors.textPrimary,
    },
    focusSummary: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
      color: colors.textPrimary,
      lineHeight: 22,
    },
    focusDetail: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const getDisplayName = (authUser) => {
  const raw =
    authUser?.name ||
    authUser?.username ||
    (authUser?.email ? authUser.email.split('@')[0] : '');
  const cleaned = raw.trim().replace(/[_\-.]+/g, ' ');
  const first = cleaned.split(' ').filter(Boolean)[0];
  if (!first) return 'there';
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
