import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppText from '../components/AppText';
import Card from '../components/Card';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import GlossaryText from '../components/GlossaryText';
import SectionTitle from '../components/SectionTitle';
import { useApp } from '../utils/AppContext';
import { getLessonContent, getLessonOverviewCopy, getLocalizedLessons, formatLessonModuleLabel } from '../utils/localization';
import { spacing, typography, useTheme } from '../theme';

export default function LessonOverviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { lessonId, entrySource } = route.params || {};
  const { preferences } = useApp();
  const { colors, components } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const [isStructureOpen, setIsStructureOpen] = useState(false);
  const overviewCopy = useMemo(
    () => getLessonOverviewCopy(preferences?.language),
    [preferences?.language]
  );
  const localizedLessons = useMemo(
    () => getLocalizedLessons(preferences?.language),
    [preferences?.language]
  );
  const lesson = localizedLessons.find((item) => item.id === lessonId) || localizedLessons[0];
  const content = getLessonContent(lesson.id, preferences?.language);
  const moduleNumber = lesson.moduleId?.split('_')[1];
  const moduleLabel = formatLessonModuleLabel(preferences?.language, moduleNumber, lesson.order);
  const takeaways =
    content?.steps?.summary?.takeaways?.length > 0
      ? content.steps.summary.takeaways
      : [lesson.shortDescription];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.layout}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <AppText style={styles.moduleLabel}>{moduleLabel}</AppText>
            <GlossaryText text={lesson.title} style={styles.title} />
            <GlossaryText text={lesson.shortDescription} style={styles.subtitle} />
          </View>

          <Card style={styles.learnCard}>
            <SectionTitle title={overviewCopy.whatYoullLearn} subtitle={overviewCopy.keyTakeaways} />
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
            <Card style={styles.structureCard}>
              <Pressable
                onPress={() => setIsStructureOpen((prev) => !prev)}
                style={({ pressed }) => [styles.structureRow, pressed && styles.structurePressed]}
              >
                <AppText style={styles.structureTitle}>{overviewCopy.lessonStructure}</AppText>
                <View style={styles.structureToggle}>
                  <Ionicons
                    name={isStructureOpen ? 'chevron-up' : 'chevron-down'}
                    size={components.sizes.icon.md}
                    color={colors.text.secondary}
                  />
                </View>
              </Pressable>
              {isStructureOpen ? (
                <View style={styles.stepList}>
                  <AppText style={styles.flowHeader}>{overviewCopy.lessonFlowHeader}</AppText>
                  {overviewCopy.stepLabels.map((label, index) => (
                    <View key={label} style={styles.stepRow}>
                      <View style={styles.stepIndex}>
                        <GlossaryText text={index + 1} style={styles.stepNumber} />
                      </View>
                      <GlossaryText text={label} style={styles.stepLabel} />
                    </View>
                  ))}
                </View>
              ) : null}
            </Card>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            label={overviewCopy.startLesson}
            onPress={() =>
              navigation.navigate('LessonStep', {
                lessonId: lesson.id,
                step: 1,
                entrySource,
              })
            }
          />
          <SecondaryButton label={overviewCopy.back} onPress={() => navigation.goBack()} />
          <View style={{ height: insets.bottom }} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background.app,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background.app,
    },
    content: {
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingTop: spacing.lg,
      gap: components.layout.contentGap,
      paddingBottom: spacing.none,
    },
    layout: {
      flex: 1,
    },
    header: {
      gap: spacing.sm,
    },
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
    },
    subtitle: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    moduleLabel: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    learnCard: {
      ...components.card.base,
      borderWidth: components.borderWidth.thin,
      borderColor: colors.ui.border,
      backgroundColor: colors.background.surfaceActive,
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
      width: components.sizes.square.xs,
      height: components.sizes.square.xs,
      borderRadius: components.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: toRgba(colors.accent.primary, 0.18),
      marginTop: spacing.none,
    },
    bulletIndexText: {
      ...typography.styles.small,
      color: colors.text.primary,
    },
    bulletText: {
      flex: 1,
      ...typography.styles.body,
      color: colors.text.primary,
    },
    structureContainer: {
      gap: spacing.sm,
    },
    structureCard: {
      ...components.card.base,
      borderWidth: components.borderWidth.thin,
      borderColor: colors.ui.divider,
    },
    structureTitle: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    structureToggle: {
      width: components.sizes.square.xs,
      height: components.sizes.square.xs,
      borderRadius: components.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: components.borderWidth.thin,
      borderColor: colors.ui.divider,
      backgroundColor: colors.background.surfaceActive,
    },
    structurePressed: {
      opacity: components.opacity.value90,
    },
    structureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    stepList: {
      gap: spacing.xs,
      paddingTop: spacing.sm,
    },
    flowHeader: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    stepRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    stepIndex: {
      width: components.sizes.square.xs,
      height: components.sizes.square.xs,
      borderRadius: components.radius.pill,
      backgroundColor: colors.background.surfaceActive,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepNumber: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    stepLabel: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    footer: {
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingTop: spacing.md,
      paddingBottom: spacing.lg,
      gap: spacing.md,
      borderTopWidth: components.borderWidth.thin,
      borderColor: colors.ui.divider,
      backgroundColor: colors.background.app,
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
