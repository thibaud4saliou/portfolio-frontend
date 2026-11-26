/**
 * Logique (pure, testée) des formulaires de l'admin : conversion entre les
 * objets de l'API et les valeurs texte des champs.
 */
export type FieldType = 'text' | 'url' | 'number' | 'textarea' | 'select' | 'email' | 'urlList';

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: readonly { value: string; label: string }[];
  rows?: number;
  placeholder?: string;
  help?: string;
  min?: number;
  max?: number;
  wide?: boolean;
  /** Affiche un bouton « Téléverser » (upload R2/S3) à côté du champ. */
  upload?: 'image' | 'video' | 'media';
}

export type FormValues = Record<string, string>;

export function emptyValues(fields: readonly FieldDef[]): FormValues {
  const out: FormValues = {};
  for (const f of fields) {
    out[f.name] = f.type === 'select' && f.options?.length ? f.options[0].value : f.type === 'number' ? '0' : '';
  }
  return out;
}

export function toFormValues(item: Record<string, unknown> | null | undefined, fields: readonly FieldDef[]): FormValues {
  const out = emptyValues(fields);
  if (!item) return out;
  for (const f of fields) {
    const v = item[f.name];
    if (v === null || v === undefined) continue;
    out[f.name] = Array.isArray(v) ? v.join('\n') : String(v);
  }
  return out;
}

export function toPayload(values: FormValues, fields: readonly FieldDef[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = (values[f.name] ?? '').trim();
    if (f.type === 'number') {
      const n = Number(raw);
      out[f.name] = raw === '' || Number.isNaN(n) ? 0 : n;
    } else if (f.type === 'urlList') {
      out[f.name] = raw
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      out[f.name] = raw;
    }
  }
  return out;
}

/** Transforme { title: "Champ obligatoire" } en message lisible avec les libellés. */
export function describeErrors(errors: Record<string, string> | undefined, fields: readonly FieldDef[]): string {
  if (!errors || Object.keys(errors).length === 0) return '';
  return Object.entries(errors)
    .map(([name, msg]) => `${fields.find((f) => f.name === name)?.label ?? name} : ${msg}`)
    .join(' · ');
}
