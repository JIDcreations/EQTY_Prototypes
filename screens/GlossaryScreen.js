import React, { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../components/AppText';
import Card from '../components/Card';
import BottomSheet from '../components/BottomSheet';
import SectionTitle from '../components/SectionTitle';
import { glossaryTerms } from '../data/glossary';
import { spacing, typography, useTheme } from '../theme';

export default function GlossaryScreen() {
  const { colors, components } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const [query, setQuery] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(null);

  const filteredTerms = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return glossaryTerms;
    return glossaryTerms.filter((item) => {
      const haystack = [
        item.term,
        item.definition,
        item.simple,
        item.advanced,
        item.example,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query]);

  const handleOpen = (term) => {
    setSelectedTerm(term);
  };

  const handleLearnMore = async () => {
    if (!selectedTerm?.learnMoreUrl) return;
    await Linking.openURL(selectedTerm.learnMoreUrl);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SectionTitle title="Glossary" subtitle="Quick definitions" />
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={components.sizes.icon.md}
            color={colors.text.secondary}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search financial terms"
            placeholderTextColor={colors.text.secondary}
            style={styles.searchInput}
          />
          {query.length > 0 ? (
            <Pressable style={styles.clearButton} onPress={() => setQuery('')}>
              <Ionicons
                name="close-circle"
                size={components.sizes.icon.md}
                color={colors.text.secondary}
              />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.list}>
          {filteredTerms.length === 0 ? (
            <AppText style={styles.emptyText}>No matches. Try a different term.</AppText>
          ) : (
            filteredTerms.map((term) => (
              <Pressable key={term.id} onPress={() => handleOpen(term)}>
                <Card style={styles.termCard}>
                  <AppText style={styles.termTitle}>{term.term}</AppText>
                  <AppText style={styles.termDescription}>{term.definition}</AppText>
                </Card>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>

      <BottomSheet
        visible={!!selectedTerm}
        title={selectedTerm?.term}
        onClose={() => setSelectedTerm(null)}
      >
        <View style={styles.sheetSection}>
          <AppText style={styles.sheetLabel}>Definition</AppText>
          <AppText style={styles.sheetText}>{selectedTerm?.definition}</AppText>
        </View>
        <View style={styles.sheetSection}>
          <AppText style={styles.sheetLabel}>Example</AppText>
          <AppText style={styles.sheetText}>{selectedTerm?.example}</AppText>
        </View>
        {selectedTerm?.learnMoreUrl ? (
          <View style={styles.sheetSection}>
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
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background.surface,
      borderRadius: components.radius.input,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      gap: spacing.sm,
    },
    searchInput: {
      flex: 1,
      ...components.input.text,
    },
    clearButton: {
      padding: spacing.xs,
    },
    list: {
      gap: spacing.md,
    },
    termCard: {
      gap: spacing.xs,
    },
    termTitle: {
      ...typography.styles.h2,
      color: colors.text.primary,
    },
    termDescription: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    emptyText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    sheetSection: {
      gap: spacing.xs,
    },
    sheetLabel: {
      ...typography.styles.small,
      color: colors.text.primary,
    },
    sheetText: {
      ...typography.styles.body,
      color: colors.text.secondary,
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
