import { router } from 'expo-router';
import { useState } from 'react';
import { useSession } from '@/store/session';

export function useRecover() {
  const recover = useSession((state) => state.recover);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit() {
    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }
    setPending(true);
    const message = await recover(email, password);
    setPending(false);
    if (message) {
      setError(message);
      return;
    }
    router.replace('/login');
  }

  return { email, setEmail, password, setPassword, confirm, setConfirm, error, pending, submit };
}
