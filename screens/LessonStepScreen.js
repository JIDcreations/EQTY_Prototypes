import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import BottomSheet from '../components/BottomSheet';
import Card from '../components/Card';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { useGlossary } from '../components/GlossaryProvider';
import GlossaryText from '../components/GlossaryText';
import LessonStepContainer from '../components/LessonStepContainer';
import StepHeader from '../components/StepHeader';
import { typography, useTheme } from '../theme';
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
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  return { colors, components, styles };
}

export default function LessonStepScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { lessonId, step = 1, entrySource } = route.params || {};
  const { userContext, onboardingContext, addReflection, completeLesson, preferences } = useApp();
  const { components } = useTheme();
  const keyboardOffset =
    components.layout.spacing.xxl +
    components.layout.spacing.xl +
    components.layout.spacing.md;
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
        return lessonId === 'lesson_0'
          ? 'Het volledige investeringsproces'
          : introTitle || 'The full investing process';
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
    disableOuterScroll && (step === 2 || step === 5) ? { paddingBottom: components.layout.spacing.none } : null;
  let flowPhaseLabel = copy.labels.lessonFlowPhases?.[step] || copy.labels.part;
  if (lessonId === 'lesson_0' && step === 6) {
    flowPhaseLabel = 'Samenvatting';
  }
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
          <View style={[styles.hintBar, styles.hintBarXs]} />
          <View style={[styles.hintBar, styles.hintBarSm]} />
          <View style={[styles.hintBar, styles.hintBarMd]} />
          <View style={[styles.hintBar, styles.hintBarLg]} />
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
  const { colors, components, styles } = useLessonStepStyles();
  const intro = content?.steps?.concept?.intro;
  const introSubtitleNl =
    'Investeren werkt wanneer elke beslissing voortbouwt op de vorige.';
  const isLessonSubtitle = intro === introSubtitleNl;
  const steps = copy.introConcept.steps;
  const [activeIndex, setActiveIndex] = useState(null);
  const paragraph = copy.introConcept.paragraph;

  return (
    <View style={styles.stepBody}>
      {intro ? (
        <AppText style={[styles.stepIntro, isLessonSubtitle && styles.stepIntroSecondary]}>
          {intro}
        </AppText>
      ) : null}
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
          <AppText style={styles.processSubline}>{copy.labels.processContext}</AppText>
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
                      size={components.sizes.icon.sm}
                      color={isActive ? colors.accent.primary : colors.text.secondary}
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
  const { styles, components } = useLessonStepStyles();
  const [cardHeight, setCardHeight] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const peek = components.layout.spacing.lg;
  const steps = copy.introVisualization.steps;
  const handleLayout = (event) => {
    const layoutHeight = event.nativeEvent.layout.height;
    const nextHeight = Math.max(260, layoutHeight - peek - components.layout.spacing.md);
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
  const structuredEmphasis = 0.8 + 0.2 * progressRatio;
  const reactiveEmphasis = 0.7 - 0.2 * progressRatio;

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
      <View style={styles.scenarioSliderWrap}>
        <AppText style={styles.scenarioSliderLabel}>
          {copy.introScenario.progressLabel}
        </AppText>
        <Slider
          value={progress}
          minimumValue={0}
          maximumValue={totalSteps}
          step={0.1}
          minimumTrackTintColor={colors.accent.primary}
          maximumTrackTintColor={colors.background.surfaceActive}
          thumbTintColor={colors.accent.primary}
          onValueChange={setProgress}
        />
        <AppText style={styles.scenarioSliderHelper}>
          {copy.introScenario.sliderHelper}
        </AppText>
      </View>

      <View style={styles.scenarioCompareGrid}>
        <Card style={[styles.scenarioComparePanel, { opacity: structuredEmphasis }]}>
          <View style={styles.scenarioCompareHeader}>
            <AppText style={styles.scenarioCompareLabel}>
              {copy.introScenario.structuredLabel}
            </AppText>
            <AppText style={styles.scenarioCompareSubline}>
              {copy.introScenario.structuredSubline}
            </AppText>
          </View>
          <ScenarioCurve
            variant="stable"
            progress={progressRatio}
            label={copy.introScenario.stableLabel}
          />
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
        </Card>

        <Card
          style={[
            styles.scenarioComparePanel,
            styles.scenarioComparePanelReactive,
            { opacity: reactiveEmphasis },
          ]}
        >
          <View style={styles.scenarioCompareHeader}>
            <AppText style={styles.scenarioCompareLabel}>
              {copy.introScenario.reactiveLabel}
            </AppText>
            <AppText style={styles.scenarioCompareSubline}>
              {copy.introScenario.reactiveSubline}
            </AppText>
          </View>
          <ScenarioCurve
            variant="volatile"
            progress={progressRatio}
            label={copy.introScenario.volatileLabel}
          />
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
        </Card>
      </View>

      <AppText style={styles.scenarioInsightLine}>{copy.introScenario.insightLine}</AppText>
      <PrimaryButton label={copy.buttons.next} onPress={onNext} />
    </View>
  );
}

