import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Switch, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Card from '../components/Card';
import AppText from '../components/AppText';
import { PrimaryButton } from '../components/Button';
import SectionTitle from '../components/SectionTitle';
import { spacing, typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';

export default function ProfileScreen() {
  const { userContext, updateUserContext } = useApp();
  const { colors, components } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
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
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}
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
            placeholderTextColor={colors.text.secondary}
          />
          <AppText style={styles.label}>Knowledge</AppText>
          <TextInput
            style={styles.input}
            value={knowledge}
            onChangeText={setKnowledge}
            placeholder="basic / intermediate / advanced"
            placeholderTextColor={colors.text.secondary}
          />
          <AppText style={styles.label}>Motivation</AppText>
          <TextInput
            style={styles.input}
            value={motivation}
            onChangeText={setMotivation}
            placeholder="Why are you investing?"
            placeholderTextColor={colors.text.secondary}
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
              trackColor={{
                false: colors.background.surfaceActive,
                true: colors.accent.primary,
              }}
              thumbColor={colors.background.app}
            />
          </View>
          <AppText style={styles.caption}>Light mode is coming soon.</AppText>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background.app,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background.app,
    },
    content: {
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingTop: spacing.lg,
      gap: components.layout.contentGap,
      paddingBottom: spacing.none,
    },
    card: {
      gap: components.layout.cardGap,
    },
    label: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    input: {
      ...components.input.container,
      ...components.input.text,
    },
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    switchLabel: {
      ...typography.styles.body,
      color: colors.text.primary,
    },
    caption: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
  });
