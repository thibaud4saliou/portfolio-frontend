'use client';

import { useEffect, useState } from 'react';
import { describeErrors, toFormValues, toPayload, type FormValues } from '@/lib/adminForm';
import { adminRequest, refreshSite, UnauthorizedError } from './adminApi';
import { SETTINGS_FIELDS, SETTINGS_SECTIONS } from './config';
import FieldInput from './FieldInput';

export default function SettingsForm({
  onStatus,
  onError,
}: {
  onStatus: (message: string) => void;
  onError: (err: unknown) => void;
}) {
  const [values, setValues] = useState<FormValues | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    adminRequest<Record<string, unknown>>('GET', '/api/settings')
      .then((res) => setValues(toFormValues(res.ok ? res.data : {}, SETTINGS_FIELDS)))
      .catch(onError);
  }, [onError]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!values) return;
    setBusy(true);
    onStatus('Enregistrement…');
    try {
      const res = await adminRequest('PUT', '/api/settings', toPayload(values, SETTINGS_FIELDS));
      if (res.ok) {
        setFieldErrors({});
        onStatus('✅ Configuration sauvegardée');
        refreshSite();
      } else {
        setFieldErrors(res.data.fields ?? {});
        onStatus(`❌ ${res.data.error ?? 'Erreur serveur'}${res.data.fields ? ' — ' + describeErrors(res.data.fields, SETTINGS_FIELDS) : ''}`);
      }
    } catch (err) {
      onError(err);
    } finally {
      setBusy(false);
    }
  }

  if (!values) return <p className="text-center text-gray-500">Chargement…</p>;

  return (
    <form onSubmit={submit} className="space-y-10 bg-[#111] p-6 border border-gray-900 w-full max-w-4xl mx-auto">
      {SETTINGS_SECTIONS.map((section) => (
        <fieldset key={section.title}>
          <legend className="text-xl font-bold uppercase text-white border-b border-gray-800 pb-2 mb-4 w-full">
            {section.title}
          </legend>
          <div className="grid md:grid-cols-2 gap-4">
            {section.fields.map((def) => (
              <FieldInput
                key={def.name}
                def={def}
                value={values[def.name] ?? ''}
                error={fieldErrors[def.name]}
                onUnauthorized={() => onError(new UnauthorizedError())}
                onChange={(v) => setValues((prev) => ({ ...(prev ?? {}), [def.name]: v }))}
              />
            ))}
          </div>
        </fieldset>
      ))}
      <button type="submit" disabled={busy} className="w-full bg-white text-black font-bold uppercase py-4 hover:bg-gray-300 disabled:opacity-50">
        Sauvegarder toute la configuration
      </button>
    </form>
  );
}
