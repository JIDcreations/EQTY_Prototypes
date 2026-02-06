import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import OnboardingScreen from '../components/OnboardingScreen';
import SettingsStackedCard from '../components/SettingsStackedCard';
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

  const renderTextSizeOption = (option, index) => {
    const isActive = preferences?.textSize === option.value;
    return (
      <Pressable
        key={option.value}
        onPress={() => {
          updatePreferences({ textSize: option.value });
          toast.show('Saved');
        }}
        style={[styles.textSizeRow, index !== TEXT_SIZE_OPTIONS.length - 1 && styles.rowDivider]}
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
        <SettingsStackedCard contentStyle={styles.cardContent}>
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
        </SettingsStackedCard>
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
    cardContent: {
      gap: components.layout.cardGap,
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
      borderRadius: components.radius.card,
      overflow: 'hidden',
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.text.primary, components.opacity.value20),
    },
    textSizeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...components.list.row,
      paddingHorizontal: components.layout.spacing.lg,
      backgroundColor: toRgba(colors.background.surfaceActive, components.opacity.value90),
    },
    rowDivider: {
      borderBottomWidth: components.borderWidth.thin,
      borderBottomColor: toRgba(colors.text.primary, components.opacity.value20),
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
      borderColor: colors.text.secondary,
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
      backgroundColor: colors.background.surfaceActive,
      padding: components.layout.spacing.md,
      borderRadius: components.radius.card,
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
