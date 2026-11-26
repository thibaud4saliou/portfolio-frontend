'use client';

import { useState } from 'react';
import { adminRequest } from './adminApi';

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await adminRequest('POST', '/api/auth/login', { password });
      if (res.ok) {
        setPassword('');
        onSuccess();
      } else {
        setError(res.data.error ?? 'Connexion refusée');
      }
    } catch {
      setError('Impossible de joindre le serveur');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto mt-16 space-y-4 bg-[#111] p-8 border border-gray-900">
      <h1 className="text-xl font-bold uppercase tracking-wider text-white text-center mb-4">Administration</h1>
      <label htmlFor="admin-password" className="text-xs uppercase text-gray-500 block">
        Mot de passe
      </label>
      <input
        id="admin-password"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3"
      />
      <button type="submit" disabled={busy} className="w-full bg-white text-black font-bold uppercase py-3 hover:bg-gray-300 disabled:opacity-50">
        {busy ? 'Connexion…' : 'Se connecter'}
      </button>
      {error && (
        <p role="alert" className="text-sm text-red-400 text-center">
          {error}
        </p>
      )}
    </form>
  );
}
