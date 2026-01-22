import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../components/AppText';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import Card from '../components/Card';
import SettingsHeader from '../components/SettingsHeader';
import Toast from '../components/Toast';
import useThemeColors from '../theme/useTheme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import useToast from '../utils/useToast';

export default function ChangePasswordScreen({ navigation }) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [nextPassword, setNextPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const toast = useToast();

  const canSave = currentPassword && nextPassword && confirmPassword;

  const handleSave = () => {
    toast.show('Saved');
    setTimeout(() => navigation.goBack(), 500);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SettingsHeader title="Change password" onBack={() => navigation.goBack()} />
        <Card style={styles.card}>
          <View style={styles.field}>
            <AppText style={styles.label}>Current password</AppText>
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              style={styles.input}
            />
          </View>
          <View style={styles.field}>
            <AppText style={styles.label}>New password</AppText>
            <TextInput
              value={nextPassword}
              onChangeText={setNextPassword}
              placeholder="Create a new password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              style={styles.input}
            />
          </View>
          <View style={styles.field}>
            <AppText style={styles.label}>Confirm new password</AppText>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              style={styles.input}
            />
          </View>
        </Card>
        <View style={styles.actions}>
          <PrimaryButton label="Save changes" onPress={handleSave} disabled={!canSave} />
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
      padding: spacing.lg,
      gap: spacing.lg,
      paddingBottom: spacing.xxxl,
    },
    card: {
      gap: spacing.md,
    },
    field: {
      gap: spacing.xs,
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
