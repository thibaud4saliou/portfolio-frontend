import { describe, expect, it } from 'vitest';
import { acceptFor, appendUrls, checkFile, fitWithin, formatBytes, MAX_IMAGE_BYTES, shouldCompress, uploadHint } from './upload';

describe('acceptFor', () => {
  it('liste les types acceptés', () => {
    expect(acceptFor('image')).toContain('image/webp');
    expect(acceptFor('image')).not.toContain('video');
    expect(acceptFor('video')).toBe('video/mp4,video/webm');
    expect(acceptFor('media')).toContain('image/png');
    expect(acceptFor('media')).toContain('video/mp4');
  });
});

describe('formatBytes', () => {
  it('formate en o / Ko / Mo', () => {
    expect(formatBytes(500)).toBe('500 o');
    expect(formatBytes(2048)).toBe('2 Ko');
    expect(formatBytes(15 * 1024 * 1024)).toBe('15 Mo');
    expect(formatBytes(1.5 * 1024 * 1024)).toBe('1.5 Mo');
  });
});

describe('checkFile', () => {
  it('accepte une image ou une vidéo valide', () => {
    expect(checkFile({ type: 'image/jpeg', size: 1000 }, 'image')).toBeNull();
    expect(checkFile({ type: 'video/mp4', size: 1000 }, 'video')).toBeNull();
    expect(checkFile({ type: 'video/mp4', size: 1000 }, 'media')).toBeNull();
  });

  it('refuse un mauvais type selon le champ', () => {
    expect(checkFile({ type: 'video/mp4', size: 10, name: 'a.mp4' }, 'image')).toMatch(/« a\.mp4 » : format non accepté/);
    expect(checkFile({ type: 'image/png', size: 10 }, 'video')).toMatch(/MP4/);
    expect(checkFile({ type: 'image/svg+xml', size: 10 }, 'media')).toMatch(/image ou vidéo/);
  });

  it('refuse un fichier trop lourd ou vide', () => {
    expect(checkFile({ type: 'image/png', size: MAX_IMAGE_BYTES + 1 }, 'image')).toMatch(/trop lourd/);
    expect(checkFile({ type: 'image/png', size: 0 }, 'image')).toMatch(/vide/);
  });
});

describe('appendUrls', () => {
  it('ajoute sans doublons', () => {
    expect(appendUrls('', ['a'])).toBe('a');
    expect(appendUrls('a, b\n', ['b', 'c'])).toBe('a\nb\nc');
  });
});

describe('uploadHint', () => {
  it('indique formats et tailles max', () => {
    expect(uploadHint('image')).toBe('JPG, PNG, WebP, AVIF ou GIF · 15 Mo max · optimisées automatiquement');
    expect(uploadHint('video')).toBe('MP4 ou WebM · 300 Mo max');
    expect(uploadHint('media')).toContain('300 Mo');
  });
});

describe('fitWithin / shouldCompress', () => {
  it('réduit proportionnellement les grandes images', () => {
    expect(fitWithin(6000, 4000)).toEqual({ width: 2560, height: 1707 });
    expect(fitWithin(3000, 6000, 1000)).toEqual({ width: 500, height: 1000 });
  });
  it("n'agrandit jamais une petite image", () => {
    expect(fitWithin(800, 600)).toEqual({ width: 800, height: 600 });
  });
  it('compresse les photos mais pas les GIF ni les vidéos', () => {
    expect(shouldCompress('image/png')).toBe(true);
    expect(shouldCompress('image/jpeg')).toBe(true);
    expect(shouldCompress('image/gif')).toBe(false);
    expect(shouldCompress('video/mp4')).toBe(false);
  });
});
