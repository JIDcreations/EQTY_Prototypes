import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import BottomSheet from '../components/BottomSheet';
import Card from '../components/Card';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { useGlossary } from '../components/GlossaryProvider';
import GlossaryText from '../components/GlossaryText';
import LessonStepContainer from '../components/LessonStepContainer';
import StepHeader from '../components/StepHeader';
import { lessonContent } from '../data/lessonContent';
import useThemeColors from '../theme/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../utils/AppContext';
import { getScenarioVariant } from '../utils/helpers';

const TOTAL_STEPS = 6;

function useLessonStepStyles() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return { colors, styles };
}

export default function LessonStepScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { lessonId, step = 1, entrySource } = route.params || {};
  const { userContext, addReflection, completeLesson } = useApp();
  const glossary = useGlossary();
  const isIntroConcept = lessonId === 'lesson_0' && step === 1;

  const content = lessonContent[lessonId] || lessonContent.lesson_0;
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

  const handleTermPress = (term) => {
    if (glossary?.openTerm) glossary.openTerm(term);
  };

  return (
    <LessonStepContainer>
      <StepHeader
        step={step}
        total={TOTAL_STEPS}
        title={stepTitle}
        onBack={() => navigation.goBack()}
        onPressTerm={handleTermPress}
        stepLabel={isIntroConcept ? 'STEP 1 · CONCEPT' : null}
        progressText={isIntroConcept ? `1/${TOTAL_STEPS}` : null}
        showTitle={!isIntroConcept}
      />

      {step === 1 && (
        <ConceptStep
          content={content}
          lessonId={lessonId}
          onNext={handleNext}
          onPressTerm={handleTermPress}
        />
      )}
      {step === 2 && (
        <VisualizationStep content={content} onNext={handleNext} onPressTerm={handleTermPress} />
      )}
      {step === 3 && (
        <ScenarioStep
          content={content}
          userContext={userContext}
          onNext={handleNext}
          onPressTerm={handleTermPress}
        />
      )}
      {step === 4 && (
        <ExerciseStep content={content} onNext={handleNext} onPressTerm={handleTermPress} />
      )}
      {step === 5 && (
        <ReflectionStep
          content={content}
          onSubmit={async (text) => {
            await addReflection(text, lessonId);
            handleNext();
          }}
          onPressTerm={handleTermPress}
        />
      )}
      {step === 6 && (
        <SummaryStep content={content} onComplete={handleComplete} onPressTerm={handleTermPress} />
      )}

    </LessonStepContainer>
  );
}

function ConceptStep({ content, lessonId, onNext, onPressTerm }) {
  const { styles } = useLessonStepStyles();

  if (lessonId === 'lesson_0') {
    return <IntroConceptStep onNext={onNext} />;
  }

  return (
    <View style={styles.stepBody}>
      <Card style={styles.conceptCard}>
        <GlossaryText
          text={content?.steps?.concept?.body}
          style={styles.bodyText}
          onPressTerm={onPressTerm}
        />
        <View style={styles.visualHint}>
          <View style={[styles.hintBar, { height: 8 }]} />
          <View style={[styles.hintBar, { height: 14 }]} />
          <View style={[styles.hintBar, { height: 22 }]} />
          <View style={[styles.hintBar, { height: 30 }]} />
        </View>
        <GlossaryText
          text={content?.steps?.concept?.visualHint}
          style={styles.caption}
          onPressTerm={onPressTerm}
        />
      </Card>
      <PrimaryButton label="Next" onPress={onNext} />
    </View>
  );
}

