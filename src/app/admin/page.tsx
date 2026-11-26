'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminRequest, UnauthorizedError } from './_components/adminApi';
import { COLLECTIONS } from './_components/config';
import ContactRequestsPanel from './_components/ContactRequestsPanel';
import ItemsManager from './_components/ItemsManager';
import LoginForm from './_components/LoginForm';
import SettingsForm from './_components/SettingsForm';

type Tab = 'requests' | (typeof COLLECTIONS)[number]['key'] | 'settings';
type AuthState = 'checking' | 'out' | 'in' | 'offline';

export default function AdminPage() {
  const [auth, setAuth] = useState<AuthState>('checking');
  const [tab, setTab] = useState<Tab>('requests');
  const [status, setStatus] = useState('');
  const [newRequests, setNewRequests] = useState(0);

  const checkSession = useCallback(async () => {
    try {
      const res = await adminRequest<{ authenticated: boolean }>('GET', '/api/auth/session');
      setAuth(res.ok && res.data.authenticated ? 'in' : 'out');
    } catch {
      setAuth('offline');
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Compteur de nouvelles demandes, visible quel que soit l'onglet ouvert.
  useEffect(() => {
    if (auth !== 'in') return;
    adminRequest<{ status: string }[]>('GET', '/api/contact-requests')
      .then((res) => res.ok && setNewRequests((res.data as { status: string }[]).filter((r) => r.status === 'new').length))
      .catch(() => undefined);
  }, [auth]);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof UnauthorizedError) {
      setStatus('Session expirée, reconnectez-vous.');
      setAuth('out');
    } else {
      setStatus('❌ Impossible de joindre le serveur');
    }
  }, []);

  async function logout() {
    await adminRequest('POST', '/api/auth/logout').catch(() => undefined);
    setStatus('');
    setAuth('out');
  }

  if (auth === 'checking') return <p className="text-center text-gray-500 mt-16">Chargement…</p>;
  if (auth === 'offline')
    return (
      <div className="text-center mt-16 space-y-4">
        <p className="text-red-400">Impossible de joindre le serveur.</p>
        <button onClick={checkSession} className="text-xs uppercase tracking-widest border border-gray-700 px-4 py-2 text-white">
          Réessayer
        </button>
      </div>
    );
  if (auth === 'out')
    return (
      <>
        {status && <p className="text-center text-sm text-gray-400 mt-8">{status}</p>}
        <LoginForm
          onSuccess={() => {
            setStatus('');
            setAuth('in');
          }}
        />
      </>
    );

  const collection = COLLECTIONS.find((c) => c.key === tab);
  const tabs: { key: Tab; label: string }[] = [
    { key: 'requests', label: newRequests > 0 ? `Demandes (${newRequests})` : 'Demandes' },
    ...COLLECTIONS.map((c) => ({ key: c.key, label: c.label })),
    { key: 'settings', label: 'Configuration' },
  ];

  return (
    <div className="max-w-6xl mx-auto pt-12 pb-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-wider text-white">Tableau de bord</h1>
        <button onClick={logout} className="text-xs uppercase tracking-widest text-gray-400 hover:text-white border border-gray-800 px-4 py-2">
          Déconnexion
        </button>
      </div>

      <div role="tablist" className="flex flex-wrap gap-4 mb-8 justify-center border-b border-gray-800 pb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => {
              setTab(t.key);
              setStatus('');
            }}
            className={`text-xs uppercase tracking-widest px-4 py-2 ${tab === t.key ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {status && (
        <p role="status" className="text-center mb-8 text-sm font-bold text-white bg-[#111] p-4 border border-gray-800">
          {status}
        </p>
      )}

      {tab === 'requests' ? (
        <ContactRequestsPanel onStatus={setStatus} onError={handleError} onNewCount={setNewRequests} />
      ) : collection ? (
        <ItemsManager key={collection.key} collection={collection} onStatus={setStatus} onError={handleError} />
      ) : (
        <SettingsForm onStatus={setStatus} onError={handleError} />
      )}
    </div>
  );
}
