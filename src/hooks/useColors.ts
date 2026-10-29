import { useMemo } from 'react';
import { useTheme } from '@/store/theme';
import { palettes, type Palette } from '@/theme/colors';

export function useColors(): Palette {
  const scheme = useTheme((state) => state.scheme);
  return palettes[scheme];
}

export function useThemedStyles<T>(factory: (colors: Palette) => T): T {
  const colors = useColors();
  return useMemo(() => factory(colors), [colors, factory]);
}
