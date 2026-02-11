import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import AppText from './AppText';
import { useGlossary } from './GlossaryProvider';
import { useTheme } from '../theme';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function GlossaryTerm({
  term,
  text,
  style,
  onPressTerm,
  accessibilityLabel,
  ...textProps
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const glossary = useGlossary();
  const handlePress = onPressTerm || glossary?.openTerm;
  const label = text ?? term?.term ?? '';
  const a11yLabel = accessibilityLabel || (term?.term ? `Open glossary term: ${term.term}` : undefined);

  return (
    <AppText
      {...textProps}
      style={[style, styles.term]}
      onPress={(event) => {
        if (!term || !handlePress) return;
        if (event?.stopPropagation) event.stopPropagation();
        handlePress(term);
      }}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
    >
      {label}
    </AppText>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    term: {
      color: colors.accent.primary,
      textDecorationLine: 'underline',
      textDecorationStyle: 'solid',
      textDecorationColor: toRgba(colors.accent.primary, colors.opacity.stroke),
    },
  });
