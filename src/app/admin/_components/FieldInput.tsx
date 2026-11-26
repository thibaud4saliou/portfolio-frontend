'use client';

import { useRef, useState } from 'react';
import type { FieldDef } from '@/lib/adminForm';
import { acceptFor, appendUrls, checkFile } from '@/lib/upload';
import { safeHref } from '@/lib/url';
import { UnauthorizedError } from './adminApi';
import { uploadFile } from './uploadClient';

const base = 'w-full bg-[#1a1a1a] border border-gray-800 text-white p-3 focus:outline-none focus:border-gray-500';

export default function FieldInput({
  def,
  value,
  error,
  onChange,
  onUnauthorized,
}: {
  def: FieldDef;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onUnauthorized?: () => void;
}) {
  const id = `f-${def.name}`;
  const fileRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState('');

  const shownError = error || uploadError;
  const common = {
    id,
    name: def.name,
    value,
    required: def.required,
    'aria-invalid': shownError ? true : undefined,
    'aria-describedby': shownError || def.help ? `${id}-hint` : undefined,
    className: `${base} ${shownError ? 'border-red-600' : ''}`,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(e.target.value),
  };

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0 || !def.upload) return;
    const list = Array.from(files);
    const invalid = list.map((f) => checkFile(f, def.upload!)).find(Boolean);
    if (invalid) {
      setUploadError(invalid);
      return;
    }
    setUploadError('');
    try {
      const urls: string[] = [];
      for (const [i, file] of list.entries()) {
        setProgress(0);
        urls.push(await uploadFile(file, (p) => setProgress(Math.round((i * 100 + p) / list.length))));
      }
      onChange(def.type === 'urlList' ? appendUrls(value, urls) : urls[0]);
    } catch (err) {
      if (err instanceof UnauthorizedError) onUnauthorized?.();
      else setUploadError((err as Error).message);
    } finally {
      setProgress(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  let control: React.ReactNode;
  if (def.type === 'select') {
    control = (
      <select {...common}>
        {def.options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  } else if (def.type === 'textarea' || def.type === 'urlList') {
    control = <textarea {...common} rows={def.rows ?? 3} />;
  } else {
    control = <input {...common} type={def.type} min={def.min} max={def.max} placeholder={def.placeholder} />;
  }

  const preview = def.upload === 'image' && def.type !== 'urlList' ? safeHref(value) : undefined;

  return (
    <div className={def.wide ? 'md:col-span-2' : undefined}>
      <label htmlFor={id} className="text-xs uppercase text-gray-500 block mb-1">
        {def.label}
        {def.required && ' *'}
      </label>

      <div className="flex gap-2 items-start">
        <div className="flex-1">{control}</div>
        {def.upload && (
          <>
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              accept={acceptFor(def.upload)}
              multiple={def.type === 'urlList'}
              onChange={(e) => handleFiles(e.target.files)}
              aria-label={`Téléverser — ${def.label}`}
            />
            <button
              type="button"
              disabled={progress !== null}
              onClick={() => fileRef.current?.click()}
              className="shrink-0 text-xs uppercase tracking-widest border border-gray-700 text-gray-300 hover:text-white hover:border-gray-400 px-3 py-3 disabled:opacity-60"
            >
              {progress !== null ? `${progress} %` : 'Téléverser'}
            </button>
          </>
        )}
      </div>

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="mt-2 h-20 w-auto border border-gray-800 object-cover" />
      )}

      {(shownError || def.help) && (
        <p id={`${id}-hint`} className={`text-xs mt-1 ${shownError ? 'text-red-400' : 'text-gray-600'}`}>
          {shownError || def.help}
        </p>
      )}
    </div>
  );
}
