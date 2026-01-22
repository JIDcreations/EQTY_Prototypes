import { useMemo } from 'react';
import { darkColors, lightColors } from './colors';
import { useApp } from '../utils/AppContext';

export function getThemeColors(appearance) {
  if (appearance === 'Light') return lightColors;
  if (appearance === 'System') return darkColors;
  return darkColors;
}

export default function useThemeColors() {
  const { preferences } = useApp();
  return useMemo(() => getThemeColors(preferences?.appearance), [preferences?.appearance]);
}
