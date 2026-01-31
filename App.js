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
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography, useTheme } from './theme';
import { AppProvider, useApp } from './utils/AppContext';
import { GlossaryProvider } from './components/GlossaryProvider';
import HomeScreen from './screens/HomeScreen';
import LessonsScreen from './screens/LessonsScreen';
import GlossaryScreen from './screens/GlossaryScreen';
import ProfileStack from './navigation/ProfileStack';
import OnboardingStack from './navigation/OnboardingStack';
import LessonOverviewScreen from './screens/LessonOverviewScreen';
import LessonStepScreen from './screens/LessonStepScreen';
import GlossaryDetailScreen from './screens/GlossaryDetailScreen';
import LessonSuccessScreen from './screens/LessonSuccessScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Tabs() {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();
  const tabBarHeight = 64 + insets.bottom;
  const tabBarPaddingBottom = Math.max(insets.bottom, spacing.xs);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.surface,
          borderTopColor: colors.ui.divider,
          height: tabBarHeight,
          paddingTop: spacing.xs,
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
      <Tab.Screen name="Lessons" component={LessonsScreen} />
      <Tab.Screen name="Glossary" component={GlossaryScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
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
          <Stack.Screen name="LessonOverview" component={LessonOverviewScreen} />
          <Stack.Screen name="LessonStep" component={LessonStepScreen} />
          <Stack.Screen name="LessonSuccess" component={LessonSuccessScreen} />
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
