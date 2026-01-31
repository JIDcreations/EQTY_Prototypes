const fonts = {
  filsonBold: 'FilsonPro-Bold',
  interRegular: 'Inter-Regular',
  interMedium: 'Inter-Medium',
  interSemiBold: 'Inter-SemiBold',
};

export const typography = {
  fonts,
  styles: {
    display: {
      fontFamily: fonts.filsonBold,
      fontSize: 32,
      lineHeight: 40,
    },
    h1: {
      fontFamily: fonts.filsonBold,
      fontSize: 26,
      lineHeight: 32,
    },
    h2: {
      fontFamily: fonts.interSemiBold,
      fontSize: 22,
      lineHeight: 28,
    },
    h3: {
      fontFamily: fonts.interSemiBold,
      fontSize: 20,
      lineHeight: 28,
    },
    body: {
      fontFamily: fonts.interRegular,
      fontSize: 16,
      lineHeight: 24,
    },
    bodyStrong: {
      fontFamily: fonts.interSemiBold,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0,
    },
    small: {
      fontFamily: fonts.interMedium,
      fontSize: 14,
      lineHeight: 20,
    },
    meta: {
      fontFamily: fonts.interRegular,
      fontSize: 14,
      lineHeight: 20,
    },
    stepLabel: {
      fontFamily: fonts.filsonBold,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 1.2,
      textTransform: 'uppercase' as const,
    },
  },
};
