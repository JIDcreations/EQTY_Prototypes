import 'react-native-gesture-handler';
import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from './theme/colors';
import { spacing } from './theme/spacing';
import { typography } from './theme/typography';
import { AppProvider, useApp } from './utils/AppContext';
import HomeScreen from './screens/HomeScreen';
import LessonsScreen from './screens/LessonsScreen';
import GlossaryScreen from './screens/GlossaryScreen';
import ProfileScreen from './screens/ProfileScreen';
import LessonOverviewScreen from './screens/LessonOverviewScreen';
import LessonStepScreen from './screens/LessonStepScreen';
import GlossaryDetailScreen from './screens/GlossaryDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Tabs() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 64 + insets.bottom;
  const tabBarPaddingBottom = Math.max(insets.bottom, spacing.xs);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.surfaceActive,
          height: tabBarHeight,
          paddingTop: spacing.xs,
          paddingBottom: tabBarPaddingBottom,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: typography.fontFamilyMedium,
          fontSize: 11,
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
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function RootStack() {
  const { isReady } = useApp();

  if (!isReady) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="LessonOverview" component={LessonOverviewScreen} />
      <Stack.Screen name="LessonStep" component={LessonStepScreen} />
      <Stack.Screen name="GlossaryDetail" component={GlossaryDetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <AppProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <RootStack />
          </NavigationContainer>
        </SafeAreaProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
