import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import { PrimaryButton } from '../components/Button';
import Card from '../components/Card';
import SettingsHeader from '../components/SettingsHeader';
import SettingsRow from '../components/SettingsRow';
import Toast from '../components/Toast';
import { typography, useTheme } from '../theme';
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
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
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
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
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
          <AppTextInput
            value={subject}
            onChangeText={setSubject}
            placeholder="Short summary"
            placeholderTextColor={colors.text.secondary}
            style={styles.input}
          />
          <AppText style={styles.label}>Message</AppText>
          <AppTextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Describe what you need help with"
            placeholderTextColor={colors.text.secondary}
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
    </View>
  );
}

const createStyles = (colors, components) =>
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
      paddingBottom: components.layout.safeArea.bottom,
    },
    card: {
      gap: components.layout.cardGap,
    },
    sectionTitle: {
      ...typography.styles.h2,
      color: colors.text.primary,
    },
    list: {
      gap: components.layout.spacing.xs,
    },
    bulletList: {
      gap: components.layout.spacing.xs,
    },
    bulletText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    label: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    input: {
      ...components.input.container,
      ...components.input.text,
    },
    messageInput: {
      ...components.input.multiline,
    },
    helperText: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    text: {
      ...typography.styles.body,
      color: colors.text.secondary,
    },
  });
