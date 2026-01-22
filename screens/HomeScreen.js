import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import { PrimaryButton } from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import SectionTitle from '../components/SectionTitle';
import Tag from '../components/Tag';
import { lessons } from '../data/curriculum';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../utils/AppContext';
import { getLessonById } from '../utils/helpers';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { progress } = useApp();

  const completedCount = progress.completedLessonIds.length;
  const totalLessons = lessons.length;
  const overallProgress = totalLessons === 0 ? 0 : completedCount / totalLessons;

  const currentLesson = getLessonById(progress.currentLessonId) || lessons[0];
  const nextLessons = lessons
    .filter((lesson) => lesson.id !== currentLesson?.id)
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Home</Text>
          <Text style={styles.subtitle}>Your investing journey</Text>
        </View>

        <Card style={styles.progressCard}>
          <View style={styles.progressRow}>
            <View>
              <Text style={styles.progressLabel}>Overall progress</Text>
              <Text style={styles.progressValue}>{`${completedCount} of ${totalLessons} lessons completed`}</Text>
            </View>
            <Ionicons name="analytics" size={20} color={colors.accent} />
          </View>
          <ProgressBar progress={overallProgress} />
        </Card>

        <Card active style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <Tag label="Current lesson" tone="accent" />
            <Text style={styles.heroTitle}>{currentLesson?.title}</Text>
            <Text style={styles.heroSubtitle}>{currentLesson?.shortDescription}</Text>
          </View>
          <PrimaryButton
            label="Continue lesson"
            onPress={() =>
              navigation.navigate('LessonOverview', {
                lessonId: currentLesson?.id,
                entrySource: 'Home',
              })
            }
          />
        </Card>

        <SectionTitle title="Next lessons" subtitle="Preview what is coming up" />
        <View style={styles.list}>
          {nextLessons.map((lesson) => (
            <Pressable
              key={lesson.id}
              onPress={() =>
                navigation.navigate('LessonOverview', {
                  lessonId: lesson.id,
                  entrySource: 'Home',
                })
              }
            >
              <Card style={styles.lessonCard}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonDescription}>{lesson.shortDescription}</Text>
              </Card>
            </Pressable>
          ))}
        </View>
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
    gap: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    fontFamily: typography.fontFamilyDemi,
    fontSize: typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textSecondary,
  },
  progressCard: {
    gap: spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textSecondary,
  },
  progressValue: {
    fontFamily: typography.fontFamilyDemi,
    fontSize: typography.body,
    color: colors.textPrimary,
  },
  heroCard: {
    gap: spacing.md,
  },
  heroHeader: {
    gap: spacing.sm,
  },
  heroTitle: {
    fontFamily: typography.fontFamilyDemi,
    fontSize: typography.h1,
    color: colors.textPrimary,
  },
  heroSubtitle: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  list: {
    gap: spacing.md,
  },
  lessonCard: {
    gap: spacing.xs,
  },
  lessonTitle: {
    fontFamily: typography.fontFamilyDemi,
    fontSize: typography.h2,
    color: colors.textPrimary,
  },
  lessonDescription: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textSecondary,
  },
});
