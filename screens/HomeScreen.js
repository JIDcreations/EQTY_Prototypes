import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import { PrimaryButton } from '../components/Button';
import GlossaryText from '../components/GlossaryText';
import ProgressBar from '../components/ProgressBar';
import SectionTitle from '../components/SectionTitle';
import Tag from '../components/Tag';
import { lessons } from '../data/curriculum';
import useThemeColors from '../theme/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../utils/AppContext';
import { getLessonById } from '../utils/helpers';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { progress } = useApp();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
          <GlossaryText text="Home" style={styles.title} />
          <GlossaryText text="Your investing journey" style={styles.subtitle} />
        </View>

        <Card style={styles.progressCard}>
          <View style={styles.progressRow}>
            <View>
              <GlossaryText text="Overall progress" style={styles.progressLabel} />
              <GlossaryText
                text={`${completedCount} of ${totalLessons} lessons completed`}
                style={styles.progressValue}
              />
            </View>
            <Ionicons name="analytics" size={20} color={colors.accent} />
          </View>
          <ProgressBar progress={overallProgress} />
        </Card>

        <Card active style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <Tag label="Current lesson" tone="accent" />
            <GlossaryText text={currentLesson?.title} style={styles.heroTitle} />
            <GlossaryText text={currentLesson?.shortDescription} style={styles.heroSubtitle} />
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
                <GlossaryText text={lesson.title} style={styles.lessonTitle} />
                <GlossaryText text={lesson.shortDescription} style={styles.lessonDescription} />
              </Card>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
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
