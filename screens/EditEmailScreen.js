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
import { useApp } from '../utils/AppContext';
import useToast from '../utils/useToast';

export default function EditEmailScreen({ navigation }) {
  const { authUser, updateAuthUser } = useApp();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [email, setEmail] = useState(authUser?.email || '');
  const toast = useToast();

  const handleSave = async () => {
    await updateAuthUser({ email: email.trim() });
    toast.show('Saved');
    setTimeout(() => navigation.goBack(), 500);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <SettingsHeader title="Email address" onBack={() => navigation.goBack()} />
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
        </Card>
        <View style={styles.actions}>
          <PrimaryButton label="Save changes" onPress={handleSave} disabled={!email.trim()} />
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
    actions: {
      gap: spacing.md,
    },
  });
