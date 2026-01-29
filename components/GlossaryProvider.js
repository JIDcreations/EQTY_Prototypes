import React, { createContext, useCallback, useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from './BottomSheet';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import AppText from './AppText';
import useThemeColors from '../theme/useTheme';

export const GlossaryContext = createContext(null);

export function GlossaryProvider({ children }) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [activeTerm, setActiveTerm] = useState(null);

  const openTerm = useCallback((term) => {
    if (!term) return;
    setActiveTerm(term);
  }, []);

  const closeTerm = useCallback(() => {
    setActiveTerm(null);
  }, []);

  const handleLearnMore = useCallback(async () => {
    if (!activeTerm?.learnMoreUrl) return;
    await Linking.openURL(activeTerm.learnMoreUrl);
  }, [activeTerm]);


  const value = useMemo(
    () => ({
      openTerm,
    }),
    [openTerm]
  );

  return (
    <GlossaryContext.Provider value={value}>
      {children}
      <BottomSheet visible={!!activeTerm} onClose={closeTerm} title={activeTerm?.term}>
        <View style={styles.glossarySection}>
          <AppText style={styles.sheetLabel}>Definition</AppText>
          <AppText style={styles.sheetText}>{activeTerm?.definition}</AppText>
        </View>
        {activeTerm?.example ? (
          <View style={styles.glossarySection}>
            <AppText style={styles.sheetLabel}>Example</AppText>
            <AppText style={styles.sheetText}>{activeTerm?.example}</AppText>
          </View>
        ) : null}
        {activeTerm?.learnMoreUrl ? (
          <View style={styles.glossarySection}>
            <AppText style={styles.sheetLabel}>Learn more</AppText>
            <Pressable style={styles.learnMoreRow} onPress={handleLearnMore}>
              <Ionicons name="logo-youtube" size={18} color={colors.accent} />
              <AppText style={styles.learnMoreText}>Learn more on YouTube</AppText>
            </Pressable>
          </View>
        ) : null}
      </BottomSheet>
    </GlossaryContext.Provider>
  );
}

export function useGlossary() {
  return React.useContext(GlossaryContext);
}

const createStyles = (colors) =>
  StyleSheet.create({
    sheetText: {
      fontFamily: typography.fontFamilyMedium,
      color: colors.textSecondary,
      fontSize: typography.body,
      lineHeight: 24,
    },
    sheetLabel: {
      fontFamily: typography.fontFamilyDemi,
      color: colors.textPrimary,
      fontSize: typography.small,
      letterSpacing: 0.3,
    },
    glossarySection: {
      gap: spacing.xs,
    },
    learnMoreRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingTop: spacing.xs,
    },
    learnMoreText: {
      fontFamily: typography.fontFamilyDemi,
      color: colors.accent,
      fontSize: typography.body,
    },
  });
