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
import { useApp } from '../utils/AppContext';
import useToast from '../utils/useToast';

export default function EditUsernameScreen({ navigation }) {
  const { authUser, updateAuthUser } = useApp();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [username, setUsername] = useState(authUser?.username || '');
  const toast = useToast();

  const handleSave = async () => {
    await updateAuthUser({ username: username.trim() });
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
        <SettingsHeader title="Username" onBack={() => navigation.goBack()} />
        <Card style={styles.card}>
          <AppText style={styles.label}>Username</AppText>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
          />
        </Card>
        <View style={styles.actions}>
          <PrimaryButton label="Save changes" onPress={handleSave} disabled={!username.trim()} />
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
