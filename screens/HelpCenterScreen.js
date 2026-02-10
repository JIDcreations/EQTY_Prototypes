import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import { SecondaryButton } from '../components/Button';
import Card from '../components/Card';
import SettingsHeader from '../components/SettingsHeader';
import { typography, useTheme } from '../theme';

const HELP_TOPICS = [
  {
    title: 'Getting started',
    description: 'Set up your profile, choose a goal, and begin your first lesson.',
  },
  {
    title: 'Lessons and progress',
    description: 'How lessons work, what is tracked, and how to pick the next step.',
  },
  {
    title: 'Account and security',
    description: 'Update your email, reset passwords, and manage access.',
  },
  {
    title: 'Troubleshooting',
    description: 'Fix loading issues, missing progress, or sync delays.',
  },
];

const GUIDE_ITEMS = [
  {
    title: 'Reset your password',
    description: 'Head to Settings > Account to reset your credentials.',
  },
  {
    title: 'Update profile details',
    description: 'Keep your learning context and goals up to date.',
  },
  {
    title: 'Track lesson progress',
    description: 'See completed lessons and what is coming up next.',
  },
  {
    title: 'Review your notes',
    description: 'Return to lesson summaries for quick refreshers.',
  },
  {
    title: 'Adjust text size',
    description: 'Increase readability from the accessibility settings.',
  },
];

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function HelpCenterScreen({ navigation }) {
  const { colors, components } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight),
    [colors, components, tabBarHeight]
  );
  const [query, setQuery] = useState('');
  const filteredGuides = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return GUIDE_ITEMS;
    return GUIDE_ITEMS.filter((item) => {
      const haystack = `${item.title} ${item.description}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SettingsHeader
          title="Help center"
          subtitle="Browse quick answers and guided steps."
          onBack={() => navigation.goBack()}
        />
        <Card style={styles.card}>
          <AppText style={styles.sectionTitle}>Search the help center</AppText>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={components.sizes.icon.md}
              color={colors.text.secondary}
            />
            <AppTextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search help topics"
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
          <AppText style={styles.helperText}>
            Popular: resetting passwords, lesson progress, and profile updates.
          </AppText>
        </Card>
        <Card style={styles.card}>
          <AppText style={styles.sectionTitle}>Browse topics</AppText>
          <View style={styles.list}>
            {HELP_TOPICS.map((topic, index) => (
              <View
                key={topic.title}
                style={[styles.listItem, index < HELP_TOPICS.length - 1 && styles.listDivider]}
              >
                <AppText style={styles.itemTitle}>{topic.title}</AppText>
                <AppText style={styles.itemText}>{topic.description}</AppText>
              </View>
            ))}
          </View>
        </Card>
        <Card style={styles.card}>
          <AppText style={styles.sectionTitle}>Popular guides</AppText>
          <View style={styles.list}>
            {filteredGuides.length === 0 ? (
              <AppText style={styles.emptyText}>No guides match that search yet.</AppText>
            ) : (
              filteredGuides.map((guide, index) => (
                <View
                  key={guide.title}
                  style={[styles.listItem, index < filteredGuides.length - 1 && styles.listDivider]}
                >
                  <AppText style={styles.itemTitle}>{guide.title}</AppText>
                  <AppText style={styles.itemText}>{guide.description}</AppText>
                </View>
              ))
            )}
          </View>
        </Card>
        <Card style={styles.card}>
          <AppText style={styles.sectionTitle}>Need more help?</AppText>
          <AppText style={styles.text}>
            Contact support for account access, lesson issues, or feedback on the learning flow.
          </AppText>
          <SecondaryButton
            label="Contact support"
            onPress={() => navigation.navigate('ContactSupport')}
          />
        </Card>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors, components, tabBarHeight) =>
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
      paddingBottom: components.layout.safeArea.bottom + tabBarHeight,
    },
    card: {
      gap: components.layout.cardGap,
    },
    sectionTitle: {
      ...typography.styles.h2,
      color: colors.text.primary,
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
    helperText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    list: {
      gap: components.layout.spacing.sm,
    },
    listItem: {
      ...components.list.row,
    },
    listDivider: {
      borderBottomWidth: components.borderWidth.thin,
      borderBottomColor: toRgba(colors.ui.divider, colors.opacity.stroke),
    },
    itemTitle: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    itemText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    emptyText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    text: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
  });
