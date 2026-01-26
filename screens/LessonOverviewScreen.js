import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppText from '../components/AppText';
import Card from '../components/Card';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import GlossaryText from '../components/GlossaryText';
import SectionTitle from '../components/SectionTitle';
import { lessonContent } from '../data/lessonContent';
import { lessons } from '../data/curriculum';
import useThemeColors from '../theme/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

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
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isStructureOpen, setIsStructureOpen] = useState(false);

  const lesson = lessons.find((item) => item.id === lessonId) || lessons[0];
  const content = lessonContent[lesson.id] || lessonContent.lesson_0;
  const moduleNumber = lesson.moduleId?.split('_')[1];
  const moduleLabel =
    moduleNumber !== undefined
      ? `Module ${moduleNumber}, Lesson ${lesson.order}`
      : `Lesson ${lesson.order}`;
  const takeaways =
    content?.steps?.summary?.takeaways?.length > 0
      ? content.steps.summary.takeaways
      : [lesson.shortDescription];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.layout}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <AppText style={styles.moduleLabel}>{moduleLabel}</AppText>
            <GlossaryText text={lesson.title} style={styles.title} />
            <GlossaryText text={lesson.shortDescription} style={styles.subtitle} />
          </View>

          <Card style={styles.learnCard}>
            <SectionTitle title="What you'll learn" subtitle="Key takeaways" />
            <View style={styles.bulletList}>
              {takeaways.map((item, index) => (
                <View key={`${index}-${item}`} style={styles.bulletRow}>
                  <View style={styles.bulletIndex}>
                    <AppText style={styles.bulletIndexText}>{index + 1}</AppText>
                  </View>
                  <GlossaryText text={item} style={styles.bulletText} />
                </View>
              ))}
            </View>
          </Card>

          <View style={styles.structureContainer}>
            <Pressable
              onPress={() => setIsStructureOpen((prev) => !prev)}
              style={({ pressed }) => [styles.structureRow, pressed && styles.structurePressed]}
            >
              <AppText style={styles.structureTitle}>Lesson structure</AppText>
              <AppText style={styles.structureToggle}>
                {isStructureOpen ? 'Hide' : 'Show'}
              </AppText>
            </Pressable>
            {isStructureOpen ? (
              <View style={styles.stepList}>
                {stepLabels.map((label, index) => (
                  <View key={label} style={styles.stepRow}>
                    <View style={styles.stepIndex}>
                      <GlossaryText text={index + 1} style={styles.stepNumber} />
                    </View>
                    <GlossaryText text={label} style={styles.stepLabel} />
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            label="Start lesson"
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
      </View>
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
      gap: spacing.xl,
      paddingBottom: spacing.xl,
    },
    layout: {
      flex: 1,
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
    moduleLabel: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.accent,
      letterSpacing: 0.4,
    },
    learnCard: {
      gap: spacing.md,
      borderWidth: 1,
      borderColor: toRgba(colors.accent, 0.18),
      backgroundColor: colors.surfaceActive,
    },
    bulletList: {
      gap: spacing.sm,
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
    },
    bulletIndex: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: toRgba(colors.accent, 0.18),
      marginTop: 2,
    },
    bulletIndexText: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: typography.small,
      color: colors.accent,
    },
    bulletText: {
      flex: 1,
      fontFamily: typography.fontFamilyMedium,
      color: colors.textPrimary,
      fontSize: typography.body,
      lineHeight: 22,
    },
    structureContainer: {
      gap: spacing.sm,
    },
    structureTitle: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
    },
    structureToggle: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
    },
    structurePressed: {
      opacity: 0.9,
    },
    structureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    stepList: {
      gap: spacing.xs,
      paddingLeft: spacing.sm,
    },
    stepRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    stepIndex: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.surfaceActive,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepNumber: {
      fontFamily: typography.fontFamilyMedium,
      color: colors.textSecondary,
      fontSize: typography.small - 1,
    },
    stepLabel: {
      fontFamily: typography.fontFamilyMedium,
      color: colors.textSecondary,
      fontSize: typography.small,
    },
    footer: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.lg,
      gap: spacing.md,
      borderTopWidth: 1,
      borderColor: colors.divider,
      backgroundColor: colors.background,
    },
  });

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
