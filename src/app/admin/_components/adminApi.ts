/** Appels de l'admin vers l'API (URL relatives → nginx → backend). */
export class UnauthorizedError extends Error {}

export interface ApiResult<T = unknown> {
  ok: boolean;
  status: number;
  data: T & { error?: string; fields?: Record<string, string> };
}

export async function adminRequest<T = unknown>(method: string, path: string, body?: unknown): Promise<ApiResult<T>> {
  const res = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  if (res.status === 401 && !path.startsWith('/api/auth/')) throw new UnauthorizedError();
  const data = res.status === 204 ? {} : await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

/** Rafraîchit le cache des pages publiques (sans bloquer si ça échoue). */
export function refreshSite() {
  fetch('/admin/revalidate', { method: 'POST', credentials: 'same-origin' }).catch(() => undefined);
}
