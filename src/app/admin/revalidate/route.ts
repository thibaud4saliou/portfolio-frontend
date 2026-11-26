import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { CONTENT_TAG, isAdminSession } from '@/lib/api';

/**
 * Appelé par l'admin après chaque modification : vide le cache des pages
 * pour que le changement soit visible immédiatement sur le site.
 * La session est vérifiée auprès de l'API (même cookie HttpOnly).
 */
export async function POST(req: NextRequest) {
  if (!(await isAdminSession(req.headers.get('cookie') ?? ''))) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  }
  // Next 16 : { expire: 0 } = expiration immédiate (pas de « stale-while-revalidate »).
  revalidateTag(CONTENT_TAG, { expire: 0 });
  return NextResponse.json({ revalidated: true });
}
