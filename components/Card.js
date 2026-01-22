import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

export default function Card({ children, active = false, style }) {
  return <View style={[styles.card, active && styles.active, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    shadowColor: colors.background,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  active: {
    backgroundColor: colors.surfaceActive,
  },
});
