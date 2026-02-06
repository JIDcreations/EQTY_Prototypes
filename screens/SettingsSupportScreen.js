import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import OnboardingScreen from '../components/OnboardingScreen';
import SettingsHeader from '../components/SettingsHeader';
import SettingsRow from '../components/SettingsRow';
import { useTheme } from '../theme';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function SettingsSupportScreen({ navigation }) {
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);

  return (
    <OnboardingScreen
      scroll
      backgroundVariant="bg3"
      contentContainerStyle={styles.content}
    >
      <SettingsHeader
        title="Help & support"
        subtitle="Find answers or get in touch"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.section}>
        <SettingsRow
          label="Help center"
          onPress={() => navigation.navigate('HelpCenter')}
          isLast
          containerStyle={styles.rowCard}
        />
        <SettingsRow
          label="Contact support"
          onPress={() => navigation.navigate('ContactSupport')}
          isLast
          containerStyle={styles.rowCard}
        />
        <SettingsRow
          label="FAQ"
          onPress={() => navigation.navigate('FAQ')}
          isLast
          containerStyle={styles.rowCard}
        />
      </View>
    </OnboardingScreen>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    content: {
      paddingBottom: components.layout.safeArea.bottom + components.layout.spacing.xl,
      gap: components.layout.contentGap,
    },
    section: {
      gap: components.layout.spacing.sm,
    },
    rowCard: {
      ...components.input.container,
      backgroundColor: toRgba(colors.background.surface, components.opacity.value40),
      borderColor: toRgba(colors.ui.divider, components.opacity.value35),
    },
  });
