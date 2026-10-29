import { useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationBar } from 'expo-navigation-bar';

export function useImmersiveChrome(splash: boolean) {
  useEffect(() => {
    StatusBar.setHidden(true, 'none');
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    NavigationBar.setHidden(splash);
  }, [splash]);
}
