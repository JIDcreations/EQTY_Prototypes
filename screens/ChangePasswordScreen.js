import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import Card from '../components/Card';
import SettingsHeader from '../components/SettingsHeader';
import Toast from '../components/Toast';
import { typography, useTheme } from '../theme';
import useToast from '../utils/useToast';

export default function ChangePasswordScreen({ navigation }) {
  const { colors, components } = useTheme();
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
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SettingsHeader title="Reset password" onBack={() => navigation.goBack()} />
        <Card style={styles.card}>
          <View style={styles.field}>
            <AppText style={styles.label}>Current password</AppText>
            <AppTextInput
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
            <AppTextInput
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
            <AppTextInput
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
    </View>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    container: {
      ...components.screen.container,
      flex: 1,
      backgroundColor: colors.background.app,
    },
    content: {
      paddingHorizontal: components.layout.pagePaddingHorizontal,
      paddingTop: components.layout.spacing.lg,
      gap: components.layout.contentGap,
      paddingBottom: components.layout.spacing.none,
    },
    card: {
      gap: components.layout.cardGap,
    },
    field: {
      gap: components.layout.spacing.xs,
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
      marginTop: components.layout.spacing.xs,
    },
    forgotText: {
      ...typography.styles.small,
      color: colors.text.primary,
    },
    actions: {
      gap: components.layout.spacing.md,
    },
  });
