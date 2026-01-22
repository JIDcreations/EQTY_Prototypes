import { Platform } from 'react-native';

const fontFamilyBase = Platform.select({
  ios: 'AvenirNext-Regular',
  android: 'System',
  default: 'System',
});

const fontFamilyMedium = Platform.select({
  ios: 'AvenirNext-Medium',
  android: 'System',
  default: 'System',
});

const fontFamilyDemi = Platform.select({
  ios: 'AvenirNext-DemiBold',
  android: 'System',
  default: 'System',
});

export const typography = {
  fontFamilyBase,
  fontFamilyMedium,
  fontFamilyDemi,
  title: 26,
  h1: 22,
  h2: 18,
  body: 16,
  small: 13,
};
