import { useMemo } from 'react';
import { useApp } from '../utils/AppContext';
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { createComponents } from './components';

export const getTheme = (appearance) => {
  const mode = appearance === 'Light' ? 'light' : 'dark';
  const palette = colors[mode];
  return {
    mode,
    colors: palette,
    typography,
    spacing,
    components: createComponents(palette),
  };
};

export const useTheme = () => {
  const { preferences } = useApp();
  return useMemo(() => getTheme(preferences?.appearance), [preferences?.appearance]);
};

export { colors, typography, spacing, createComponents };
