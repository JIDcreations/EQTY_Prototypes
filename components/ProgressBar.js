import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

export default function ProgressBar({ progress }) {
  const width = Math.min(1, Math.max(0, progress)) * 100;
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${width}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 8,
    backgroundColor: colors.surfaceActive,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
});
