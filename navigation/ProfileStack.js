import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileOverviewScreen from '../screens/ProfileOverviewScreen';
import EditUsernameScreen from '../screens/EditUsernameScreen';
import EditEmailScreen from '../screens/EditEmailScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import EditPersonalContextScreen from '../screens/EditPersonalContextScreen';
import LanguageScreen from '../screens/LanguageScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import ContactSupportScreen from '../screens/ContactSupportScreen';
import FAQScreen from '../screens/FAQScreen';
import LoggedOutScreen from '../screens/LoggedOutScreen';

const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileOverview" component={ProfileOverviewScreen} />
      <Stack.Screen name="EditUsername" component={EditUsernameScreen} />
      <Stack.Screen name="EditEmail" component={EditEmailScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="EditPersonalContext" component={EditPersonalContextScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="ContactSupport" component={ContactSupportScreen} />
      <Stack.Screen name="FAQ" component={FAQScreen} />
      <Stack.Screen name="LoggedOut" component={LoggedOutScreen} />
    </Stack.Navigator>
  );
}
