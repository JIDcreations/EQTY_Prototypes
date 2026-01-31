import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../components/AppText';
import { PrimaryButton } from '../components/Button';
import Card from '../components/Card';
import { spacing, typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';

export default function LoggedOutScreen({ navigation }) {
  const { updateAuthUser } = useApp();
  const { colors, components } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);

  const handleLogin = async () => {
    await updateAuthUser({});
    navigation.replace('ProfileOverview');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <AppText style={styles.title}>You are logged out</AppText>
          <AppText style={styles.text}>
            This prototype uses local-only data. Tap below to continue with a demo profile.
          </AppText>
          <PrimaryButton label="Log in" onPress={handleLogin} />
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
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
    },
    text: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
  });
