import { describe, expect, it } from 'vitest';
import { describeErrors, emptyValues, toFormValues, toPayload, type FieldDef } from './adminForm';

const fields: FieldDef[] = [
  { name: 'title', label: 'Titre', type: 'text', required: true },
  { name: 'category', label: 'Catégorie', type: 'select', options: [{ value: 'clip', label: 'Clip' }] },
  { name: 'order', label: 'Ordre', type: 'number' },
  { name: 'stills', label: 'Stills', type: 'urlList' },
  { name: 'empty', label: 'Vide', type: 'select', options: [] },
];

describe('emptyValues', () => {
  it('pré-remplit select (1re option) et nombres (0)', () => {
    expect(emptyValues(fields)).toEqual({ title: '', category: 'clip', order: '0', stills: '', empty: '' });
  });
});

describe('toFormValues', () => {
  it("convertit un objet de l'API en valeurs de formulaire", () => {
    const v = toFormValues({ id: 'x', title: 'T', order: 3, stills: ['a', 'b'], category: null }, fields);
    expect(v).toEqual({ title: 'T', category: 'clip', order: '3', stills: 'a\nb', empty: '' });
  });
  it('gère un objet absent', () => {
    expect(toFormValues(null, fields).title).toBe('');
  });
});

describe('toPayload', () => {
  it('convertit les valeurs en corps de requête', () => {
    const p = toPayload({ title: '  T  ', category: 'clip', order: '4', stills: 'https://a, https://b\n\nhttps://c' }, fields);
    expect(p).toEqual({ title: 'T', category: 'clip', order: 4, stills: ['https://a', 'https://b', 'https://c'], empty: '' });
  });
  it('met 0 pour un nombre vide ou invalide', () => {
    expect(toPayload({ order: '' }, fields).order).toBe(0);
    expect(toPayload({ order: 'abc' }, fields).order).toBe(0);
  });
});

describe('describeErrors', () => {
  it('utilise les libellés des champs', () => {
    expect(describeErrors({ title: 'Champ obligatoire', inconnu: 'x' }, fields)).toBe('Titre : Champ obligatoire · inconnu : x');
    expect(describeErrors(undefined, fields)).toBe('');
    expect(describeErrors({}, fields)).toBe('');
  });
});
