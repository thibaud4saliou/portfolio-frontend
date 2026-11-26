'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminRequest } from './adminApi';

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  type: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  emailSent: boolean;
  emailError: string | null;
  createdAt: string;
}

const TYPE_LABELS: Record<string, string> = {
  clip: 'Clip vidéo',
  'court-metrage': 'Court-métrage',
  publicite: 'Publicité / Brand content',
  photo: 'Photographie',
  autre: 'Autre',
};

const FILTERS = [
  { key: 'active', label: 'À traiter' },
  { key: 'archived', label: 'Archivées' },
  { key: 'all', label: 'Toutes' },
] as const;

const dateFmt = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });

export default function ContactRequestsPanel({
  onStatus,
  onError,
  onNewCount,
}: {
  onStatus: (message: string) => void;
  onError: (err: unknown) => void;
  onNewCount: (count: number) => void;
}) {
  const [items, setItems] = useState<ContactRequest[] | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('active');

  const load = useCallback(async () => {
    try {
      const res = await adminRequest<ContactRequest[]>('GET', '/api/contact-requests');
      if (res.ok) setItems(res.data as ContactRequest[]);
    } catch (err) {
      onError(err);
    }
  }, [onError]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (items) onNewCount(items.filter((i) => i.status === 'new').length);
  }, [items, onNewCount]);

  const visible = useMemo(
    () =>
      (items ?? []).filter((i) =>
        filter === 'all' ? true : filter === 'archived' ? i.status === 'archived' : i.status !== 'archived',
      ),
    [items, filter],
  );

  async function setStatus(item: ContactRequest, status: ContactRequest['status']) {
    try {
      const res = await adminRequest('PATCH', `/api/contact-requests/${encodeURIComponent(item.id)}`, { status });
      if (res.ok) setItems((prev) => prev?.map((i) => (i.id === item.id ? { ...i, status } : i)) ?? null);
      else onStatus(`❌ ${res.data.error ?? 'Erreur serveur'}`);
    } catch (err) {
      onError(err);
    }
  }

  async function remove(item: ContactRequest) {
    if (!window.confirm(`Supprimer définitivement la demande de « ${item.name} » ?`)) return;
    try {
      const res = await adminRequest('DELETE', `/api/contact-requests/${encodeURIComponent(item.id)}`);
      if (res.ok) {
        setItems((prev) => prev?.filter((i) => i.id !== item.id) ?? null);
        onStatus('🗑️ Demande supprimée');
      } else onStatus(`❌ ${res.data.error ?? 'Suppression impossible'}`);
    } catch (err) {
      onError(err);
    }
  }

  if (!items) return <p className="text-center text-gray-500">Chargement…</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`text-xs uppercase tracking-widest px-3 py-1 border ${filter === f.key ? 'border-white text-white' : 'border-gray-800 text-gray-500 hover:text-white'}`}
          >
            {f.label}
          </button>
        ))}
        <button type="button" onClick={load} className="text-xs uppercase tracking-widest px-3 py-1 border border-gray-800 text-gray-500 hover:text-white">
          ↻ Actualiser
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="text-center text-gray-500 italic text-sm py-12 border border-dashed border-gray-800">Aucune demande.</p>
      ) : (
        <ul className="space-y-4">
          {visible.map((item) => (
            <li
              key={item.id}
              className={`p-5 border bg-[#111] ${item.status === 'new' ? 'border-white' : 'border-gray-800'}`}
            >
              <div className="flex flex-wrap justify-between gap-2 mb-3">
                <div>
                  <p className="font-bold text-white">
                    {item.status === 'new' && <span className="text-[10px] bg-white text-black px-2 py-0.5 mr-2 uppercase">Nouveau</span>}
                    {item.name}
                  </p>
                  <a href={`mailto:${item.email}`} className="text-sm text-blue-400 hover:underline break-all">
                    {item.email}
                  </a>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <p>{dateFmt.format(new Date(item.createdAt))}</p>
                  <p className="uppercase tracking-widest">{TYPE_LABELS[item.type] ?? item.type}</p>
                </div>
              </div>

              <p className="text-gray-300 text-sm whitespace-pre-line mb-3">{item.message}</p>

              {!item.emailSent && (
                <p className="text-xs text-amber-400 mb-3">
                  ⚠️ Email de notification non envoyé{item.emailError ? ` (${item.emailError})` : ''} — pensez à répondre au client.
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <a
                  href={`mailto:${item.email}?subject=${encodeURIComponent(`Votre demande de devis — ${TYPE_LABELS[item.type] ?? item.type}`)}`}
                  onClick={() => item.status === 'new' && setStatus(item, 'read')}
                  className="text-xs uppercase tracking-widest bg-white text-black font-bold px-3 py-1"
                >
                  Répondre
                </a>
                {item.status === 'new' && (
                  <button type="button" onClick={() => setStatus(item, 'read')} className="text-xs uppercase tracking-widest border border-gray-700 text-gray-300 px-3 py-1">
                    Marquer lu
                  </button>
                )}
                {item.status !== 'archived' ? (
                  <button type="button" onClick={() => setStatus(item, 'archived')} className="text-xs uppercase tracking-widest border border-gray-700 text-gray-300 px-3 py-1">
                    Archiver
                  </button>
                ) : (
                  <button type="button" onClick={() => setStatus(item, 'read')} className="text-xs uppercase tracking-widest border border-gray-700 text-gray-300 px-3 py-1">
                    Désarchiver
                  </button>
                )}
                <button type="button" onClick={() => remove(item)} className="text-xs uppercase tracking-widest border border-red-900/50 text-red-500 px-3 py-1 ml-auto">
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
