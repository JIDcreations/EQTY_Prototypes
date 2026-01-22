import React, { useMemo } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AppText from '../components/AppText';
import Card from '../components/Card';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import SegmentedControl from '../components/SegmentedControl';
import SettingsRow from '../components/SettingsRow';
import SettingsSection from '../components/SettingsSection';
import Toast from '../components/Toast';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { useApp } from '../utils/AppContext';
import useToast from '../utils/useToast';

const APPEARANCE_OPTIONS = [
  { label: 'Dark', value: 'Dark' },
  { label: 'Light', value: 'Light' },
  { label: 'System', value: 'System' },
];

const TEXT_SIZE_OPTIONS = [
  { label: 'Default', value: 'Default' },
  { label: 'Comfort', value: 'Comfort' },
  { label: 'Large', value: 'Large' },
];

export default function ProfileOverviewScreen() {
  const navigation = useNavigation();
  const { authUser, onboardingContext, preferences, updatePreferences, logOut } = useApp();
  const toast = useToast();

  const previewAnswers = useMemo(() => {
    const fallback = 'Not set yet.';
    const makePreview = (value) => {
      if (!value) return fallback;
      const trimmed = value.trim();
      if (trimmed.length <= 72) return trimmed;
      return `${trimmed.slice(0, 72).trim()}...`;
    };
    return {
      experience: makePreview(onboardingContext?.experienceAnswer),
      knowledge: makePreview(onboardingContext?.knowledgeAnswer),
      motivation: makePreview(onboardingContext?.motivationAnswer),
    };
  }, [onboardingContext]);

  const handleLogOut = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await logOut();
          navigation.replace('LoggedOut');
        },
      },
    ]);
  };

  const renderTextSizeOption = (option, index) => {
    const isActive = preferences?.textSize === option.value;
    return (
      <Pressable
        key={option.value}
        onPress={() => {
          updatePreferences({ textSize: option.value });
          toast.show('Saved');
        }}
        style={[styles.textSizeRow, index !== TEXT_SIZE_OPTIONS.length - 1 && styles.rowDivider]}
      >
        <View style={styles.textSizeLeft}>
          <View style={[styles.radio, isActive && styles.radioActive]}>
            {isActive ? <View style={styles.radioDot} /> : null}
          </View>
          <AppText style={styles.textSizeLabel}>{option.label}</AppText>
        </View>
        <AppText
          style={[
            styles.textSizeSample,
            option.value === 'Comfort' && styles.textSizeSampleComfort,
            option.value === 'Large' && styles.textSizeSampleLarge,
          ]}
        >
          Aa
        </AppText>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppText style={styles.title}>Profile</AppText>
          <AppText style={styles.subtitle}>Account & preferences</AppText>
        </View>

        <SettingsSection title="Account">
          <Card style={styles.card}>
            <SettingsRow
              label="Username"
              value={authUser?.username || '—'}
              onPress={() => navigation.navigate('EditUsername')}
            />
            <SettingsRow
              label="Email address"
              value={authUser?.email || '—'}
              onPress={() => navigation.navigate('EditEmail')}
            />
            <SettingsRow
              label="Reset password"
              onPress={() => navigation.navigate('ResetPassword')}
              isLast
            />
          </Card>
        </SettingsSection>

        <SettingsSection title="Security">
          <Card style={styles.card}>
            <SettingsRow
              label="Change password"
              onPress={() => navigation.navigate('ChangePassword')}
            />
            <SettingsRow
              label="Two-factor authentication"
              subtitle="Extra security for your account"
              value="Off"
              right={
                <Switch
                  value={false}
                  disabled
                  trackColor={{ false: colors.surface, true: colors.accent }}
                  thumbColor={colors.background}
                />
              }
              isLast
              disabled
            />
            <AppText style={styles.inlineHint}>Coming later</AppText>
          </Card>
        </SettingsSection>

        <SettingsSection title="Personal context (AI)">
          <Card style={styles.card}>
            <View style={styles.contextBlock}>
              <AppText style={styles.contextLabel}>Investing experience so far</AppText>
              <AppText
                style={[
                  styles.contextValue,
                  previewAnswers.experience === 'Not set yet.' && styles.contextPlaceholder,
                ]}
              >
                {previewAnswers.experience}
              </AppText>
            </View>
            <View style={styles.contextBlock}>
              <AppText style={styles.contextLabel}>Current knowledge</AppText>
              <AppText
                style={[
                  styles.contextValue,
                  previewAnswers.knowledge === 'Not set yet.' && styles.contextPlaceholder,
                ]}
              >
                {previewAnswers.knowledge}
              </AppText>
            </View>
            <View style={styles.contextBlock}>
              <AppText style={styles.contextLabel}>Motivation</AppText>
              <AppText
                style={[
                  styles.contextValue,
                  previewAnswers.motivation === 'Not set yet.' && styles.contextPlaceholder,
                ]}
              >
                {previewAnswers.motivation}
              </AppText>
            </View>
            <AppText style={styles.contextHelper}>
              Used to adapt explanations and feedback. No financial advice.
            </AppText>
            <SecondaryButton
              label="Edit personal context"
              tone="accent"
              onPress={() => navigation.navigate('EditPersonalContext')}
              style={styles.contextButton}
            />
          </Card>
        </SettingsSection>

        <SettingsSection title="Preferences">
          <Card style={styles.card}>
            <SettingsRow
              label="Language"
              value={preferences?.language || 'English'}
              onPress={() => navigation.navigate('Language')}
              isLast
            />
          </Card>
          <Card style={styles.card}>
            <AppText style={styles.cardTitle}>Appearance</AppText>
            <SegmentedControl
              options={APPEARANCE_OPTIONS}
              value={preferences?.appearance || 'Dark'}
              onChange={(next) => {
                updatePreferences({ appearance: next });
                toast.show('Saved');
              }}
            />
          </Card>
        </SettingsSection>

        <SettingsSection title="Accessibility">
          <Card style={styles.card}>
            <View style={styles.textSizeHeader}>
              <AppText style={styles.cardTitle}>Text size</AppText>
              <AppText style={styles.cardSubtitle}>Adjust text size for better readability</AppText>
            </View>
            <View style={styles.textSizeList}>
              {TEXT_SIZE_OPTIONS.map(renderTextSizeOption)}
            </View>
            <View style={styles.previewCard}>
              <AppText style={styles.previewTitle}>Preview</AppText>
              <AppText style={styles.previewText}>
                Investing is a long-term journey. Adjust the text size to match your comfort.
              </AppText>
            </View>
          </Card>
        </SettingsSection>

        <SettingsSection title="Help & support">
          <Card style={styles.card}>
            <SettingsRow
              label="Help center"
              onPress={() => navigation.navigate('HelpCenter')}
            />
            <SettingsRow
              label="Contact support"
              onPress={() => navigation.navigate('ContactSupport')}
            />
            <SettingsRow label="FAQ" onPress={() => navigation.navigate('FAQ')} isLast />
          </Card>
        </SettingsSection>

        <PrimaryButton label="Log out" onPress={handleLogOut} style={styles.logoutButton} />
      </ScrollView>
      <Toast message={toast.message} visible={toast.visible} onHide={toast.hide} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  header: {
    gap: spacing.xs,
  },
  title: {
    fontFamily: typography.fontFamilyDemi,
    fontSize: typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textSecondary,
  },
  card: {
    gap: spacing.md,
  },
  inlineHint: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textSecondary,
  },
  contextBlock: {
    gap: 4,
  },
  contextLabel: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textSecondary,
  },
  contextValue: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.body,
    color: colors.textPrimary,
  },
  contextPlaceholder: {
    color: colors.textSecondary,
  },
  contextButton: {
    marginTop: spacing.xs,
  },
  contextHelper: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textSecondary,
  },
  cardTitle: {
    fontFamily: typography.fontFamilyDemi,
    fontSize: typography.body,
    color: colors.textPrimary,
  },
  cardSubtitle: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.small,
    color: colors.textSecondary,
  },
  textSizeHeader: {
    gap: 4,
  },
  textSizeList: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.surface,
  },
  textSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceActive,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceActive,
  },
  textSizeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  textSizeLabel: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.body,
    color: colors.textPrimary,
  },
  textSizeSample: {
    fontFamily: typography.fontFamilyDemi,
    fontSize: typography.small,
    color: colors.textSecondary,
  },
  textSizeSampleComfort: {
    fontSize: typography.body,
  },
  textSizeSampleLarge: {
    fontSize: typography.h2,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: colors.accent,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  previewCard: {
    backgroundColor: colors.surfaceActive,
    padding: spacing.md,
    borderRadius: 14,
    gap: spacing.xs,
  },
  previewTitle: {
    fontFamily: typography.fontFamilyDemi,
    fontSize: typography.small,
    color: colors.textPrimary,
  },
  previewText: {
    fontFamily: typography.fontFamilyMedium,
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  logoutButton: {
    marginTop: spacing.sm,
  },
});
