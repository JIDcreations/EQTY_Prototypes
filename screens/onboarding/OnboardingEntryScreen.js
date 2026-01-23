import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../components/AppText';
import BottomSheet from '../../components/BottomSheet';
import OnboardingAuthButton from '../../components/OnboardingAuthButton';
import OnboardingScreen from '../../components/OnboardingScreen';
import { PrimaryButton } from '../../components/Button';
import useThemeColors from '../../theme/useTheme';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function OnboardingEntryScreen({ navigation }) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [sheetVisible, setSheetVisible] = useState(false);

  const handleApple = () => {
    setSheetVisible(false);
    navigation.navigate('OnboardingBasicInfo');
  };

  const handleGoogle = () => {
    setSheetVisible(false);
    navigation.navigate('OnboardingBasicInfo');
  };

  const handleEmail = () => {
    setSheetVisible(false);
    navigation.navigate('OnboardingEmail');
  };

  return (
    <OnboardingScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <AppText style={styles.kicker}>Start here</AppText>
          <AppText style={styles.title}>Let’s build your EQTY account</AppText>
          <AppText style={styles.subtitle}>
            A quick setup unlocks the calm, personalized learning experience.
          </AppText>
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Get started" onPress={() => setSheetVisible(true)} />
          <Pressable onPress={() => navigation.navigate('OnboardingLogin')}>
            <AppText style={styles.link}>I already have an account</AppText>
          </Pressable>
        </View>
      </View>

      <BottomSheet
        visible={sheetVisible}
        title="Create your EQTY account"
        onClose={() => setSheetVisible(false)}
      >
        <OnboardingAuthButton
          label="Continue with Apple"
          iconName="logo-apple"
          variant="light"
          onPress={handleApple}
        />
        <OnboardingAuthButton
          label="Continue with Google"
          iconName="logo-google"
          onPress={handleGoogle}
        />
        <OnboardingAuthButton
          label="Continue with email"
          iconName="mail-outline"
          onPress={handleEmail}
        />
      </BottomSheet>
    </OnboardingScreen>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      paddingBottom: spacing.xl,
    },
    header: {
      gap: spacing.sm,
      maxWidth: 320,
    },
    kicker: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    title: {
      fontFamily: typography.fontFamilyDemi,
      fontSize: 28,
      color: colors.textPrimary,
      lineHeight: 34,
    },
    subtitle: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    actions: {
      gap: spacing.md,
    },
    link: {
      fontFamily: typography.fontFamilyMedium,
      fontSize: typography.small,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
