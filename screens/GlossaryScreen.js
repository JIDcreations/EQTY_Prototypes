import React, { useMemo, useRef, useState, useCallback } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import BottomSheet from '../components/BottomSheet';
import Card from '../components/Card';
import OnboardingScreen from '../components/OnboardingScreen';
import SectionTitle from '../components/SectionTitle';
import { glossaryCategories, glossaryTerms } from '../data/glossary';
import { typography, useTheme } from '../theme';

export default function GlossaryScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const [query, setQuery] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortAz, setSortAz] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef(null);

  const scopedTermIds =
    route?.params?.termIds ||
    route?.params?.lessonTermIds ||
    route?.params?.terms ||
    null;

  const categoriesById = useMemo(() => {
    return glossaryCategories.reduce((acc, category) => {
      acc[category.id] = category;
      return acc;
    }, {});
  }, [glossaryCategories]);

  const scopedTerms = useMemo(() => {
    if (!Array.isArray(scopedTermIds) || scopedTermIds.length === 0) {
      return glossaryTerms;
    }
    const normalizedIds = scopedTermIds
      .map((value) => (typeof value === 'string' ? value.toLowerCase() : value))
      .filter(Boolean);
    const idSet = new Set(normalizedIds);
    return glossaryTerms.filter((term) => {
      const termId = term.id?.toLowerCase();
      const termLabel = term.term?.toLowerCase();
      return idSet.has(termId) || idSet.has(termLabel);
    });
  }, [scopedTermIds]);

  const activeCategories = useMemo(() => {
    return glossaryCategories.filter((category) =>
      scopedTerms.some((term) => term.categoryId === category.id)
    );
  }, [glossaryCategories, scopedTerms]);

  const normalizedQuery = query.trim().toLowerCase();
  const searchedTerms = useMemo(() => {
    if (!normalizedQuery) return scopedTerms;
    return scopedTerms.filter((item) => {
      const category = categoriesById[item.categoryId];
      const haystack = [
        item.term,
        item.definition,
        item.example,
        ...(item.tags || []),
        ...(item.aliases || []),
        category?.title,
        category?.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [categoriesById, normalizedQuery, scopedTerms]);

  const filteredTerms = useMemo(() => {
    if (activeCategory === 'all') return searchedTerms;
    return searchedTerms.filter((term) => term.categoryId === activeCategory);
  }, [activeCategory, searchedTerms]);

  const displayTerms = useMemo(() => {
    if (!sortAz) return filteredTerms;
    return [...filteredTerms].sort((a, b) => a.term.localeCompare(b.term));
  }, [filteredTerms, sortAz]);

  const listTitle =
    activeCategory === 'all'
      ? 'All terms'
      : categoriesById[activeCategory]?.title || 'Terms';

  const handleScroll = useCallback(
    (event) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      setShowScrollTop(offsetY > components.layout.spacing.xxl);
    },
    [components.layout.spacing.xxl]
  );

  const handleScrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const getVideoUrl = (term) => {
    if (!term?.term) return null;
    return (
      term.learnMoreUrl ||
      `https://www.youtube.com/results?search_query=${encodeURIComponent(
        `${term.term} investing explained`
      )}`
    );
  };

  const handleLearnMore = async () => {
    const videoUrl = getVideoUrl(selectedTerm);
    if (!videoUrl) return;
    await Linking.openURL(videoUrl);
  };

  const renderTermRow = (term, index, total) => (
    <Pressable
      key={term.id}
      onPress={() => setSelectedTerm(term)}
      style={[
        styles.termRow,
        index < total - 1 && styles.termDivider,
      ]}
    >
      <View style={styles.termRowTop}>
        <AppText style={styles.termTitle}>{term.term}</AppText>
        <Ionicons
          name="chevron-forward"
          size={components.sizes.icon.sm}
          color={colors.text.secondary}
        />
      </View>
      <AppText style={styles.termDescription} numberOfLines={1}>
        {term.definition}
      </AppText>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <OnboardingScreen
        backgroundVariant="bg3"
        contentContainerStyle={styles.screen}
      >
        <View style={styles.fixedHeader}>
          <View style={styles.headerSection}>
            <View style={styles.headerRow}>
              <SectionTitle
                title="Glossary"
                subtitle="Find terms fast without leaving your flow."
              />
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
          </View>

          <View style={styles.stickyControls}>
            <View style={styles.searchGroup}>
              <AppText style={styles.searchLabel}>Search glossary</AppText>
              <View style={styles.searchBar}>
                <Ionicons
                  name="search"
                  size={components.sizes.icon.md}
                  color={colors.text.secondary}
                />
                <AppTextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search terms, tags, or categories"
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
            </View>
            <View style={styles.chipRow}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScrollContent}
                style={styles.filterScroll}
              >
                <Pressable
                  onPress={() => setActiveCategory('all')}
                  style={({ pressed }) => [
                    styles.filterChip,
                    activeCategory === 'all' && styles.filterChipActive,
                    pressed && styles.filterChipPressed,
                  ]}
                >
                  <AppText
                    style={[
                      styles.filterChipText,
                      activeCategory === 'all' && styles.filterChipTextActive,
                    ]}
                  >
                    All
                  </AppText>
                </Pressable>
                {activeCategories.map((category) => {
                  const isActive = activeCategory === category.id;
                  return (
                    <Pressable
                      key={category.id}
                      onPress={() => setActiveCategory(category.id)}
                      style={({ pressed }) => [
                        styles.filterChip,
                        isActive && styles.filterChipActive,
                        pressed && styles.filterChipPressed,
                      ]}
                    >
                      <AppText
                        style={[
                          styles.filterChipText,
                          isActive && styles.filterChipTextActive,
                        ]}
                      >
                        {category.title}
                      </AppText>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.termsBlock}>
            <View style={styles.sortTextRow}>
              <Pressable onPress={() => setSortAz((prev) => !prev)}>
                <View style={styles.sortTextInner}>
                  <Ionicons
                    name="swap-vertical"
                    size={components.sizes.icon.xs}
                    color={sortAz ? colors.text.primary : colors.text.secondary}
                  />
                  <AppText
                    style={[styles.sortText, sortAz && styles.sortTextActive]}
                  >
                    A-Z
                  </AppText>
                </View>
              </Pressable>
            </View>
            <Card style={styles.termsCard}>
              <View style={styles.termsHeader}>
                <AppText style={styles.termsTitle}>{listTitle}</AppText>
                <AppText style={styles.termsCount}>{displayTerms.length} terms</AppText>
              </View>
              {displayTerms.length === 0 ? (
                <AppText style={styles.emptyText}>No matches. Try another term.</AppText>
              ) : (
                <View style={styles.termList}>
                  {displayTerms.map((term, index) =>
                    renderTermRow(term, index, displayTerms.length)
                  )}
                </View>
              )}
            </Card>
          </View>
        </ScrollView>
      </OnboardingScreen>

      {showScrollTop ? (
        <Pressable
          onPress={handleScrollToTop}
          style={({ pressed }) => [
            styles.scrollTopButton,
            pressed && styles.scrollTopButtonPressed,
          ]}
        >
          <Ionicons
            name="chevron-up"
            size={components.sizes.icon.md}
            color={colors.text.primary}
          />
        </Pressable>
      ) : null}

      <BottomSheet
        visible={!!selectedTerm}
        title={selectedTerm?.term}
        onClose={() => setSelectedTerm(null)}
        scrimOpacity={0}
      >
        <View style={styles.sheetSection}>
          <AppText style={styles.sheetLabel}>Definition</AppText>
          <AppText style={styles.sheetDefinition}>{selectedTerm?.definition}</AppText>
        </View>
        <View style={styles.sheetSection}>
          <AppText style={styles.sheetLabel}>Example</AppText>
          <AppText style={styles.sheetExample}>{selectedTerm?.example}</AppText>
        </View>
        {selectedTerm?.term ? (
          <Pressable style={styles.learnMoreRow} onPress={handleLearnMore}>
            <Ionicons
              name="play-circle-outline"
              size={components.sizes.icon.sm}
              color={colors.text.secondary}
            />
            <AppText style={styles.learnMoreText}>Watch 2-minute video</AppText>
          </Pressable>
        ) : null}
      </BottomSheet>
    </View>
  );
}

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const createStyles = (colors, components) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.app,
    },
    screen: {
      flex: 1,
      paddingTop: 0,
      paddingBottom: 0,
      paddingHorizontal: 0,
    },
    fixedHeader: {
      gap: components.layout.spacing.lg,
      paddingTop: components.layout.spacing.xl,
      paddingHorizontal: components.layout.pagePaddingHorizontal,
    },
    headerSection: {},
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
      borderColor: toRgba(colors.ui.divider, components.opacity.value35),
      backgroundColor: toRgba(colors.background.surface, components.opacity.value60),
    },
    stickyControls: {
      gap: components.layout.spacing.md,
    },
    searchGroup: {
      gap: components.layout.spacing.xs,
    },
    searchLabel: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: toRgba(colors.background.surface, components.opacity.value60),
      borderRadius: components.radius.input,
      paddingHorizontal: components.layout.spacing.lg,
      paddingVertical: components.layout.spacing.md,
      gap: components.layout.spacing.sm,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, components.opacity.value45),
    },
    searchInput: {
      flex: 1,
      ...components.input.text,
    },
    clearButton: {
      padding: components.layout.spacing.xs,
    },
    chipRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    filterScroll: {
      flex: 1,
      marginHorizontal: -components.layout.pagePaddingHorizontal,
    },
    filterScrollContent: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      gap: components.layout.spacing.xs,
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingRight: components.layout.pagePaddingHorizontal + components.layout.spacing.sm,
    },
    filterChip: {
      paddingHorizontal: components.layout.spacing.md,
      paddingVertical: components.layout.spacing.xs,
      borderRadius: components.radius.pill,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, components.opacity.value45),
      backgroundColor: toRgba(colors.background.surfaceActive, components.opacity.value80),
    },
    filterChipActive: {
      backgroundColor: colors.accent.primary,
      borderColor: toRgba(colors.text.onAccent, components.opacity.value20),
    },
    filterChipPressed: {
      opacity: components.opacity.value90,
    },
    filterChipText: {
      ...typography.styles.small,
      color: colors.text.primary,
    },
    filterChipTextActive: {
      color: colors.text.onAccent,
    },
    scroll: {
      flex: 1,
      marginBottom:
        -(components.layout.spacing.xxl * 2 + components.layout.safeArea.bottom),
    },
    scrollContent: {
      paddingTop: components.layout.spacing.md,
      paddingBottom: components.layout.spacing.none,
      paddingHorizontal: components.layout.pagePaddingHorizontal,
    },
    termsBlock: {
      gap: components.layout.spacing.sm,
    },
    sortTextRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    sortTextInner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.xs,
    },
    sortText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    sortTextActive: {
      color: colors.text.primary,
    },
    termsCard: {
      ...components.card.base,
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, components.opacity.value45),
      backgroundColor: toRgba(colors.background.surface, components.opacity.value80),
      gap: components.layout.spacing.md,
    },
    termsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.md,
    },
    termsTitle: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    termsCount: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    emptyText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    termList: {
      gap: 0,
    },
    termRow: {
      ...components.list.row,
      paddingVertical: components.layout.spacing.md,
    },
    termDivider: {
      borderBottomWidth: components.borderWidth.thin,
      borderBottomColor: toRgba(colors.ui.divider, components.opacity.value45),
    },
    termRowTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: components.layout.spacing.sm,
    },
    termTitle: {
      ...typography.styles.bodyStrong,
      color: colors.text.primary,
      flex: 1,
    },
    termDescription: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    scrollTopButton: {
      position: 'absolute',
      right: components.layout.spacing.lg,
      bottom: components.layout.safeArea.bottom + components.layout.spacing.xxl,
      width: components.sizes.square.md,
      height: components.sizes.square.md,
      borderRadius: components.radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: components.borderWidth.thin,
      borderColor: toRgba(colors.ui.divider, components.opacity.value45),
      backgroundColor: toRgba(colors.background.surfaceActive, components.opacity.value90),
    },
    scrollTopButtonPressed: {
      opacity: components.opacity.value80,
    },
    sheetSection: {
      gap: components.layout.spacing.xs,
    },
    sheetLabel: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    sheetDefinition: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    sheetExample: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
    learnMoreRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: components.layout.spacing.sm,
      paddingTop: components.layout.spacing.sm,
    },
    learnMoreText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  });
