import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { create } from 'zustand';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ColorScheme = 'light' | 'dark';

const KEY = 'kinesis.theme';

function systemScheme(): ColorScheme {
  return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
}

function resolve(preference: ThemePreference): ColorScheme {
  return preference === 'system' ? systemScheme() : preference;
}

type ThemeState = {
  preference: ThemePreference;
  scheme: ColorScheme;
  hydrate: () => Promise<void>;
  setPreference: (preference: ThemePreference) => Promise<void>;
};

export const useTheme = create<ThemeState>((set) => ({
  preference: 'system',
  scheme: systemScheme(),
  hydrate: async () => {
    const saved = await AsyncStorage.getItem(KEY);
    const preference: ThemePreference = saved === 'light' || saved === 'dark' ? saved : 'system';
    set({ preference, scheme: resolve(preference) });
  },
  setPreference: async (preference) => {
    await AsyncStorage.setItem(KEY, preference);
    set({ preference, scheme: resolve(preference) });
  },
}));

Appearance.addChangeListener(() => {
  if (useTheme.getState().preference === 'system') {
    useTheme.setState({ scheme: systemScheme() });
  }
});
