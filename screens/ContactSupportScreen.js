import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../components/AppText';
import { PrimaryButton } from '../components/Button';
import Card from '../components/Card';
import SettingsHeader from '../components/SettingsHeader';
import SettingsRow from '../components/SettingsRow';
import Toast from '../components/Toast';
import useThemeColors from '../theme/useTheme';
import { layout } from '../theme/layout';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import useToast from '../utils/useToast';

const CONTACT_CHANNELS = [
  {
    label: 'In-app chat',
    subtitle: 'Fastest response. Weekdays 09:00 to 17:00.',
  },
  {
    label: 'Email support',
    subtitle: 'support@example.com. Replies within 24 hours.',
  },
  {
    label: 'Phone line',
    subtitle: '+1 (555) 014-2030 for account access issues.',
  },
];

const SUPPORT_CHECKLIST = [
  'Your account email or username.',
  'What you were trying to do when it happened.',
  'Device model and OS version.',
  'Screenshots or screen recordings if possible.',
];

export default function ContactSupportScreen({ navigation }) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const toast = useToast();
  const canSend = subject.trim().length > 0 && message.trim().length > 0;

  const handleSend = () => {
    toast.show('Support request sent');
    setSubject('');
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SettingsHeader
          title="Contact support"
          subtitle="We usually reply within 24 hours."
          onBack={() => navigation.goBack()}
        />
        <Card style={styles.card}>
          <AppText style={styles.sectionTitle}>Contact options</AppText>
          <View style={styles.list}>
            {CONTACT_CHANNELS.map((channel, index) => (
              <SettingsRow
                key={channel.label}
                label={channel.label}
                subtitle={channel.subtitle}
                isLast={index === CONTACT_CHANNELS.length - 1}
              />
            ))}
          </View>
        </Card>
        <Card style={styles.card}>
          <AppText style={styles.sectionTitle}>Before you reach out</AppText>
          <AppText style={styles.text}>
            Including these details helps us resolve your request faster:
          </AppText>
          <View style={styles.bulletList}>
            {SUPPORT_CHECKLIST.map((item) => (
              <AppText key={item} style={styles.bulletText}>
                - {item}
              </AppText>
            ))}
          </View>
        </Card>
        <Card style={styles.card}>
          <AppText style={styles.sectionTitle}>Send a request</AppText>
          <AppText style={styles.label}>Subject</AppText>
          <TextInput
            value={subject}
            onChangeText={setSubject}
            placeholder="Short summary"
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
          />
          <AppText style={styles.label}>Message</AppText>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Describe what you need help with"
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, styles.messageInput]}
            multiline
            textAlignVertical="top"
          />
          <AppText style={styles.helperText}>
            Please do not include passwords or sensitive financial details.
          </AppText>
          <PrimaryButton label="Send message" onPress={handleSend} disabled={!canSend} />
        </Card>
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
      gap: spacing.md,
    },
    sectionTitle: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: typography.h2,
      color: colors.textPrimary,
    },
    list: {
      gap: spacing.xs,
    },
    bulletList: {
      gap: spacing.xs,
    },
    bulletText: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      lineHeight: 20,
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
    messageInput: {
      minHeight: 120,
    },
    helperText: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    text: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
      color: colors.textSecondary,
      lineHeight: 24,
    },
  });
