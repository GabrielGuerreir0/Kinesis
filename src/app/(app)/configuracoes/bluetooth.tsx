import { Linking, StyleSheet, Text } from 'react-native';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { useBluetoothConsent } from '@/hooks/useBluetoothConsent';
import { useThemedStyles } from '@/hooks/useColors';
import type { Palette } from '@/theme/colors';

export default function BluetoothScreen() {
  const consent = useBluetoothConsent();
  const styles = useThemedStyles(makeStyles);

  return (
    <Screen>
      <Text style={styles.lead}>O Bluetooth conecta sensores de movimento. A escolha fica neste aparelho.</Text>
      <Text style={styles.status}>{consent.allowed ? 'Bluetooth autorizado.' : 'Bluetooth pendente.'}</Text>
      {consent.error ? <Text style={styles.error}>{consent.error}</Text> : null}
      {consent.allowed ? (
        <Button label="Revogar autorização" tone="ghost" onPress={() => void consent.revoke()} />
      ) : (
        <Button
          label={consent.pending ? 'Pedindo acesso…' : 'Autorizar Bluetooth'}
          onPress={() => void consent.allow()}
          disabled={consent.pending}
        />
      )}
      <Button label="Abrir ajustes do sistema" tone="ghost" onPress={() => void Linking.openSettings()} />
    </Screen>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  lead: { color: colors.muted, fontSize: 16 },
  status: { color: colors.text, fontSize: 18, fontWeight: '700' },
  error: { color: colors.danger, fontSize: 14 },
});
