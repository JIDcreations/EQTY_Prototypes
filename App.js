import 'react-native-gesture-handler';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors, typography, useTheme } from './theme';
import { AppProvider, useApp } from './utils/AppContext';
import { GlossaryProvider } from './components/GlossaryProvider';
import HomeScreen from './screens/HomeScreen';
import GlossaryScreen from './screens/GlossaryScreen';
import ProfileStack from './navigation/ProfileStack';
import OnboardingStack from './navigation/OnboardingStack';
import GlossaryDetailScreen from './screens/GlossaryDetailScreen';
import OnboardingQuestionScreen from './screens/onboarding/OnboardingQuestionScreen';
import OnboardingRequiredScreen from './screens/OnboardingRequiredScreen';
import LessonsStack from './navigation/LessonsStack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const toRgba = (hex, alpha) => {
  const cleaned = hex.replace('#', '');
  const value = parseInt(cleaned, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function Tabs() {
  const { colors, typography, components } = useTheme();
  const tabBarHeight = components.layout.spacing.xxl * 2 + components.layout.safeArea.bottom;
  const tabBarPaddingBottom = Math.max(
    components.layout.safeArea.bottom,
    components.layout.spacing.xs
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.surface,
          borderTopColor: toRgba(colors.ui.divider, colors.opacity.stroke),
          height: tabBarHeight,
          paddingTop: components.layout.spacing.xs,
          paddingBottom: tabBarPaddingBottom,
        },
        tabBarActiveTintColor: colors.accent.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarLabelStyle: {
          ...typography.styles.small,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home-outline';
          if (route.name === 'Home') iconName = 'home-outline';
          if (route.name === 'Lessons') iconName = 'book-outline';
          if (route.name === 'Glossary') iconName = 'list-outline';
          if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Lessons" component={LessonsStack} />
      <Tab.Screen name="Glossary" component={GlossaryScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarButton: () => null,
          tabBarItemStyle: { display: 'none' },
        }}
      />
    </Tab.Navigator>
  );
}

function RootStack() {
  const { isReady, authUser, preferences } = useApp();
  const { colors } = useTheme();

  if (!isReady) {
    return <View style={{ flex: 1, backgroundColor: colors.background.app }} />;
  }

  const showOnboarding = !preferences?.hasOnboarded || !authUser;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {showOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingStack} />
      ) : (
        <>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="OnboardingRequired" component={OnboardingRequiredScreen} />
          <Stack.Screen
            name="OnboardingQuestionExperience"
            component={OnboardingQuestionScreen}
            initialParams={{
              question: 'What have you already done in terms of investing?',
              field: 'experienceAnswer',
              step: 1,
              total: 3,
              nextRoute: 'OnboardingQuestionKnowledge',
            }}
          />
          <Stack.Screen
            name="OnboardingQuestionKnowledge"
            component={OnboardingQuestionScreen}
            initialParams={{
              question: 'What do you already know about investing today?',
              field: 'knowledgeAnswer',
              step: 2,
              total: 3,
              nextRoute: 'OnboardingQuestionMotivation',
            }}
          />
          <Stack.Screen
            name="OnboardingQuestionMotivation"
            component={OnboardingQuestionScreen}
            initialParams={{
              question: 'Why do you want to start investing?',
              field: 'motivationAnswer',
              step: 3,
              total: 3,
              isLast: true,
            }}
          />
          <Stack.Screen name="GlossaryDetail" component={GlossaryDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

function AppShell() {
  const { preferences } = useApp();
  const { colors } = useTheme();
  const isLight = preferences?.appearance === 'Light';
  const navTheme = useMemo(
    () => ({
      ...DefaultTheme,
      dark: !isLight,
      colors: {
        ...DefaultTheme.colors,
        background: colors.background.app,
        card: colors.background.surface,
        text: colors.text.primary,
        border: colors.ui.divider,
        primary: colors.accent.primary,
      },
    }),
    [colors, isLight]
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background.app }}>
      <SafeAreaProvider>
        <GlossaryProvider>
          <NavigationContainer theme={navTheme}>
            <StatusBar style={isLight ? 'dark' : 'light'} />
            <RootStack />
          </NavigationContainer>
        </GlossaryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter,Playfair_Display,Poppins,Zeyada/Inter/static/Inter_24pt-Regular.ttf'),
    'Inter-Medium': require('./assets/fonts/Inter,Playfair_Display,Poppins,Zeyada/Inter/static/Inter_24pt-Medium.ttf'),
    'Inter-SemiBold': require('./assets/fonts/Inter,Playfair_Display,Poppins,Zeyada/Inter/static/Inter_24pt-SemiBold.ttf'),
    'FilsonPro-Bold': require('./assets/fonts/filson-pro/FilsonProBold.otf'),
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.dark.background.app }} />;
  }

  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
