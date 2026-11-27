import { fitWithin, shouldCompress } from '@/lib/upload';
import { UnauthorizedError } from './adminApi';

/**
 * Convertit une photo en WebP (≤ 2560 px) dans le navigateur avant l'envoi :
 * fichiers 5 à 10× plus légers, donc site plus rapide et stockage économisé.
 * Si le navigateur ne sait pas encoder en WebP (certains Safari) ou si le
 * résultat n'est pas plus léger, on garde le fichier d'origine.
 */
async function optimizeImage(file: File): Promise<File> {
  if (!shouldCompress(file.type) || typeof createImageBitmap !== 'function') return file;
  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = fitWithin(bitmap.width, bitmap.height);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.85));
    if (!blob || blob.type !== 'image/webp' || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
  } catch {
    return file;
  }
}

/**
 * 1. Demande à l'API une URL d'upload présignée (session admin requise).
 * 2. Envoie le fichier DIRECTEMENT au bucket R2/S3 (pas via notre serveur).
 * 3. Retourne l'URL publique à enregistrer dans le champ.
 */
export async function uploadFile(original: File, onProgress?: (percent: number) => void): Promise<string> {
  const file = await optimizeImage(original);
  const res = await fetch('/api/uploads/presign', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentType: file.type, size: file.size, filename: file.name }),
  });
  if (res.status === 401) throw new UnauthorizedError();
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Erreur ${res.status}`);

  const { uploadUrl, publicUrl, headers } = data as {
    uploadUrl: string;
    publicUrl: string;
    headers: Record<string, string>;
  };

  // XMLHttpRequest plutôt que fetch : il donne la progression de l'envoi.
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    for (const [k, v] of Object.entries(headers ?? {})) xhr.setRequestHeader(k, v);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Le stockage a refusé l'envoi (${xhr.status})`));
    xhr.onerror = () => reject(new Error('Envoi interrompu (réseau ou CORS du bucket)'));
    xhr.send(file);
  });

  return publicUrl;
}
