import React, { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import Card from '../components/Card';
import BottomSheet from '../components/BottomSheet';
import SectionTitle from '../components/SectionTitle';
import { glossaryTerms } from '../data/glossary';
import { typography, useTheme } from '../theme';

export default function GlossaryScreen() {
  const navigation = useNavigation();
  const { colors, components } = useTheme();
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
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <SectionTitle title="Glossary" subtitle="Quick definitions" />
          <Pressable
            onPress={() => navigation.navigate('Profile')}
            style={styles.profileButton}
            hitSlop={components.layout.spacing.sm}
          >
            <Ionicons
              name="person-outline"
              size={components.sizes.icon.lg}
              color={colors.text.primary}
            />
          </Pressable>
        </View>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={components.sizes.icon.md}
            color={colors.text.secondary}
          />
          <AppTextInput
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
    </View>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    container: {
      ...components.screen.containerScroll,
      flex: 1,
      backgroundColor: colors.background.app,
    },
    content: {
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingTop: components.layout.safeArea.top + components.layout.spacing.lg,
      gap: components.layout.contentGap,
      paddingBottom: components.layout.safeArea.bottom,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: components.layout.spacing.md,
    },
    profileButton: {
      width: components.sizes.square.lg,
      height: components.sizes.square.lg,
      borderRadius: components.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: components.borderWidth.thin,
      borderColor: colors.ui.divider,
      backgroundColor: colors.background.surface,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background.surface,
      borderRadius: components.radius.input,
      paddingHorizontal: components.layout.spacing.lg,
      paddingVertical: components.layout.spacing.md,
      gap: components.layout.spacing.sm,
    },
    searchInput: {
      flex: 1,
      ...components.input.text,
    },
    clearButton: {
      padding: components.layout.spacing.xs,
    },
    list: {
      gap: components.layout.spacing.md,
    },
    termCard: {
      gap: components.layout.spacing.xs,
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
      gap: components.layout.spacing.xs,
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
      gap: components.layout.spacing.sm,
      paddingTop: components.layout.spacing.xs,
    },
    learnMoreText: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
  });
