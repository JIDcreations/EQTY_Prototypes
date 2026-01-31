import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../components/AppText';
import Card from '../components/Card';
import SettingsHeader from '../components/SettingsHeader';
import Toast from '../components/Toast';
import { spacing, typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import { getLanguageOptions, getSettingsCopy } from '../utils/localization';
import useToast from '../utils/useToast';

export default function LanguageScreen({ navigation }) {
  const { preferences, updatePreferences } = useApp();
  const { colors, components } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const toast = useToast();
  const options = useMemo(
    () => getLanguageOptions(preferences?.language),
    [preferences?.language]
  );
  const settingsCopy = useMemo(
    () => getSettingsCopy(preferences?.language),
    [preferences?.language]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <SettingsHeader title={settingsCopy.languageTitle} onBack={() => navigation.goBack()} />
        <Card style={styles.card}>
          {options.map((option, index) => {
            const isActive = preferences?.language === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => {
                  updatePreferences({ language: option.value });
                  toast.show(settingsCopy.saved);
                }}
                style={[styles.row, index !== options.length - 1 && styles.rowDivider]}
              >
                <View style={styles.rowLeft}>
                  <View style={[styles.radio, isActive && styles.radioActive]}>
                    {isActive ? <View style={styles.radioDot} /> : null}
                  </View>
                  <AppText style={styles.rowLabel}>{option.label}</AppText>
                </View>
                {isActive ? (
                  <AppText style={styles.activeLabel}>{settingsCopy.selected}</AppText>
                ) : null}
              </Pressable>
            );
          })}
        </Card>
      </ScrollView>
      <Toast message={toast.message} visible={toast.visible} onHide={toast.hide} />
    </SafeAreaView>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background.app,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background.app,
    },
    content: {
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingTop: spacing.lg,
      gap: components.layout.contentGap,
      paddingBottom: spacing.none,
    },
    card: {
      paddingVertical: spacing.xs,
    },
    row: {
      ...components.list.row,
      paddingHorizontal: spacing.lg,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    rowDivider: {
      borderBottomWidth: components.borderWidth.thin,
      borderBottomColor: colors.ui.divider,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    rowLabel: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    activeLabel: {
      ...typography.styles.small,
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
  });
