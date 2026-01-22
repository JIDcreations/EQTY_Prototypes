import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import GlossaryText from '../components/GlossaryText';
import SectionTitle from '../components/SectionTitle';
import Tag from '../components/Tag';
import { lessons, modules } from '../data/curriculum';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../utils/AppContext';
import { getLessonStatus } from '../utils/helpers';

export default function LessonsScreen() {
  const navigation = useNavigation();
  const { progress } = useApp();

  const modulesWithLessons = useMemo(() => {
    return modules.map((module) => ({
      ...module,
      lessons: lessons
        .filter((lesson) => lesson.moduleId === module.id)
        .sort((a, b) => a.order - b.order),
    }));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
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
                    ? 'Completed'
                    : status === 'current'
                    ? 'Current'
                    : 'Upcoming';
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
                          <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
                          <GlossaryText text="Lesson finished" style={styles.completedText} />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  module: {
    gap: spacing.md,
  },
  moduleHeader: {
    gap: spacing.xs,
  },
  moduleTitle: {
    fontFamily: typography.fontFamilyDemi,
    fontSize: typography.h1,
    color: colors.textPrimary,
  },
  moduleSubtitle: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textSecondary,
  },
  moduleLessons: {
    gap: spacing.md,
  },
  lessonCard: {
    gap: spacing.sm,
  },
  lessonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  lessonTitle: {
    fontFamily: typography.fontFamilyDemi,
    fontSize: typography.h2,
    color: colors.textPrimary,
    flex: 1,
  },
  lessonDescription: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textSecondary,
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  completedText: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textSecondary,
  },
});
