import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '../components/BottomSheet';
import Card from '../components/Card';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import LessonStepContainer from '../components/LessonStepContainer';
import StepHeader from '../components/StepHeader';
import { lessonContent } from '../data/lessonContent';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../utils/AppContext';
import { simulateCompound, formatCurrency } from '../utils/finance';
import { getScenarioVariant } from '../utils/helpers';

const TOTAL_STEPS = 6;

export default function LessonStepScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { lessonId, step = 1, entrySource } = route.params || {};
  const { userContext, addReflection, completeLesson } = useApp();

  const content = lessonContent[lessonId] || lessonContent.lesson_1;
  const stepTitle = useMemo(() => {
    if (!content) return `Step ${step}`;
    switch (step) {
      case 1:
        return content.steps.concept.title;
      case 2:
        return content.steps.visualization.title;
      case 3:
        return content.steps.scenario.title;
      case 4:
        return content.steps.exercise.title;
      case 5:
        return 'Reflection';
      case 6:
        return 'Summary';
      default:
        return `Step ${step}`;
    }
  }, [content, step]);

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      navigation.push('LessonStep', { lessonId, step: step + 1, entrySource });
    }
  };

  const handleComplete = async () => {
    await completeLesson(lessonId);
    if (entrySource === 'Lessons') {
      navigation.navigate('Tabs', { screen: 'Lessons' });
    } else {
      navigation.navigate('Tabs', { screen: 'Home' });
    }
  };

  return (
    <LessonStepContainer>
      <StepHeader step={step} total={TOTAL_STEPS} title={stepTitle} onBack={() => navigation.goBack()} />

      {step === 1 && <ConceptStep content={content} onNext={handleNext} />}
      {step === 2 && <VisualizationStep content={content} onNext={handleNext} />}
      {step === 3 && (
        <ScenarioStep content={content} userContext={userContext} onNext={handleNext} />
      )}
      {step === 4 && <ExerciseStep content={content} onNext={handleNext} />}
      {step === 5 && (
        <ReflectionStep
          content={content}
          onSubmit={async (text) => {
            await addReflection(text, lessonId);
            handleNext();
          }}
        />
      )}
      {step === 6 && <SummaryStep content={content} onComplete={handleComplete} />}
    </LessonStepContainer>
  );
}

function ConceptStep({ content, onNext }) {
  return (
    <View style={styles.stepBody}>
      <Card style={styles.conceptCard}>
        <Text style={styles.bodyText}>{content?.steps?.concept?.body}</Text>
        <View style={styles.visualHint}>
          <View style={[styles.hintBar, { height: 8 }]} />
          <View style={[styles.hintBar, { height: 14 }]} />
          <View style={[styles.hintBar, { height: 22 }]} />
          <View style={[styles.hintBar, { height: 30 }]} />
        </View>
        <Text style={styles.caption}>{content?.steps?.concept?.visualHint}</Text>
      </Card>
      <PrimaryButton label="Next" onPress={onNext} />
    </View>
  );
}

function VisualizationStep({ content, onNext }) {
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.stepBody}>
      <Card style={styles.visualCard}>
        <Text style={styles.bodyText}>{content?.steps?.visualization?.title}</Text>
        <Text style={styles.caption}>Tap elements to explore</Text>
        <View style={styles.segmentRow}>
          {content?.steps?.visualization?.segments?.map((segment) => (
            <Pressable
              key={segment.id}
              style={[styles.segment, { flex: segment.value * 10 }]}
              onPress={() => setSelected(segment)}
            >
              <Text style={styles.segmentLabel}>{segment.label}</Text>
            </Pressable>
          ))}
        </View>
      </Card>
      <PrimaryButton label="Next" onPress={onNext} />

      <BottomSheet
        visible={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.label}
      >
        <Text style={styles.sheetText}>{selected?.description}</Text>
      </BottomSheet>
    </View>
  );
}

