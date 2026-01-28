import { lessonContent } from '../data/lessonContent';
import { lessonContentNl } from '../data/lessonContentNl';
import { lessons, modules } from '../data/curriculum';
import { curriculumNl } from '../data/curriculumNl';

const LOCALE_MAP = {
  English: 'en',
  Dutch: 'nl',
};

const LESSON_OVERVIEW_COPY = {
  en: {
    whatYoullLearn: "What you'll learn",
    keyTakeaways: 'Key takeaways',
    lessonStructure: 'Lesson structure',
    show: 'Show',
    hide: 'Hide',
    startLesson: 'Start lesson',
    back: 'Back',
    stepLabels: [
      'Concept',
      'Visual exploration',
      'Scenario',
      'Practical exercise',
      'Reflection',
      'Summary',
    ],
    statusCompleted: 'Completed',
    statusCurrent: 'Current',
    statusUpcoming: 'Upcoming',
    lessonFinished: 'Lesson finished',
  },
  nl: {
    whatYoullLearn: 'Wat je leert',
    keyTakeaways: 'Belangrijkste inzichten',
    lessonStructure: 'Lesopbouw',
    show: 'Toon',
    hide: 'Verberg',
    startLesson: 'Start les',
    back: 'Terug',
    stepLabels: [
      'Concept',
      'Visuele verkenning',
      'Scenario',
      'Praktische oefening',
      'Reflectie',
      'Samenvatting',
    ],
    statusCompleted: 'Afgerond',
    statusCurrent: 'Huidig',
    statusUpcoming: 'Aankomend',
    lessonFinished: 'Les afgerond',
  },
};

const INTRO_STEP_LABELS = {
  en: {
    1: 'STEP 1 - CONCEPT',
    2: 'STEP 2 - VISUALISATION',
    3: 'STEP 3 - SCENARIO',
    4: 'STEP 4 - EXERCISE',
    5: 'STEP 5 - REFLECTION',
    6: 'STEP 6 - SUMMARY',
  },
  nl: {
    1: 'STAP 1 - CONCEPT',
    2: 'STAP 2 - VISUALISATIE',
    3: 'STAP 3 - SCENARIO',
    4: 'STAP 4 - OEFENING',
    5: 'STAP 5 - REFLECTIE',
    6: 'STAP 6 - SAMENVATTING',
  },
};

const INTRO_STEP_TITLES = {
  en: {
    2: 'From goal to execution',
    4: 'Build the process',
    5: 'Reflection',
    6: 'The full investing process',
  },
  nl: {
    2: 'Van doel tot uitvoering',
    4: 'Bouw het proces',
    5: 'Reflectie',
    6: 'Het volledige investeringsproces',
  },
};

