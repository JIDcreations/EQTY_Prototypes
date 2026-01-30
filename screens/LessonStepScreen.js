import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
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
import useThemeColors from '../theme/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../utils/AppContext';
import { getScenarioVariant } from '../utils/helpers';
import {
  getIntroStepTitle,
  getLessonContent,
  getLessonStepCopy,
} from '../utils/localization';

const TOTAL_STEPS = 6;
const STABLE_CURVE_POINTS = [
  { x: 0, y: 78 },
  { x: 8, y: 75 },
  { x: 16, y: 72 },
  { x: 24, y: 68 },
  { x: 32, y: 66 },
  { x: 40, y: 60 },
  { x: 48, y: 58 },
  { x: 56, y: 52 },
  { x: 64, y: 50 },
  { x: 72, y: 44 },
  { x: 80, y: 40 },
  { x: 88, y: 36 },
  { x: 96, y: 30 },
  { x: 100, y: 26 },
];
const VOLATILE_CURVE_POINTS = [
  { x: 0, y: 50 },
  { x: 15, y: 38 },
  { x: 30, y: 64 },
  { x: 45, y: 42 },
  { x: 60, y: 70 },
  { x: 75, y: 50 },
  { x: 90, y: 78 },
  { x: 100, y: 72 },
];

const getSmoothPoints = (basePoints, samplesPerSegment = 10) => {
  if (basePoints.length < 3) return basePoints;
  const smooth = [];
  for (let i = 0; i < basePoints.length - 1; i += 1) {
    const p0 = basePoints[i - 1] || basePoints[i];
    const p1 = basePoints[i];
    const p2 = basePoints[i + 1];
    const p3 = basePoints[i + 2] || p2;
    for (let step = 0; step <= samplesPerSegment; step += 1) {
      const t = step / samplesPerSegment;
      const t2 = t * t;
      const t3 = t2 * t;
      const x =
        0.5 *
        (2 * p1.x +
          (-p0.x + p2.x) * t +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
      const y =
        0.5 *
        (2 * p1.y +
          (-p0.y + p2.y) * t +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
      if (i > 0 && step === 0) continue;
      smooth.push({ x, y });
    }
  }
  return smooth;
};

function useLessonStepStyles() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return { colors, styles };
}

export default function LessonStepScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { lessonId, step = 1, entrySource } = route.params || {};
  const { userContext, onboardingContext, addReflection, completeLesson, preferences } = useApp();
  const glossary = useGlossary();
  const isIntroScenario = lessonId === 'lesson_0' && step === 3;

  const content = getLessonContent(lessonId, preferences?.language);
  const copy = useMemo(() => getLessonStepCopy(preferences?.language), [preferences?.language]);
  const stepTitle = useMemo(() => {
    if (!content) return `${copy.labels.part} ${step}`;
    const introTitle = getIntroStepTitle(preferences?.language, step);
    switch (step) {
      case 1:
        return content.steps.concept.title;
      case 2:
        return lessonId === 'lesson_0'
          ? introTitle || content.steps.visualization.title
          : content.steps.visualization.title;
      case 3:
        return content.steps.scenario.title;
      case 4:
        return content?.steps?.exercise?.title || introTitle || 'Build the process';
      case 5:
        return content?.steps?.reflection?.title || introTitle || 'Reflection';
      case 6:
        return introTitle || 'The full investing process';
      default:
        return `${copy.labels.part} ${step}`;
    }
  }, [content, copy.labels.part, lessonId, preferences?.language, step]);

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      navigation.push('LessonStep', { lessonId, step: step + 1, entrySource });
    }
  };

  const handleComplete = async () => {
    await completeLesson(lessonId);
    navigation.navigate('LessonSuccess', { lessonId });
  };

  const handleTermPress = (term) => {
    if (glossary?.openTerm) glossary.openTerm(term);
  };

  const disableOuterScroll =
    lessonId === 'lesson_0' && (step === 2 || step === 5 || step === 6);
  const containerContentStyle =
    disableOuterScroll && (step === 2 || step === 5) ? { paddingBottom: 0 } : null;
  const flowPhaseLabel =
    copy.labels.lessonFlowPhases?.[step] || copy.labels.part;
  const flowMetaLabel = `${flowPhaseLabel} · ${step}/${TOTAL_STEPS}`.toUpperCase();

  return (
    <LessonStepContainer
      scrollEnabled={!disableOuterScroll}
      contentStyle={containerContentStyle}
    >
      <StepHeader
        step={step}
        total={TOTAL_STEPS}
        title={stepTitle}
        onBack={() => navigation.goBack()}
        onPressTerm={handleTermPress}
        stepLabel={flowMetaLabel}
        helperText={
          isIntroScenario ? copy.introScenario.headerHelper : null
        }
        showTitle
      />

      {step === 1 && (
        <ConceptStep
          content={content}
          lessonId={lessonId}
          onNext={handleNext}
          onPressTerm={handleTermPress}
          copy={copy}
        />
      )}
      {step === 2 && (
        <VisualizationStep
          content={content}
          lessonId={lessonId}
          onNext={handleNext}
          onPressTerm={handleTermPress}
          copy={copy}
        />
      )}
      {step === 3 && (lessonId === 'lesson_0' ? (
        <IntroScenarioStep
          content={content}
          onboardingContext={onboardingContext}
          userContext={userContext}
          onNext={handleNext}
          copy={copy}
        />
      ) : (
        <ScenarioStep
          content={content}
          userContext={userContext}
          onNext={handleNext}
          onPressTerm={handleTermPress}
          copy={copy}
        />
      ))}
      {step === 4 && (
        <ExerciseStep
          content={content}
          lessonId={lessonId}
          onNext={handleNext}
          onPressTerm={handleTermPress}
          copy={copy}
        />
      )}
      {step === 5 && (
        <ReflectionStep
          content={content}
          onSubmit={async (text, response) => {
            await addReflection(text, lessonId, response);
            handleNext();
          }}
          onPressTerm={handleTermPress}
          copy={copy}
        />
      )}
      {step === 6 && (
        lessonId === 'lesson_0' ? (
          <IntroSummaryStep content={content} onComplete={handleComplete} copy={copy} />
        ) : (
          <SummaryStep
            content={content}
            onComplete={handleComplete}
            onPressTerm={handleTermPress}
            copy={copy}
          />
        )
      )}

    </LessonStepContainer>
  );
}

