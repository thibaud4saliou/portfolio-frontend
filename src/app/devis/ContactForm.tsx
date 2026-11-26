'use client';

import Link from 'next/link';
import { useState } from 'react';

const EMPTY = { name: '', email: '', type: 'clip', message: '', website: '' };
type Status = { kind: 'idle' | 'sending' | 'success' | 'error'; message?: string };

const inputClass =
  'bg-transparent border-b border-gray-800 text-white p-3 focus:outline-none focus:border-white transition-colors';

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: 'sending' });
    try {
      // URL relative : passe par nginx, fonctionne quel que soit le domaine.
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus({ kind: 'success', message: 'Votre demande a bien été envoyée. Je reviens vers vous très vite !' });
        setForm(EMPTY);
        return;
      }
      const data = await res.json().catch(() => ({}));
      const message =
        res.status === 400 && data.fields
          ? 'Merci de vérifier les champs : ' + Object.keys(data.fields).join(', ')
          : res.status === 429
            ? 'Trop de demandes envoyées. Réessayez dans un moment ou écrivez-moi directement par email.'
            : "L'envoi a échoué. Vous pouvez m'écrire directement par email.";
      setStatus({ kind: 'error', message });
    } catch {
      setStatus({ kind: 'error', message: 'Impossible de joindre le serveur. Réessayez plus tard.' });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-[#0a0a0a] p-8 md:p-10 border border-gray-900 rounded-sm">
      <div className="flex flex-col gap-2">
        <label htmlFor="c-name" className="text-xs uppercase tracking-widest text-gray-500">Nom / Structure *</label>
        <input id="c-name" type="text" required maxLength={120} autoComplete="name" value={form.name} onChange={set('name')} className={inputClass} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="c-email" className="text-xs uppercase tracking-widest text-gray-500">Email *</label>
        <input id="c-email" type="email" required maxLength={254} autoComplete="email" value={form.email} onChange={set('email')} className={inputClass} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="c-type" className="text-xs uppercase tracking-widest text-gray-500">Type de projet *</label>
        <select id="c-type" value={form.type} onChange={set('type')} className="bg-[#111] border border-gray-800 text-white p-3 focus:outline-none focus:border-gray-500">
          <option value="clip">Clip vidéo</option>
          <option value="court-metrage">Court-métrage</option>
          <option value="publicite">Publicité / Brand content</option>
          <option value="photo">Photographie</option>
          <option value="autre">Autre</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="c-message" className="text-xs uppercase tracking-widest text-gray-500">Détails du projet *</label>
        <textarea id="c-message" required minLength={10} maxLength={5000} rows={5} value={form.message} onChange={set('message')} className={`${inputClass} resize-none`} />
      </div>

      {/* Champ piège anti-spam : invisible pour les humains */}
      <div aria-hidden="true" className="absolute -left-[10000px] w-px h-px overflow-hidden">
        <label htmlFor="c-website">Ne pas remplir</label>
        <input id="c-website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
      </div>

      <p className="text-[11px] text-gray-500 leading-relaxed">
        Vos informations servent uniquement à répondre à votre demande et ne sont jamais revendues.{' '}
        <Link href="/politique-confidentialite" className="underline hover:text-white">En savoir plus</Link>.
      </p>

      <button
        type="submit"
        disabled={status.kind === 'sending'}
        className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 hover:bg-gray-300 transition-colors disabled:opacity-50"
      >
        {status.kind === 'sending' ? 'Envoi en cours…' : 'Envoyer la demande'}
      </button>

      <p role="status" aria-live="polite" className={`text-center text-sm font-bold ${status.kind === 'success' ? 'text-green-500' : 'text-red-400'}`}>
        {status.message}
      </p>
    </form>
  );
}
