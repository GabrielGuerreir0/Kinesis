import { useState } from 'react';
import { useSession, type Profile } from '@/store/session';

export function useProfileForm() {
  const profile = useSession((state) => state.profile);
  const updateProfile = useSession((state) => state.updateProfile);
  const setPassword = useSession((state) => state.setPassword);
  const signOut = useSession((state) => state.signOut);
  const [draft, setDraft] = useState<Profile>(profile);
  const [password, setPasswordDraft] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function patch(partial: Partial<Profile>) {
    setDraft((current) => ({ ...current, ...partial }));
  }

  async function save() {
    setPending(true);
    setMessage(null);
    const profileError = await updateProfile(draft);
    if (profileError) {
      setPending(false);
      setError(profileError);
      return;
    }
    if (password.length > 0) {
      const passwordError = await setPassword(password);
      if (passwordError) {
        setPending(false);
        setError(passwordError);
        return;
      }
      setPasswordDraft('');
    }
    setPending(false);
    setError(null);
    setMessage('Dados salvos neste aparelho.');
  }

  return { draft, patch, password, setPasswordDraft, message, error, pending, save, signOut };
}
