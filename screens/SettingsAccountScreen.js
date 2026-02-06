import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import OnboardingScreen from '../components/OnboardingScreen';
import SettingsHeader from '../components/SettingsHeader';
import SettingsRow from '../components/SettingsRow';
import SettingsStackedCard from '../components/SettingsStackedCard';
import Toast from '../components/Toast';
import { typography, useTheme } from '../theme';
import { useApp } from '../utils/AppContext';
import useToast from '../utils/useToast';

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function SettingsAccountScreen({ navigation }) {
  const { authUser, updateAuthUser } = useApp();
  const { colors, components } = useTheme();
  const styles = useMemo(() => createStyles(colors, components), [colors, components]);
  const toast = useToast();
  const [activeField, setActiveField] = useState(null);
  const [username, setUsername] = useState(authUser?.username || '');
  const [email, setEmail] = useState(authUser?.email || '');

  useEffect(() => {
    if (!activeField) {
      setUsername(authUser?.username || '');
      setEmail(authUser?.email || '');
    }
  }, [activeField, authUser]);

  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim();
  const hasUsernameChange = trimmedUsername !== (authUser?.username || '');
  const hasEmailChange = trimmedEmail !== (authUser?.email || '');
  const hasChanges = hasUsernameChange || hasEmailChange;
  const saveDisabled =
    !hasChanges ||
    (hasUsernameChange && !trimmedUsername) ||
    (hasEmailChange && !trimmedEmail);

  const handleCancel = () => {
    setUsername(authUser?.username || '');
    setEmail(authUser?.email || '');
    setActiveField(null);
  };

  const handleSave = async () => {
    const updates = {};
    if (hasUsernameChange) updates.username = trimmedUsername;
    if (hasEmailChange) updates.email = trimmedEmail;
    if (Object.keys(updates).length) {
      await updateAuthUser(updates);
      toast.show('Saved');
    }
    setActiveField(null);
  };

  const renderField = ({
    key,
    label,
    value,
    placeholder,
    onChangeText,
    inputProps,
  }) => {
    if (activeField === key) {
      const shouldCollapse = !hasChanges;
      return (
        <View style={styles.inlineField}>
          <AppText style={styles.label}>{label}</AppText>
          <AppTextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.text.secondary}
            style={styles.input}
            onBlur={() => {
              if (shouldCollapse) setActiveField(null);
            }}
            {...inputProps}
          />
        </View>
      );
    }

    const displayValue = value?.trim() ? value.trim() : '—';
    return (
      <SettingsRow
        label={label}
        value={displayValue}
        onPress={() => setActiveField(key)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <OnboardingScreen
        scroll
        backgroundVariant="bg3"
        contentContainerStyle={styles.content}
      >
        <SettingsHeader
          title="Account"
          subtitle="Update your username, email, and password"
          onBack={() => navigation.goBack()}
        />
        <SettingsStackedCard contentStyle={styles.cardContent}>
          {renderField({
            key: 'username',
            label: 'Username',
            value: username,
            placeholder: 'Enter username',
            onChangeText: setUsername,
          })}
          {renderField({
            key: 'email',
            label: 'Email address',
            value: email,
            placeholder: 'name@email.com',
            onChangeText: setEmail,
            inputProps: {
              keyboardType: 'email-address',
              autoCapitalize: 'none',
            },
          })}
          <SettingsRow
            label="Reset password"
            onPress={() => navigation.navigate('ChangePassword')}
            isLast
          />
        </SettingsStackedCard>
        {hasChanges ? (
          <View style={styles.actions}>
            <PrimaryButton
              label="Save changes"
              onPress={handleSave}
              disabled={saveDisabled}
            />
            <SecondaryButton label="Cancel" onPress={handleCancel} />
          </View>
        ) : null}
      </OnboardingScreen>
      <Toast message={toast.message} visible={toast.visible} onHide={toast.hide} />
    </View>
  );
}

const createStyles = (colors, components) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingBottom: components.layout.safeArea.bottom + components.layout.spacing.xl,
      gap: components.layout.contentGap,
    },
    cardContent: {
      gap: components.layout.cardGap,
    },
    inlineField: {
      gap: components.layout.spacing.xs,
      paddingVertical: components.layout.spacing.md,
      borderBottomWidth: components.borderWidth.thin,
      borderBottomColor: toRgba(colors.text.primary, components.opacity.value20),
    },
    label: {
      ...typography.styles.small,
      color: colors.text.secondary,
    },
    input: {
      ...components.input.container,
      ...components.input.text,
    },
    actions: {
      gap: components.layout.spacing.md,
    },
  });
