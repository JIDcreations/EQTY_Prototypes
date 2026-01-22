import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../components/AppText';
import { SecondaryButton } from '../components/Button';
import Card from '../components/Card';
import SettingsHeader from '../components/SettingsHeader';
import useThemeColors from '../theme/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

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
    description: 'Head to Profile > Reset password to update your credentials.',
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

export default function HelpCenterScreen({ navigation }) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
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
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search help topics"
              placeholderTextColor={colors.textSecondary}
              style={styles.searchInput}
            />
            {query.length > 0 ? (
              <Pressable style={styles.clearButton} onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
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
      gap: spacing.md,
    },
    sectionTitle: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: typography.h2,
      color: colors.textPrimary,
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
    helperText: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
    },
    list: {
      gap: spacing.sm,
    },
    listItem: {
      gap: spacing.xs,
      paddingVertical: spacing.sm,
    },
    listDivider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    itemTitle: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: typography.body,
      color: colors.textPrimary,
    },
    itemText: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    emptyText: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
    },
    text: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },
  });
