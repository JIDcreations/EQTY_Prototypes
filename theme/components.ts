import { layout } from './layout';
import { typography } from './typography';

const radius = {
  button: 16,
  card: 24,
  input: 16,
  pill: 999,
};

const borderWidth = {
  thin: 1,
};

const opacity = {
  value95: 0.95,
  value94: 0.94,
  value90: 0.9,
  value60: 0.6,
  value55: 0.55,
  value50: 0.5,
  value45: 0.45,
  value40: 0.4,
  value35: 0.35,
  value20: 0.2,
  value80: 0.8,
};

const sizes = {
  icon: {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
  },
  square: {
    xs: 24,
    sm: 28,
    md: 34,
    lg: 36,
  },
  dot: {
    xs: 6,
    sm: 8,
    md: 10,
    lg: 14,
  },
  line: {
    thin: 2,
    thick: 3,
  },
  track: {
    sm: 18,
  },
  hintBar: {
    xs: 8,
    sm: 14,
    md: 22,
    lg: 30,
  },
  chart: {
    sm: 90,
    md: 96,
    lg: 120,
    xl: 190,
  },
  card: {
    stackHeight: 160,
  },
  illustration: {
    sm: 180,
    smAlt: 190,
    md: 200,
    lg: 220,
    xl: 230,
    xxl: 240,
    xxxl: 260,
  },
  input: {
    minHeight: 48,
    multilineMinHeight: 96,
    composerMaxHeight: 120,
  },
  list: {
    minItemHeight: 56,
  },
  screen: {
    minPanelHeight: 330,
    maxContentWidth: 320,
  },
  handle: {
    width: 40,
    widthLg: 44,
    height: 4,
  },
};

const offsets = {
  stackedCard: {
    insetSm: 10,
    insetMd: 18,
    insetLg: 22,
  },
  onboarding: {
    orbTopSm: 40,
    orbTopMd: 60,
    orbBottomSm: 80,
    orbBottomMd: 90,
    orbBottomLg: 120,
    orbLeftSm: -60,
    orbLeftLg: -80,
    orbRightSm: -80,
    orbRightLg: -90,
    orbRightMd: -70,
  },
  glow: {
    top: -80,
    rightLg: -120,
    rightSm: -80,
    leftLg: -120,
    bottomLg: -120,
  },
  lesson: {
    processLineLeft: 9,
  },
  translate: {
    sm: -10,
    lg: -190,
  },
};

const shadows = {
  stackedCard: {
    opacity: 0.22,
    radius: 16,
    offsetX: 0,
    offsetY: 10,
    elevation: 6,
  },
};

const transforms = {
  scalePressed: 0.99,
  scalePressedStrong: 0.96,
};

export const createComponents = (colors) => ({
  radius,
  borderWidth,
  opacity,
  sizes,
  offsets,
  shadows,
  transforms,
  layout,
  screen: {
    safeArea: {
      paddingTop: layout.safeArea.top,
      paddingBottom: layout.safeArea.bottom,
      paddingLeft: layout.safeArea.left,
      paddingRight: layout.safeArea.right,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background.app,
      paddingTop: layout.safeArea.top,
      paddingBottom: layout.safeArea.bottom,
      paddingLeft: layout.safeArea.left,
      paddingRight: layout.safeArea.right,
    },
  },
  button: {
    base: {
      borderRadius: radius.button,
      paddingVertical: layout.spacing.lg,
      paddingHorizontal: layout.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: {
      backgroundColor: colors.accent.primary,
    },
    secondary: {
      backgroundColor: colors.background.surface,
      borderWidth: borderWidth.thin,
      borderColor: colors.ui.border,
    },
    label: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
    },
    labelOnAccent: {
      ...typography.styles.bodyStrong,
      color: colors.text.onAccent,
    },
    disabled: {
      opacity: opacity.value55,
    },
  },
  card: {
    base: {
      backgroundColor: colors.background.surface,
      borderRadius: radius.card,
      padding: layout.spacing.lg,
      gap: layout.spacing.md,
    },
    title: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    body: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    supporting: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  },
  input: {
    container: {
      borderRadius: radius.input,
      paddingVertical: layout.spacing.md,
      paddingHorizontal: layout.spacing.lg,
      backgroundColor: colors.background.surfaceActive,
      borderWidth: borderWidth.thin,
      borderColor: colors.ui.border,
      minHeight: sizes.input.minHeight,
    },
    multiline: {
      minHeight: sizes.input.multilineMinHeight,
    },
    text: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    label: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    helper: {
      ...typography.styles.meta,
      color: colors.text.secondary,
    },
  },
  list: {
    row: {
      paddingVertical: layout.spacing.md,
      gap: layout.spacing.sm,
    },
    divider: {
      borderBottomWidth: borderWidth.thin,
      borderBottomColor: colors.ui.divider,
    },
    headerText: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    itemTitle: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    itemSubtext: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  },
});
