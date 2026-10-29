import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { deleteSecret, readSecret, writeSecret } from '@/store/secure';

export type Profile = {
  name: string;
  email: string;
  phone: string;
};

type StoredProfile = Profile & { seedLogin: boolean; photo: string | null };

type SessionState = {
  ready: boolean;
  session: boolean;
  profile: Profile;
  photo: string | null;
  seedLogin: boolean;
  bluetoothAllowed: boolean;
  hydrate: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  recover: (email: string, password: string) => Promise<string | null>;
  updateProfile: (patch: Profile) => Promise<string | null>;
  setPassword: (password: string) => Promise<string | null>;
  setPhoto: (photo: string | null) => Promise<void>;
  setBluetoothAllowed: (allowed: boolean) => Promise<void>;
};

const PROFILE_KEY = 'kinesis.profile';
const BLUETOOTH_KEY = 'kinesis.bluetooth';
const PASSWORD_KEY = 'kinesis.password';
const SESSION_KEY = 'kinesis.session';

const SEED: StoredProfile & { password: string } = {
  name: 'Atleta',
  email: 'voce@kinesis.app',
  phone: '',
  photo: null,
  seedLogin: true,
  password: 'kinesis',
};

let boot: Promise<void> | null = null;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateProfile(profile: Profile): string | null {
  if (profile.name.trim().length < 2) return 'Informe seu nome.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) return 'Informe um e-mail válido.';
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 6) return 'A senha precisa de pelo menos 6 caracteres.';
  return null;
}

async function readStored(): Promise<StoredProfile & { password: string; session: boolean; bluetoothAllowed: boolean }> {
  const [rawProfile, password, session, bluetooth] = await Promise.all([
    AsyncStorage.getItem(PROFILE_KEY),
    readSecret(PASSWORD_KEY),
    readSecret(SESSION_KEY),
    AsyncStorage.getItem(BLUETOOTH_KEY),
  ]);

  if (!rawProfile || !password) {
    const { password: seedPassword, ...profile } = SEED;
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    await writeSecret(PASSWORD_KEY, seedPassword);
    return { ...profile, password: seedPassword, session: session === '1', bluetoothAllowed: bluetooth === '1' };
  }

  const profile = JSON.parse(rawProfile) as StoredProfile;
  return {
    name: profile.name,
    email: profile.email,
    phone: profile.phone ?? '',
    seedLogin: profile.seedLogin,
    photo: profile.photo ?? null,
    password,
    session: session === '1',
    bluetoothAllowed: bluetooth === '1',
  };
}

export const useSession = create<SessionState>((set, get) => ({
  ready: false,
  session: false,
  profile: { name: SEED.name, email: SEED.email, phone: SEED.phone },
  photo: null,
  seedLogin: true,
  bluetoothAllowed: false,

  hydrate: () => {
    boot ??= readStored()
      .then((stored) => {
        const { password: _password, session, bluetoothAllowed, seedLogin, photo, ...profile } = stored;
        set({ ready: true, session, profile, photo, seedLogin, bluetoothAllowed });
      })
      .catch(() => {
        set({ ready: true });
      });
    return boot;
  },

  signIn: async (email, password) => {
    const stored = await readStored();
    const matches =
      normalizeEmail(email) === normalizeEmail(stored.email) && password === stored.password;
    if (!matches) return 'E-mail ou senha não conferem com a conta deste aparelho.';
    await writeSecret(SESSION_KEY, '1');
    set({ session: true });
    return null;
  },

  signOut: async () => {
    await deleteSecret(SESSION_KEY);
    set({ session: false });
  },

  recover: async (email, password) => {
    const stored = await readStored();
    if (normalizeEmail(email) !== normalizeEmail(stored.email)) {
      return 'Não há conta salva neste aparelho com esse e-mail.';
    }
    return get().setPassword(password);
  },

  updateProfile: async (patch) => {
    const error = validateProfile(patch);
    if (error) return error;
    const next: StoredProfile = {
      name: patch.name.trim(),
      email: patch.email.trim(),
      phone: patch.phone.trim(),
      photo: get().photo,
      seedLogin: get().seedLogin,
    };
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    set({ profile: { name: next.name, email: next.email, phone: next.phone } });
    return null;
  },

  setPassword: async (password) => {
    const error = validatePassword(password);
    if (error) return error;
    const next: StoredProfile = { ...get().profile, photo: get().photo, seedLogin: false };
    await writeSecret(PASSWORD_KEY, password);
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    set({ seedLogin: false });
    return null;
  },

  setPhoto: async (photo) => {
    const next: StoredProfile = { ...get().profile, photo, seedLogin: get().seedLogin };
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    set({ photo });
  },

  setBluetoothAllowed: async (allowed) => {
    await AsyncStorage.setItem(BLUETOOTH_KEY, allowed ? '1' : '0');
    set({ bluetoothAllowed: allowed });
  },
}));
