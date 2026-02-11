import React, { useContext, useMemo } from 'react';
import AppText from './AppText';
import GlossaryTerm from './GlossaryTerm';
import { GlossaryContext } from './GlossaryProvider';
import { glossaryIndex, normalizeGlossarySegments, splitGlossaryText } from '../utils/glossary';

export default function GlossaryText({
  text,
  children,
  segments,
  style,
  termStyle,
  onPressTerm,
  ...textProps
}) {
  const glossary = useContext(GlossaryContext);
  const content = segments ?? text ?? children;
  const resolvedText = typeof content === 'number' ? String(content) : content;
  const parts = useMemo(() => {
    if (Array.isArray(resolvedText)) {
      return normalizeGlossarySegments(resolvedText, glossaryIndex);
    }
    if (typeof resolvedText !== 'string') {
      return [{ text: resolvedText }];
    }
    return splitGlossaryText(resolvedText, glossaryIndex);
  }, [resolvedText]);

  const handlePress = onPressTerm || glossary?.openTerm;

  return (
    <AppText style={style} {...textProps}>
      {parts.map((part, index) => {
        if (!part.term) return part.text;
        return (
          <GlossaryTerm
            key={`${part.text}-${index}`}
            term={part.term}
            text={part.text}
            style={termStyle}
            onPressTerm={handlePress}
          />
        );
      })}
    </AppText>
  );
}
