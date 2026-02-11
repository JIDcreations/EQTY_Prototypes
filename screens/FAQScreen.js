import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AppText from '../components/AppText';
import { SecondaryButton } from '../components/Button';
import Card from '../components/Card';
import SettingsHeader from '../components/SettingsHeader';
import { typography, useTheme } from '../theme';

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
  const { colors, components } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight),
    [colors, components, tabBarHeight]
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
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
    list: {
      gap: components.layout.spacing.md,
    },
    card: {
      gap: components.layout.cardGap,
    },
    question: {
      ...typography.styles.h3,
      color: colors.text.primary,
    },
    answer: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  });
