import { ViewStyle } from 'react-native';
import type { Palette } from '@/theme/colors';

export function cardStyle(colors: Palette): ViewStyle {
  return {
    backgroundColor: colors.surface,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  };
}
