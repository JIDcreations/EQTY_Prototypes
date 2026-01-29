import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../components/AppText';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import Card from '../components/Card';
import SettingsHeader from '../components/SettingsHeader';
import Toast from '../components/Toast';
import useThemeColors from '../theme/useTheme';
import { layout } from '../theme/layout';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import useToast from '../utils/useToast';

export default function ResetPasswordScreen({ navigation }) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [email, setEmail] = useState('');
  const toast = useToast();

  const handleSend = () => {
    toast.show('Reset link sent');
    setTimeout(() => navigation.goBack(), 500);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <SettingsHeader title="Reset password" onBack={() => navigation.goBack()} />
        <Card style={styles.card}>
          <AppText style={styles.label}>Email address</AppText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="name@email.com"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <AppText style={styles.hint}>
            We'll send a reset link to your email.
          </AppText>
        </Card>
        <View style={styles.actions}>
          <PrimaryButton label="Send reset link" onPress={handleSend} disabled={!email.trim()} />
          <SecondaryButton label="Cancel" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
      <Toast message={toast.message} visible={toast.visible} onHide={toast.hide} />
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
    card: {
      gap: spacing.sm,
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
      fontSize: typography.body,
    },
    hint: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
    },
    actions: {
      gap: spacing.md,
    },
  });
