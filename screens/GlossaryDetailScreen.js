import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppText from '../components/AppText';
import Card from '../components/Card';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { glossaryTerms } from '../data/glossary';
import useThemeColors from '../theme/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../utils/AppContext';
import { getGlossaryExplanation } from '../utils/helpers';

export default function GlossaryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { termId } = route.params || {};
  const { userContext } = useApp();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [explanation, setExplanation] = useState(null);

  const term = useMemo(
    () => glossaryTerms.find((item) => item.id === termId) || glossaryTerms[0],
    [termId]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppText style={styles.title}>{term.term}</AppText>
          <AppText style={styles.subtitle}>{term.definition}</AppText>
        </View>

        <Card style={styles.explainCard}>
          <AppText style={styles.cardTitle}>Explain for me</AppText>
          <AppText style={styles.cardText}>
            {explanation || 'Tap below for a tailored explanation.'}
          </AppText>
          <PrimaryButton
            label="Explain for me"
            onPress={() => setExplanation(getGlossaryExplanation(term, userContext))}
          />
        </Card>

        <SecondaryButton label="Back" onPress={() => navigation.goBack()} />
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
    header: {
      gap: spacing.sm,
    },
    title: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: typography.title,
      color: colors.textPrimary,
    },
    subtitle: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
      color: colors.textSecondary,
    },
    explainCard: {
      gap: spacing.sm,
    },
    cardTitle: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: typography.h2,
      color: colors.textPrimary,
    },
    cardText: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
      color: colors.textSecondary,
    },
  });
