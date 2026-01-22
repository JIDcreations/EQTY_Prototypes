import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Switch, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/Card';
import AppText from '../components/AppText';
import { PrimaryButton } from '../components/Button';
import SectionTitle from '../components/SectionTitle';
import useThemeColors from '../theme/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../utils/AppContext';

export default function ProfileScreen() {
  const { userContext, updateUserContext } = useApp();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [experience, setExperience] = useState(userContext.experience);
  const [knowledge, setKnowledge] = useState(userContext.knowledge);
  const [motivation, setMotivation] = useState(userContext.motivation);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    setExperience(userContext.experience);
    setKnowledge(userContext.knowledge);
    setMotivation(userContext.motivation);
  }, [userContext]);

  const handleSave = () => {
    updateUserContext({ experience, knowledge, motivation });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle title="Profile" subtitle="Personal learning context" />

        <Card style={styles.card}>
          <AppText style={styles.label}>Experience</AppText>
          <TextInput
            style={styles.input}
            value={experience}
            onChangeText={setExperience}
            placeholder="new / growing / seasoned"
            placeholderTextColor={colors.textSecondary}
          />
          <AppText style={styles.label}>Knowledge</AppText>
          <TextInput
            style={styles.input}
            value={knowledge}
            onChangeText={setKnowledge}
            placeholder="basic / intermediate / advanced"
            placeholderTextColor={colors.textSecondary}
          />
          <AppText style={styles.label}>Motivation</AppText>
          <TextInput
            style={styles.input}
            value={motivation}
            onChangeText={setMotivation}
            placeholder="Why are you investing?"
            placeholderTextColor={colors.textSecondary}
          />
          <PrimaryButton label="Save profile" onPress={handleSave} />
        </Card>

        <Card style={styles.card}>
          <AppText style={styles.label}>Appearance</AppText>
          <View style={styles.switchRow}>
            <AppText style={styles.switchLabel}>Dark mode</AppText>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: colors.surfaceActive, true: colors.accent }}
              thumbColor={colors.background}
            />
          </View>
          <AppText style={styles.caption}>Light mode is coming soon.</AppText>
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
    label: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
    },
    input: {
      borderRadius: 14,
      padding: spacing.sm,
      backgroundColor: colors.surfaceActive,
      color: colors.textPrimary,
      fontFamily: typography.fontFamilyMedium,
    },
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    switchLabel: {
      fontFamily: typography.fontFamilyMedium,
      color: colors.textPrimary,
      fontSize: typography.body,
    },
    caption: {
      fontFamily: typography.fontFamilyMedium,
      color: colors.textSecondary,
      fontSize: typography.small,
    },
  });
