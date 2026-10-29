import { useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { useSession } from '@/store/session';

export function useBluetoothConsent() {
  const allowed = useSession((state) => state.bluetoothAllowed);
  const setBluetoothAllowed = useSession((state) => state.setBluetoothAllowed);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function allow() {
    setPending(true);
    setError(null);
    try {
      const granted = await requestOsBluetooth();
      if (!granted) {
        setError('O sistema não concedeu o Bluetooth.');
        await setBluetoothAllowed(false);
        return;
      }
      await setBluetoothAllowed(true);
    } catch {
      setError('Não foi possível pedir a permissão de Bluetooth.');
    } finally {
      setPending(false);
    }
  }

  async function revoke() {
    await setBluetoothAllowed(false);
    setError(null);
  }

  return { allowed, error, pending, allow, revoke };
}

async function requestOsBluetooth(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  const api = typeof Platform.Version === 'number' ? Platform.Version : 0;
  if (api < 31) return true;
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
  return result === PermissionsAndroid.RESULTS.GRANTED;
}
