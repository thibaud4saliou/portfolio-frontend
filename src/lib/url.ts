/**
 * Défense XSS côté affichage : React échappe le texte, mais PAS les attributs
 * href/src. Une URL "javascript:..." enregistrée en base s'exécuterait au clic.
 * On ne laisse donc passer que http(s) et les chemins internes.
 */
export function safeHref(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const v = value.trim();
  if (v.startsWith('/') && !v.startsWith('//') && !v.startsWith('/\\')) return v;
  try {
    const url = new URL(v);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

const YT_ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * Convertit un lien YouTube/Vimeo en URL d'intégration (iframe).
 * Retourne null pour tout autre domaine : on n'intègre jamais une page arbitraire.
 */
export function toEmbedUrl(value: string | null | undefined): string | null {
  const href = safeHref(value);
  if (!href || !isExternal(href)) return null;
  const url = new URL(href);
  const host = url.hostname.replace(/^www\.|^m\./, '');

  let ytId: string | null = null;
  if (host === 'youtu.be') ytId = url.pathname.slice(1).split('/')[0];
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (url.pathname === '/watch') ytId = url.searchParams.get('v');
    else {
      const m = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/);
      if (m) ytId = m[1];
    }
  }
  if (ytId) return YT_ID.test(ytId) ? `https://www.youtube-nocookie.com/embed/${ytId}` : null;

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const m = url.pathname.match(/(?:^|\/)(\d{5,})(?:\/([0-9a-f]+))?/);
    if (m) return `https://player.vimeo.com/video/${m[1]}${m[2] ? `?h=${m[2]}` : ''}`;
  }
  return null;
}