const LESSON_STEP_COPY = {
  en: {
    buttons: {
      next: 'Next',
      continue: 'Continue',
      reset: 'Reset',
      completeExercise: 'Complete exercise',
      completeLesson: 'Complete lesson',
    },
    labels: {
      insight: 'Insight',
      outcome: 'Outcome',
      aligned: 'Aligned',
      recheckFlow: 'Recheck the flow',
      yourOrder: 'Your order',
      actions: 'Actions',
      yourProcess: 'Your process',
      availableSteps: 'Available steps',
      executionLast: 'Execution (last)',
      emptySlot: 'Empty slot',
      needHint: 'Need a hint?',
      hint: 'Hint',
      revealImpact: 'Reveal impact',
      signal: 'Signal',
      coverage: 'Coverage',
      keyTakeaways: 'Key takeaways',
      eqtyInsight: 'EQTY insight',
      tapElements: 'Tap elements to explore',
      animationPlaceholder: 'Animation placeholder',
      tapReturn: 'Tap to return',
      tapDetails: 'Tap for details',
      tapStation: 'Tap a station to expand.',
    },
    messages: {
      noExercise: 'No exercise is available for this lesson.',
      tapActions: 'Tap actions below to build the sequence.',
      correctOrder: 'Correct order - you can continue.',
      incorrectOrder: 'Order is off - try again.',
      hintBody: 'Execution is never the starting point. Begin by defining the goal.',
      selectItems: 'Select items to see the impact.',
      reflectionQuestion: 'What did you learn from this lesson?',
      reflectionPlaceholder: 'Type your response here...',
      reflectionSaved: 'Saved to personalize upcoming lessons.',
      reflectionShort:
        'The lesson centers on defining each step before execution to keep decisions grounded.',
      reflectionStructure:
        'Noted - execution gains meaning when it follows the full sequence of steps.',
      reflectionEmotion:
        'Noted - a defined process can reduce reactive execution by adding pause and clarity.',
      reflectionDefault:
        'This reflection ties back to the idea that execution works best after the earlier steps are set.',
    },
    introConcept: {
      definition: 'Definition',
      title: 'What is investing as a process?',
      paragraph:
        'Investing is not a single action. It is a sequence of decisions that build on each other. Buying or selling only happens at the final step.',
      processTitle: 'Process overview',
      processHint: 'Tap a step to see its role.',
      steps: [
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
      ],
    },
    introVisualization: {
      subtitle: 'Each decision naturally leads to the next.',
      stepPrefix: 'Step',
      steps: [
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
          detail: 'Strategy turns goals and constraints into a repeatable rule set you can follow.',
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
            'Execution is the final act - order type, timing, and costs - after everything else is clear.',
        },
      ],
    },
    introScenario: {
      withPlan: 'Structured decisions',
      withoutPlan: 'Reactive decisions',
      planMeaning:
        'A plan here means defining your goal, risk, strategy, allocation, and vehicle before execution.',
      processRail: 'Process rail',
      structuredLabel: 'Structured decisions',
      reactiveLabel: 'Reactive decisions',
      stableDecisions: 'Structured decisions',
      reactiveDecisions: 'Reactive decisions',
      missingSuffix: ' missing',
      premature: 'Premature',
      downstreamImpact: 'Downstream steps weaken; execution becomes premature.',
      structuredOutcome: 'Stable outcome',
      reactiveOutcome: 'Volatile outcome',
      structuredCaption: 'Clear steps before execution keep the curve steady.',
      reactiveCaption: 'Skipping steps creates sharper swings.',
      focus: 'Focus',
      focused: 'Focused',
      focusInsightStructured:
        'When each step is defined upfront, decisions stay calm and consistent.',
      focusInsightReactive:
        'When execution comes early, outcomes swing because choices are made mid-stream.',
      keyInsightFallback:
        'The process prevents impulsive action by forcing clarity before execution.',
      steps: [
        { id: 'goal', label: 'Goal' },
        { id: 'risk', label: 'Risk' },
        { id: 'strategy', label: 'Strategy' },
        { id: 'allocation', label: 'Allocation' },
        { id: 'vehicle', label: 'Vehicle' },
        { id: 'execution', label: 'Execution' },
      ],
    },
    introExercise: {
      instruction: 'Tap the steps in the correct order before execution.',
      correct: 'Correct order - you can continue.',
      incorrect: 'Order is off - try again.',
    },
  },
  nl: {
    buttons: {
      next: 'Volgende',
      continue: 'Doorgaan',
      reset: 'Reset',
      completeExercise: 'Oefening afronden',
      completeLesson: 'Les afronden',
    },
    labels: {
      insight: 'Inzicht',
      outcome: 'Uitkomst',
      aligned: 'In lijn',
      recheckFlow: 'Controleer de volgorde',
      yourOrder: 'Jouw volgorde',
      actions: 'Acties',
      yourProcess: 'Jouw proces',
      availableSteps: 'Beschikbare stappen',
      executionLast: 'Uitvoering (laatst)',
      emptySlot: 'Lege plek',
      needHint: 'Hint nodig?',
      hint: 'Hint',
      revealImpact: 'Toon impact',
      signal: 'Signaal',
      coverage: 'Dekking',
      keyTakeaways: 'Belangrijkste inzichten',
      eqtyInsight: 'EQTY inzicht',
      tapElements: 'Tik op elementen om te verkennen',
      animationPlaceholder: 'Animatie placeholder',
      tapReturn: 'Tik om terug te gaan',
      tapDetails: 'Tik voor details',
      tapStation: 'Tik op een stap om uit te vouwen.',
    },
    messages: {
      noExercise: 'Er is geen oefening beschikbaar voor deze les.',
      tapActions: 'Tik op de acties hieronder om de volgorde op te bouwen.',
      correctOrder: 'Juiste volgorde - je kunt doorgaan.',
      incorrectOrder: 'Volgorde klopt niet - probeer opnieuw.',
      hintBody: 'Uitvoering is nooit het startpunt. Begin met het definieren van het doel.',
      selectItems: 'Selecteer items om de impact te zien.',
      reflectionQuestion: 'Wat heb je geleerd uit deze les?',
      reflectionPlaceholder: 'Typ hier je antwoord...',
      reflectionSaved: 'Opgeslagen om komende lessen te personaliseren.',
      reflectionShort:
        'De les draait om het definieren van elke stap voor uitvoering om beslissingen stevig te houden.',
      reflectionStructure:
        'Genoteerd - uitvoering krijgt betekenis wanneer ze de volledige reeks stappen volgt.',
      reflectionEmotion:
        'Genoteerd - een gedefinieerd proces kan reactieve uitvoering verminderen door pauze en helderheid toe te voegen.',
      reflectionDefault:
        'Deze reflectie sluit aan bij het idee dat uitvoering het best werkt nadat de eerdere stappen zijn gezet.',
    },
    introConcept: {
      definition: 'Definitie',
      title: 'Wat is investeren als proces?',
      paragraph:
        'Investeren is geen eenmalige actie. Het is een reeks beslissingen die op elkaar voortbouwen. Kopen of verkopen gebeurt pas in de laatste stap.',
      processTitle: 'Procesoverzicht',
      processHint: 'Tik op een stap om de rol te zien.',
      steps: [
        {
          id: 'goal',
          label: 'Doelbepaling',
          detail: 'Verduidelijk wat het geld moet bereiken.',
        },
        {
          id: 'risk',
          label: 'Individuele risicoanalyse',
          detail: 'Bepaal risicocapaciteit, risicotolerantie en tijdshorizon.',
        },
        {
          id: 'strategy',
          label: 'Financiele investeringsstrategie',
          detail: 'Vertaal het doel naar leidende regels.',
        },
        {
          id: 'allocation',
          label: 'Kapitaalallocatie',
          detail: 'Bepaal hoe kapitaal over activa wordt verdeeld.',
        },
        {
          id: 'vehicle',
          label: 'Beleggingsinstrument',
          detail: 'Kies de instrumenten die passen bij de allocatie.',
        },
        {
          id: 'execution',
          label: 'Uitvoering',
          detail: 'Plaats de order pas wanneer het proces helder is.',
        },
      ],
    },
    introVisualization: {
      subtitle: 'Elke beslissing leidt natuurlijk naar de volgende.',
      stepPrefix: 'Stap',
      steps: [
        {
          id: 'goal',
          label: 'Doelbepaling',
          question: 'Wat moet mijn geld bereiken?',
          why: 'Doelen gaan over richting, nog niet over keuze.',
          detail:
            'Een doel bepaalt het doel en de timing voordat er een product of ticker in beeld komt.',
        },
        {
          id: 'risk',
          label: 'Individuele risicoanalyse',
          question: 'Hoeveel instabiliteit kan ik aan?',
          why: 'Risico is tolerantie voor beweging, geen gevaar.',
          detail:
            'Risicoanalyse verduidelijkt capaciteit, tolerantie en horizon zodat keuzes binnen je grenzen blijven.',
        },
        {
          id: 'strategy',
          label: 'Financiele investeringsstrategie',
          question: 'Hoe vertaal ik intentie naar regels?',
          why: 'Strategie vermindert complexiteit, ze voegt die niet toe.',
          detail:
            'Strategie zet doelen en randvoorwaarden om in een herhaalbare set regels die je kunt volgen.',
        },
        {
          id: 'allocation',
          label: 'Kapitaalallocatie',
          question: 'Hoe is mijn geld verdeeld?',
          why: 'Allocatie is structuur, niet rekenen in deze fase.',
          detail:
            'Allocatie bepaalt hoeveel waarheen gaat en vormt de uitkomsten meer dan een enkele keuze.',
        },
        {
          id: 'vehicle',
          label: 'Beleggingsinstrument',
          question: 'Welke tool voert het plan uit?',
          why: 'Instrumenten zijn middelen, geen strategie.',
          detail:
            "Instrumenten zijn de tools die de allocatie uitvoeren (fondsen, ETF's, obligaties, aandelen).",
        },
        {
          id: 'execution',
          label: 'Uitvoering',
          question: 'Wanneer handel ik?',
          why: 'Uitvoering is definitief, niet iteratief.',
          detail:
            'Uitvoering is de laatste handeling - ordertype, timing en kosten - nadat alles helder is.',
        },
      ],
    },
    introScenario: {
      withPlan: 'Gestructureerde keuzes',
      withoutPlan: 'Reactieve keuzes',
      planMeaning:
        'Een plan betekent hier dat je doel, risico, strategie, allocatie en instrument bepaalt voordat je uitvoert.',
      processRail: 'Proceslijn',
      structuredLabel: 'Gestructureerde keuzes',
      reactiveLabel: 'Reactieve keuzes',
      stableDecisions: 'Gestructureerde keuzes',
      reactiveDecisions: 'Reactieve keuzes',
      missingSuffix: ' ontbreekt',
      premature: 'Te vroeg',
      downstreamImpact: 'Volgende stappen verzwakken; uitvoering wordt te vroeg.',
      structuredOutcome: 'Stabiele uitkomst',
      reactiveOutcome: 'Volatiele uitkomst',
      structuredCaption: 'Duidelijkheid voor uitvoering houdt de curve rustig.',
      reactiveCaption: 'Stappen overslaan zorgt voor scherpere schommelingen.',
      focus: 'Focus',
      focused: 'Gefocust',
      focusInsightStructured:
        'Wanneer elke stap vooraf is bepaald, blijven beslissingen rustig en consistent.',
      focusInsightReactive:
        'Wanneer uitvoering te vroeg komt, schommelen uitkomsten omdat keuzes onderweg worden gemaakt.',
      keyInsightFallback:
        'Het proces voorkomt impulsieve actie door helderheid af te dwingen voor uitvoering.',
      steps: [
        { id: 'goal', label: 'Doel' },
        { id: 'risk', label: 'Risico' },
        { id: 'strategy', label: 'Strategie' },
        { id: 'allocation', label: 'Allocatie' },
        { id: 'vehicle', label: 'Instrument' },
        { id: 'execution', label: 'Uitvoering' },
      ],
    },
    introExercise: {
      instruction: 'Tik de stappen in de juiste volgorde voordat je uitvoert.',
      correct: 'Juiste volgorde - je kunt doorgaan.',
      incorrect: 'Volgorde klopt niet - probeer opnieuw.',
    },
  },
};