function IntroConceptStep({ onNext }) {
  const { styles } = useLessonStepStyles();
  const steps = [
    {
      id: 'goal',
      label: 'Goal definition',
      detail: 'Clarify what the money should achieve.',
    },
    {
      id: 'risk',
      label: 'Individual risk analysis',
      detail: 'Define risk capacity, tolerance, and time horizon.',
    },
    {
      id: 'strategy',
      label: 'Financial investment strategy',
      detail: 'Translate the goal into guiding rules.',
    },
    {
      id: 'allocation',
      label: 'Capital allocation',
      detail: 'Decide how capital is distributed across assets.',
    },
    {
      id: 'vehicle',
      label: 'Investment vehicle',
      detail: 'Select the instruments that fit the allocation.',
    },
    {
      id: 'execution',
      label: 'Execution',
      detail: 'Place the order only after the process is clear.',
    },
  ];
  const [activeId, setActiveId] = useState(steps[0].id);
  const paragraph =
    'Investing is not a single action. It is a sequence of decisions that build on each other. Buying or selling only happens at the final step.';

  return (
    <View style={styles.stepBody}>
      <Card style={styles.conceptCard}>
        <View style={styles.introHeader}>
          <View style={styles.introAccent} />
          <AppText style={styles.introLabel}>Definition</AppText>
        </View>
        <AppText style={styles.introTitle}>What is investing as a process?</AppText>
        <AppText style={styles.introText}>{paragraph}</AppText>
      </Card>
      <Card style={styles.processCard}>
        <View style={styles.processHeader}>
          <AppText style={styles.processTitle}>Process overview</AppText>
          <AppText style={styles.processHint}>Tap a step to see its role.</AppText>
        </View>
        <View style={styles.processList}>
          <View pointerEvents="none" style={styles.processRail} />
          {steps.map((step) => {
            const isActive = step.id === activeId;
            return (
              <Pressable
                key={step.id}
                onPress={() => setActiveId(step.id)}
                style={styles.processRow}
              >
                <View style={styles.processNodeWrap}>
                  <View
                    style={[
                      styles.processNode,
                      isActive && styles.processNodeActive,
                    ]}
                  />
                </View>
                <View style={styles.processCopy}>
                  <AppText
                    style={[styles.processLabel, isActive && styles.processLabelActive]}
                  >
                    {step.label}
                  </AppText>
                  {isActive ? (
                    <AppText style={styles.processDetail}>{step.detail}</AppText>
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </Card>
      <PrimaryButton label="Next" onPress={onNext} />
    </View>
  );
}

function VisualizationStep({ content, onNext, onPressTerm }) {
  const { styles } = useLessonStepStyles();
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.stepBody}>
      <Card style={styles.visualCard}>
        <GlossaryText
          text={content?.steps?.visualization?.title}
          style={styles.bodyText}
          onPressTerm={onPressTerm}
        />
        <AppText style={styles.caption}>Tap elements to explore</AppText>
        <View style={styles.segmentRow}>
          {content?.steps?.visualization?.segments?.map((segment) => (
            <Pressable
              key={segment.id}
              style={[styles.segment, { flex: segment.value * 10 }]}
              onPress={() => setSelected(segment)}
            >
              <GlossaryText
                text={segment.label}
                style={styles.segmentLabel}
                onPressTerm={onPressTerm}
              />
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
        <AppText style={styles.sheetText}>{selected?.description}</AppText>
      </BottomSheet>
    </View>
  );
}

function ScenarioStep({ content, userContext, onNext, onPressTerm }) {
  const { styles } = useLessonStepStyles();
  const variantKey = getScenarioVariant(userContext);
  const variant = content?.steps?.scenario?.variants?.[variantKey];
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.stepBody}>
      <Card style={styles.scenarioCard}>
        <GlossaryText text={variant?.prompt} style={styles.bodyText} onPressTerm={onPressTerm} />
        <View style={styles.optionList}>
          {variant?.options?.map((option) => {
            const isActive = selected === option;
            return (
              <Pressable
                key={option}
                style={[styles.option, isActive && styles.optionActive]}
                onPress={() => setSelected(option)}
              >
                <GlossaryText
                  text={option}
                  style={[styles.optionText, isActive && styles.optionTextActive]}
                  onPressTerm={onPressTerm}
                />
              </Pressable>
            );
          })}
        </View>
      </Card>
      {selected ? (
        <Card style={styles.insightCard}>
          <AppText style={styles.insightTitle}>Insight</AppText>
          <GlossaryText
            text={variant?.insight}
            style={styles.caption}
            onPressTerm={onPressTerm}
          />
        </Card>
      ) : null}
      <PrimaryButton label="Continue" onPress={onNext} disabled={!selected} />
    </View>
  );
}

function ExerciseStep({ content, onNext, onPressTerm }) {
  const { styles } = useLessonStepStyles();
  const exercise = content?.steps?.exercise;

  if (!exercise) {
    return (
      <View style={styles.stepBody}>
        <Card style={styles.exerciseCard}>
          <AppText style={styles.bodyText}>No exercise is available for this lesson.</AppText>
        </Card>
        <PrimaryButton label="Continue" onPress={onNext} />
      </View>
    );
  }

  switch (exercise.type) {
    case 'sequence':
      return <SequenceExercise exercise={exercise} onNext={onNext} onPressTerm={onPressTerm} />;
    case 'choice':
      return <ChoiceExercise exercise={exercise} onNext={onNext} onPressTerm={onPressTerm} />;
    case 'multi':
      return <MultiExercise exercise={exercise} onNext={onNext} onPressTerm={onPressTerm} />;
    case 'tradeoff':
    default:
      return <TradeoffExercise exercise={exercise} onNext={onNext} onPressTerm={onPressTerm} />;
  }
}

function SequenceExercise({ exercise, onNext, onPressTerm }) {
  const { styles } = useLessonStepStyles();
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
        <GlossaryText text={description} style={styles.bodyText} onPressTerm={onPressTerm} />
        <AppText style={styles.exerciseLabel}>Your order</AppText>
        <View style={styles.sequenceList}>
          {order.length === 0 ? (
            <AppText style={styles.caption}>Tap actions below to build the sequence.</AppText>
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
                    <AppText style={styles.sequenceIndexText}>{index + 1}</AppText>
                  </View>
                  <GlossaryText
                    text={item?.label}
                    style={styles.sequenceText}
                    onPressTerm={onPressTerm}
                  />
                </Pressable>
              );
            })
          )}
        </View>
        <AppText style={styles.exerciseLabel}>Actions</AppText>
        <View style={styles.optionList}>
          {items.map((item) => {
            const isSelected = order.includes(item.id);
            return (
              <Pressable
                key={item.id}
                onPress={() => handleAdd(item.id)}
                style={[styles.option, isSelected && styles.optionDisabled]}
              >
                <GlossaryText
                  text={item.label}
                  style={styles.optionText}
                  onPressTerm={onPressTerm}
                />
              </Pressable>
            );
          })}
        </View>
      </Card>

      {message ? (
        <Card style={styles.insightCard}>
          <AppText style={styles.insightTitle}>{isCorrect ? 'Aligned' : 'Recheck the flow'}</AppText>
          <GlossaryText text={message} style={styles.caption} onPressTerm={onPressTerm} />
        </Card>
      ) : null}

      <View style={styles.exerciseActions}>
        <SecondaryButton label="Reset" onPress={reset} />
        <PrimaryButton label="Complete exercise" onPress={onNext} disabled={!isComplete} />
      </View>
    </View>
  );
}

function ChoiceExercise({ exercise, onNext, onPressTerm }) {
  const { styles } = useLessonStepStyles();
  const { description, options = [], revealTitle = 'Outcome' } = exercise;
  const [selectedId, setSelectedId] = useState(null);
  const selected = options.find((option) => option.id === selectedId);

  const reset = () => setSelectedId(null);

  return (
    <View style={styles.stepBody}>
      <Card style={styles.exerciseCard}>
        <GlossaryText text={description} style={styles.bodyText} onPressTerm={onPressTerm} />
        <View style={styles.optionList}>
          {options.map((option) => {
            const isActive = option.id === selectedId;
            return (
              <Pressable
                key={option.id}
                style={[styles.option, isActive && styles.optionActive]}
                onPress={() => setSelectedId(option.id)}
              >
                <GlossaryText
                  text={option.label}
                  style={[styles.optionText, isActive && styles.optionTextActive]}
                  onPressTerm={onPressTerm}
                />
              </Pressable>
            );
          })}
        </View>
      </Card>

      {selected ? (
        <Card style={styles.insightCard}>
          <AppText style={styles.insightTitle}>{selected.revealTitle || revealTitle}</AppText>
          <GlossaryText text={selected.reveal} style={styles.caption} onPressTerm={onPressTerm} />
        </Card>
      ) : null}

      <View style={styles.exerciseActions}>
        <SecondaryButton label="Reset" onPress={reset} />
        <PrimaryButton label="Complete exercise" onPress={onNext} disabled={!selected} />
      </View>
    </View>
  );
}

function TradeoffExercise({ exercise, onNext, onPressTerm }) {
  const { colors, styles } = useLessonStepStyles();
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
        <GlossaryText text={description} style={styles.bodyText} onPressTerm={onPressTerm} />
        <View style={styles.exerciseSection}>
          {sliders.map((slider) => (
            <View key={slider.id} style={styles.sliderRow}>
              <GlossaryText
                text={slider.label}
                style={styles.sliderTitle}
                onPressTerm={onPressTerm}
              />
              <AppText style={styles.sliderValue}>
                {formatSliderValue(slider, values[slider.id])}
              </AppText>
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
                  <GlossaryText
                    text={slider.leftLabel}
                    style={styles.sliderHintText}
                    onPressTerm={onPressTerm}
                  />
                  <GlossaryText
                    text={slider.rightLabel}
                    style={styles.sliderHintText}
                    onPressTerm={onPressTerm}
                  />
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.exerciseCard}>
        {requiresRun ? (
          <PrimaryButton label={ctaLabel} onPress={() => setHasRun(true)} />
        ) : null}
        {hasRun ? (
          <View style={styles.resultsBlock}>
            <View style={styles.resultRow}>
              <AppText style={styles.resultLabel}>{scoreLabel}</AppText>
              <AppText style={styles.resultValue}>{`${score}/100`}</AppText>
            </View>
            <View style={styles.scoreTrack}>
              <View style={[styles.scoreFill, { width: `${score}%` }]} />
            </View>
            {insightText ? (
              <GlossaryText text={insightText} style={styles.caption} onPressTerm={onPressTerm} />
            ) : null}
            {exercise.resultHint ? (
              <GlossaryText
                text={exercise.resultHint}
                style={styles.caption}
                onPressTerm={onPressTerm}
              />
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

function MultiExercise({ exercise, onNext, onPressTerm }) {
  const { colors, styles } = useLessonStepStyles();
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
        <GlossaryText text={description} style={styles.bodyText} onPressTerm={onPressTerm} />
        <View style={styles.optionList}>
          {options.map((option) => {
            const isActive = selectedIds.includes(option.id);
            return (
              <Pressable
                key={option.id}
                style={[styles.option, isActive && styles.optionActive]}
                onPress={() => toggle(option.id)}
              >
                <GlossaryText
                  text={option.label}
                  style={[styles.optionText, isActive && styles.optionTextActive]}
                  onPressTerm={onPressTerm}
                />
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card style={styles.insightCard}>
        <AppText style={styles.insightTitle}>{scoreLabel}</AppText>
        <View style={styles.resultRow}>
          <AppText style={styles.resultLabel}>{scoreLabel}</AppText>
          <AppText style={styles.resultValue}>{`${Math.round(remaining)}${unit}`}</AppText>
        </View>
        {insightText ? (
          <GlossaryText text={insightText} style={styles.caption} onPressTerm={onPressTerm} />
        ) : null}
        {hasSelection ? (
          <View style={styles.impactList}>
            {selectedIds.map((id) => {
              const option = options.find((item) => item.id === id);
              if (!option) return null;
              return (
                <View key={id} style={styles.impactRow}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.accent} />
                  <GlossaryText
                    text={option.detail}
                    style={styles.impactText}
                    onPressTerm={onPressTerm}
                  />
                </View>
              );
            })}
          </View>
        ) : (
          <GlossaryText text={emptyMessage} style={styles.caption} onPressTerm={onPressTerm} />
        )}
      </Card>

      <View style={styles.exerciseActions}>
        <SecondaryButton label="Reset" onPress={reset} />
        <PrimaryButton label="Complete exercise" onPress={onNext} disabled={!hasSelection} />
      </View>
    </View>
  );
}

function ReflectionStep({ content, onSubmit, onPressTerm }) {
  const { colors, styles } = useLessonStepStyles();
  const [text, setText] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.stepBody}
    >
      <Card style={styles.reflectionCard}>
        <GlossaryText
          text={content?.steps?.reflection?.question}
          style={styles.bodyText}
          onPressTerm={onPressTerm}
        />
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

function SummaryStep({ content, onComplete, onPressTerm }) {
  const { colors, styles } = useLessonStepStyles();
  return (
    <View style={styles.stepBody}>
      <Card style={styles.summaryCard}>
        <AppText style={styles.bodyText}>Key takeaways</AppText>
        <View style={styles.takeawayList}>
          {content?.steps?.summary?.takeaways?.map((item) => (
            <View key={item} style={styles.takeawayRow}>
              <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
              <GlossaryText
                text={item}
                style={styles.takeawayText}
                onPressTerm={onPressTerm}
              />
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
          <AppText style={styles.videoText}>{content.steps.summary.video.label}</AppText>
        </Pressable>
      ) : null}

      <PrimaryButton label="Complete lesson" onPress={onComplete} />
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
  stepBody: {
    gap: spacing.lg,
  },
  conceptCard: {
    gap: spacing.md,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  introAccent: {
    width: 18,
    height: 2,
    backgroundColor: colors.accent,
    borderRadius: 999,
  },
  introLabel: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  introTitle: {
    fontFamily: typography.fontFamilyDemi,
    color: colors.textPrimary,
    fontSize: typography.h1,
  },
  introText: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    fontSize: typography.body,
    lineHeight: 22,
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
  processCard: {
    gap: spacing.md,
  },
  processHeader: {
    gap: spacing.xs,
  },
  processTitle: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    fontSize: typography.small,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  processHint: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small,
  },
  processList: {
    position: 'relative',
    gap: 0,
    paddingLeft: spacing.xs,
  },
  processRail: {
    position: 'absolute',
    left: 10,
    top: 8,
    bottom: 8,
    width: 2,
    backgroundColor: colors.divider,
  },
  processRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  processNodeWrap: {
    width: 22,
    alignItems: 'center',
    marginTop: 2,
  },
  processNode: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.textSecondary,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  processNodeActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  processCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  processLabel: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
  },
  processLabelActive: {
    color: colors.textPrimary,
  },
  processDetail: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small,
    lineHeight: 18,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  segment: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: colors.surfaceActive,
    borderWidth: 1,
    borderColor: colors.textPrimary,
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
    borderWidth: 1,
    borderColor: colors.textPrimary,
  },
  optionActive: {
    backgroundColor: colors.surfaceActive,
    borderWidth: 1,
    borderColor: colors.textPrimary,
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
    borderWidth: 1,
    borderColor: colors.textPrimary,
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
    borderWidth: 1,
    borderColor: colors.textPrimary,
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
