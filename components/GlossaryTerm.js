import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import AppText from './AppText';
import { useGlossary } from './GlossaryProvider';
import { useTheme } from '../theme';

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
      style={[styles.term, style]}
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
      color: colors.text.primary,
      textDecorationLine: 'underline',
      textDecorationStyle: 'dotted',
      textDecorationColor: colors.accent.primary,
    },
  });