function ScenarioStep({ content, userContext, onNext }) {
  const variantKey = getScenarioVariant(userContext);
  const variant = content?.steps?.scenario?.variants?.[variantKey];
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.stepBody}>
      <Card style={styles.scenarioCard}>
        <Text style={styles.bodyText}>{variant?.prompt}</Text>
        <View style={styles.optionList}>
          {variant?.options?.map((option) => {
            const isActive = selected === option;
            return (
              <Pressable
                key={option}
                style={[styles.option, isActive && styles.optionActive]}
                onPress={() => setSelected(option)}
              >
                <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                  {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>
      {selected ? (
        <Card style={styles.insightCard}>
          <Text style={styles.insightTitle}>Insight</Text>
          <Text style={styles.caption}>{variant?.insight}</Text>
        </Card>
      ) : null}
      <PrimaryButton label="Continue" onPress={onNext} disabled={!selected} />
    </View>
  );
}

function ExerciseStep({ content, onNext }) {
  const defaults = content?.steps?.exercise?.defaults;
  const ranges = content?.steps?.exercise?.ranges;
  const [contribution, setContribution] = useState(defaults?.contribution || 150);
  const [years, setYears] = useState(defaults?.years || 10);
  const [returnRate, setReturnRate] = useState(defaults?.returnRate || 6);
  const [hasRun, setHasRun] = useState(false);

  const results = useMemo(
    () => simulateCompound({ contribution, years, returnRate }),
    [contribution, years, returnRate]
  );

  const principalPercent = results.total === 0 ? 0 : results.principal / results.total;
  const growthPercent = results.total === 0 ? 0 : results.growth / results.total;

  const reset = () => {
    setContribution(defaults?.contribution || 150);
    setYears(defaults?.years || 10);
    setReturnRate(defaults?.returnRate || 6);
    setHasRun(false);
  };

  return (
    <View style={styles.stepBody}>
      <Card style={styles.exerciseCard}>
        <Text style={styles.bodyText}>{content?.steps?.exercise?.description}</Text>
        <View style={styles.exerciseSection}>
          <Text style={styles.exerciseLabel}>Step A - Set the inputs</Text>
          <View style={styles.sliderRow}>
            <Text style={styles.sliderTitle}>Monthly contribution</Text>
            <Text style={styles.sliderValue}>{formatCurrency(contribution)}</Text>
            <Slider
              value={contribution}
              minimumValue={ranges?.contribution?.min || 50}
              maximumValue={ranges?.contribution?.max || 500}
              step={ranges?.contribution?.step || 10}
              minimumTrackTintColor={colors.accent}
              maximumTrackTintColor={colors.surfaceActive}
              thumbTintColor={colors.accent}
              onValueChange={setContribution}
            />
          </View>
          <View style={styles.sliderRow}>
            <Text style={styles.sliderTitle}>Time horizon</Text>
            <Text style={styles.sliderValue}>{`${years} years`}</Text>
            <Slider
              value={years}
              minimumValue={ranges?.years?.min || 5}
              maximumValue={ranges?.years?.max || 30}
              step={ranges?.years?.step || 1}
              minimumTrackTintColor={colors.accent}
              maximumTrackTintColor={colors.surfaceActive}
              thumbTintColor={colors.accent}
              onValueChange={setYears}
            />
          </View>
          <View style={styles.sliderRow}>
            <Text style={styles.sliderTitle}>Expected return</Text>
            <Text style={styles.sliderValue}>{`${returnRate.toFixed(1)}%`}</Text>
            <Slider
              value={returnRate}
              minimumValue={ranges?.returnRate?.min || 3}
              maximumValue={ranges?.returnRate?.max || 10}
              step={ranges?.returnRate?.step || 0.5}
              minimumTrackTintColor={colors.accent}
              maximumTrackTintColor={colors.surfaceActive}
              thumbTintColor={colors.accent}
              onValueChange={setReturnRate}
            />
          </View>
        </View>
      </Card>

      <Card active style={styles.exerciseCard}>
        <Text style={styles.exerciseLabel}>Step B - Run simulation</Text>
        <PrimaryButton label="Run simulation" onPress={() => setHasRun(true)} />
        {hasRun ? (
          <View style={styles.resultsBlock}>
            <Text style={styles.exerciseLabel}>Step C - See the impact</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total value</Text>
              <Text style={styles.resultValue}>{formatCurrency(results.total)}</Text>
            </View>
            <View style={styles.stackedBar}>
              <View
                style={[styles.principalBar, { flex: principalPercent || 0.6 }]}
              />
              <View style={[styles.growthBar, { flex: growthPercent || 0.4 }]} />
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Contributions</Text>
              <Text style={styles.resultValue}>{formatCurrency(results.principal)}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Growth</Text>
              <Text style={styles.resultValue}>{formatCurrency(results.growth)}</Text>
            </View>
            <Text style={styles.caption}>
              More time increases growth faster than higher monthly deposits.
            </Text>
          </View>
        ) : null}
      </Card>

      <View style={styles.exerciseActions}>
        <SecondaryButton label="Reset" onPress={reset} />
        <PrimaryButton label="Complete exercise" onPress={onNext} disabled={!hasRun} />
      </View>
    </View>
  );
}

function ReflectionStep({ content, onSubmit }) {
  const [text, setText] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.stepBody}
    >
      <Card style={styles.reflectionCard}>
        <Text style={styles.bodyText}>{content?.steps?.reflection?.question}</Text>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Write a short reflection"
          placeholderTextColor={colors.textSecondary}
          multiline
        />
      </Card>
      <PrimaryButton label="Submit reflection" onPress={() => onSubmit(text)} disabled={!text} />
    </KeyboardAvoidingView>
  );
}

function SummaryStep({ content, onComplete }) {
  return (
    <View style={styles.stepBody}>
      <Card style={styles.summaryCard}>
        <Text style={styles.bodyText}>Key takeaways</Text>
        <View style={styles.takeawayList}>
          {content?.steps?.summary?.takeaways?.map((item) => (
            <View key={item} style={styles.takeawayRow}>
              <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
              <Text style={styles.takeawayText}>{item}</Text>
            </View>
          ))}
        </View>
      </Card>

      {content?.steps?.summary?.video ? (
        <Pressable
          onPress={() => Linking.openURL(content.steps.summary.video.url)}
          style={styles.videoRow}
        >
          <Ionicons name="play-circle" size={20} color={colors.accent} />
          <Text style={styles.videoText}>{content.steps.summary.video.label}</Text>
        </Pressable>
      ) : null}

      <PrimaryButton label="Complete lesson" onPress={onComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  stepBody: {
    gap: spacing.lg,
  },
  conceptCard: {
    gap: spacing.md,
  },
  bodyText: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    fontSize: typography.body,
    lineHeight: 22,
  },
  caption: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small,
    lineHeight: 18,
  },
  visualHint: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  hintBar: {
    width: 18,
    borderRadius: 6,
    backgroundColor: colors.surfaceActive,
  },
  visualCard: {
    gap: spacing.md,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  segment: {
    backgroundColor: colors.surfaceActive,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  segmentLabel: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    fontSize: typography.small,
  },
  sheetText: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
  },
  scenarioCard: {
    gap: spacing.md,
  },
  optionList: {
    gap: spacing.sm,
  },
  option: {
    padding: spacing.sm,
    borderRadius: 14,
    backgroundColor: colors.surfaceActive,
  },
  optionActive: {
    backgroundColor: 'rgba(198, 146, 29, 0.18)',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  optionText: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    fontSize: typography.small,
  },
  optionTextActive: {
    color: colors.accent,
  },
  insightCard: {
    gap: spacing.xs,
  },
  insightTitle: {
    fontFamily: typography.fontFamilyDemi,
    color: colors.textPrimary,
    fontSize: typography.h2,
  },
  exerciseCard: {
    gap: spacing.md,
  },
  exerciseSection: {
    gap: spacing.md,
  },
  exerciseLabel: {
    fontFamily: typography.fontFamilyDemi,
    color: colors.textPrimary,
    fontSize: typography.small,
  },
  sliderRow: {
    gap: spacing.xs,
  },
  sliderTitle: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small,
  },
  sliderValue: {
    fontFamily: typography.fontFamilyDemi,
    color: colors.textPrimary,
    fontSize: typography.body,
  },
  resultsBlock: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small,
  },
  resultValue: {
    fontFamily: typography.fontFamilyDemi,
    color: colors.textPrimary,
    fontSize: typography.body,
  },
  stackedBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  principalBar: {
    backgroundColor: colors.surfaceActive,
  },
  growthBar: {
    backgroundColor: colors.accent,
  },
  exerciseActions: {
    gap: spacing.md,
  },
  reflectionCard: {
    gap: spacing.md,
  },
  input: {
    minHeight: 120,
    borderRadius: 16,
    padding: spacing.md,
    backgroundColor: colors.surfaceActive,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.body,
    textAlignVertical: 'top',
  },
  summaryCard: {
    gap: spacing.md,
  },
  takeawayList: {
    gap: spacing.sm,
  },
  takeawayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  takeawayText: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    fontSize: typography.body,
  },
  videoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  videoText: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    fontSize: typography.body,
  },
});
