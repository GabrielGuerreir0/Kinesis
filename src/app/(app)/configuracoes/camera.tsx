import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused } from 'expo-router';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { useThemedStyles } from '@/hooks/useColors';
import type { Palette } from '@/theme/colors';

export default function CameraPermissionScreen() {
  const focused = useIsFocused();
  const styles = useThemedStyles(makeStyles);
  const [permission, requestPermission] = useCameraPermissions();
  const granted = permission?.granted === true;

  return (
    <Screen>
      <Text style={styles.lead}>A câmera registra o movimento. Nada é enviado para fora do aparelho.</Text>
      <Text style={styles.status}>{permissionLabel(permission?.granted, permission?.canAskAgain)}</Text>
      {granted && focused ? <CameraView style={styles.preview} facing="back" /> : <View style={styles.preview} />}
      {permission && !granted && permission.canAskAgain ? (
        <Button label="Permitir câmera" onPress={() => void requestPermission()} />
      ) : null}
      {permission && !granted && !permission.canAskAgain ? (
        <Button label="Abrir ajustes do sistema" tone="ghost" onPress={() => void Linking.openSettings()} />
      ) : null}
    </Screen>
  );
}

function permissionLabel(granted?: boolean, canAskAgain?: boolean): string {
  if (granted) return 'Câmera autorizada.';
  if (canAskAgain === false) return 'A permissão foi negada no sistema.';
  return 'Aguardando autorização.';
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  lead: { color: colors.muted, fontSize: 16 },
  status: { color: colors.text, fontSize: 18, fontWeight: '700' },
  preview: {
    flex: 1,
    minHeight: 220,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
});
