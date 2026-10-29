import { Pressable, StyleSheet } from 'react-native';
import { router, Stack } from 'expo-router';
import { AppIcon } from '@/components/AppIcon';
import { useColors } from '@/hooks/useColors';

export default function SettingsLayout() {
  const colors = useColors();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Configurações',
          headerLeft: () => (
            <Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={() => router.back()} style={styles.back}>
              <AppIcon name="back" color={colors.text} size={26} />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen name="termos" options={{ title: 'Termos de uso' }} />
      <Stack.Screen name="camera" options={{ title: 'Câmera' }} />
      <Stack.Screen name="bluetooth" options={{ title: 'Bluetooth' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  back: { marginLeft: 8, padding: 8 },
});
