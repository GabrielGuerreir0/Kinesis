import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LaunchSplash } from '@/components/LaunchSplash';
import { useImmersiveChrome } from '@/hooks/useImmersiveChrome';
import { useSession } from '@/store/session';
import { useTheme } from '@/store/theme';
import { useColors, useThemedStyles } from '@/hooks/useColors';
import type { Palette } from '@/theme/colors';

SplashScreen.preventAutoHideAsync().catch(() => {});
SplashScreen.setOptions({ duration: 280, fade: true });

export default function RootLayout() {
  const ready = useSession((state) => state.ready);
  const hydrate = useSession((state) => state.hydrate);
  const hydrateTheme = useTheme((state) => state.hydrate);
  const styles = useThemedStyles(makeStyles);
  const [splash, setSplash] = useState(true);
  const hidNative = useRef(false);
  useImmersiveChrome(splash);

  useEffect(() => {
    void hydrate();
    void hydrateTheme();
  }, [hydrate, hydrateTheme]);

  function hideNativeSplash() {
    if (hidNative.current) return;
    hidNative.current = true;
    void SplashScreen.hideAsync();
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar hidden />
      {ready ? <RootNavigator /> : <View style={styles.boot} />}
      {splash ? <LaunchSplash ready={ready} onLayout={hideNativeSplash} onDone={() => setSplash(false)} /> : null}
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const session = useSession((state) => state.session);
  const colors = useColors();

  return (
    <>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Protected guard={session} redirectTo="/login">
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Protected guard={!session} redirectTo="/">
          <Stack.Screen name="login" />
          <Stack.Screen
            name="recuperar-senha"
            options={{
              headerShown: true,
              title: 'Recuperar senha',
              headerStyle: { backgroundColor: colors.surface },
              headerTintColor: colors.text,
              headerShadowVisible: false,
            }}
          />
        </Stack.Protected>
      </Stack>
    </>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.accent },
  boot: { flex: 1, backgroundColor: colors.accent },
  });
