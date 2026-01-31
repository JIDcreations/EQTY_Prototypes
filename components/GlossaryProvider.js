import React, { createContext, useCallback, useMemo, useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from './BottomSheet';
import { spacing, typography, useTheme } from '../theme';
import AppText from './AppText';

export const GlossaryContext = createContext(null);

export function GlossaryProvider({ children }) {
  const { colors, components } = useTheme();
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
              <Ionicons
                name="logo-youtube"
                size={components.sizes.icon.md}
                color={colors.accent.primary}
              />
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
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    sheetLabel: {
      ...typography.styles.small,
      color: colors.text.primary,
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
      ...typography.styles.body,
      color: colors.text.primary,
    },
  });
