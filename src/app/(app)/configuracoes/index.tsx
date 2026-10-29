import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { NavRow } from '@/components/NavRow';
import { Screen } from '@/components/Screen';
import { ThemeChoice } from '@/components/ThemeChoice';
import { useThemedStyles } from '@/hooks/useColors';
import type { Palette } from '@/theme/colors';

export default function SettingsScreen() {
  const styles = useThemedStyles(makeStyles);
  return (
    <Screen scroll>
      <Text style={styles.lead}>Autorizações e condições de uso deste aparelho.</Text>
      <ThemeChoice />
      <NavRow icon="terms" title="Termos de uso" detail="Condições de uso do Kinesis" onPress={() => router.push('/configuracoes/termos')} />
      <NavRow icon="camera" title="Câmera" detail="Autorizar o uso da câmera" onPress={() => router.push('/configuracoes/camera')} />
      <NavRow icon="bluetooth" title="Bluetooth" detail="Autorizar sensores Bluetooth" onPress={() => router.push('/configuracoes/bluetooth')} />
    </Screen>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    lead: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  });
