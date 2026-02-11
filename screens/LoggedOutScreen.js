import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AppText from '../components/AppText';
import { PrimaryButton } from '../components/Button';
import Card from '../components/Card';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';

export default function LoggedOutScreen({ navigation }) {
  const { updateAuthUser } = useApp();
  const { colors, components } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const styles = useMemo(
    () => createStyles(colors, components, tabBarHeight),
    [colors, components, tabBarHeight]
  );

  const handleLogin = async () => {
    await updateAuthUser({});
    navigation.replace('SettingsHome');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
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
    title: {
      ...typography.styles.h1,
      color: colors.text.primary,
    },
    text: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
  });
