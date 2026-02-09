import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import OnboardingScreen from '../components/OnboardingScreen';
import SettingsHeader from '../components/SettingsHeader';
import Toast from '../components/Toast';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import useToast from '../utils/useToast';

const TEXT_SIZE_OPTIONS = [
  { label: 'Default', value: 'Default' },
  { label: 'Comfort', value: 'Comfort' },
  { label: 'Large', value: 'Large' },
];

export default function SettingsAccessibilityScreen({ navigation }) {
  const { preferences, updatePreferences } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const toast = useToast();

  const renderTextSizeOption = (option) => {
    const isActive = preferences?.textSize === option.value;
    return (
      <Pressable
        key={option.value}
        onPress={() => {
          updatePreferences({ textSize: option.value });
          toast.show('Saved');
        }}
        style={styles.textSizeRow}
      >
        <View style={styles.textSizeLeft}>
          <View style={[styles.radio, isActive && styles.radioActive]}>
            {isActive ? <View style={styles.radioDot} /> : null}
          </View>
          <AppText style={styles.textSizeLabel}>{option.label}</AppText>
        </View>
        <AppText
          style={[
            styles.textSizeSample,
            option.value === 'Comfort' && styles.textSizeSampleComfort,
            option.value === 'Large' && styles.textSizeSampleLarge,
          ]}
        >
          Aa
        </AppText>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <OnboardingScreen
        scroll
        backgroundVariant="bg3"
        contentContainerStyle={styles.content}
      >
        <SettingsHeader
          title="Accessibility"
          subtitle="Adjust text size for better readability"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.section}>
          <View style={styles.textSizeHeader}>
            <AppText style={styles.cardTitle}>Text size</AppText>
            <AppText style={styles.cardSubtitle}>
              Adjust text size for better readability
            </AppText>
          </View>
          <View style={styles.textSizeList}>{TEXT_SIZE_OPTIONS.map(renderTextSizeOption)}</View>
          <View style={styles.previewCard}>
            <AppText style={styles.previewTitle}>Preview</AppText>
            <AppText style={styles.previewText}>
              Investing is a long-term journey. Adjust the text size to match your comfort.
            </AppText>
          </View>
        </View>
      </OnboardingScreen>
      <Toast message={toast.message} visible={toast.visible} onHide={toast.hide} />
    </View>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingBottom: components.layout.safeArea.bottom + components.layout.spacing.xl,
      gap: components.layout.contentGap,
    },
    section: {
      gap: components.layout.spacing.lg,
    },
    cardTitle: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    cardSubtitle: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    textSizeHeader: {
      gap: components.layout.spacing.xs,
    },
    textSizeList: {
      gap: components.layout.spacing.sm,
    },
    textSizeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...components.input.container,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    textSizeLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
    },
    textSizeLabel: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    textSizeSample: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    textSizeSampleComfort: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    textSizeSampleLarge: {
      ...typography.styles.h2,
      color: colors.text.secondary,
    },
    radio: {
      width: components.sizes.track.sm,
      height: components.sizes.track.sm,
      borderRadius: components.radius.pill,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioActive: {
      borderColor: colors.accent.primary,
    },
    radioDot: {
      width: components.sizes.dot.sm,
      height: components.sizes.dot.sm,
      borderRadius: components.radius.pill,
      backgroundColor: colors.accent.primary,
    },
    previewCard: {
      ...components.input.container,
      backgroundColor: toRgba(colors.background.surface, colors.opacity.surface),
      borderColor: toRgba(colors.ui.divider, colors.opacity.stroke),
      gap: components.layout.spacing.xs,
    },
    previewTitle: {
      ...typography.styles.small,
      color: colors.text.primary,
    },
    previewText: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
  });

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
