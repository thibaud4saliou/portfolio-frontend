import type { MetadataRoute } from 'next';
import { getProjects } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.SITE_URL || 'http://localhost';
  const pages = ['', '/directeur-photo', '/realisation', '/clips', '/devis', '/mentions-legales', '/politique-confidentialite'];
  const projects = await getProjects();
  return [
    ...pages.map((p) => ({ url: `${site}${p}` })),
    ...projects.map((p) => ({ url: `${site}/realisation/${p.id}` })),
  ];
}
