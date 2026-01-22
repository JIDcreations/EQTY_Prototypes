import React, { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/Card';
import BottomSheet from '../components/BottomSheet';
import SectionTitle from '../components/SectionTitle';
import { glossaryTerms } from '../data/glossary';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function GlossaryScreen() {
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
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SectionTitle title="Glossary" subtitle="Quick definitions" />
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search financial terms"
            placeholderTextColor={colors.textSecondary}
            style={styles.searchInput}
          />
          {query.length > 0 ? (
            <Pressable style={styles.clearButton} onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.list}>
          {filteredTerms.length === 0 ? (
            <Text style={styles.emptyText}>No matches. Try a different term.</Text>
          ) : (
            filteredTerms.map((term) => (
              <Pressable key={term.id} onPress={() => handleOpen(term)}>
                <Card style={styles.termCard}>
                  <Text style={styles.termTitle}>{term.term}</Text>
                  <Text style={styles.termDescription}>{term.definition}</Text>
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
          <Text style={styles.sheetLabel}>Definition</Text>
          <Text style={styles.sheetText}>{selectedTerm?.definition}</Text>
        </View>
        <View style={styles.sheetSection}>
          <Text style={styles.sheetLabel}>Example</Text>
          <Text style={styles.sheetText}>{selectedTerm?.example}</Text>
        </View>
        <Pressable style={styles.learnMoreRow} onPress={handleLearnMore}>
          <Ionicons name="logo-youtube" size={18} color={colors.accent} />
          <Text style={styles.learnMoreText}>Learn more on YouTube</Text>
        </Pressable>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.fontFamilyMedium,
    color: colors.textPrimary,
    fontSize: typography.body,
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
    fontFamily: typography.fontFamilyDemi,
    fontSize: typography.h2,
    color: colors.textPrimary,
  },
  termDescription: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textSecondary,
  },
  emptyText: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textSecondary,
  },
  sheetSection: {
    gap: spacing.xs,
  },
  sheetLabel: {
    fontFamily: typography.fontFamilyDemi,
    color: colors.textPrimary,
    fontSize: typography.small,
    letterSpacing: 0.3,
  },
  sheetText: {
    fontFamily: typography.fontFamilyMedium,
    color: colors.textSecondary,
    fontSize: typography.body,
  },
  learnMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  learnMoreText: {
    fontFamily: typography.fontFamilyDemi,
    color: colors.accent,
    fontSize: typography.body,
  },
});