function ScenarioCurve({ variant, progress, label }) {
  const { styles, colors, components } = useLessonStepStyles();
  const [size, setSize] = useState({ width: components.layout.spacing.none, height: components.layout.spacing.none });
  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const points =
    variant === 'stable' ? STABLE_CURVE_POINTS : VOLATILE_CURVE_POINTS;
  const smoothPoints = useMemo(() => getSmoothPoints(points, 14), [points]);
  const lineColor =
    variant === 'stable' ? colors.accent.primary : toRgba(colors.text.secondary, 0.9);

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
              opacity: components.opacity.value20 + components.opacity.value80 * clampedProgress,
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
  const { styles, components } = useLessonStepStyles();
  const [size, setSize] = useState({ width: components.layout.spacing.none, height: components.layout.spacing.none });
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
                minimumTrackTintColor={colors.accent.primary}
                maximumTrackTintColor={colors.background.surfaceActive}
                thumbTintColor={colors.accent.primary}
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
  const { colors, components, styles } = useLessonStepStyles();
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
                  <Ionicons
                    name="checkmark-circle"
                    size={components.sizes.icon.sm}
                    color={colors.accent.primary}
                  />
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
  const { colors, components, styles } = useLessonStepStyles();
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
  const isClosed = !!response;

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
    if (isClosed) return;
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? keyboardOffset : 0}
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
        {isClosed ? (
          <View style={styles.reflectionClosedCard}>
            <Ionicons
              name="lock-closed"
              size={components.sizes.icon.sm}
              color={colors.text.secondary}
            />
            <View style={styles.reflectionClosedTextWrap}>
              <AppText style={styles.reflectionClosedTitle}>
                {copy.messages.reflectionLockedTitle}
              </AppText>
              <AppText style={styles.reflectionClosedText}>
                {copy.messages.reflectionLockedBody}
              </AppText>
            </View>
          </View>
        ) : null}
        <PrimaryButton
          label={copy.buttons.continue}
          onPress={handleContinue}
          disabled={!canContinue}
        />
        {isClosed ? null : (
          <View style={styles.reflectionComposer}>
            <AppTextInput
              style={styles.reflectionInput}
              value={text}
              onChangeText={(value) => {
                if (isClosed) return;
                setText(value);
                setResponse(null);
              }}
              placeholder={placeholder}
              placeholderTextColor={toRgba(colors.text.secondary, 0.7)}
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
                size={components.sizes.icon.sm}
                color={canSend ? colors.text.primary : colors.text.secondary}
              />
            </Pressable>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

function SummaryStep({ content, onComplete, onPressTerm, copy }) {
  const { colors, components, styles } = useLessonStepStyles();
  return (
    <View style={styles.stepBody}>
      <Card style={styles.summaryCard}>
        <AppText style={styles.bodyText}>{copy.labels.keyTakeaways}</AppText>
        <View style={styles.takeawayList}>
          {content?.steps?.summary?.takeaways?.map((item) => (
            <View key={item} style={styles.takeawayRow}>
              <Ionicons
                name="checkmark-circle"
                size={components.sizes.icon.md}
                color={colors.accent.primary}
              />
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
          <Ionicons
            name="play-circle"
            size={components.sizes.icon.lg}
            color={colors.accent.primary}
          />
          <AppText style={styles.videoText}>{content.steps.summary.video.label}</AppText>
        </Pressable>
      ) : null}

      <PrimaryButton label={copy.buttons.completeLesson} onPress={onComplete} />
    </View>
  );
}

function IntroSummaryStep({ content, onComplete, copy }) {
  const { colors, components, styles } = useLessonStepStyles();
  const summarySubtext =
    'Dit is het vaste stappenplan dat elke investering structureert.';
  const summaryHelper = 'Tik op de stappen voor meer info.';
  const stations = [
    {
      id: 'target',
      title: 'Doelbepaling',
      description: 'Definieer het doel en de grenzen voor uitvoering.',
      substeps: ['Doel', 'Tijdshorizon', 'Doeltype'],
    },
    {
      id: 'drivers',
      title: 'Individuele risicoanalyse',
      description: 'Verduidelijk de randvoorwaarden die elke beslissing vormen.',
      substeps: ['Risicocapaciteit', 'Risicotolerantie', 'Financiële middelen'],
    },
    {
      id: 'strategy',
      title: 'Financiële investeringsstrategie',
      description: 'Zet de regels vast die beslissingen onder onzekerheid sturen.',
      substeps: ['Liquiditeit', 'Kosten', 'Ethiek/ESG', 'Dividendvoorkeur'],
    },
    {
      id: 'allocation',
      title: 'Kapitaalallocatie',
      description: 'Verdeel kapitaal over gedefinieerde prioriteiten.',
      substeps: ['Activaklassen', 'Diversificatie', 'Voorbeeldallocaties'],
    },
    {
      id: 'vehicles',
      title: 'Beleggingsinstrumenten',
      description: 'Selecteer de tools die het plan uitdrukken.',
      substeps: ['Aandelen', 'Obligaties', "ETF's", 'Alternatieven'],
    },
    {
      id: 'execution',
      title: 'Uitvoering',
      description: 'Plaats orders pas wanneer het systeem duidelijk is.',
      substeps: ['Ordertypes', 'Transactiekosten', 'Uitvoering komt als laatste'],
    },
  ];
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <View style={[styles.stepBody, styles.summaryBody]}>
      <View style={styles.summaryHeaderBlock}>
        <AppText style={styles.summarySubtitle}>{summarySubtext}</AppText>
        <AppText style={styles.summaryHelper}>{summaryHelper}</AppText>
      </View>

      <View style={styles.summaryContent}>
        <ScrollView
          style={styles.summaryScroll}
          contentContainerStyle={styles.summaryScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.processMap, styles.summaryProcessMap]}>
            {stations.map((station, index) => {
              const isActive = index === activeIndex;
              return (
                <View
                  key={station.id}
                  style={[styles.processStationBlock, styles.summaryStationBlock]}
                >
                  <Pressable
                    onPress={() =>
                      setActiveIndex((prev) => (prev === index ? null : index))
                    }
                    style={[
                      styles.processStationRow,
                      styles.summaryStationRow,
                      isActive && styles.summaryStationRowActive,
                    ]}
                  >
                    <View
                      style={[
                        styles.summaryIndexChip,
                        isActive && styles.summaryIndexChipActive,
                      ]}
                    >
                      <AppText
                        style={[
                          styles.summaryIndexText,
                          isActive && styles.summaryIndexTextActive,
                        ]}
                      >
                        {index + 1}
                      </AppText>
                    </View>
                    <View style={styles.summaryStationText}>
                      <AppText
                        style={[
                          styles.processStationTitle,
                          isActive && styles.summaryStationTitleActive,
                        ]}
                      >
                        {station.title}
                      </AppText>
                    </View>
                    <View
                      style={[
                        styles.processStationIndicator,
                        styles.summaryStationIndicator,
                        isActive && styles.summaryStationIndicatorActive,
                      ]}
                    >
                      <Ionicons
                        name={isActive ? 'chevron-down' : 'chevron-forward'}
                        size={components.sizes.icon.sm}
                        color={isActive ? colors.accent.primary : colors.text.secondary}
                      />
                    </View>
                  </Pressable>
                  {isActive ? (
                    <View style={[styles.processPanel, styles.summaryProcessPanel]}>
                      <AppText style={styles.processDescription}>
                        {station.description}
                      </AppText>
                      <View style={styles.processSubsteps}>
                        {station.substeps?.map((item) => (
                          <View
                            key={`${station.id}-${item}`}
                            style={[styles.processChip, styles.summaryProcessChip]}
                          >
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

const createStyles = (colors, components) =>
  StyleSheet.create({
  stepBody: {
    gap: components.layout.spacing.lg,
  },
  conceptCard: {
    gap: components.layout.spacing.md,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.sm,
  },
  introAccent: {
    width: components.sizes.track.sm,
    height: components.sizes.line.thin,
    backgroundColor: colors.accent.primary,
    borderRadius: components.radius.pill,
  },
  introLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  introTitle: {
    ...typography.styles.h1,
    color: colors.text.primary,
  },
  stepIntro: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  stepIntroSecondary: {
    color: colors.text.secondary,
  },
  introText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  bodyText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  caption: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  visualHint: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: components.layout.spacing.xs,
  },
  hintBar: {
    width: components.sizes.track.sm,
    borderRadius: components.radius.input,
    backgroundColor: colors.background.surfaceActive,
  },
  hintBarXs: {
    height: components.sizes.hintBar.xs,
  },
  hintBarSm: {
    height: components.sizes.hintBar.sm,
  },
  hintBarMd: {
    height: components.sizes.hintBar.md,
  },
  hintBarLg: {
    height: components.sizes.hintBar.lg,
  },
  visualCard: {
    gap: components.layout.spacing.md,
  },
  journeyTitle: {
    ...typography.styles.h1,
    color: colors.text.primary,
  },
  journeySubtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  journeyPager: {
    flex: 1,
    marginTop: components.layout.spacing.sm,
  },
  journeyPagerContent: {
    paddingBottom: components.layout.spacing.none,
  },
  journeyBody: {
    flex: 1,
  },
  journeyContent: {
    flex: 1,
    gap: components.layout.spacing.sm,
  },
  journeyNextWrap: {
    marginTop: components.layout.spacing.md,
  },
  journeyPage: {
    borderRadius: components.radius.card,
    padding: components.layout.spacing.lg,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.ui.divider,
    backgroundColor: colors.background.surface,
    gap: components.layout.spacing.md,
    justifyContent: 'center',
    marginBottom: components.layout.spacing.md,
  },
  journeyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  journeyStepChip: {
    paddingHorizontal: components.layout.spacing.md,
    paddingVertical: components.layout.spacing.xs,
    borderRadius: components.radius.pill,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.ui.divider,
    backgroundColor: colors.background.surfaceActive,
  },
  journeyStepText: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  journeyAccent: {
    width: components.sizes.square.xs,
    height: components.sizes.line.thin,
    borderRadius: components.radius.pill,
    backgroundColor: toRgba(colors.accent.primary, 0.4),
  },
  journeyLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  journeyQuestion: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  journeyWhy: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  journeyDetail: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  journeyTapHint: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  journeyVisual: {
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.ui.divider,
    backgroundColor: colors.background.surfaceActive,
    padding: components.layout.spacing.md,
    height: components.sizes.chart.xl,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  journeyPlaceholder: {
    flex: 1,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderStyle: 'dashed',
    borderColor: toRgba(colors.text.secondary, 0.3),
    alignItems: 'center',
    justifyContent: 'center',
    gap: components.layout.spacing.xs,
  },
  journeyPlaceholderText: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  processCard: {
    gap: components.layout.spacing.md,
  },
  processHeader: {
    gap: components.layout.spacing.sm,
  },
  processTitle: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  processSubline: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: components.layout.spacing.xs,
    marginTop: components.layout.spacing.sm,
  },
  segment: {
    paddingVertical: components.layout.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: components.radius.input,
    backgroundColor: colors.background.surfaceActive,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.text.primary,
  },
  segmentLabel: {
    ...typography.styles.small,
    color: colors.text.primary,
  },
  sheetText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  scenarioCard: {
    gap: components.layout.spacing.md,
  },
  scenarioMeaning: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  scenarioCompareGrid: {
    flexDirection: 'row',
    gap: components.layout.spacing.md,
    alignItems: 'stretch',
    marginTop: components.layout.spacing.sm,
  },
  scenarioComparePanel: {
    flex: 1,
    minWidth: components.layout.spacing.none,
    padding: components.layout.spacing.md,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.ui.divider,
    backgroundColor: colors.background.surface,
    gap: components.layout.spacing.lg,
  },
  scenarioComparePanelReactive: {
    borderColor: toRgba(colors.text.secondary, 0.3),
    backgroundColor: colors.background.surfaceActive,
  },
  scenarioCompareHeader: {
    gap: components.layout.spacing.xs,
  },
  scenarioCompareLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  scenarioCompareSubline: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  scenarioCompareSteps: {
    flexGrow: 1,
    gap: components.layout.spacing.sm,
    paddingVertical: components.layout.spacing.xs,
  },
  scenarioCompareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.sm,
  },
  scenarioCompareTrack: {
    alignItems: 'center',
    width: components.sizes.track.sm,
  },
  scenarioCompareNode: {
    width: components.sizes.dot.md,
    height: components.sizes.dot.md,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.text.secondary, 0.5),
    backgroundColor: colors.background.surface,
  },
  scenarioCompareNodeActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  scenarioCompareNodeActiveReactive: {
    backgroundColor: colors.text.primary,
    borderColor: colors.text.primary,
  },
  scenarioCompareNodeCurrent: {
    backgroundColor: colors.text.primary,
    borderColor: colors.text.primary,
  },
  scenarioCompareNodeMissing: {
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
    borderColor: toRgba(colors.text.secondary, 0.45),
  },
  scenarioCompareLine: {
    width: components.sizes.line.thin,
    height: components.sizes.track.sm,
    marginTop: components.layout.spacing.xs,
    backgroundColor: toRgba(colors.text.secondary, 0.35),
  },
  scenarioCompareLineActive: {
    backgroundColor: toRgba(colors.accent.primary, 0.65),
  },
  scenarioCompareLineActiveReactive: {
    backgroundColor: toRgba(colors.text.primary, 0.75),
  },
  scenarioCompareLineMissing: {
    backgroundColor: 'transparent',
    borderWidth: components.borderWidth.thin,
    borderStyle: 'dashed',
    borderColor: toRgba(colors.text.secondary, 0.35),
  },
  scenarioCompareStepLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  scenarioCompareStepLabelActive: {
    color: colors.text.primary,
  },
  scenarioCompareStepLabelCurrent: {
    color: colors.text.primary,
  },
  scenarioCompareStepLabelMissing: {
    color: colors.text.secondary,
  },
  scenarioSliderWrap: {
    marginTop: components.layout.spacing.xl,
    gap: components.layout.spacing.sm,
  },
  scenarioSliderLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  scenarioSliderHelper: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  scenarioCurveWrap: {
    gap: components.layout.spacing.xs,
    marginTop: components.layout.spacing.sm,
  },
  scenarioCurveChart: {
    height: components.sizes.chart.md,
    borderRadius: components.radius.input,
    backgroundColor: colors.background.surfaceActive,
    overflow: 'hidden',
  },
  scenarioCurveLine: {
    flex: 1,
  },
  scenarioCurveSegment: {
    position: 'absolute',
    height: components.sizes.line.thin,
    borderRadius: components.radius.pill,
  },
  scenarioCurveLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  scenarioOutcomeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: components.layout.spacing.md,
  },
  outcomePressable: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: components.layout.spacing.none,
    borderRadius: components.radius.input,
  },
  outcomePressablePressed: {
    opacity: components.opacity.value95,
    transform: [{ scale: components.transforms.scalePressed }],
  },
  scenarioPanel: {
    padding: components.layout.spacing.md,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.ui.divider,
    backgroundColor: colors.background.surfaceActive,
    gap: components.layout.spacing.md,
  },
  scenarioPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scenarioPanelTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  scenarioBadge: {
    paddingHorizontal: components.layout.spacing.md,
    paddingVertical: components.layout.spacing.xs,
    borderRadius: components.radius.pill,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.accent.primary, 0.6),
    backgroundColor: toRgba(colors.accent.primary, 0.12),
  },
  scenarioBadgeMuted: {
    borderColor: colors.ui.divider,
    backgroundColor: colors.background.surface,
  },
  scenarioBadgeText: {
    ...typography.styles.meta,
    color: colors.text.secondary,
  },
  scenarioRail: {
    gap: components.layout.spacing.sm,
  },
  scenarioRailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: components.layout.spacing.sm,
  },
  scenarioRailTrack: {
    alignItems: 'center',
    width: components.sizes.track.sm,
  },
  scenarioNode: {
    width: components.sizes.dot.md,
    height: components.sizes.dot.md,
    borderRadius: components.radius.input,
    backgroundColor: colors.text.secondary,
  },
  scenarioNodeActive: {
    backgroundColor: colors.accent.primary,
  },
  scenarioNodeDegraded: {
    opacity: components.opacity.value40,
  },
  scenarioNodeMissing: {
    backgroundColor: 'transparent',
    borderWidth: components.borderWidth.thin,
    borderStyle: 'dashed',
    borderColor: toRgba(colors.text.secondary, 0.6),
  },
  scenarioRailLine: {
    width: components.sizes.line.thin,
    height: components.sizes.track.sm,
    marginTop: components.layout.spacing.xs,
    backgroundColor: toRgba(colors.text.secondary, 0.5),
  },
  scenarioRailLineBroken: {
    backgroundColor: 'transparent',
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderStyle: 'dashed',
    borderColor: toRgba(colors.text.secondary, 0.5),
  },
  scenarioRailLineDegraded: {
    opacity: components.opacity.value40,
  },
  scenarioRailLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  scenarioRailLabelMuted: {
    color: colors.text.secondary,
  },
  scenarioRailLabelStrong: {
    color: colors.text.primary,
  },
  scenarioRailLabelDegraded: {
    color: colors.text.secondary,
  },
  scenarioRailLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.xs,
  },
  scenarioRailLabelColumn: {
    flex: 1,
    gap: components.layout.spacing.xs,
  },
  scenarioConsequence: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  scenarioPrematureBadge: {
    paddingHorizontal: components.layout.spacing.sm,
    paddingVertical: components.layout.spacing.xs,
    borderRadius: components.radius.pill,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.accent.primary, 0.6),
  },
  scenarioPrematureText: {
    ...typography.styles.meta,
    color: colors.text.secondary,
  },
  outcomePanel: {
    gap: components.layout.spacing.sm,
    padding: components.layout.spacing.md,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.ui.divider,
    backgroundColor: colors.background.surface,
  },
  outcomePanelActive: {
    borderColor: toRgba(colors.accent.primary, 0.7),
    backgroundColor: toRgba(colors.accent.primary, 0.08),
  },
  outcomeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: components.layout.spacing.sm,
  },
  outcomeTitleStack: {
    flex: 1,
    gap: components.layout.spacing.xs,
  },
  outcomeScenarioLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  outcomeLabel: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  outcomeFocusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.xs,
    paddingHorizontal: components.layout.spacing.sm,
    paddingVertical: components.layout.spacing.xs,
    borderRadius: components.radius.pill,
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.text.secondary, 0.4),
    backgroundColor: toRgba(colors.text.secondary, 0.12),
  },
  outcomeFocusPillActive: {
    borderColor: toRgba(colors.accent.primary, 0.8),
    backgroundColor: toRgba(colors.accent.primary, 0.18),
  },
  outcomeFocusText: {
    ...typography.styles.meta,
    color: colors.text.secondary,
  },
  outcomeFocusTextActive: {
    color: colors.text.primary,
  },
  outcomeChart: {
    height: components.sizes.chart.lg,
    borderRadius: components.radius.input,
    backgroundColor: colors.background.surfaceActive,
    overflow: 'hidden',
  },
  outcomeLine: {
    flex: 1,
  },
  outcomeLineSegment: {
    position: 'absolute',
    height: components.sizes.line.thin,
    borderRadius: components.radius.pill,
    backgroundColor: colors.text.secondary,
  },
  outcomeCaption: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  scenarioFocusLine: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  scenarioInsightLine: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  optionList: {
    gap: components.layout.spacing.sm,
  },
  option: {
    padding: components.layout.spacing.sm,
    borderRadius: components.radius.input,
    backgroundColor: colors.background.surfaceActive,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.text.primary,
  },
  optionActive: {
    backgroundColor: colors.background.surfaceActive,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.text.primary,
  },
  optionText: {
    ...typography.styles.small,
    color: colors.text.primary,
  },
  optionTextActive: {
    color: colors.text.primary,
  },
  insightCard: {
    gap: components.layout.spacing.xs,
  },
  insightTitle: {
    ...typography.styles.h2,
    color: colors.text.primary,
  },
  exerciseCard: {
    gap: components.layout.spacing.md,
  },
  exerciseBody: {
    flex: 1,
  },
  exerciseContent: {
    gap: components.layout.spacing.lg,
  },
  exerciseSection: {
    gap: components.layout.spacing.md,
  },
  exerciseInstruction: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  exerciseStatusText: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  exerciseStatusCorrect: {
    color: colors.text.primary,
  },
  exerciseStatusWrong: {
    color: colors.text.secondary,
  },
  exerciseSectionLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  exerciseSlots: {
    gap: components.layout.spacing.sm,
  },
  exerciseSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.sm,
    padding: components.layout.spacing.sm,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.ui.divider,
    backgroundColor: colors.background.surfaceActive,
    minHeight: components.sizes.list.minItemHeight,
  },
  exerciseSlotExecution: {
    borderColor: toRgba(colors.accent.primary, 0.6),
  },
  exerciseSlotWrong: {
    borderColor: toRgba(colors.accent.primary, 0.8),
    backgroundColor: toRgba(colors.accent.primary, 0.08),
  },
  exerciseSlotHint: {
    borderColor: toRgba(colors.accent.primary, 0.6),
  },
  exerciseSlotIndex: {
    width: components.sizes.square.sm,
    height: components.sizes.square.sm,
    borderRadius: components.radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.surface,
  },
  exerciseSlotIndexText: {
    ...typography.styles.stepLabel,
    color: colors.text.primary,
  },
  exerciseSlotText: {
    ...typography.styles.body,
    color: colors.text.primary,
    flex: 1,
  },
  exerciseSlotEmptyText: {
    color: colors.text.secondary,
  },
  exerciseSlotTextMuted: {
    ...typography.styles.body,
    color: colors.text.secondary,
    flex: 1,
  },
  exerciseChipList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: components.layout.spacing.sm,
  },
  exerciseChip: {
    paddingVertical: components.layout.spacing.sm,
    paddingHorizontal: components.layout.spacing.md,
    borderRadius: components.radius.pill,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.ui.divider,
    backgroundColor: colors.background.surfaceActive,
  },
  exerciseChipText: {
    ...typography.styles.small,
    color: colors.text.primary,
  },
  exerciseActionRow: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: components.layout.spacing.sm,
  },
  exerciseHintButton: {
    width: '100%',
  },
  exerciseNextButton: {
    width: '100%',
  },
  exerciseFooter: {
    marginTop: 'auto',
    gap: components.layout.spacing.sm,
  },
  exerciseHintBody: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  exerciseOutcome: {
    gap: components.layout.spacing.sm,
    padding: components.layout.spacing.md,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.ui.divider,
    backgroundColor: colors.background.surfaceActive,
  },
  exerciseOutcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseOutcomeLabel: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  exerciseOutcomeChart: {
    height: components.sizes.chart.sm,
    borderRadius: components.radius.input,
    backgroundColor: colors.background.surface,
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
    height: components.sizes.line.thin,
    borderRadius: components.radius.pill,
    backgroundColor: colors.text.secondary,
  },
  exerciseLineStable: {
    backgroundColor: colors.text.secondary,
  },
  exerciseLineReactive: {
    backgroundColor: toRgba(colors.text.secondary, 0.7),
  },
  exerciseOutcomeText: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  exerciseLabel: {
    ...typography.styles.stepLabel,
    color: colors.text.primary,
  },
  sequenceList: {
    gap: components.layout.spacing.sm,
    marginBottom: components.layout.spacing.sm,
  },
  sequenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.sm,
    padding: components.layout.spacing.sm,
    borderRadius: components.radius.input,
    backgroundColor: colors.background.surfaceActive,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.text.primary,
  },
  sequenceIndex: {
    width: components.sizes.square.xs,
    height: components.sizes.square.xs,
    borderRadius: components.radius.input,
    backgroundColor: colors.background.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sequenceIndexText: {
    ...typography.styles.stepLabel,
    color: colors.text.primary,
  },
  sequenceText: {
    ...typography.styles.small,
    color: colors.text.primary,
    flex: 1,
  },
  sliderRow: {
    gap: components.layout.spacing.xs,
  },
  sliderTitle: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  sliderValue: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  sliderHintRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderHintText: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  optionDisabled: {
    opacity: components.opacity.value45,
  },
  resultsBlock: {
    gap: components.layout.spacing.sm,
    marginTop: components.layout.spacing.sm,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  resultValue: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  scoreTrack: {
    height: components.sizes.hintBar.xs,
    borderRadius: components.radius.input,
    overflow: 'hidden',
    backgroundColor: colors.background.surface,
  },
  scoreFill: {
    height: components.sizes.hintBar.xs,
    backgroundColor: colors.accent.primary,
  },
  impactList: {
    gap: components.layout.spacing.xs,
    marginTop: components.layout.spacing.xs,
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.xs,
  },
  impactText: {
    ...typography.styles.small,
    flex: 1,
    color: colors.text.primary,
  },
  exerciseActions: {
    gap: components.layout.spacing.md,
  },
  reflectionThread: {
    gap: components.layout.spacing.lg,
  },
  reflectionBody: {
    flex: 1,
    gap: components.layout.spacing.md,
  },
  reflectionScroll: {
    flex: 1,
  },
  reflectionScrollContent: {
    paddingTop: components.layout.spacing.sm,
    paddingBottom: components.layout.spacing.xxl,
  },
  reflectionFooter: {
    gap: components.layout.spacing.md,
    marginTop: 'auto',
    paddingTop: components.layout.spacing.sm,
    borderTopWidth: components.borderWidth.thin,
    borderTopColor: toRgba(colors.text.secondary, 0.25),
  },
  reflectionClosedCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: components.layout.spacing.sm,
    paddingVertical: components.layout.spacing.sm,
    paddingHorizontal: components.layout.spacing.md,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.ui.divider,
    backgroundColor: colors.background.surface,
  },
  reflectionClosedTextWrap: {
    flex: 1,
    gap: components.layout.spacing.xs,
  },
  reflectionClosedTitle: {
    ...typography.styles.small,
    color: colors.text.primary,
  },
  reflectionClosedText: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  chatBubble: {
    maxWidth: '92%',
    borderRadius: components.radius.input,
    paddingVertical: components.layout.spacing.sm,
    paddingHorizontal: components.layout.spacing.md,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.ui.divider,
    backgroundColor: colors.background.surfaceActive,
  },
  chatBubbleSystem: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background.surface,
  },
  chatBubbleUser: {
    alignSelf: 'flex-end',
    borderColor: toRgba(colors.accent.primary, 0.6),
    backgroundColor: toRgba(colors.accent.primary, 0.08),
  },
  chatLabel: {
    ...typography.styles.meta,
    color: colors.text.secondary,
    marginBottom: components.layout.spacing.xs,
  },
  chatText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  reflectionComposer: {
    ...components.input.container,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: components.layout.spacing.sm,
  },
  reflectionInput: {
    flex: 1,
    ...components.input.multiline,
    ...components.input.text,
    maxHeight: components.sizes.input.composerMaxHeight,
    textAlignVertical: 'top',
  },
  reflectionSendButton: {
    width: components.sizes.square.lg,
    height: components.sizes.square.lg,
    borderRadius: components.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: components.borderWidth.thin,
    borderColor: toRgba(colors.text.secondary, 0.5),
    backgroundColor: colors.background.surfaceActive,
  },
  reflectionSendButtonPressed: {
    transform: [{ scale: components.transforms.scalePressedStrong }],
  },
  reflectionSendButtonDisabled: {
    opacity: components.opacity.value50,
  },
  reflectionSavedPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.xs,
    paddingVertical: components.layout.spacing.sm,
    paddingHorizontal: components.layout.spacing.md,
    borderRadius: components.radius.pill,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.ui.divider,
    backgroundColor: colors.background.surface,
  },
  reflectionSavedText: {
    ...typography.styles.small,
    color: colors.text.secondary,
  },
  summaryCard: {
    gap: components.layout.spacing.md,
  },
  summaryHeaderBlock: {
    gap: components.layout.spacing.xs,
  },
  summaryTitle: {
    ...typography.styles.h1,
    color: colors.text.primary,
  },
  summarySubtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  summaryHelper: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  summaryBody: {
    flex: 1,
  },
  summaryContent: {
    gap: components.layout.spacing.lg,
    flex: 1,
  },
  summaryScroll: {
    flex: 1,
  },
  summaryScrollContent: {
    paddingBottom: components.layout.spacing.md,
  },
  systemInsight: {
    ...typography.styles.body,
    textAlign: 'center',
    color: colors.text.primary,
  },
  summaryFooter: {
    marginTop: 'auto',
  },
  processMap: {
    position: 'relative',
    gap: components.layout.spacing.md,
    paddingLeft: components.layout.spacing.lg,
  },
  summaryProcessMap: {
    paddingLeft: components.layout.spacing.none,
    gap: components.layout.spacing.lg,
  },
  processLine: {
    position: 'absolute',
    left: components.offsets.lesson.processLineLeft,
    top: components.layout.spacing.xs,
    bottom: components.layout.spacing.xs,
    width: components.sizes.line.thin,
    borderRadius: components.radius.pill,
    backgroundColor: toRgba(colors.text.secondary, 0.25),
  },
  processStationBlock: {
    gap: components.layout.spacing.xs,
  },
  summaryStationBlock: {
    gap: components.layout.spacing.sm,
  },
  processStationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.sm,
  },
  processStationRowActive: {
    backgroundColor: toRgba(colors.background.surfaceActive, 0.6),
    borderRadius: components.radius.input,
    paddingVertical: components.layout.spacing.sm,
    paddingHorizontal: components.layout.spacing.sm,
  },
  summaryStationRow: {
    paddingVertical: components.layout.spacing.md,
    paddingHorizontal: components.layout.spacing.md,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.ui.divider,
    backgroundColor: colors.background.surface,
    gap: components.layout.spacing.md,
  },
  summaryStationRowActive: {
    borderColor: toRgba(colors.accent.primary, 0.6),
    backgroundColor: toRgba(colors.accent.primary, 0.08),
  },
  processNode: {
    width: components.sizes.dot.lg,
    height: components.sizes.dot.lg,
    borderRadius: components.radius.pill,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.ui.divider,
    backgroundColor: colors.background.surface,
  },
  processNodeActive: {
    borderColor: colors.accent.primary,
    backgroundColor: colors.accent.primary,
  },
  processStationText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.xs,
  },
  summaryStationText: {
    flex: 1,
    gap: components.layout.spacing.xs,
  },
  processStationIndicator: {
    width: components.sizes.square.xs,
    height: components.sizes.square.xs,
    borderRadius: components.radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: components.borderWidth.thin,
    borderColor: colors.ui.divider,
    backgroundColor: colors.background.surfaceActive,
  },
  summaryStationIndicator: {
    borderColor: toRgba(colors.text.secondary, 0.5),
  },
  summaryStationIndicatorActive: {
    borderColor: toRgba(colors.accent.primary, 0.7),
    backgroundColor: toRgba(colors.accent.primary, 0.12),
  },
  processStationIndex: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  processStationTitle: {
    ...typography.styles.bodyStrong,
    color: colors.text.primary,
    flexShrink: 1,
  },
  summaryStationTitleActive: {
    color: colors.text.primary,
  },
  summaryIndexChip: {
    width: components.sizes.square.md,
    height: components.sizes.square.md,
    borderRadius: components.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: components.borderWidth.thin,
    borderColor: colors.ui.divider,
    backgroundColor: colors.background.surfaceActive,
  },
  summaryIndexChipActive: {
    borderColor: toRgba(colors.accent.primary, 0.7),
    backgroundColor: toRgba(colors.accent.primary, 0.18),
  },
  summaryIndexText: {
    ...typography.styles.stepLabel,
    color: colors.text.secondary,
  },
  summaryIndexTextActive: {
    color: colors.text.primary,
  },
  processPanel: {
    marginLeft: components.layout.spacing.lg,
    paddingVertical: components.layout.spacing.sm,
    paddingHorizontal: components.layout.spacing.sm,
    borderRadius: components.radius.input,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.ui.divider,
    backgroundColor: colors.background.surface,
    gap: components.layout.spacing.sm,
  },
  summaryProcessPanel: {
    marginLeft: components.sizes.square.md + components.layout.spacing.md,
    paddingVertical: components.layout.spacing.md,
    paddingHorizontal: components.layout.spacing.md,
    borderColor: toRgba(colors.text.secondary, 0.3),
    backgroundColor: colors.background.surfaceActive,
  },
  processDescription: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  processSubsteps: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: components.layout.spacing.xs,
  },
  processChip: {
    paddingVertical: components.layout.spacing.sm,
    paddingHorizontal: components.layout.spacing.md,
    borderRadius: components.radius.pill,
    borderWidth: components.borderWidth.thin,
    borderColor: colors.ui.divider,
    backgroundColor: colors.background.surfaceActive,
  },
  summaryProcessChip: {
    borderColor: toRgba(colors.text.secondary, 0.35),
    backgroundColor: colors.background.surface,
  },
  processChipText: {
    ...typography.styles.small,
    color: colors.text.primary,
  },
  takeawayList: {
    gap: components.layout.spacing.sm,
  },
  takeawayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.sm,
  },
  takeawayText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  videoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: components.layout.spacing.sm,
    padding: components.layout.spacing.sm,
    borderRadius: components.radius.input,
    backgroundColor: colors.background.surface,
  },
  videoText: {
    ...typography.styles.body,
    color: colors.text.primary,
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
