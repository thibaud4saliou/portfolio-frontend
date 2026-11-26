import { unstable_cache } from 'next/cache';
import type { Equipment, Project, Review, Settings } from './types';

/**
 * Accès à l'API depuis le SERVEUR Next uniquement (Server Components).
 * On passe par le réseau Docker interne : http://backend:5000.
 * Le navigateur, lui, appelle "/api/..." en relatif (via nginx).
 */
const API = process.env.API_INTERNAL_URL ?? 'http://localhost:5000';

/** Tag invalidé par l'admin après chaque modification (voir /admin/revalidate). */
export const CONTENT_TAG = 'content';
const REVALIDATE_SECONDS = 300;

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { cache: 'no-store' });
  if (res.status === 404) return null as T;
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return (await res.json()) as T;
}

/**
 * Mise en cache 5 min (ou jusqu'à la prochaine modif admin). En cas d'erreur,
 * on renvoie la valeur par défaut SANS la mettre en cache, pour ne pas figer
 * une page vide si l'API redémarre.
 */
function cached<T>(path: string, fallback: T) {
  const load = unstable_cache(() => fetchJson<T>(path), ['api', path], {
    revalidate: REVALIDATE_SECONDS,
    tags: [CONTENT_TAG],
  });
  return async (): Promise<T> => {
    try {
      return (await load()) ?? fallback;
    } catch (err) {
      console.error('[api]', (err as Error).message);
      return fallback;
    }
  };
}

export const getSettings = cached<Settings>('/api/settings', {});
export const getProjects = cached<Project[]>('/api/projects', []);
export const getReviews = cached<Review[]>('/api/reviews', []);
export const getEquipment = cached<Equipment[]>('/api/equipment', []);

export async function getProject(id: string): Promise<Project | null> {
  return cached<Project | null>(`/api/projects/${encodeURIComponent(id)}`, null)();
}

export async function isAdminSession(cookieHeader: string): Promise<boolean> {
  try {
    const res = await fetch(`${API}/api/auth/session`, { headers: { cookie: cookieHeader }, cache: 'no-store' });
    return res.ok && (await res.json()).authenticated === true;
  } catch {
    return false;
  }
}
