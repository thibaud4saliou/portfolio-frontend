'use client';

import { useCallback, useEffect, useState } from 'react';
import { describeErrors, emptyValues, toFormValues, toPayload, type FormValues } from '@/lib/adminForm';
import { adminRequest, refreshSite, UnauthorizedError } from './adminApi';
import type { CollectionConfig } from './config';
import FieldInput from './FieldInput';

type Item = Record<string, unknown> & { id: string };

export default function ItemsManager({
  collection,
  onStatus,
  onError,
}: {
  collection: CollectionConfig;
  onStatus: (message: string) => void;
  onError: (err: unknown) => void;
}) {
  const { fields, endpoint, singular } = collection;
  const [items, setItems] = useState<Item[]>([]);
  const [values, setValues] = useState<FormValues>(() => emptyValues(fields));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await adminRequest<Item[]>('GET', endpoint);
      if (res.ok) setItems(res.data as Item[]);
    } catch (err) {
      onError(err);
    }
  }, [endpoint, onError]);

  // Le composant est recréé à chaque changement d'onglet (prop key) :
  // pas besoin de réinitialiser le formulaire ici.
  useEffect(() => {
    let active = true;
    adminRequest<Item[]>('GET', endpoint)
      .then((res) => {
        if (active && res.ok) setItems(res.data as Item[]);
      })
      .catch(onError);
    return () => {
      active = false;
    };
  }, [endpoint, onError]);

  function startEdit(item: Item) {
    setEditingId(item.id);
    setValues(toFormValues(item, fields));
    setFieldErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancel() {
    setEditingId(null);
    setValues(emptyValues(fields));
    setFieldErrors({});
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    onStatus('Enregistrement…');
    try {
      const res = editingId
        ? await adminRequest('PUT', `${endpoint}/${encodeURIComponent(editingId)}`, toPayload(values, fields))
        : await adminRequest('POST', endpoint, toPayload(values, fields));
      if (res.ok) {
        onStatus(editingId ? '✅ Modification sauvegardée' : '✅ Ajouté avec succès');
        cancel();
        refreshSite();
        await load();
      } else {
        setFieldErrors(res.data.fields ?? {});
        onStatus(`❌ ${res.data.error ?? 'Erreur serveur'}${res.data.fields ? ' — ' + describeErrors(res.data.fields, fields) : ''}`);
      }
    } catch (err) {
      onError(err);
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: Item) {
    const { title } = collection.describe(item);
    if (!window.confirm(`Supprimer définitivement « ${title} » ?`)) return;
    try {
      const res = await adminRequest('DELETE', `${endpoint}/${encodeURIComponent(item.id)}`);
      if (res.ok) {
        onStatus('🗑️ Supprimé');
        if (editingId === item.id) cancel();
        refreshSite();
        await load();
      } else onStatus(`❌ ${res.data.error ?? 'Suppression impossible'}`);
    } catch (err) {
      onError(err);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <form onSubmit={submit} className="space-y-4 bg-[#111] p-6 border border-gray-900 h-fit">
        <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
          <h2 className="text-xl font-bold uppercase text-white">
            {editingId ? `Modifier ${singular}` : `Ajouter ${singular}`}
          </h2>
          {editingId && (
            <button type="button" onClick={cancel} className="text-xs text-gray-500 hover:text-white uppercase">
              Annuler
            </button>
          )}
        </div>
        {fields.map((def) => (
          <FieldInput
            key={def.name}
            def={def}
            value={values[def.name] ?? ''}
            error={fieldErrors[def.name]}
            onUnauthorized={() => onError(new UnauthorizedError())}
            onChange={(v) => setValues((prev) => ({ ...prev, [def.name]: v }))}
          />
        ))}
        <button type="submit" disabled={busy} className="w-full bg-white text-black font-bold uppercase py-3 mt-4 hover:bg-gray-300 disabled:opacity-50">
          {editingId ? 'Sauvegarder' : 'Ajouter'}
        </button>
      </form>

      <div className="bg-[#111] p-6 border border-gray-900 h-fit max-h-[800px] overflow-y-auto">
        <h2 className="text-xl font-bold uppercase tracking-wider text-white mb-6 border-b border-gray-800 pb-2">
          Gérer ({items.length})
        </h2>
        {items.length === 0 ? (
          <p className="text-gray-500 italic text-sm">Aucun élément.</p>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => {
              const { tag, title } = collection.describe(item);
              return (
                <li
                  key={item.id}
                  className={`flex justify-between items-center p-4 border ${editingId === item.id ? 'border-white bg-[#222]' : 'border-gray-800 bg-[#1a1a1a]'}`}
                >
                  <div className="truncate pr-4 text-sm text-gray-300 flex flex-col">
                    <span className="font-bold text-white">[{tag}]</span>
                    <span className="mt-1 truncate">{title || 'Sans titre'}</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="text-xs uppercase tracking-widest text-blue-400 hover:text-blue-300 font-bold px-3 py-1 border border-blue-900/50"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item)}
                      aria-label={`Supprimer ${title}`}
                      className="text-xs uppercase tracking-widest text-red-500 hover:text-red-400 font-bold px-3 py-1 border border-red-900/50"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