const LANGUAGE_OPTIONS = {
  en: [
    { value: 'English', label: 'English' },
    { value: 'Dutch', label: 'Dutch' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' },
  ],
  nl: [
    { value: 'English', label: 'Engels' },
    { value: 'Dutch', label: 'Nederlands' },
    { value: 'French', label: 'Frans' },
    { value: 'German', label: 'Duits' },
  ],
};

const ONBOARDING_COPY = {
  en: {
    welcome: {
      title: 'Welcome to EQTY',
      subtitle:
        'A calm space to understand investing, shaped around your pace and goals.',
      tapHint: 'Tap to continue',
    },
    positioning: {
      stepLabel: 'Step 02',
      badge: 'EQTY positioning',
      title: 'Build to understand investing',
      subtitle: 'Clear lessons, calm pacing, and context that grows with you.',
      tapHint: 'Tap to continue',
    },
    ai: {
      stepLabel: 'Step 03',
      badge: 'AI transparency',
      title: 'How AI works in EQTY',
      subtitle: 'AI adapts explanations and examples.\nNo advice, no predictions.',
      tapHint: 'Tap to continue',
    },
    entry: {
      kicker: 'Start here',
      title: 'Create your EQTY account',
      subtitle: 'A quick setup unlocks the calm, personalized learning experience.',
      cardTitle: 'Get started',
      cardSubtitle: 'Choose a sign-up path.',
      button: 'Get started',
      loginLink: 'I already have an account',
      sheetTitle: 'Create your EQTY account',
      apple: 'Continue with Apple',
      google: 'Continue with Google',
      email: 'Continue with email',
    },
    login: {
      badge: 'Welcome back',
      title: 'Log in to EQTY',
      subtitle: 'Use any details for this prototype.',
      usernameLabel: 'Username',
      usernamePlaceholder: 'Your username',
      passwordLabel: 'Password',
      passwordPlaceholder: '********',
      button: 'Log in',
      link: "Don't have an account?",
    },
    email: {
      badge: 'Email sign up',
      title: 'Create with email',
      subtitle: 'No real authentication required for this demo.',
      emailLabel: 'Email',
      emailPlaceholder: 'you@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: '********',
      confirmLabel: 'Confirm password',
      confirmPlaceholder: '********',
      button: 'Sign up',
      link: 'Already have an account?',
    },
    basicInfo: {
      badge: 'Account setup',
      title: 'About you',
      subtitle: 'This helps personalize your experience.',
      nameLabel: 'Name',
      namePlaceholder: 'Your name',
      birthLabel: 'Date of birth',
      birthPlaceholder: 'DD / MM / YYYY',
      button: 'Create account',
    },
    language: {
      badge: 'Preferences',
      title: 'Choose your language',
      subtitle: 'You can change this later in Profile.',
      button: 'Continue',
      selected: 'Selected',
    },
    questionsIntro: {
      badge: 'Personal context',
      title: 'Personalize your path',
      subtitle: 'You will answer 3 questions.\nWe use them to adapt explanations and examples.',
      tapHint: 'Tap to continue',
      cardTitle: 'Your story in three beats',
      cardSubtitle: 'Short, honest, and easy.',
      bullets: [
        'Your current experience.',
        'What you already understand.',
        'Why you want to start now.',
      ],
      note: 'Editable later in Profile.',
      button: 'Start',
    },
    question: {
      badge: 'Your perspective',
      placeholder: 'Share a few thoughts...',
      button: 'Next',
      labelPrefix: 'Question',
      questions: {
        experienceAnswer: 'What have you already done in terms of investing?',
        knowledgeAnswer: 'What do you already know about investing today?',
        motivationAnswer: 'Why do you want to start investing?',
      },
    },
    confirmation: {
      badge: 'All set',
      title: 'You are all set',
      lines: [
        'Your answers are saved in your profile.',
        'You can edit them later.',
        'They are used to adapt explanations and examples.',
      ],
      button: 'Go to EQTY',
    },
  },
  nl: {
    welcome: {
      title: 'Welkom bij EQTY',
      subtitle:
        'Een rustige plek om investeren te begrijpen, afgestemd op jouw tempo en doelen.',
      tapHint: 'Tik om door te gaan',
    },
    positioning: {
      stepLabel: 'Stap 02',
      badge: 'EQTY positionering',
      title: 'Bouw om investeren te begrijpen',
      subtitle: 'Heldere lessen, rustig tempo en context die met je meegroeit.',
      tapHint: 'Tik om door te gaan',
    },
    ai: {
      stepLabel: 'Stap 03',
      badge: 'AI transparantie',
      title: 'Hoe AI werkt in EQTY',
      subtitle: 'AI past uitleg en voorbeelden aan.\nGeen advies, geen voorspellingen.',
      tapHint: 'Tik om door te gaan',
    },
    entry: {
      kicker: 'Start hier',
      title: 'Maak je EQTY account',
      subtitle: 'Een snelle setup opent de rustige, gepersonaliseerde leerervaring.',
      cardTitle: 'Begin',
      cardSubtitle: 'Kies een manier om te registreren.',
      button: 'Begin',
      loginLink: 'Ik heb al een account',
      sheetTitle: 'Maak je EQTY account',
      apple: 'Ga verder met Apple',
      google: 'Ga verder met Google',
      email: 'Ga verder met e-mail',
    },
    login: {
      badge: 'Welkom terug',
      title: 'Log in op EQTY',
      subtitle: 'Gebruik om het even welke gegevens voor deze prototype.',
      usernameLabel: 'Gebruikersnaam',
      usernamePlaceholder: 'Jouw gebruikersnaam',
      passwordLabel: 'Wachtwoord',
      passwordPlaceholder: '********',
      button: 'Log in',
      link: 'Nog geen account?',
    },
    email: {
      badge: 'Aanmelden met e-mail',
      title: 'Maak account met e-mail',
      subtitle: 'Geen echte authenticatie nodig voor deze demo.',
      emailLabel: 'E-mail',
      emailPlaceholder: 'jij@voorbeeld.com',
      passwordLabel: 'Wachtwoord',
      passwordPlaceholder: '********',
      confirmLabel: 'Bevestig wachtwoord',
      confirmPlaceholder: '********',
      button: 'Registreren',
      link: 'Al een account?',
    },
    basicInfo: {
      badge: 'Account instellen',
      title: 'Over jou',
      subtitle: 'Dit helpt om je ervaring te personaliseren.',
      nameLabel: 'Naam',
      namePlaceholder: 'Jouw naam',
      birthLabel: 'Geboortedatum',
      birthPlaceholder: 'DD / MM / JJJJ',
      button: 'Account maken',
    },
    language: {
      badge: 'Voorkeuren',
      title: 'Kies je taal',
      subtitle: 'Je kan dit later wijzigen in Profiel.',
      button: 'Doorgaan',
      selected: 'Gekozen',
    },
    questionsIntro: {
      badge: 'Persoonlijke context',
      title: 'Personaliseer je pad',
      subtitle: 'Je beantwoordt 3 vragen.\nWe gebruiken ze om uitleg en voorbeelden aan te passen.',
      tapHint: 'Tik om door te gaan',
      cardTitle: 'Je verhaal in drie stappen',
      cardSubtitle: 'Kort, eerlijk en eenvoudig.',
      bullets: [
        'Je huidige ervaring.',
        'Wat je al begrijpt.',
        'Waarom je nu wil beginnen.',
      ],
      note: 'Later aanpasbaar in Profiel.',
      button: 'Start',
    },
    question: {
      badge: 'Jouw perspectief',
      placeholder: 'Deel een paar gedachten...',
      button: 'Volgende',
      labelPrefix: 'Vraag',
      questions: {
        experienceAnswer: 'Wat heb je al gedaan op vlak van investeren?',
        knowledgeAnswer: 'Wat weet je vandaag al over investeren?',
        motivationAnswer: 'Waarom wil je nu beginnen met investeren?',
      },
    },
    confirmation: {
      badge: 'Alles klaar',
      title: 'Je bent helemaal klaar',
      lines: [
        'Je antwoorden zijn opgeslagen in je profiel.',
        'Je kan ze later aanpassen.',
        'Ze worden gebruikt om uitleg en voorbeelden aan te passen.',
      ],
      button: 'Ga naar EQTY',
    },
  },
};

const HOME_COPY = {
  en: {
    greetingMorning: 'Good morning',
    greetingAfternoon: 'Good afternoon',
    greetingEvening: 'Good evening',
    defaultName: 'there',
    defaultMotivation: 'invest with confidence.',
    moduleFocus: 'Module focus',
    moduleFallbackDescription: 'Build the foundation for today.',
    todaysLessonTag: "TODAY'S LESSON",
    todaysFocusTitle: "Today's focus",
    todaysFocusSubtitle: 'What you will cover in this lesson.',
    startLesson: 'Start lesson',
    viewDetails: 'View details',
    hideDetails: 'Hide details',
    labels: {
      concept: 'Concept',
      scenario: 'Scenario',
      exercise: 'Exercise',
    },
    coreConceptFallback: 'Core concept',
    titles: {
      scenario: 'Real-world lens',
      exercise: 'Personal application',
    },
    conceptDetail: (lessonTitle) =>
      `We break down ${lessonTitle || 'the main idea'} so you can spot the decision lever and apply it consistently.`,
    scenarioSummary: (moduleLabel) => `${moduleLabel} applied to a practical decision.`,
    scenarioDetail: (lessonTitle, moduleDescription) =>
      `You will walk through a realistic case that shows how ${lessonTitle || 'this idea'} shapes a real choice. ${moduleDescription}`,
    exerciseSummary: (motivation) => `A short reflection aligned with your goal: ${motivation}`,
    exerciseDetail:
      'Write down one action you can take this week to apply the lesson. Keep it small, specific, and measurable.',
  },
  nl: {
    greetingMorning: 'Goedemorgen',
    greetingAfternoon: 'Goedemiddag',
    greetingEvening: 'Goedenavond',
    defaultName: 'daar',
    defaultMotivation: 'investeer met vertrouwen.',
    moduleFocus: 'Modulefocus',
    moduleFallbackDescription: 'Bouw de basis voor vandaag.',
    todaysLessonTag: 'LES VAN VANDAAG',
    todaysFocusTitle: 'Focus van vandaag',
    todaysFocusSubtitle: 'Wat je in deze les behandelt.',
    startLesson: 'Start les',
    viewDetails: 'Bekijk details',
    hideDetails: 'Verberg details',
    labels: {
      concept: 'Concept',
      scenario: 'Scenario',
      exercise: 'Oefening',
    },
    coreConceptFallback: 'Kernconcept',
    titles: {
      scenario: 'Praktijklens',
      exercise: 'Persoonlijke toepassing',
    },
    conceptDetail: (lessonTitle) =>
      `We leggen ${lessonTitle || 'het hoofdidee'} uit zodat je de beslisknop ziet en het consequent kan toepassen.`,
    scenarioSummary: (moduleLabel) => `${moduleLabel} toegepast op een praktische beslissing.`,
    scenarioDetail: (lessonTitle, moduleDescription) =>
      `Je doorloopt een realistische case die toont hoe ${lessonTitle || 'dit idee'} een echte keuze stuurt. ${moduleDescription}`,
    exerciseSummary: (motivation) => `Een korte reflectie rond je doel: ${motivation}`,
    exerciseDetail:
      'Schrijf een actie op die je deze week kan doen om de les toe te passen. Hou het klein, specifiek en meetbaar.',
  },
};

const SETTINGS_COPY = {
  en: {
    languageTitle: 'Language',
    saved: 'Saved',
    selected: 'Selected',
  },
  nl: {
    languageTitle: 'Taal',
    saved: 'Opgeslagen',
    selected: 'Gekozen',
  },
};

export function getLocaleKey(language) {
  return LOCALE_MAP[language] || 'en';
}

export function getLessonContent(lessonId, language) {
  const locale = getLocaleKey(language);
  const localized = locale === 'nl' ? lessonContentNl : null;
  return localized?.[lessonId] || lessonContent[lessonId] || lessonContent.lesson_0;
}

export function getLocalizedLessons(language) {
  const locale = getLocaleKey(language);
  if (locale !== 'nl') return lessons;
  return lessons.map((lesson) => {
    const override = curriculumNl.lessons?.[lesson.id];
    return override ? { ...lesson, ...override } : lesson;
  });
}

export function getLocalizedModules(language) {
  const locale = getLocaleKey(language);
  if (locale !== 'nl') return modules;
  return modules.map((module) => {
    const override = curriculumNl.modules?.[module.id];
    return override ? { ...module, ...override } : module;
  });
}

export function getLessonOverviewCopy(language) {
  const locale = getLocaleKey(language);
  return LESSON_OVERVIEW_COPY[locale] || LESSON_OVERVIEW_COPY.en;
}

export function getLessonStepCopy(language) {
  const locale = getLocaleKey(language);
  return LESSON_STEP_COPY[locale] || LESSON_STEP_COPY.en;
}

export function getLanguageOptions(language) {
  const locale = getLocaleKey(language);
  return LANGUAGE_OPTIONS[locale] || LANGUAGE_OPTIONS.en;
}

export function getOnboardingCopy(language) {
  const locale = getLocaleKey(language);
  return ONBOARDING_COPY[locale] || ONBOARDING_COPY.en;
}

export function getHomeCopy(language) {
  const locale = getLocaleKey(language);
  return HOME_COPY[locale] || HOME_COPY.en;
}

export function getSettingsCopy(language) {
  const locale = getLocaleKey(language);
  return SETTINGS_COPY[locale] || SETTINGS_COPY.en;
}

export function formatLessonModuleLabel(language, moduleNumber, lessonOrder) {
  const locale = getLocaleKey(language);
  if (locale === 'nl') {
    return moduleNumber !== undefined
      ? `Module ${moduleNumber}, Les ${lessonOrder}`
      : `Les ${lessonOrder}`;
  }
  return moduleNumber !== undefined
    ? `Module ${moduleNumber}, Lesson ${lessonOrder}`
    : `Lesson ${lessonOrder}`;
}

export function getIntroStepLabel(language, step) {
  const locale = getLocaleKey(language);
  return INTRO_STEP_LABELS[locale]?.[step] || INTRO_STEP_LABELS.en[step] || null;
}

export function getIntroStepTitle(language, step) {
  const locale = getLocaleKey(language);
  return INTRO_STEP_TITLES[locale]?.[step] || INTRO_STEP_TITLES.en[step] || null;
}

export function formatOnboardingQuestionLabel(language, step) {
  const locale = getLocaleKey(language);
  const prefix = ONBOARDING_COPY[locale]?.question?.labelPrefix || ONBOARDING_COPY.en.question.labelPrefix;
  const padded = String(step).padStart(2, '0');
  return `${prefix} ${padded}`;
}

export function formatHomeLessonCount(language, current, total) {
  const locale = getLocaleKey(language);
  if (locale === 'nl') {
    return `Les ${current}/${total}`;
  }
  return `Lesson ${current}/${total}`;
}

export function formatHomeModuleLabel(language, moduleNumber, moduleTitle, moduleIndex) {
  const locale = getLocaleKey(language);
  const moduleName = moduleTitle || '';
  if (moduleNumber !== undefined && moduleNumber !== null) {
    return `Module ${moduleNumber} ${moduleName}`.trim();
  }
  if (moduleIndex !== undefined && moduleIndex !== null) {
    return `Module ${moduleIndex} ${moduleName}`.trim();
  }
  return locale === 'nl' ? 'Modulefocus' : 'Module focus';
}
