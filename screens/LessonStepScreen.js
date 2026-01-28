import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  LayoutAnimation,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  UIManager,
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
  getIntroStepLabel,
  getIntroStepTitle,
  getLessonContent,
  getLessonStepCopy,
} from '../utils/localization';

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
  const { userContext, onboardingContext, addReflection, completeLesson, preferences } = useApp();
  const glossary = useGlossary();
  const isIntroConcept = lessonId === 'lesson_0' && step === 1;
  const isIntroVisualization = lessonId === 'lesson_0' && step === 2;
  const isIntroScenario = lessonId === 'lesson_0' && step === 3;
  const isIntroExercise = lessonId === 'lesson_0' && step === 4;
  const isIntroReflection = lessonId === 'lesson_0' && step === 5;
  const isIntroSummary = lessonId === 'lesson_0' && step === 6;

  const content = getLessonContent(lessonId, preferences?.language);
  const copy = useMemo(() => getLessonStepCopy(preferences?.language), [preferences?.language]);
  const stepTitle = useMemo(() => {
    if (!content) return `Step ${step}`;
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
        return `Step ${step}`;
    }
  }, [content, lessonId, preferences?.language, step]);

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

  const disableOuterScroll =
    lessonId === 'lesson_0' && (step === 2 || step === 5 || step === 6);
  const containerContentStyle =
    disableOuterScroll && step === 2 ? { paddingBottom: 0 } : null;

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
        stepLabel={
          lessonId === 'lesson_0' ? getIntroStepLabel(preferences?.language, step) : null
        }
        progressText={
          isIntroConcept
            ? `1/${TOTAL_STEPS}`
            : isIntroVisualization
            ? `2/${TOTAL_STEPS}`
            : isIntroScenario
            ? `3/${TOTAL_STEPS}`
            : isIntroExercise
            ? `4/${TOTAL_STEPS}`
            : isIntroReflection
            ? `5/${TOTAL_STEPS}`
            : isIntroSummary
            ? `6/${TOTAL_STEPS}`
            : null
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
  const { styles } = useLessonStepStyles();
  const intro = content?.steps?.concept?.intro;
  const steps = copy.introConcept.steps;
  const [activeId, setActiveId] = useState(steps[0].id);
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
                  >
                    <AppText
                      style={[
                        styles.processNodeText,
                        isActive && styles.processNodeTextActive,
                      ]}
                    >
                      {steps.findIndex((item) => item.id === step.id) + 1}
                    </AppText>
                  </View>
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
              <AppText style={styles.journeyLabel}>
                {`${copy.introVisualization.stepPrefix} ${index + 1} - ${step.label}`}
              </AppText>
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

function getScenarioVariantFromOnboarding(onboardingContext, userContext) {
  const experienceText = (onboardingContext?.experienceAnswer || '').toLowerCase();
  const knowledgeText = (onboardingContext?.knowledgeAnswer || '').toLowerCase();

  if (/(seasoned|professional|advisor|decade|advanced)/.test(experienceText)) {
    return 'seasoned';
  }
  if (/(year|years|portfolio|stock|stocks|crypto|etf|bond|fund|index|broker|app|trade|trading)/.test(experienceText)) {
    return 'growing';
  }
  if (/(none|nothing|new|starting|beginner)/.test(experienceText)) {
    return 'new';
  }

  if (/(advanced|expert|professional)/.test(knowledgeText)) {
    return 'seasoned';
  }
  if (/(intermediate|familiar|comfortable|some)/.test(knowledgeText)) {
    return 'growing';
  }
  if (/(basic|new|beginner|none)/.test(knowledgeText)) {
    return 'new';
  }

  return userContext?.experience || 'new';
}

function IntroScenarioStep({ content, onboardingContext, userContext, onNext, copy }) {
  const { styles, colors } = useLessonStepStyles();
  const scenario = content?.steps?.scenario;
  const intro = scenario?.intro;
  const variantKey = getScenarioVariantFromOnboarding(onboardingContext, userContext);
  const variant = scenario?.variants?.[variantKey] || scenario?.variants?.new;
  const keyInsight = variant?.keyInsight || copy.introScenario.keyInsightFallback;
  const [mode, setMode] = useState('plan');
  const [activeMissing, setActiveMissing] = useState(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [outcomeMounted, setOutcomeMounted] = useState(false);
  const outcomeAnim = useState(() => new Animated.Value(0))[0];
  const steps = copy.introScenario.steps;
  const missingIds = mode === 'no-plan' ? ['goal', 'risk', 'strategy'] : [];
  const activeMissingIndex = activeMissing
    ? steps.findIndex((step) => step.id === activeMissing)
    : -1;

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useEffect(() => {
    if (showOutcome) {
      setOutcomeMounted(true);
      outcomeAnim.setValue(0);
      Animated.timing(outcomeAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    } else if (outcomeMounted) {
      Animated.timing(outcomeAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setOutcomeMounted(false);
      });
    }
  }, [showOutcome, outcomeMounted, outcomeAnim]);

  const applyAnimation = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const handleToggle = (nextMode) => {
    if (nextMode === mode) return;
    applyAnimation();
    setMode(nextMode);
    setActiveMissing(null);
  };

  const handleMissingPress = (id) => {
    if (mode !== 'no-plan') return;
    applyAnimation();
    setActiveMissing((prev) => (prev === id ? null : id));
  };

  const handleExecutionPress = () => {
    applyAnimation();
    setShowOutcome((prev) => !prev);
  };

  return (
    <View style={styles.stepBody}>
      {intro ? <AppText style={styles.stepIntro}>{intro}</AppText> : null}
      <View style={styles.scenarioToggle}>
        <Pressable
          onPress={() => handleToggle('plan')}
          style={[
            styles.scenarioToggleOption,
            mode === 'plan' && styles.scenarioToggleOptionActive,
          ]}
        >
          <AppText
            style={[
              styles.scenarioToggleText,
              mode === 'plan' && styles.scenarioToggleTextActive,
            ]}
          >
            {copy.introScenario.withPlan}
          </AppText>
        </Pressable>
        <Pressable
          onPress={() => handleToggle('no-plan')}
          style={[
            styles.scenarioToggleOption,
            mode === 'no-plan' && styles.scenarioToggleOptionActive,
          ]}
        >
          <AppText
            style={[
              styles.scenarioToggleText,
              mode === 'no-plan' && styles.scenarioToggleTextActive,
            ]}
          >
            {copy.introScenario.withoutPlan}
          </AppText>
        </Pressable>
      </View>

      <View style={styles.scenarioPanel}>
        <View style={styles.scenarioPanelHeader}>
          <AppText style={styles.scenarioPanelTitle}>{copy.introScenario.processRail}</AppText>
          <View
            style={[
              styles.scenarioBadge,
              mode === 'no-plan' && styles.scenarioBadgeMuted,
            ]}
          >
            <AppText style={styles.scenarioBadgeText}>
              {mode === 'plan'
                ? copy.introScenario.stableDecisions
                : copy.introScenario.reactiveDecisions}
            </AppText>
          </View>
        </View>
        <View style={styles.scenarioRail}>
          {steps.map((step, index) => {
            const isExecution = step.id === 'execution';
            const isMissing = missingIds.includes(step.id);
            const isLast = index === steps.length - 1;
            const isDegraded =
              activeMissingIndex >= 0 && index > activeMissingIndex && mode === 'no-plan';
            const label = isMissing
              ? `${step.label}${copy.introScenario.missingSuffix}`
              : step.label;
            const showJump = isExecution && mode === 'no-plan';
            const showConsequence = isMissing && activeMissing === step.id;
            const showExecutionHint = isExecution && !showOutcome;
            const isInteractive = isExecution || isMissing;
            const RowWrapper = isInteractive ? Pressable : View;
            return (
              <RowWrapper
                key={step.id}
                onPress={
                  isExecution
                    ? handleExecutionPress
                    : isMissing
                    ? () => handleMissingPress(step.id)
                    : undefined
                }
                style={styles.scenarioRailRow}
              >
                <View style={styles.scenarioRailTrack}>
                  <View
                    style={[
                      styles.scenarioNode,
                      isExecution && styles.scenarioNodeActive,
                      isMissing && styles.scenarioNodeMissing,
                      isDegraded && styles.scenarioNodeDegraded,
                    ]}
                  />
                  {!isLast ? (
                    <View
                      style={[
                        styles.scenarioRailLine,
                        mode === 'no-plan' && styles.scenarioRailLineBroken,
                        isDegraded && styles.scenarioRailLineDegraded,
                      ]}
                    />
                  ) : null}
                </View>
                <View style={styles.scenarioRailLabelColumn}>
                  <View style={styles.scenarioRailLabelRow}>
                    <AppText
                      style={[
                        styles.scenarioRailLabel,
                        isMissing && styles.scenarioRailLabelMuted,
                        isExecution && styles.scenarioRailLabelStrong,
                        isDegraded && styles.scenarioRailLabelDegraded,
                      ]}
                    >
                      {label}
                    </AppText>
                    {showJump ? (
                      <Ionicons name="arrow-forward" size={14} color={colors.accent} />
                    ) : null}
                    {isExecution && activeMissingIndex >= 0 ? (
                      <View style={styles.scenarioPrematureBadge}>
                        <AppText style={styles.scenarioPrematureText}>
                          {copy.introScenario.premature}
                        </AppText>
                      </View>
                    ) : null}
                  </View>
                  {showExecutionHint ? (
                    <AppText style={styles.scenarioTapHint}>
                      {copy.introScenario.tapExecution}
                    </AppText>
                  ) : null}
                  {showConsequence ? (
                    <AppText style={styles.scenarioConsequence}>
                      {copy.introScenario.downstreamImpact}
                    </AppText>
                  ) : null}
                </View>
              </RowWrapper>
            );
          })}
        </View>
        {outcomeMounted ? (
          <Animated.View
            style={[
              styles.scenarioOutcome,
              {
                opacity: outcomeAnim,
                transform: [
                  {
                    translateY: outcomeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <OutcomeChart mode={mode} copy={copy} />
          </Animated.View>
        ) : null}
      </View>
      <AppText style={styles.scenarioInsightLine}>{keyInsight}</AppText>
      <PrimaryButton label={copy.buttons.next} onPress={onNext} />
    </View>
  );
}

function OutcomeChart({ mode, copy }) {
  const { styles } = useLessonStepStyles();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const lineAnim = useState(() => new Animated.Value(1))[0];
  const points =
    mode === 'plan'
      ? [
          { x: 0, y: 68 },
          { x: 18, y: 62 },
          { x: 36, y: 56 },
          { x: 54, y: 52 },
          { x: 72, y: 44 },
          { x: 90, y: 36 },
          { x: 100, y: 32 },
        ]
      : [
          { x: 0, y: 60 },
          { x: 18, y: 40 },
          { x: 36, y: 78 },
          { x: 54, y: 34 },
          { x: 72, y: 86 },
          { x: 90, y: 48 },
          { x: 100, y: 58 },
        ];

  useEffect(() => {
    lineAnim.setValue(0);
    Animated.timing(lineAnim, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [mode, lineAnim]);

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
      return { x: x1, y: y1, length, angle, key: `seg-${index}` };
    });
  }, [points, size]);

  return (
    <View style={styles.outcomePanel}>
      <View style={styles.outcomeHeader}>
        <AppText style={styles.outcomeLabel}>
          {mode === 'plan' ? copy.introScenario.stableOutcome : copy.introScenario.reactiveOutcome}
        </AppText>
      </View>
      <View
        style={styles.outcomeChart}
        onLayout={(event) =>
          setSize({
            width: event.nativeEvent.layout.width,
            height: event.nativeEvent.layout.height,
          })
        }
      >
        <Animated.View
          style={[
            styles.outcomeLine,
            {
              opacity: lineAnim,
              transform: [
                {
                  translateY: lineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [6, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {segments.map((segment) => (
            <View
              key={segment.key}
              style={[
                styles.outcomeLineSegment,
                {
                  width: segment.length,
                  left: segment.x,
                  top: segment.y,
                  transform: [{ rotate: `${segment.angle}deg` }],
                },
              ]}
            />
          ))}
        </Animated.View>
      </View>
      <AppText style={styles.outcomeCaption}>
        {mode === 'plan' ? copy.introScenario.stableCaption : copy.introScenario.reactiveCaption}
      </AppText>
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
  const [response, setResponse] = useState(null);
  const intro = content?.steps?.reflection?.intro;

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

  const handleBlur = () => {
    setResponse(buildResponse(text));
  };

  const handleContinue = () => {
    const nextResponse = response || buildResponse(text);
    if (!response) {
      setResponse(nextResponse);
      return;
    }
    onSubmit(text, nextResponse);
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
            <GlossaryText
              text={content?.steps?.reflection?.question}
              style={styles.chatText}
              onPressTerm={onPressTerm}
            />
          </View>
          <View style={[styles.chatBubble, styles.chatBubbleUser]}>
            <TextInput
              style={styles.chatInput}
              value={text}
              onChangeText={(value) => {
                setText(value);
                setResponse(null);
              }}
              onBlur={handleBlur}
              placeholder={
                content?.steps?.reflection?.placeholder || copy.messages.reflectionPlaceholder
              }
              placeholderTextColor={colors.textSecondary}
              multiline
            />
          </View>
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
        <PrimaryButton label={copy.buttons.continue} onPress={handleContinue} />
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
    lineHeight: 22,
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
  journeyTitle: {
    fontFamily: typography.fontFamilyDemi,
    color: colors.textPrimary,
    fontSize: typography.h1,
  },
  journeySubtitle: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
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
    paddingHorizontal: 10,
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
    lineHeight: 22,
  },
  journeyWhy: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small,
    lineHeight: 18,
  },
  journeyDetail: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
  },
  journeyTapHint: {
    fontFamily: typography.fontFamilyMedium,
    color: toRgba(colors.textSecondary, 0.7),
    fontSize: typography.small,
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
    width: 24,
    alignItems: 'center',
    marginTop: 2,
  },
  processNode: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surfaceActive,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processNodeActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  processNodeText: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small - 1,
    color: colors.textSecondary,
    lineHeight: typography.small - 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    transform: [{ translateY: Platform.OS === 'ios' ? 0.5 : 0 }],
  },
  processNodeTextActive: {
    color: colors.background,
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
  scenarioToggle: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: toRgba(colors.textSecondary, 0.45),
    backgroundColor: colors.surface,
    marginTop: spacing.md,
  },
  scenarioToggleOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scenarioToggleOptionActive: {
    backgroundColor: colors.surfaceActive,
    borderWidth: 1,
    borderColor: toRgba(colors.textSecondary, 0.35),
  },
  scenarioToggleText: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.small,
    letterSpacing: 0.6,
  },
  scenarioToggleTextActive: {
    color: colors.textPrimary,
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
    paddingHorizontal: 10,
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
    lineHeight: 18,
  },
  scenarioPrematureBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
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
  scenarioTapHint: {
    fontFamily: typography.fontFamilyMedium,
    color: toRgba(colors.textSecondary, 0.8),
    fontSize: typography.small - 1,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  scenarioOutcome: {
    marginTop: spacing.md,
  },
  outcomePanel: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
  },
  outcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  outcomeLabel: {
    fontFamily: typography.fontFamilyDemi,
    color: colors.textPrimary,
    fontSize: typography.body,
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
    lineHeight: 18,
  },
  scenarioInsightLine: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
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
    lineHeight: 22,
  },
  exerciseStatusText: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    lineHeight: 18,
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
    lineHeight: 22,
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
    lineHeight: 18,
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
  },
  reflectionScroll: {
    flex: 1,
  },
  reflectionScrollContent: {
    paddingBottom: spacing.md,
  },
  reflectionFooter: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
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
    lineHeight: 22,
  },
  chatInput: {
    minHeight: 72,
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.body,
    textAlignVertical: 'top',
  },
  reflectionSavedPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: 6,
    paddingHorizontal: 10,
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
    lineHeight: 22,
  },
  processHint: {
    fontFamily: typography.fontFamilyMedium,
    color: toRgba(colors.textSecondary, 0.75),
    fontSize: typography.small,
    letterSpacing: 0.2,
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
    paddingVertical: 6,
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
    fontSize: typography.small,
    lineHeight: 18,
  },
  processSubsteps: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  processChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
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
