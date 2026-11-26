import { describe, expect, it } from 'vitest';
import { acceptFor, appendUrls, checkFile, formatBytes, MAX_IMAGE_BYTES } from './upload';

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
