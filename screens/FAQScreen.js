import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../components/AppText';
import { SecondaryButton } from '../components/Button';
import Card from '../components/Card';
import SettingsHeader from '../components/SettingsHeader';
import useThemeColors from '../theme/useTheme';
import { layout } from '../theme/layout';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const FAQ_ITEMS = [
  {
    question: 'How do lessons work?',
    answer:
      'Each lesson is a short flow with concepts, examples, and exercises. Your progress saves automatically.',
  },
  {
    question: 'How do I see my progress?',
    answer:
      'Your progress appears on the home screen and in your profile overview. Completed lessons stay marked.',
  },
  {
    question: 'Can I update my learning context?',
    answer:
      'Yes. Update your experience, knowledge, or motivation from the profile settings at any time.',
  },
  {
    question: 'I forgot my password. What should I do?',
    answer:
      'Use the reset password option in settings. You can also contact support if you are locked out.',
  },
  {
    question: 'Is my data private?',
    answer:
      'We store only your profile context and lesson progress. Do not share sensitive financial details.',
  },
  {
    question: 'Why is content missing or not loading?',
    answer:
      'Try refreshing the app or checking your connection. If it persists, send us a support request.',
  },
];

export default function FAQScreen({ navigation }) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <SettingsHeader
          title="FAQ"
          subtitle="Answers to the most common questions."
          onBack={() => navigation.goBack()}
        />
        <View style={styles.list}>
          {FAQ_ITEMS.map((item) => (
            <Card key={item.question} style={styles.card}>
              <AppText style={styles.question}>{item.question}</AppText>
              <AppText style={styles.answer}>{item.answer}</AppText>
            </Card>
          ))}
        </View>
        <Card style={styles.card}>
          <AppText style={styles.question}>Still need help?</AppText>
          <AppText style={styles.answer}>
            Visit the help center or send a support request for anything not covered here.
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
      paddingHorizontal: layout.sideMargin,
      paddingTop: spacing.lg,
      gap: spacing.lg,
      paddingBottom: 0,
    },
    list: {
      gap: spacing.md,
    },
    card: {
      gap: spacing.sm,
    },
    question: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: typography.body,
      color: colors.textPrimary,
    },
    answer: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });
