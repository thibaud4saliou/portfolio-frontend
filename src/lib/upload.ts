/**
 * Règles d'upload côté navigateur (miroir de backend/src/lib/uploads.ts).
 * Le serveur revérifie tout : ceci sert seulement à prévenir l'utilisateur tôt.
 */
export type UploadKind = 'image' | 'video' | 'media';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
const VIDEO_TYPES = ['video/mp4', 'video/webm'];
const MB = 1024 * 1024;
export const MAX_IMAGE_BYTES = 15 * MB;
export const MAX_VIDEO_BYTES = 300 * MB;

export function acceptFor(kind: UploadKind): string {
  if (kind === 'image') return IMAGE_TYPES.join(',');
  if (kind === 'video') return VIDEO_TYPES.join(',');
  return [...IMAGE_TYPES, ...VIDEO_TYPES].join(',');
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < MB) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / MB).toFixed(1).replace('.0', '')} Mo`;
}

/** Retourne un message d'erreur, ou null si le fichier est acceptable. */
export function checkFile(file: { type: string; size: number; name?: string }, kind: UploadKind): string | null {
  const isImage = IMAGE_TYPES.includes(file.type);
  const isVideo = VIDEO_TYPES.includes(file.type);
  const label = file.name ? `« ${file.name} » : ` : '';
  if ((kind === 'image' && !isImage) || (kind === 'video' && !isVideo) || (kind === 'media' && !isImage && !isVideo)) {
    return `${label}format non accepté (${kind === 'video' ? 'MP4, WebM' : kind === 'image' ? 'JPG, PNG, WebP, AVIF, GIF' : 'image ou vidéo'})`;
  }
  const max = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > max) return `${label}fichier trop lourd (${formatBytes(file.size)}, max ${formatBytes(max)})`;
  if (file.size === 0) return `${label}fichier vide`;
  return null;
}

/** Ajoute des URL à une liste "une URL par ligne" sans doublons. */
export function appendUrls(current: string, urls: string[]): string {
  const existing = current
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const merged = [...existing, ...urls.filter((u) => !existing.includes(u))];
  return merged.join('\n');
}
