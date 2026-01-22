import React, { useContext, useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { glossaryTerms } from '../data/glossary';
import { colors } from '../theme/colors';
import { GlossaryContext } from './GlossaryProvider';

const glossaryIndex = buildGlossaryIndex(glossaryTerms);

function buildGlossaryIndex(terms) {
  const escapedTerms = terms
    .map((item) => item.term?.trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp);

  if (escapedTerms.length === 0) {
    return { regex: null, map: {} };
  }

  return {
    regex: new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi'),
    map: terms.reduce((acc, item) => {
      if (item.term) acc[item.term.toLowerCase()] = item;
      return acc;
    }, {}),
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function GlossaryText({
  text,
  children,
  style,
  termStyle,
  onPressTerm,
  ...textProps
}) {
  const glossary = useContext(GlossaryContext);
  const content = text ?? children;
  const resolvedText = typeof content === 'number' ? String(content) : content;
  const parts = useMemo(() => {
    if (!resolvedText || typeof resolvedText !== 'string' || !glossaryIndex.regex) {
      return [{ text: resolvedText }];
    }
    return resolvedText.split(glossaryIndex.regex).map((part) => {
      const term = glossaryIndex.map[part.toLowerCase()];
      return term ? { text: part, term } : { text: part };
    });
  }, [resolvedText]);

  const handlePress = onPressTerm || glossary?.openTerm;

  return (
    <Text style={style} {...textProps}>
      {parts.map((part, index) => {
        if (!part.term) return part.text;
        return (
          <Text
            key={`${part.text}-${index}`}
            style={[styles.term, termStyle]}
            onPress={(event) => {
              if (!handlePress) return;
              if (event?.stopPropagation) event.stopPropagation();
              handlePress(part.term);
            }}
          >
            {part.text}
          </Text>
        );
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  term: {
    color: colors.accent,
    textDecorationLine: 'underline',
  },
});
