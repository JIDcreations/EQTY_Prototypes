import React, { createContext, useCallback, useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from './BottomSheet';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export const GlossaryContext = createContext(null);

export function GlossaryProvider({ children }) {
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
          <Text style={styles.sheetLabel}>Definition</Text>
          <Text style={styles.sheetText}>{activeTerm?.definition}</Text>
        </View>
        {activeTerm?.example ? (
          <View style={styles.glossarySection}>
            <Text style={styles.sheetLabel}>Example</Text>
            <Text style={styles.sheetText}>{activeTerm?.example}</Text>
          </View>
        ) : null}
        {activeTerm?.learnMoreUrl ? (
          <View style={styles.glossarySection}>
            <Text style={styles.sheetLabel}>Learn more</Text>
            <Pressable style={styles.learnMoreRow} onPress={handleLearnMore}>
              <Ionicons name="logo-youtube" size={18} color={colors.accent} />
              <Text style={styles.learnMoreText}>Learn more on YouTube</Text>
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

const styles = StyleSheet.create({
  sheetText: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
    lineHeight: 22,
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
