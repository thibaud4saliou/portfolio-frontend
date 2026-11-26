import { describe, expect, it } from 'vitest';
import { isExternal, safeHref, toEmbedUrl } from './url';

describe('safeHref', () => {
  it('laisse passer http(s) et chemins internes', () => {
    expect(safeHref('https://instagram.com/x')).toBe('https://instagram.com/x');
    expect(safeHref(' /realisation/1 ')).toBe('/realisation/1');
  });

  it('bloque les URL dangereuses (XSS)', () => {
    expect(safeHref('javascript:alert(document.cookie)')).toBeUndefined();
    expect(safeHref('JAVASCRIPT:alert(1)')).toBeUndefined();
    expect(safeHref('data:text/html;base64,PHNjcmlwdD4=')).toBeUndefined();
    expect(safeHref('//evil.com')).toBeUndefined();
    expect(safeHref('/\\evil.com')).toBeUndefined();
  });

  it('gère vide / null / invalide', () => {
    expect(safeHref(null)).toBeUndefined();
    expect(safeHref(undefined)).toBeUndefined();
    expect(safeHref('')).toBeUndefined();
    expect(safeHref('n importe quoi')).toBeUndefined();
  });
});

describe('isExternal', () => {
  it('distingue liens externes et internes', () => {
    expect(isExternal('https://vimeo.com')).toBe(true);
    expect(isExternal('/devis')).toBe(false);
  });
});

describe('toEmbedUrl', () => {
  const yt = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ';

  it('convertit tous les formats YouTube', () => {
    expect(toEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(yt);
    expect(toEmbedUrl('https://youtube.com/watch?v=dQw4w9WgXcQ&t=42s')).toBe(yt);
    expect(toEmbedUrl('https://m.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(yt);
    expect(toEmbedUrl('https://youtu.be/dQw4w9WgXcQ?si=abc')).toBe(yt);
    expect(toEmbedUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe(yt);
    expect(toEmbedUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(yt);
  });

  it('convertit Vimeo (avec hash de vidéo privée)', () => {
    expect(toEmbedUrl('https://vimeo.com/123456789')).toBe('https://player.vimeo.com/video/123456789');
    expect(toEmbedUrl('https://vimeo.com/123456789/abcdef1234')).toBe('https://player.vimeo.com/video/123456789?h=abcdef1234');
    expect(toEmbedUrl('https://player.vimeo.com/video/123456789')).toBe('https://player.vimeo.com/video/123456789');
  });

  it("refuse les autres sites et les ID invalides (pas d'iframe arbitraire)", () => {
    expect(toEmbedUrl('https://evil.com/watch?v=dQw4w9WgXcQ')).toBeNull();
    expect(toEmbedUrl('https://youtube.com/watch?v=<script>')).toBeNull();
    expect(toEmbedUrl('https://youtube.com/channel/abc')).toBeNull();
    expect(toEmbedUrl('https://vimeo.com/about')).toBeNull();
    expect(toEmbedUrl('javascript:alert(1)')).toBeNull();
    expect(toEmbedUrl('/local')).toBeNull();
    expect(toEmbedUrl(null)).toBeNull();
  });
});
