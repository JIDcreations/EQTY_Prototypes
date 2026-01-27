import React, { useMemo, useState, useEffect } from 'react';
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
  const { userContext, onboardingContext, addReflection, completeLesson } = useApp();
  const glossary = useGlossary();
  const isIntroConcept = lessonId === 'lesson_0' && step === 1;
  const isIntroVisualization = lessonId === 'lesson_0' && step === 2;
  const isIntroScenario = lessonId === 'lesson_0' && step === 3;

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

  const disableOuterScroll = lessonId === 'lesson_0' && step === 2;
  const containerContentStyle = disableOuterScroll ? { paddingBottom: 0 } : null;

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
          isIntroConcept
            ? 'STEP 1 · CONCEPT'
            : isIntroVisualization
            ? 'STEP 2 · VISUALISATION'
            : isIntroScenario
            ? 'STEP 3 · SCENARIO'
            : null
        }
        progressText={
          isIntroConcept
            ? `1/${TOTAL_STEPS}`
            : isIntroVisualization
            ? `2/${TOTAL_STEPS}`
            : isIntroScenario
            ? `3/${TOTAL_STEPS}`
            : null
        }
        showTitle={!isIntroConcept && !isIntroVisualization}
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
        <VisualizationStep
          content={content}
          lessonId={lessonId}
          onNext={handleNext}
          onPressTerm={handleTermPress}
        />
      )}
      {step === 3 && (lessonId === 'lesson_0' ? (
        <IntroScenarioStep
          content={content}
          onboardingContext={onboardingContext}
          userContext={userContext}
          onNext={handleNext}
        />
      ) : (
        <ScenarioStep
          content={content}
          userContext={userContext}
          onNext={handleNext}
          onPressTerm={handleTermPress}
        />
      ))}
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
      <PrimaryButton label="Next" onPress={onNext} />
    </View>
  );
}

function IntroVisualizationStep({ onNext }) {
  const { styles } = useLessonStepStyles();
  const [cardHeight, setCardHeight] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const peek = spacing.lg;
  const steps = [
    {
      id: 'goal',
      label: 'Goal definition',
      question: 'What should my money achieve?',
      why: 'Goals are about direction, not choice yet.',
      detail:
        'A target defines purpose and timing before any product or ticker enters the picture.',
    },
    {
      id: 'risk',
      label: 'Individual risk analysis',
      question: 'How much instability can I handle?',
      why: 'Risk is tolerance for movement, not danger.',
      detail:
        'Risk analysis clarifies capacity, tolerance, and horizon so choices stay within your limits.',
    },
    {
      id: 'strategy',
      label: 'Financial investment strategy',
      question: 'How do I translate intent into rules?',
      why: 'Strategy reduces complexity, it does not add it.',
      detail:
        'Strategy turns goals and constraints into a repeatable rule set you can follow.',
    },
    {
      id: 'allocation',
      label: 'Capital allocation',
      question: 'How is my money spread?',
      why: 'Allocation is structure, not math at this stage.',
      detail:
        'Allocation decides how much goes where, shaping outcomes more than any single pick.',
    },
    {
      id: 'vehicle',
      label: 'Investment vehicle',
      question: 'What tool executes the plan?',
      why: 'Vehicles are means, not strategy.',
      detail:
        'Vehicles are the tools that implement allocation (funds, ETFs, bonds, equities).',
    },
    {
      id: 'execution',
      label: 'Execution',
      question: 'When do I act?',
      why: 'Execution is final, not iterative.',
      detail:
        'Execution is the final act—order type, timing, and costs—after everything else is clear.',
    },
  ];
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
        <AppText style={styles.journeyTitle}>From goal to execution</AppText>
        <AppText style={styles.journeySubtitle}>
          Each decision naturally leads to the next.
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
                {`Step ${index + 1} – ${step.label}`}
              </AppText>
              {expandedCards[step.id] ? (
                <>
                  <AppText style={styles.journeyDetail}>{step.detail}</AppText>
                  <AppText style={styles.journeyTapHint}>Tap to return</AppText>
                </>
              ) : (
                <>
                  <AppText style={styles.journeyQuestion}>{step.question}</AppText>
                  <View style={styles.journeyVisual}>
                    <View style={styles.journeyPlaceholder}>
                      <AppText style={styles.journeyPlaceholderText}>
                        Animation placeholder
                      </AppText>
                    </View>
                  </View>
                  <AppText style={styles.journeyWhy}>{step.why}</AppText>
                  <AppText style={styles.journeyTapHint}>Tap for details</AppText>
                </>
              )}
            </Pressable>
          ))}
          <View style={styles.journeyNextWrap}>
            <PrimaryButton label="Next" onPress={onNext} />
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

function IntroScenarioStep({ content, onboardingContext, userContext, onNext }) {
  const { styles, colors } = useLessonStepStyles();
  const scenario = content?.steps?.scenario;
  const variantKey = getScenarioVariantFromOnboarding(onboardingContext, userContext);
  const variant = scenario?.variants?.[variantKey] || scenario?.variants?.new;
  const keyInsight =
    variant?.keyInsight ||
    'The process prevents impulsive action by forcing clarity before execution.';
  const [mode, setMode] = useState('plan');
  const [activeMissing, setActiveMissing] = useState(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [outcomeMounted, setOutcomeMounted] = useState(false);
  const outcomeAnim = useState(() => new Animated.Value(0))[0];
  const steps = [
    { id: 'goal', label: 'Goal' },
    { id: 'risk', label: 'Risk' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'allocation', label: 'Allocation' },
    { id: 'vehicle', label: 'Vehicle' },
    { id: 'execution', label: 'Execution' },
  ];
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
            With a plan
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
            Without a plan
          </AppText>
        </Pressable>
      </View>

      <View style={styles.scenarioPanel}>
        <View style={styles.scenarioPanelHeader}>
          <AppText style={styles.scenarioPanelTitle}>Process rail</AppText>
          <View
            style={[
              styles.scenarioBadge,
              mode === 'no-plan' && styles.scenarioBadgeMuted,
            ]}
          >
            <AppText style={styles.scenarioBadgeText}>
              {mode === 'plan' ? 'Stable decisions' : 'Reactive decisions'}
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
            const label = isMissing ? `${step.label} missing` : step.label;
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
                        <AppText style={styles.scenarioPrematureText}>Premature</AppText>
                      </View>
                    ) : null}
                  </View>
                  {showExecutionHint ? (
                    <AppText style={styles.scenarioTapHint}>Tap execution to see outcome</AppText>
                  ) : null}
                  {showConsequence ? (
                    <AppText style={styles.scenarioConsequence}>
                      Downstream steps weaken; execution becomes premature.
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
            <OutcomeChart mode={mode} />
          </Animated.View>
        ) : null}
      </View>
      <AppText style={styles.scenarioInsightLine}>{keyInsight}</AppText>
      <PrimaryButton label="Next" onPress={onNext} />
    </View>
  );
}

function OutcomeChart({ mode }) {
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
          {mode === 'plan' ? 'Stable outcome' : 'Reactive outcome'}
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
        {mode === 'plan'
          ? 'Clarity before execution keeps outcomes steadier.'
          : 'Skipping steps makes outcomes more reactive.'}
      </AppText>
    </View>
  );
}

function VisualizationStep({ content, lessonId, onNext, onPressTerm }) {
  const { styles } = useLessonStepStyles();
  const [selected, setSelected] = useState(null);

  if (lessonId === 'lesson_0') {
    return <IntroVisualizationStep onNext={onNext} />;
  }

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

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
