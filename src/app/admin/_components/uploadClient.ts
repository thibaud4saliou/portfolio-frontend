import { UnauthorizedError } from './adminApi';

/**
 * 1. Demande à l'API une URL d'upload présignée (session admin requise).
 * 2. Envoie le fichier DIRECTEMENT au bucket R2/S3 (pas via notre serveur).
 * 3. Retourne l'URL publique à enregistrer dans le champ.
 */
export async function uploadFile(file: File, onProgress?: (percent: number) => void): Promise<string> {
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
