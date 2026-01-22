import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Card from '../components/Card';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import SectionTitle from '../components/SectionTitle';
import Tag from '../components/Tag';
import { lessonContent } from '../data/lessonContent';
import { lessons } from '../data/curriculum';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../utils/AppContext';

const stepLabels = [
  'Concept',
  'Visual exploration',
  'Scenario',
  'Practical exercise',
  'Reflection',
  'Summary',
];

export default function LessonOverviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { lessonId, entrySource } = route.params || {};
  const { progress } = useApp();

  const lesson = lessons.find((item) => item.id === lessonId) || lessons[0];
  const content = lessonContent[lesson.id] || lessonContent.lesson_1;
  const isCompleted = progress.completedLessonIds.includes(lesson.id);
  const isCurrent = progress.currentLessonId === lesson.id;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.subtitle}>{lesson.shortDescription}</Text>
          <View style={styles.tagRow}>
            {isCurrent ? <Tag label="Current" tone="accent" /> : null}
            {isCompleted ? <Tag label="Completed" /> : null}
          </View>
        </View>

        <Card style={styles.overviewCard}>
          <SectionTitle title="Lesson structure" subtitle="6 guided steps" />
          <View style={styles.stepList}>
            {stepLabels.map((label, index) => (
              <View key={label} style={styles.stepRow}>
                <View style={styles.stepIndex}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.stepLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card active style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{content?.steps?.concept?.title}</Text>
          <Text style={styles.summaryText}>{content?.steps?.concept?.body}</Text>
        </Card>

        <View style={styles.buttonStack}>
          <PrimaryButton
            label={isCompleted ? 'Restart lesson' : isCurrent ? 'Resume lesson' : 'Start lesson'}
            onPress={() =>
              navigation.navigate('LessonStep', {
                lessonId: lesson.id,
                step: 1,
                entrySource,
              })
            }
          />
          <SecondaryButton label="Back" onPress={() => navigation.goBack()} />
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
    gap: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    gap: spacing.sm,
  },
  title: {
    fontFamily: typography.fontFamilyDemi,
    fontSize: typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  tagRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  overviewCard: {
    gap: spacing.md,
  },
  stepList: {
    gap: spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepIndex: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surfaceActive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontFamily: typography.fontFamilyDemi,
    color: colors.textPrimary,
    fontSize: typography.small,
  },
  stepLabel: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    fontSize: typography.body,
  },
  summaryCard: {
    gap: spacing.sm,
  },
  summaryTitle: {
    fontFamily: typography.fontFamilyDemi,
    color: colors.textPrimary,
    fontSize: typography.h1,
  },
  summaryText: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
  },
  buttonStack: {
    gap: spacing.md,
  },
});
