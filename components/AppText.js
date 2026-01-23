import React, { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useApp } from '../utils/AppContext';
import { typography } from '../theme/typography';

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

export default function AppText({ style, children, ...props }) {
  const { textScale } = useApp();
  const scaledStyle = useMemo(
    () =>
      scaleTextStyle(
        [
          {
            fontFamily: typography.fontFamilyBase,
          },
          style,
        ],
        textScale || 1
      ),
    [style, textScale]
  );

  return (
    <Text style={scaledStyle} {...props}>
      {children}
    </Text>
  );
}
