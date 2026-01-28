import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../components/AppText';
import Card from '../components/Card';
import SettingsHeader from '../components/SettingsHeader';
import Toast from '../components/Toast';
import useThemeColors from '../theme/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../utils/AppContext';
import { getLanguageOptions, getSettingsCopy } from '../utils/localization';
import useToast from '../utils/useToast';

export default function LanguageScreen({ navigation }) {
  const { preferences, updatePreferences } = useApp();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
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
        contentContainerStyle={styles.content}
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

const createStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: spacing.lg,
      gap: spacing.lg,
      paddingBottom: spacing.xxxl,
    },
    card: {
      paddingVertical: spacing.xs,
    },
    row: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    rowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    rowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    rowLabel: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
      color: colors.textPrimary,
    },
    activeLabel: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
    },
    radio: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 1,
      borderColor: colors.textSecondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioActive: {
      borderColor: colors.accent,
    },
    radioDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.accent,
    },
  });
