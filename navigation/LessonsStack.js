import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LessonsScreen from '../screens/LessonsScreen';
import LessonOverviewScreen from '../screens/LessonOverviewScreen';
import LessonStepScreen from '../screens/LessonStepScreen';
import LessonSuccessScreen from '../screens/LessonSuccessScreen';

const Stack = createStackNavigator();

export default function LessonsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LessonsHome" component={LessonsScreen} />
      <Stack.Screen name="LessonOverview" component={LessonOverviewScreen} />
      <Stack.Screen name="LessonStep" component={LessonStepScreen} />
      <Stack.Screen name="LessonSuccess" component={LessonSuccessScreen} />
    </Stack.Navigator>
  );
}
