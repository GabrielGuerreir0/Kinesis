import { useState } from 'react';
import { useSession } from '@/store/session';

export function useLogin() {
  const signIn = useSession((state) => state.signIn);
  const seedLogin = useSession((state) => state.seedLogin);
  const emailHint = useSession((state) => state.profile.email);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit() {
    setPending(true);
    const message = await signIn(email, password);
    setPending(false);
    if (message) {
      setError(message);
      return;
    }
  }

  return { email, setEmail, password, setPassword, error, pending, submit, seedLogin, emailHint };
}
