import { devices, metrics, recovery, sleep } from '@/data/wearables';
import { useSession } from '@/store/session';

export function useDashboard() {
  const name = useSession((state) => state.profile.name);
  const bluetoothAllowed = useSession((state) => state.bluetoothAllowed);
  return { name, bluetoothAllowed, metrics, sleep, recovery, devices };
}