function ConceptStep({ content, lessonId, onNext, onPressTerm, copy }) {
  const { styles } = useLessonStepStyles();

  if (lessonId === 'lesson_0') {
    return <IntroConceptStep content={content} onNext={onNext} copy={copy} />;
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
      <PrimaryButton label={copy.buttons.next} onPress={onNext} />
    </View>
  );
}

function IntroConceptStep({ content, onNext, copy }) {
  const { colors, styles } = useLessonStepStyles();
  const intro = content?.steps?.concept?.intro;
  const steps = copy.introConcept.steps;
  const [activeIndex, setActiveIndex] = useState(null);
  const paragraph = copy.introConcept.paragraph;

  return (
    <View style={styles.stepBody}>
      {intro ? <AppText style={styles.stepIntro}>{intro}</AppText> : null}
      <Card style={styles.conceptCard}>
        <View style={styles.introHeader}>
          <View style={styles.introAccent} />
          <AppText style={styles.introLabel}>{copy.introConcept.definition}</AppText>
        </View>
        <AppText style={styles.introTitle}>{copy.introConcept.title}</AppText>
        <AppText style={styles.introText}>{paragraph}</AppText>
      </Card>
      <Card style={styles.processCard}>
        <View style={styles.processHeader}>
          <AppText style={styles.processTitle}>{copy.introConcept.processTitle}</AppText>
          <AppText style={styles.processHint}>{copy.introConcept.processHint}</AppText>
        </View>
        <View style={styles.processMap}>
          <View style={styles.processLine} />
          {steps.map((step, index) => {
            const isActive = index === activeIndex;
            return (
              <View key={step.id} style={styles.processStationBlock}>
                <Pressable
                  onPress={() =>
                    setActiveIndex((prev) => (prev === index ? null : index))
                  }
                  style={[
                    styles.processStationRow,
                    isActive && styles.processStationRowActive,
                  ]}
                >
                  <View
                    style={[styles.processNode, isActive && styles.processNodeActive]}
                  />
                  <View style={styles.processStationText}>
                    <AppText style={styles.processStationIndex}>{index + 1}</AppText>
                    <AppText style={styles.processStationTitle}>{step.label}</AppText>
                  </View>
                  <View style={styles.processStationIndicator}>
                    <Ionicons
                      name={isActive ? 'chevron-down' : 'chevron-forward'}
                      size={16}
                      color={isActive ? colors.accent : colors.textSecondary}
                    />
                  </View>
                </Pressable>
                {isActive ? (
                  <View style={styles.processPanel}>
                    <AppText style={styles.processDescription}>{step.detail}</AppText>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      </Card>
      <PrimaryButton label={copy.buttons.next} onPress={onNext} />
    </View>
  );
}

function IntroVisualizationStep({ onNext, copy }) {
  const { styles } = useLessonStepStyles();
  const [cardHeight, setCardHeight] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const peek = spacing.lg;
  const steps = copy.introVisualization.steps;
  const handleLayout = (event) => {
    const layoutHeight = event.nativeEvent.layout.height;
    const nextHeight = Math.max(260, layoutHeight - peek - spacing.md);
    setCardHeight((prev) => (prev === nextHeight ? prev : nextHeight));
  };

  const toggleCard = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={[styles.stepBody, styles.journeyBody]}>
      <View style={styles.journeyContent}>
        <AppText style={styles.journeySubtitle}>
          {copy.introVisualization.subtitle}
        </AppText>
        <ScrollView
          style={styles.journeyPager}
          contentContainerStyle={styles.journeyPagerContent}
          onLayout={handleLayout}
          showsVerticalScrollIndicator={false}
        >
          {steps.map((step, index) => (
            <Pressable
              key={step.id}
              onPress={() => toggleCard(step.id)}
              style={[styles.journeyPage, cardHeight ? { height: cardHeight } : null]}
            >
              <View style={styles.journeyHeaderRow}>
                <View style={styles.journeyStepChip}>
                  <AppText style={styles.journeyStepText}>
                    {`${index + 1}`.padStart(2, '0')}
                  </AppText>
                </View>
                <View style={styles.journeyAccent} />
              </View>
              <AppText style={styles.journeyLabel}>{step.label}</AppText>
              {expandedCards[step.id] ? (
                <>
                  <AppText style={styles.journeyDetail}>{step.detail}</AppText>
                  <AppText style={styles.journeyTapHint}>{copy.labels.tapReturn}</AppText>
                </>
              ) : (
                <>
                  <AppText style={styles.journeyQuestion}>{step.question}</AppText>
                  <View style={styles.journeyVisual}>
                    <View style={styles.journeyPlaceholder}>
                      <AppText style={styles.journeyPlaceholderText}>
                        {copy.labels.animationPlaceholder}
                      </AppText>
                    </View>
                  </View>
                  <AppText style={styles.journeyWhy}>{step.why}</AppText>
                  <AppText style={styles.journeyTapHint}>{copy.labels.tapDetails}</AppText>
                </>
              )}
            </Pressable>
          ))}
          <View style={styles.journeyNextWrap}>
            <PrimaryButton label={copy.buttons.next} onPress={onNext} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

function IntroScenarioStep({ onNext, copy }) {
  const { styles, colors } = useLessonStepStyles();
  const steps = copy.introScenario.steps;
  const totalSteps = steps.length;
  const [progress, setProgress] = useState(0);
  const clampedProgress = Math.max(0, Math.min(progress, totalSteps));
  const progressRatio = totalSteps ? clampedProgress / totalSteps : 0;

  const structuredSteps = steps.map((step, index) => {
    const threshold = index + 1;
    const isActive = clampedProgress >= threshold;
    const isCurrent = clampedProgress > threshold - 1 && clampedProgress < threshold;
    return { ...step, isActive, isCurrent };
  });

  const missingIds = ['goal', 'risk', 'strategy'];
  const reactiveSteps = steps.map((step, index) => {
    const threshold = index + 1;
    const isMissing = missingIds.includes(step.id);
    const isActive = !isMissing && clampedProgress >= threshold;
    const isCurrent = !isMissing && clampedProgress > threshold - 1 && clampedProgress < threshold;
    return {
      ...step,
      isActive,
      isCurrent,
      isMissing,
    };
  });

  return (
    <View style={styles.stepBody}>
      <View style={styles.scenarioCompareGrid}>
        <Card style={styles.scenarioComparePanel}>
          <View style={styles.scenarioCompareHeader}>
            <AppText style={styles.scenarioCompareLabel}>
              {copy.introScenario.structuredLabel}
            </AppText>
            <AppText style={styles.scenarioCompareSubline}>
              {copy.introScenario.structuredSubline}
            </AppText>
          </View>
          <View style={styles.scenarioCompareSteps}>
            {structuredSteps.map((step, index) => {
              const isLast = index === structuredSteps.length - 1;
              return (
                <View key={step.id} style={styles.scenarioCompareRow}>
                  <View style={styles.scenarioCompareTrack}>
                    <View
                      style={[
                        styles.scenarioCompareNode,
                        step.isActive && styles.scenarioCompareNodeActive,
                        step.isCurrent && styles.scenarioCompareNodeCurrent,
                      ]}
                    />
                    {!isLast ? (
                      <View
                        style={[
                          styles.scenarioCompareLine,
                          step.isActive && styles.scenarioCompareLineActive,
                        ]}
                      />
                    ) : null}
                  </View>
                  <AppText
                    style={[
                      styles.scenarioCompareStepLabel,
                      step.isActive && styles.scenarioCompareStepLabelActive,
                      step.isCurrent && styles.scenarioCompareStepLabelCurrent,
                    ]}
                  >
                    {step.label}
                  </AppText>
                </View>
              );
            })}
          </View>
          <ScenarioCurve
            variant="stable"
            progress={progressRatio}
            label={copy.introScenario.stableLabel}
          />
        </Card>

        <Card style={[styles.scenarioComparePanel, styles.scenarioComparePanelReactive]}>
          <View style={styles.scenarioCompareHeader}>
            <AppText style={styles.scenarioCompareLabel}>
              {copy.introScenario.reactiveLabel}
            </AppText>
            <AppText style={styles.scenarioCompareSubline}>
              {copy.introScenario.reactiveSubline}
            </AppText>
          </View>
          <View style={styles.scenarioCompareSteps}>
            {reactiveSteps.map((step, index) => {
              const isLast = index === reactiveSteps.length - 1;
              return (
                <View key={step.id} style={styles.scenarioCompareRow}>
                  <View style={styles.scenarioCompareTrack}>
                    <View
                      style={[
                        styles.scenarioCompareNode,
                        step.isMissing && styles.scenarioCompareNodeMissing,
                        step.isActive && styles.scenarioCompareNodeActiveReactive,
                        step.isCurrent && styles.scenarioCompareNodeCurrent,
                      ]}
                    />
                    {!isLast ? (
                      <View
                        style={[
                          styles.scenarioCompareLine,
                          step.isMissing && styles.scenarioCompareLineMissing,
                          step.isActive && styles.scenarioCompareLineActiveReactive,
                        ]}
                      />
                    ) : null}
                  </View>
                  <AppText
                    style={[
                      styles.scenarioCompareStepLabel,
                      step.isMissing && styles.scenarioCompareStepLabelMissing,
                      step.isActive && styles.scenarioCompareStepLabelActive,
                      step.isCurrent && styles.scenarioCompareStepLabelCurrent,
                    ]}
                  >
                    {step.label}
                  </AppText>
                </View>
              );
            })}
          </View>
          <ScenarioCurve
            variant="volatile"
            progress={progressRatio}
            label={copy.introScenario.volatileLabel}
          />
        </Card>
      </View>

      <View style={styles.scenarioSliderWrap}>
        <AppText style={styles.scenarioSliderLabel}>
          {copy.introScenario.progressLabel}
        </AppText>
        <Slider
          value={progress}
          minimumValue={0}
          maximumValue={totalSteps}
          step={0.1}
          minimumTrackTintColor={colors.accent}
          maximumTrackTintColor={colors.surfaceActive}
          thumbTintColor={colors.accent}
          onValueChange={setProgress}
        />
      </View>

      <AppText style={styles.scenarioInsightLine}>{copy.introScenario.insightLine}</AppText>
      <PrimaryButton label={copy.buttons.next} onPress={onNext} />
    </View>
  );
}

function ScenarioCurve({ variant, progress, label }) {
  const { styles, colors } = useLessonStepStyles();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const points =
    variant === 'stable' ? STABLE_CURVE_POINTS : VOLATILE_CURVE_POINTS;
  const smoothPoints = useMemo(() => getSmoothPoints(points, 14), [points]);
  const lineColor =
    variant === 'stable' ? colors.accent : toRgba(colors.textSecondary, 0.9);

  const { segments, totalLength } = useMemo(() => {
    if (!size.width || !size.height) return { segments: [], totalLength: 0 };
    let running = 0;
    const nextSegments = smoothPoints.slice(0, -1).map((point, index) => {
      const next = smoothPoints[index + 1];
      const x1 = (point.x / 100) * size.width;
      const y1 = (point.y / 100) * size.height;
      const x2 = (next.x / 100) * size.width;
      const y2 = (next.y / 100) * size.height;
      const length = Math.hypot(x2 - x1, y2 - y1);
      const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
      const start = running;
      running += length;
      return { x: x1, y: y1, length, angle, start, key: `seg-${index}` };
    });
    return { segments: nextSegments, totalLength: running };
  }, [smoothPoints, size]);

  return (
    <View style={styles.scenarioCurveWrap}>
      <View
        style={styles.scenarioCurveChart}
        onLayout={(event) =>
          setSize({
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height,
          })
        }
      >
        <View
          style={[
            styles.scenarioCurveLine,
            {
              opacity: 0.2 + 0.8 * clampedProgress,
            },
          ]}
        >
          {segments.map((segment) => {
            if (!totalLength) return null;
            const visibleLength = Math.max(
              0,
              Math.min(segment.length, clampedProgress * totalLength - segment.start)
            );
            if (visibleLength <= 0) return null;
            return (
              <View
                key={segment.key}
                style={[
                  styles.scenarioCurveSegment,
                  {
                    width: visibleLength,
                    left: segment.x,
                    top: segment.y,
                    backgroundColor: lineColor,
                    transform: [{ rotate: `${segment.angle}deg` }],
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
      <AppText style={styles.scenarioCurveLabel}>{label}</AppText>
    </View>
  );
}

function VisualizationStep({ content, lessonId, onNext, onPressTerm, copy }) {
  const { styles } = useLessonStepStyles();
  const [selected, setSelected] = useState(null);

  if (lessonId === 'lesson_0') {
    return <IntroVisualizationStep onNext={onNext} copy={copy} />;
  }

  return (
    <View style={styles.stepBody}>
      <Card style={styles.visualCard}>
        <GlossaryText
          text={content?.steps?.visualization?.title}
          style={styles.bodyText}
          onPressTerm={onPressTerm}
        />
        <AppText style={styles.caption}>{copy.labels.tapElements}</AppText>
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
      <PrimaryButton label={copy.buttons.next} onPress={onNext} />

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

function ScenarioStep({ content, userContext, onNext, onPressTerm, copy }) {
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
          <AppText style={styles.insightTitle}>{copy.labels.insight}</AppText>
          <GlossaryText
            text={variant?.insight}
            style={styles.caption}
            onPressTerm={onPressTerm}
          />
        </Card>
      ) : null}
      <PrimaryButton label={copy.buttons.continue} onPress={onNext} disabled={!selected} />
    </View>
  );
}

function ExerciseStep({ content, lessonId, onNext, onPressTerm, copy }) {
  const { styles } = useLessonStepStyles();
  const exercise = content?.steps?.exercise;

  if (!exercise) {
    return (
      <View style={styles.stepBody}>
        <Card style={styles.exerciseCard}>
          <AppText style={styles.bodyText}>{copy.messages.noExercise}</AppText>
        </Card>
        <PrimaryButton label={copy.buttons.continue} onPress={onNext} />
      </View>
    );
  }

  if (lessonId === 'lesson_0') {
    return <IntroExerciseStep exercise={exercise} onNext={onNext} copy={copy} />;
  }

  switch (exercise.type) {
    case 'sequence':
      return (
        <SequenceExercise
          exercise={exercise}
          onNext={onNext}
          onPressTerm={onPressTerm}
          copy={copy}
        />
      );
    case 'choice':
      return (
        <ChoiceExercise
          exercise={exercise}
          onNext={onNext}
          onPressTerm={onPressTerm}
          copy={copy}
        />
      );
    case 'multi':
      return (
        <MultiExercise
          exercise={exercise}
          onNext={onNext}
          onPressTerm={onPressTerm}
          copy={copy}
        />
      );
    case 'tradeoff':
    default:
      return (
        <TradeoffExercise
          exercise={exercise}
          onNext={onNext}
          onPressTerm={onPressTerm}
          copy={copy}
        />
      );
  }
}

function SequenceExercise({ exercise, onNext, onPressTerm, copy }) {
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
        <AppText style={styles.exerciseLabel}>{copy.labels.yourOrder}</AppText>
        <View style={styles.sequenceList}>
          {order.length === 0 ? (
            <AppText style={styles.caption}>{copy.messages.tapActions}</AppText>
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
        <AppText style={styles.exerciseLabel}>{copy.labels.actions}</AppText>
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
          <AppText style={styles.insightTitle}>
            {isCorrect ? copy.labels.aligned : copy.labels.recheckFlow}
          </AppText>
          <GlossaryText text={message} style={styles.caption} onPressTerm={onPressTerm} />
        </Card>
      ) : null}

      <View style={styles.exerciseActions}>
        <SecondaryButton label={copy.buttons.reset} onPress={reset} />
        <PrimaryButton
          label={copy.buttons.completeExercise}
          onPress={onNext}
          disabled={!isComplete}
        />
      </View>
    </View>
  );
}

function IntroExerciseStep({ exercise, onNext, copy }) {
  const { styles } = useLessonStepStyles();
  const { items = [], correctOrder = [] } = exercise;
  const [placements, setPlacements] = useState(
    () => items.reduce((acc, item) => ({ ...acc, [item.id]: null }), {})
  );
  const [hintActive, setHintActive] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const slots = useMemo(() => {
    const next = Array(items.length).fill(null);
    items.forEach((item) => {
      const slotIndex = placements[item.id];
      if (slotIndex !== null && slotIndex !== undefined) {
        next[slotIndex] = item;
      }
    });
    return next;
  }, [items, placements]);

  const available = items.filter((item) => placements[item.id] === null);
  const isComplete = slots.every(Boolean);
  const isCorrect =
    isComplete && correctOrder.every((stepId, index) => slots[index]?.id === stepId);
  const showError = isComplete && !isCorrect;
  const wrongSlots = showError
    ? slots.map((item, index) => item?.id !== correctOrder[index])
    : [];

  const handlePlace = (id) => {
    if (placements[id] !== null && placements[id] !== undefined) return;
    const nextIndex = slots.findIndex((item) => !item);
    if (nextIndex === -1) return;
    setPlacements((prev) => ({ ...prev, [id]: nextIndex }));
  };

  const handleRemove = (id) => {
    setPlacements((prev) => ({ ...prev, [id]: null }));
  };

  const handleHint = () => {
    setHintActive(true);
    setShowHint(true);
    setTimeout(() => {
      setHintActive(false);
    }, 1500);
  };

  return (
    <View style={[styles.stepBody, styles.exerciseBody]}>
      <View style={styles.exerciseContent}>
        <AppText style={styles.exerciseInstruction}>{copy.introExercise.instruction}</AppText>
        {isComplete ? (
          <AppText
            style={[
              styles.exerciseStatusText,
              isCorrect ? styles.exerciseStatusCorrect : styles.exerciseStatusWrong,
            ]}
          >
            {isCorrect ? copy.messages.correctOrder : copy.messages.incorrectOrder}
          </AppText>
        ) : null}

        <View style={styles.exerciseSection}>
          <AppText style={styles.exerciseSectionLabel}>{copy.labels.yourProcess}</AppText>
          <View style={styles.exerciseSlots}>
            {slots.map((item, index) => {
              const isExecutionSlot = index === slots.length - 1;
              return (
                <View
                  key={`slot-${index}`}
                  style={[
                    styles.exerciseSlot,
                    isExecutionSlot && styles.exerciseSlotExecution,
                    wrongSlots[index] && styles.exerciseSlotWrong,
                    hintActive && index === 0 && styles.exerciseSlotHint,
                  ]}
                >
                  <View style={styles.exerciseSlotIndex}>
                    <AppText style={styles.exerciseSlotIndexText}>{index + 1}</AppText>
                  </View>
                  {item ? (
                    <Pressable onPress={() => handleRemove(item.id)}>
                      <View style={styles.exerciseChip}>
                        <AppText style={styles.exerciseChipText}>{item.label}</AppText>
                      </View>
                    </Pressable>
                  ) : (
                    <AppText style={styles.exerciseSlotTextMuted}>
                      {isExecutionSlot ? copy.labels.executionLast : copy.labels.emptySlot}
                    </AppText>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.exerciseSection}>
          <AppText style={styles.exerciseSectionLabel}>{copy.labels.availableSteps}</AppText>
          <View style={styles.exerciseChipList}>
            {available.map((item) => {
              return (
                <Pressable key={item.id} onPress={() => handlePlace(item.id)}>
                  <View style={styles.exerciseChip}>
                    <AppText style={styles.exerciseChipText}>{item.label}</AppText>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.exerciseFooter}>
        <View style={styles.exerciseActionRow}>
          <SecondaryButton
            label={copy.labels.needHint}
            onPress={handleHint}
            style={styles.exerciseHintButton}
          />
          <PrimaryButton
            label={copy.buttons.next}
            onPress={onNext}
            disabled={!isCorrect}
            style={styles.exerciseNextButton}
          />
        </View>
      </View>

      <BottomSheet
        visible={showHint}
        onClose={() => setShowHint(false)}
        title={copy.labels.hint}
      >
        <AppText style={styles.exerciseHintBody}>
          {copy.messages.hintBody}
        </AppText>
      </BottomSheet>
    </View>
  );
}

function ExerciseOutcomeLine({ mode }) {
  const { styles } = useLessonStepStyles();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const points =
    mode === 'stable'
      ? [
          { x: 0, y: 70 },
          { x: 20, y: 62 },
          { x: 40, y: 56 },
          { x: 60, y: 48 },
          { x: 80, y: 40 },
          { x: 100, y: 34 },
        ]
      : [
          { x: 0, y: 62 },
          { x: 18, y: 42 },
          { x: 36, y: 82 },
          { x: 54, y: 36 },
          { x: 72, y: 86 },
          { x: 90, y: 46 },
          { x: 100, y: 58 },
        ];
  const segments = useMemo(() => {
    if (!size.width || !size.height) return [];
    return points.slice(0, -1).map((point, index) => {
      const next = points[index + 1];
      const x1 = (point.x / 100) * size.width;
      const y1 = (point.y / 100) * size.height;
      const x2 = (next.x / 100) * size.width;
      const y2 = (next.y / 100) * size.height;
      const length = Math.hypot(x2 - x1, y2 - y1);
      const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
      return { x: x1, y: y1, length, angle, key: `ex-seg-${index}` };
    });
  }, [points, size]);

  return (
    <View
      style={styles.exerciseOutcomeLine}
      onLayout={(event) =>
        setSize({
          width: event.nativeEvent.layout.width,
          height: event.nativeEvent.layout.height,
        })
      }
    >
      {segments.map((segment) => (
        <View
          key={segment.key}
          style={[
            styles.exerciseOutcomeLineSegment,
            {
              width: segment.length,
              left: segment.x,
              top: segment.y,
              transform: [{ rotate: `${segment.angle}deg` }],
              backgroundColor:
                mode === 'stable'
                  ? styles.exerciseLineStable.backgroundColor
                  : styles.exerciseLineReactive.backgroundColor,
            },
          ]}
        />
      ))}
    </View>
  );
}

function ChoiceExercise({ exercise, onNext, onPressTerm, copy }) {
  const { styles } = useLessonStepStyles();
  const { description, options = [], revealTitle = copy.labels.outcome } = exercise;
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
        <SecondaryButton label={copy.buttons.reset} onPress={reset} />
        <PrimaryButton
          label={copy.buttons.completeExercise}
          onPress={onNext}
          disabled={!selected}
        />
      </View>
    </View>
  );
}

function TradeoffExercise({ exercise, onNext, onPressTerm, copy }) {
  const { colors, styles } = useLessonStepStyles();
  const {
    description,
    sliders = [],
    requiresRun = false,
    ctaLabel = copy.labels.revealImpact,
    scoreLabel = copy.labels.signal,
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
        <SecondaryButton label={copy.buttons.reset} onPress={reset} />
        <PrimaryButton
          label={copy.buttons.completeExercise}
          onPress={onNext}
          disabled={!hasRun}
        />
      </View>
    </View>
  );
}

function MultiExercise({ exercise, onNext, onPressTerm, copy }) {
  const { colors, styles } = useLessonStepStyles();
  const {
    description,
    options = [],
    baseScore = 100,
    scoreLabel = copy.labels.coverage,
    unit = '%',
    insight = {},
    emptyMessage = copy.messages.selectItems,
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
        <SecondaryButton label={copy.buttons.reset} onPress={reset} />
        <PrimaryButton
          label={copy.buttons.completeExercise}
          onPress={onNext}
          disabled={!hasSelection}
        />
      </View>
    </View>
  );
}

function ReflectionStep({ content, onSubmit, onPressTerm, copy }) {
  const { colors, styles } = useLessonStepStyles();
  const [text, setText] = useState('');
  const [submittedText, setSubmittedText] = useState('');
  const [response, setResponse] = useState(null);
  const intro = content?.steps?.reflection?.intro;
  const question =
    copy.messages.reflectionQuestion || content?.steps?.reflection?.question;
  const placeholder =
    copy.messages.reflectionPlaceholder || content?.steps?.reflection?.placeholder;
  const canSend = text.trim().length > 0;
  const canContinue = !!response;

  const buildResponse = (input) => {
    const normalized = (input || '').toLowerCase().trim();
    if (!normalized || normalized.length < 6) {
      return copy.messages.reflectionShort;
    }
    const structureWords = [
      'order',
      'sequence',
      'step',
      'process',
      'structure',
      'framework',
      'flow',
      'plan',
      'planning',
      'prior',
      'before',
      'clarity',
    ];
    const emotionWords = [
      'fear',
      'anxiety',
      'panic',
      'stress',
      'nervous',
      'worry',
      'emotional',
      'impulse',
      'impulsive',
      'reactive',
      'react',
      'fomo',
    ];
    const hasStructure = structureWords.some((word) => normalized.includes(word));
    const hasEmotion = emotionWords.some((word) => normalized.includes(word));
    if (hasStructure) {
      return copy.messages.reflectionStructure;
    }
    if (hasEmotion) {
      return copy.messages.reflectionEmotion;
    }
    return copy.messages.reflectionDefault;
  };

  const handleSend = () => {
    if (!canSend) return;
    const trimmed = text.trim();
    setSubmittedText(trimmed);
    setResponse(buildResponse(trimmed));
    setText('');
  };

  const handleContinue = () => {
    if (!response) {
      handleSend();
      return;
    }
    onSubmit(submittedText || text, response);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 72 : 0}
      style={[styles.stepBody, styles.reflectionBody]}
    >
      {intro ? <AppText style={styles.stepIntro}>{intro}</AppText> : null}
      <ScrollView
        style={styles.reflectionScroll}
        contentContainerStyle={styles.reflectionScrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.reflectionThread}>
          <View style={[styles.chatBubble, styles.chatBubbleSystem]}>
            <AppText style={styles.chatLabel}>EQTY</AppText>
            <GlossaryText text={question} style={styles.chatText} onPressTerm={onPressTerm} />
          </View>
          {submittedText ? (
            <View style={[styles.chatBubble, styles.chatBubbleUser]}>
              <AppText style={styles.chatText}>{submittedText}</AppText>
            </View>
          ) : null}
          {response ? (
            <View style={[styles.chatBubble, styles.chatBubbleSystem]}>
              <AppText style={styles.chatLabel}>{copy.labels.eqtyInsight}</AppText>
              <AppText style={styles.chatText}>{response}</AppText>
            </View>
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.reflectionFooter}>
        {response ? (
          <View style={styles.reflectionSavedPill}>
            <Ionicons name="sparkles-outline" size={14} color={colors.textSecondary} />
            <AppText style={styles.reflectionSavedText}>
              {copy.messages.reflectionSaved}
            </AppText>
          </View>
        ) : null}
        <PrimaryButton
          label={copy.buttons.continue}
          onPress={handleContinue}
          disabled={!canContinue}
        />
        <View style={styles.reflectionComposer}>
          <TextInput
            style={styles.reflectionInput}
            value={text}
            onChangeText={(value) => {
              setText(value);
              setResponse(null);
            }}
            placeholder={placeholder}
            placeholderTextColor={toRgba(colors.textSecondary, 0.7)}
            multiline
          />
          <Pressable
            onPress={handleSend}
            disabled={!canSend}
            style={({ pressed }) => [
              styles.reflectionSendButton,
              !canSend && styles.reflectionSendButtonDisabled,
              pressed && canSend && styles.reflectionSendButtonPressed,
            ]}
          >
            <Ionicons
              name="arrow-up"
              size={16}
              color={canSend ? colors.textPrimary : colors.textSecondary}
            />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function SummaryStep({ content, onComplete, onPressTerm, copy }) {
  const { colors, styles } = useLessonStepStyles();
  return (
    <View style={styles.stepBody}>
      <Card style={styles.summaryCard}>
        <AppText style={styles.bodyText}>{copy.labels.keyTakeaways}</AppText>
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

      <PrimaryButton label={copy.buttons.completeLesson} onPress={onComplete} />
    </View>
  );
}

function IntroSummaryStep({ content, onComplete, copy }) {
  const { colors, styles } = useLessonStepStyles();
  const map = content?.steps?.summary?.processMap || [];
  const stations = map.length
    ? map
    : [
        {
          id: 'target',
          title: 'Target',
          description: 'Define the objective and boundaries.',
          substeps: ['Purpose', 'Time horizon', 'Goal type'],
        },
        {
          id: 'drivers',
          title: 'Drivers',
          description: 'Clarify the risk profile and constraints.',
          substeps: ['Risk capacity', 'Risk tolerance', 'Financial resources'],
        },
        {
          id: 'strategy',
          title: 'Financial investment strategy',
          description: 'Set the rules for how you will invest.',
          substeps: ['Liquidity', 'Costs', 'Ethics/ESG', 'Dividend preference'],
        },
        {
          id: 'allocation',
          title: 'Capital allocation',
          description: 'Distribute capital across the plan.',
          substeps: ['Asset categories', 'Diversification', 'Example allocations'],
        },
        {
          id: 'vehicles',
          title: 'Investment vehicles',
          description: 'Select the tools that express the plan.',
          substeps: ['Equities', 'Bonds', 'ETFs', 'Alternatives'],
        },
        {
          id: 'execution',
          title: 'Execution',
          description: 'Execute only after every step is clear.',
          substeps: ['Order types', 'Transaction costs', 'Execution comes last'],
        },
      ];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={[styles.stepBody, styles.summaryBody]}>
      <View style={styles.summaryHeaderBlock}>
        <AppText style={styles.processTitle}>{copy.labels.investingProcess}</AppText>
        <AppText style={styles.summarySubtitle}>
          {content?.steps?.summary?.subtitle ||
            'Execution is the final step - not the starting point.'}
        </AppText>
        <AppText style={styles.processHint}>{copy.labels.tapStation}</AppText>
      </View>

      <View style={styles.summaryContent}>
        <ScrollView
          style={styles.summaryScroll}
          contentContainerStyle={styles.summaryScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.processMap}>
            <View style={styles.processLine} />
            {stations.map((station, index) => {
              const isActive = index === activeIndex;
              return (
                <View key={station.id} style={styles.processStationBlock}>
                  <Pressable
                    onPress={() =>
                      setActiveIndex((prev) => (prev === index ? null : index))
                    }
                    style={[
                      styles.processStationRow,
                      isActive && styles.processStationRowActive,
                    ]}
                  >
                    <View
                      style={[
                        styles.processNode,
                        isActive && styles.processNodeActive,
                      ]}
                    />
                    <View style={styles.processStationText}>
                      <AppText style={styles.processStationIndex}>
                        {index + 1}
                      </AppText>
                      <AppText style={styles.processStationTitle}>
                        {station.title}
                      </AppText>
                    </View>
                    <View style={styles.processStationIndicator}>
                      <Ionicons
                        name={isActive ? 'chevron-down' : 'chevron-forward'}
                        size={16}
                        color={isActive ? colors.accent : colors.textSecondary}
                      />
                    </View>
                  </Pressable>
                  {isActive ? (
                    <View style={styles.processPanel}>
                      <AppText style={styles.processDescription}>
                        {station.description}
                      </AppText>
                      <View style={styles.processSubsteps}>
                        {station.substeps?.map((item) => (
                          <View key={`${station.id}-${item}`} style={styles.processChip}>
                            <AppText style={styles.processChipText}>{item}</AppText>
                          </View>
                        ))}
                      </View>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <View style={styles.summaryFooter}>
        <PrimaryButton label={copy.buttons.continue} onPress={onComplete} />
      </View>
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
  stepIntro: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 24,
  },
  introText: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    fontSize: typography.body,
    lineHeight: 24,
  },
  bodyText: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    fontSize: typography.body,
    lineHeight: 24,
  },
  caption: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small,
    lineHeight: 20,
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
  journeyTitle: {
    fontFamily: typography.fontFamilyDemi,
    color: colors.textPrimary,
    fontSize: typography.h1,
  },
  journeySubtitle: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 24,
  },
  journeyPager: {
    flex: 1,
    marginTop: spacing.sm,
  },
  journeyPagerContent: {
    paddingBottom: 0,
  },
  journeyBody: {
    flex: 1,
  },
  journeyContent: {
    flex: 1,
    gap: spacing.sm,
  },
  journeyNextWrap: {
    marginTop: spacing.md,
  },
  journeyPage: {
    borderRadius: 22,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    gap: spacing.md,
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  journeyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  journeyStepChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceActive,
  },
  journeyStepText: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  journeyAccent: {
    width: 24,
    height: 2,
    borderRadius: 999,
    backgroundColor: toRgba(colors.accent, 0.4),
  },
  journeyLabel: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
  },
  journeyQuestion: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    fontSize: typography.body,
    lineHeight: 24,
  },
  journeyWhy: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 24,
  },
  journeyDetail: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 24,
  },
  journeyTapHint: {
    fontFamily: typography.fontFamilyMedium,
    color: toRgba(colors.textSecondary, 0.7),
    fontSize: typography.body,
    lineHeight: 20,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  journeyVisual: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceActive,
    padding: spacing.md,
    height: 190,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  journeyPlaceholder: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: toRgba(colors.textSecondary, 0.3),
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  journeyPlaceholderText: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textSecondary,
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
    fontSize: typography.body,
    lineHeight: 20,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
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
    lineHeight: 24,
  },
  scenarioCard: {
    gap: spacing.md,
  },
  scenarioMeaning: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 24,
  },
  scenarioCompareGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'stretch',
    marginTop: spacing.sm,
  },
  scenarioComparePanel: {
    flex: 1,
    minWidth: 0,
    padding: spacing.md,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    gap: spacing.lg,
  },
  scenarioComparePanelReactive: {
    borderColor: toRgba(colors.textSecondary, 0.3),
    backgroundColor: colors.surfaceActive,
  },
  scenarioCompareHeader: {
    gap: spacing.xs,
  },
  scenarioCompareLabel: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  scenarioCompareSubline: {
    fontFamily: typography.fontFamilyDemi,
    color: colors.textPrimary,
    fontSize: typography.body,
  },
  scenarioCompareSteps: {
    flexGrow: 1,
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  scenarioCompareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  scenarioCompareTrack: {
    alignItems: 'center',
    width: 18,
  },
  scenarioCompareNode: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: toRgba(colors.textSecondary, 0.5),
    backgroundColor: colors.surface,
  },
  scenarioCompareNodeActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  scenarioCompareNodeActiveReactive: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  scenarioCompareNodeCurrent: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  scenarioCompareNodeMissing: {
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
    borderColor: toRgba(colors.textSecondary, 0.45),
  },
  scenarioCompareLine: {
    width: 2,
    height: 18,
    marginTop: 4,
    backgroundColor: toRgba(colors.textSecondary, 0.35),
  },
  scenarioCompareLineActive: {
    backgroundColor: toRgba(colors.accent, 0.65),
  },
  scenarioCompareLineActiveReactive: {
    backgroundColor: toRgba(colors.textPrimary, 0.75),
  },
  scenarioCompareLineMissing: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: toRgba(colors.textSecondary, 0.35),
  },
  scenarioCompareStepLabel: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
  },
  scenarioCompareStepLabelActive: {
    color: colors.textPrimary,
  },
  scenarioCompareStepLabelCurrent: {
    color: colors.accent,
  },
  scenarioCompareStepLabelMissing: {
    color: toRgba(colors.textSecondary, 0.55),
  },
  scenarioSliderWrap: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  scenarioSliderLabel: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 20,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  scenarioCurveWrap: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  scenarioCurveChart: {
    height: 96,
    borderRadius: 14,
    backgroundColor: colors.surfaceActive,
    overflow: 'hidden',
  },
  scenarioCurveLine: {
    flex: 1,
  },
  scenarioCurveSegment: {
    position: 'absolute',
    height: 2,
    borderRadius: 999,
  },
  scenarioCurveLabel: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  scenarioOutcomeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  outcomePressable: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 0,
    borderRadius: 16,
  },
  outcomePressablePressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  scenarioPanel: {
    padding: spacing.md,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceActive,
    gap: spacing.md,
  },
  scenarioPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scenarioPanelTitle: {
    fontFamily: typography.fontFamilyDemi,
    color: colors.textPrimary,
    fontSize: typography.body,
  },
  scenarioBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: toRgba(colors.accent, 0.6),
    backgroundColor: toRgba(colors.accent, 0.12),
  },
  scenarioBadgeMuted: {
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  scenarioBadgeText: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small - 1,
    letterSpacing: 0.6,
  },
  scenarioRail: {
    gap: spacing.sm,
  },
  scenarioRailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  scenarioRailTrack: {
    alignItems: 'center',
    width: 18,
  },
  scenarioNode: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.textSecondary,
  },
  scenarioNodeActive: {
    backgroundColor: colors.accent,
  },
  scenarioNodeDegraded: {
    opacity: 0.4,
  },
  scenarioNodeMissing: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: toRgba(colors.textSecondary, 0.6),
  },
  scenarioRailLine: {
    width: 2,
    height: 18,
    marginTop: 4,
    backgroundColor: toRgba(colors.textSecondary, 0.5),
  },
  scenarioRailLineBroken: {
    backgroundColor: 'transparent',
    borderRadius: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: toRgba(colors.textSecondary, 0.5),
  },
  scenarioRailLineDegraded: {
    opacity: 0.4,
  },
  scenarioRailLabel: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    fontSize: typography.body,
  },
  scenarioRailLabelMuted: {
    color: colors.textSecondary,
  },
  scenarioRailLabelStrong: {
    color: colors.accent,
  },
  scenarioRailLabelDegraded: {
    color: toRgba(colors.textSecondary, 0.6),
  },
  scenarioRailLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  scenarioRailLabelColumn: {
    flex: 1,
    gap: spacing.xs,
  },
  scenarioConsequence: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small,
    lineHeight: 20,
  },
  scenarioPrematureBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: toRgba(colors.accent, 0.6),
  },
  scenarioPrematureText: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.accent,
    fontSize: typography.small - 1,
    letterSpacing: 0.4,
  },
  outcomePanel: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  outcomePanelActive: {
    borderColor: toRgba(colors.accent, 0.7),
    backgroundColor: toRgba(colors.accent, 0.08),
  },
  outcomeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  outcomeTitleStack: {
    flex: 1,
    gap: 4,
  },
  outcomeScenarioLabel: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  outcomeLabel: {
    fontFamily: typography.fontFamilyDemi,
    color: colors.textPrimary,
    fontSize: typography.body,
  },
  outcomeFocusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: toRgba(colors.textSecondary, 0.4),
    backgroundColor: toRgba(colors.textSecondary, 0.12),
  },
  outcomeFocusPillActive: {
    borderColor: toRgba(colors.accent, 0.8),
    backgroundColor: toRgba(colors.accent, 0.18),
  },
  outcomeFocusText: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small - 1,
    letterSpacing: 0.4,
  },
  outcomeFocusTextActive: {
    color: colors.textPrimary,
  },
  outcomeChart: {
    height: 120,
    borderRadius: 14,
    backgroundColor: colors.surfaceActive,
    overflow: 'hidden',
  },
  outcomeLine: {
    flex: 1,
  },
  outcomeLineSegment: {
    position: 'absolute',
    height: 2,
    borderRadius: 999,
    backgroundColor: colors.textSecondary,
  },
  outcomeCaption: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small,
    lineHeight: 20,
  },
  scenarioFocusLine: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 24,
  },
  scenarioInsightLine: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 24,
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
  exerciseBody: {
    flex: 1,
  },
  exerciseContent: {
    gap: spacing.lg,
  },
  exerciseSection: {
    gap: spacing.md,
  },
  exerciseInstruction: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 24,
  },
  exerciseStatusText: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    lineHeight: 20,
  },
  exerciseStatusCorrect: {
    color: colors.textPrimary,
  },
  exerciseStatusWrong: {
    color: colors.textSecondary,
  },
  exerciseSectionLabel: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  exerciseSlots: {
    gap: spacing.sm,
  },
  exerciseSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceActive,
    minHeight: 56,
  },
  exerciseSlotExecution: {
    borderColor: toRgba(colors.accent, 0.6),
  },
  exerciseSlotWrong: {
    borderColor: toRgba(colors.accent, 0.8),
    backgroundColor: toRgba(colors.accent, 0.08),
  },
  exerciseSlotHint: {
    borderColor: toRgba(colors.accent, 0.6),
  },
  exerciseSlotIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  exerciseSlotIndexText: {
    fontFamily: typography.fontFamilyDemi,
    fontSize: typography.small,
    color: colors.textPrimary,
  },
  exerciseSlotText: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  exerciseSlotEmptyText: {
    color: colors.textSecondary,
  },
  exerciseSlotTextMuted: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
  exerciseChipList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  exerciseChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceActive,
  },
  exerciseChipText: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textPrimary,
  },
  exerciseActionRow: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: spacing.sm,
  },
  exerciseHintButton: {
    width: '100%',
  },
  exerciseNextButton: {
    width: '100%',
  },
  exerciseFooter: {
    marginTop: 'auto',
    gap: spacing.sm,
  },
  exerciseHintBody: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 24,
  },
  exerciseOutcome: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceActive,
  },
  exerciseOutcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseOutcomeLabel: {
    fontFamily: typography.fontFamilyDemi,
    fontSize: typography.body,
    color: colors.textPrimary,
  },
  exerciseOutcomeChart: {
    height: 90,
    borderRadius: 12,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  exerciseOutcomeLineWrap: {
    flex: 1,
  },
  exerciseOutcomeLine: {
    flex: 1,
  },
  exerciseOutcomeLineSegment: {
    position: 'absolute',
    height: 2,
    borderRadius: 999,
    backgroundColor: colors.textSecondary,
  },
  exerciseLineStable: {
    backgroundColor: colors.textSecondary,
  },
  exerciseLineReactive: {
    backgroundColor: toRgba(colors.textSecondary, 0.7),
  },
  exerciseOutcomeText: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small,
    lineHeight: 20,
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
  reflectionThread: {
    gap: spacing.md,
  },
  reflectionBody: {
    flex: 1,
    gap: 0,
  },
  reflectionScroll: {
    flex: 1,
  },
  reflectionScrollContent: {
    paddingBottom: spacing.lg,
  },
  reflectionFooter: {
    gap: spacing.sm,
    marginTop: 'auto',
  },
  chatBubble: {
    maxWidth: '92%',
    borderRadius: 18,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceActive,
  },
  chatBubbleSystem: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
  },
  chatBubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.surfaceActive,
  },
  chatLabel: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.tiny,
    color: colors.textSecondary,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  chatText: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    fontSize: typography.body,
    lineHeight: 24,
  },
  reflectionComposer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  reflectionInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.body,
    textAlignVertical: 'top',
  },
  reflectionSendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: toRgba(colors.textSecondary, 0.5),
    backgroundColor: colors.surfaceActive,
  },
  reflectionSendButtonPressed: {
    transform: [{ scale: 0.96 }],
  },
  reflectionSendButtonDisabled: {
    opacity: 0.5,
  },
  reflectionSavedPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  reflectionSavedText: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textSecondary,
  },
  summaryCard: {
    gap: spacing.md,
  },
  summaryHeaderBlock: {
    gap: spacing.xs,
  },
  summaryTitle: {
    fontFamily: typography.fontFamilyDemi,
    color: colors.textPrimary,
    fontSize: typography.h1,
  },
  summarySubtitle: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 24,
  },
  processHint: {
    fontFamily: typography.fontFamilyMedium,
    color: toRgba(colors.textSecondary, 0.75),
    fontSize: typography.body,
    lineHeight: 24,
  },
  summaryBody: {
    flex: 1,
  },
  summaryContent: {
    gap: spacing.lg,
    flex: 1,
  },
  summaryScroll: {
    flex: 1,
  },
  summaryScrollContent: {
    paddingBottom: spacing.md,
  },
  systemInsight: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
    textAlign: 'center',
  },
  summaryFooter: {
    marginTop: 'auto',
  },
  processMap: {
    position: 'relative',
    gap: spacing.md,
    paddingLeft: spacing.lg,
  },
  processLine: {
    position: 'absolute',
    left: spacing.sm + 1,
    top: 4,
    bottom: 4,
    width: 2,
    borderRadius: 999,
    backgroundColor: toRgba(colors.textSecondary, 0.25),
  },
  processStationBlock: {
    gap: spacing.xs,
  },
  processStationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  processStationRowActive: {
    backgroundColor: toRgba(colors.surfaceActive, 0.6),
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  processNode: {
    width: 14,
    height: 14,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  processNodeActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  processStationText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  processStationIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceActive,
  },
  processStationIndex: {
    fontFamily: typography.fontFamilyDemi,
    fontSize: typography.small,
    color: colors.textSecondary,
  },
  processStationTitle: {
    fontFamily: typography.fontFamilyDemi,
    fontSize: typography.body,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  processPanel: {
    marginLeft: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  processDescription: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 24,
  },
  processSubsteps: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  processChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surfaceActive,
  },
  processChipText: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textPrimary,
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

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
