'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function ResetPasswordPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      supabase.auth.exchangeCodeForSession(code);
    }
  }, [searchParams, supabase]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      // Fehlerbehandlung
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      // Fehlerbehandlung
    } else {
      router.push('/login');
    }
  };

  return (
    <form onSubmit={handleReset}>
      <input
        type="password"
        placeholder="Neues Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Passwort bestätigen"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button type="submit">Passwort zurücksetzen</button>
    </form>
  );
}
