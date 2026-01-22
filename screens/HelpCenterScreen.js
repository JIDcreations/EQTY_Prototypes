import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../components/AppText';
import Card from '../components/Card';
import SettingsHeader from '../components/SettingsHeader';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function HelpCenterScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SettingsHeader title="Help center" onBack={() => navigation.goBack()} />
        <Card style={styles.card}>
          <AppText style={styles.title}>Help center</AppText>
          <AppText style={styles.text}>
            We're preparing a guided help center with quick answers and tutorials.
          </AppText>
        </Card>
      </ScrollView>
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
  card: {
    gap: spacing.sm,
  },
  title: {
    fontFamily: typography.fontFamilyDemi,
    fontSize: typography.body,
    color: colors.textPrimary,
  },
  text: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
