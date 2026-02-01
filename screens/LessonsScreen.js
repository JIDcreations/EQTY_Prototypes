import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import GlossaryText from '../components/GlossaryText';
import SectionTitle from '../components/SectionTitle';
import Tag from '../components/Tag';
import { getLessonOverviewCopy, getLocalizedLessons, getLocalizedModules } from '../utils/localization';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getLessonStatus } from '../utils/helpers';

export default function LessonsScreen() {
  const navigation = useNavigation();
  const { progress, preferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const overviewCopy = useMemo(
    () => getLessonOverviewCopy(preferences?.language),
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

  const modulesWithLessons = useMemo(() => {
    return localizedModules.map((module) => ({
      ...module,
      lessons: localizedLessons
        .filter((lesson) => lesson.moduleId === module.id)
        .sort((a, b) => a.order - b.order),
    }));
  }, [localizedLessons, localizedModules]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle title="Lessons" subtitle="Curriculum overview" />

        {modulesWithLessons.map((module) => (
          <View key={module.id} style={styles.module}>
            <View style={styles.moduleHeader}>
              <GlossaryText text={module.title} style={styles.moduleTitle} />
              <GlossaryText text={module.description} style={styles.moduleSubtitle} />
            </View>
            <View style={styles.moduleLessons}>
              {module.lessons.map((lesson) => {
                const status = getLessonStatus(lesson.id, progress);
                const statusLabel =
                  status === 'completed'
                    ? overviewCopy.statusCompleted
                    : status === 'current'
                    ? overviewCopy.statusCurrent
                    : overviewCopy.statusUpcoming;
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
                    <Card style={styles.lessonCard}>
                      <View style={styles.lessonRow}>
                        <GlossaryText text={lesson.title} style={styles.lessonTitle} />
                        <Tag label={statusLabel} tone={status === 'current' ? 'accent' : 'default'} />
                      </View>
                      <GlossaryText
                        text={lesson.shortDescription}
                        style={styles.lessonDescription}
                      />
                      {status === 'completed' ? (
                        <View style={styles.completedRow}>
                          <Ionicons
                            name="checkmark-circle"
                            size={components.sizes.icon.sm}
                            color={colors.accent.primary}
                          />
                          <GlossaryText text={overviewCopy.lessonFinished} style={styles.completedText} />
                        </View>
                      ) : null}
                    </Card>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
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
    module: {
      gap: components.layout.spacing.md,
    },
    moduleHeader: {
      gap: components.layout.spacing.xs,
    },
    moduleTitle: {
      ...typography.styles.h2,
      color: colors.text.primary,
    },
    moduleSubtitle: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    moduleLessons: {
      gap: components.layout.spacing.md,
    },
    lessonCard: {
      gap: components.layout.cardGap,
    },
    lessonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: components.layout.spacing.md,
    },
    lessonTitle: {
      ...typography.styles.h3,
      color: colors.text.primary,
      flex: 1,
    },
    lessonDescription: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    completedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.xs,
    },
    completedText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  });
