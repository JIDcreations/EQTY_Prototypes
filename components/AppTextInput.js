import React, { useMemo } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { useApp } from '../utils/AppContext';
import { typography } from '../theme';

function scaleTextStyle(style, scale) {
  const flattened = StyleSheet.flatten(style);
  if (!flattened) return style;
  const next = { ...flattened };
  if (typeof flattened.fontSize === 'number') {
    next.fontSize = Math.round(flattened.fontSize * scale);
  }
  if (typeof flattened.lineHeight === 'number') {
    next.lineHeight = Math.round(flattened.lineHeight * scale);
  }
  return next;
}

export default function AppTextInput({ style, ...props }) {
  const { textScale } = useApp();
  const scaledStyle = useMemo(
    () =>
      scaleTextStyle(
        [
          typography.styles.body,
          style,
        ],
        textScale || 1
      ),
    [style, textScale]
  );

  return <TextInput style={scaledStyle} {...props} />;
}
