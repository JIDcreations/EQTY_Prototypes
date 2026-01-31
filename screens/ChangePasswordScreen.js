import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../components/AppText';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import Card from '../components/Card';
import SettingsHeader from '../components/SettingsHeader';
import Toast from '../components/Toast';
import { spacing, typography, useTheme } from '../theme';
import useToast from '../utils/useToast';

export default function ChangePasswordScreen({ navigation }) {
  const { colors, components } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
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
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <SettingsHeader title="Reset password" onBack={() => navigation.goBack()} />
        <Card style={styles.card}>
          <View style={styles.field}>
            <AppText style={styles.label}>Current password</AppText>
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
              placeholderTextColor={colors.text.secondary}
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
              placeholderTextColor={colors.text.secondary}
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
              placeholderTextColor={colors.text.secondary}
              secureTextEntry
              style={styles.input}
            />
          </View>
          <Pressable
            onPress={() => navigation.navigate('ResetPassword')}
            style={styles.forgotRow}
          >
            <AppText style={styles.forgotText}>Forgot password? Send reset link</AppText>
          </Pressable>
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
    field: {
      gap: spacing.xs,
    },
    label: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    input: {
      ...components.input.container,
      ...components.input.text,
    },
    forgotRow: {
      alignSelf: 'flex-start',
      marginTop: spacing.xs,
    },
    forgotText: {
      ...typography.styles.small,
      color: colors.text.primary,
    },
    actions: {
      gap: spacing.md,
    },
  });
