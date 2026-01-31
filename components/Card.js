import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme';

export default function Card({ children, active = false, style }) {
  const { components } = useTheme();
  const styles = useMemo(() => createStyles(components), [components]);
  return <View style={[styles.card, style]}>{children}</View>;
}

const createStyles = (components) =>
  StyleSheet.create({
    card: {
      ...components.card.base,
    },
  });
