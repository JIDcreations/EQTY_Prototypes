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
  const exercise = content?.steps?.exercise;

  if (!exercise) {
    return (
      <View style={styles.stepBody}>
        <Card style={styles.exerciseCard}>
          <Text style={styles.bodyText}>No exercise is available for this lesson.</Text>
        </Card>
        <PrimaryButton label="Continue" onPress={onNext} />
      </View>
    );
  }

  switch (exercise.type) {
    case 'sequence':
      return <SequenceExercise exercise={exercise} onNext={onNext} />;
    case 'choice':
      return <ChoiceExercise exercise={exercise} onNext={onNext} />;
    case 'multi':
      return <MultiExercise exercise={exercise} onNext={onNext} />;
    case 'tradeoff':
    default:
      return <TradeoffExercise exercise={exercise} onNext={onNext} />;
  }
}

function SequenceExercise({ exercise, onNext }) {
  const { description, items = [], correctOrder = [], feedback = {} } = exercise;
  const [order, setOrder] = useState([]);

  const isComplete = order.length === items.length;
  const isCorrect =
    isComplete && correctOrder.every((stepId, index) => order[index] === stepId);
  const message = isComplete ? (isCorrect ? feedback.correct : feedback.incorrect) : null;

  const handleAdd = (stepId) => {
    if (order.includes(stepId)) return;
    setOrder((prev) => [...prev, stepId]);
  };

  const handleRemove = (stepId) => {
    setOrder((prev) => prev.filter((item) => item !== stepId));
  };

  const reset = () => setOrder([]);

  return (
    <View style={styles.stepBody}>
      <Card style={styles.exerciseCard}>
        <Text style={styles.bodyText}>{description}</Text>
        <Text style={styles.exerciseLabel}>Your order</Text>
        <View style={styles.sequenceList}>
          {order.length === 0 ? (
            <Text style={styles.caption}>Tap actions below to build the sequence.</Text>
          ) : (
            order.map((stepId, index) => {
              const item = items.find((entry) => entry.id === stepId);
              return (
                <Pressable
                  key={stepId}
                  onPress={() => handleRemove(stepId)}
                  style={styles.sequenceItem}
                >
                  <View style={styles.sequenceIndex}>
                    <Text style={styles.sequenceIndexText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.sequenceText}>{item?.label}</Text>
                </Pressable>
              );
            })
          )}
        </View>
        <Text style={styles.exerciseLabel}>Actions</Text>
        <View style={styles.optionList}>
          {items.map((item) => {
            const isSelected = order.includes(item.id);
            return (
              <Pressable
                key={item.id}
                onPress={() => handleAdd(item.id)}
                style={[styles.option, isSelected && styles.optionDisabled]}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      {message ? (
        <Card active style={styles.insightCard}>
          <Text style={styles.insightTitle}>{isCorrect ? 'Aligned' : 'Recheck the flow'}</Text>
          <Text style={styles.caption}>{message}</Text>
        </Card>
      ) : null}

      <View style={styles.exerciseActions}>
        <SecondaryButton label="Reset" onPress={reset} />
        <PrimaryButton label="Complete exercise" onPress={onNext} disabled={!isComplete} />
      </View>
    </View>
  );
}

function ChoiceExercise({ exercise, onNext }) {
  const { description, options = [], revealTitle = 'Outcome' } = exercise;
  const [selectedId, setSelectedId] = useState(null);
  const selected = options.find((option) => option.id === selectedId);

  const reset = () => setSelectedId(null);

  return (
    <View style={styles.stepBody}>
      <Card style={styles.exerciseCard}>
        <Text style={styles.bodyText}>{description}</Text>
        <View style={styles.optionList}>
          {options.map((option) => {
            const isActive = option.id === selectedId;
            return (
              <Pressable
                key={option.id}
                style={[styles.option, isActive && styles.optionActive]}
                onPress={() => setSelectedId(option.id)}
              >
                <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      {selected ? (
        <Card active style={styles.insightCard}>
          <Text style={styles.insightTitle}>{selected.revealTitle || revealTitle}</Text>
          <Text style={styles.caption}>{selected.reveal}</Text>
        </Card>
      ) : null}

      <View style={styles.exerciseActions}>
        <SecondaryButton label="Reset" onPress={reset} />
        <PrimaryButton label="Complete exercise" onPress={onNext} disabled={!selected} />
      </View>
    </View>
  );
}

function TradeoffExercise({ exercise, onNext }) {
  const {
    description,
    sliders = [],
    requiresRun = false,
    ctaLabel = 'Reveal impact',
    scoreLabel = 'Signal',
    insight = {},
    insightMode = 'score',
    insightBySlider = {},
    scoreMode = 'average',
  } = exercise;

  const initialValues = useMemo(() => {
    return sliders.reduce((acc, slider) => {
      const fallback = slider.min + (slider.max - slider.min) / 2;
      acc[slider.id] = slider.defaultValue ?? fallback;
      return acc;
    }, {});
  }, [sliders]);

  const [values, setValues] = useState(initialValues);
  const [hasRun, setHasRun] = useState(!requiresRun);

  const reset = () => {
    setValues(initialValues);
    setHasRun(!requiresRun);
  };

  const handleValueChange = (id, nextValue) => {
    setValues((prev) => ({ ...prev, [id]: nextValue }));
  };

  const normalized = sliders.map((slider) => {
    const raw = values[slider.id] ?? slider.min;
    const range = slider.max - slider.min || 1;
    const ratio = (raw - slider.min) / range;
    return slider.invert ? 1 - ratio : ratio;
  });

  const score = (() => {
    if (normalized.length === 0) return 0;
    if (scoreMode === 'range') {
      const max = Math.max(...normalized);
      const min = Math.min(...normalized);
      return Math.round((max - min) * 100);
    }
    const total = normalized.reduce((sum, value) => sum + value, 0);
    return Math.round((total / normalized.length) * 100);
  })();

  const insightText = (() => {
    if (insightMode === 'dominant' && sliders.length) {
      const dominant = sliders.reduce((winner, slider) =>
        (values[slider.id] ?? 0) > (values[winner.id] ?? 0) ? slider : winner
      );
      return insightBySlider[dominant.id] || insight.mid || '';
    }
    if (score <= 35) return insight.low || '';
    if (score >= 66) return insight.high || '';
    return insight.mid || '';
  })();

  const formatSliderValue = (slider, value) => {
    const prefix = slider.prefix || '';
    const suffix = slider.suffix || '';
    return `${prefix}${value}${suffix}`;
  };

  return (
    <View style={styles.stepBody}>
      <Card style={styles.exerciseCard}>
        <Text style={styles.bodyText}>{description}</Text>
        <View style={styles.exerciseSection}>
          {sliders.map((slider) => (
            <View key={slider.id} style={styles.sliderRow}>
              <Text style={styles.sliderTitle}>{slider.label}</Text>
              <Text style={styles.sliderValue}>
                {formatSliderValue(slider, values[slider.id])}
              </Text>
              <Slider
                value={values[slider.id]}
                minimumValue={slider.min}
                maximumValue={slider.max}
                step={slider.step}
                minimumTrackTintColor={colors.accent}
                maximumTrackTintColor={colors.surfaceActive}
                thumbTintColor={colors.accent}
                onValueChange={(nextValue) => handleValueChange(slider.id, nextValue)}
              />
              {slider.leftLabel || slider.rightLabel ? (
                <View style={styles.sliderHintRow}>
                  <Text style={styles.sliderHintText}>{slider.leftLabel}</Text>
                  <Text style={styles.sliderHintText}>{slider.rightLabel}</Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </Card>

      <Card active style={styles.exerciseCard}>
        {requiresRun ? (
          <PrimaryButton label={ctaLabel} onPress={() => setHasRun(true)} />
        ) : null}
        {hasRun ? (
          <View style={styles.resultsBlock}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>{scoreLabel}</Text>
              <Text style={styles.resultValue}>{`${score}/100`}</Text>
            </View>
            <View style={styles.scoreTrack}>
              <View style={[styles.scoreFill, { width: `${score}%` }]} />
            </View>
            {insightText ? <Text style={styles.caption}>{insightText}</Text> : null}
            {exercise.resultHint ? (
              <Text style={styles.caption}>{exercise.resultHint}</Text>
            ) : null}
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

function MultiExercise({ exercise, onNext }) {
  const {
    description,
    options = [],
    baseScore = 100,
    scoreLabel = 'Coverage',
    unit = '%',
    insight = {},
    emptyMessage = 'Select items to see the impact.',
  } = exercise;
  const [selectedIds, setSelectedIds] = useState([]);

  const toggle = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const reset = () => setSelectedIds([]);

  const totalImpact = selectedIds.reduce((sum, id) => {
    const option = options.find((item) => item.id === id);
    return sum + (option?.impact || 0);
  }, 0);

  const remaining = Math.max(0, baseScore - totalImpact);
  const insightText = (() => {
    if (remaining <= 35) return insight.low || '';
    if (remaining >= 66) return insight.high || '';
    return insight.mid || '';
  })();

  const hasSelection = selectedIds.length > 0;

  return (
    <View style={styles.stepBody}>
      <Card style={styles.exerciseCard}>
        <Text style={styles.bodyText}>{description}</Text>
        <View style={styles.optionList}>
          {options.map((option) => {
            const isActive = selectedIds.includes(option.id);
            return (
              <Pressable
                key={option.id}
                style={[styles.option, isActive && styles.optionActive]}
                onPress={() => toggle(option.id)}
              >
                <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card active style={styles.insightCard}>
        <Text style={styles.insightTitle}>{scoreLabel}</Text>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>{scoreLabel}</Text>
          <Text style={styles.resultValue}>{`${Math.round(remaining)}${unit}`}</Text>
        </View>
        {insightText ? <Text style={styles.caption}>{insightText}</Text> : null}
        {hasSelection ? (
          <View style={styles.impactList}>
            {selectedIds.map((id) => {
              const option = options.find((item) => item.id === id);
              if (!option) return null;
              return (
                <View key={id} style={styles.impactRow}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
                  <Text style={styles.impactText}>{option.detail}</Text>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={styles.caption}>{emptyMessage}</Text>
        )}
      </Card>

      <View style={styles.exerciseActions}>
        <SecondaryButton label="Reset" onPress={reset} />
        <PrimaryButton label="Complete exercise" onPress={onNext} disabled={!hasSelection} />
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
  sequenceList: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sequenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: 14,
    backgroundColor: colors.surfaceActive,
  },
  sequenceIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sequenceIndexText: {
    fontFamily: typography.fontFamilyDemi,
    fontSize: typography.small,
    color: colors.textPrimary,
  },
  sequenceText: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textPrimary,
    flex: 1,
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
  sliderHintRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderHintText: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small,
  },
  optionDisabled: {
    opacity: 0.45,
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
  scoreTrack: {
    height: 8,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  scoreFill: {
    height: 8,
    backgroundColor: colors.accent,
  },
  impactList: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  impactText: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small,
    flex: 1,
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
