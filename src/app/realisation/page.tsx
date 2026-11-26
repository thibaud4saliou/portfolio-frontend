import type { Metadata } from 'next';
import ProjectGrid from '@/components/video/ProjectGrid';

export const metadata: Metadata = { title: 'Réalisation', description: 'Courts-métrages et projets réalisés par Thibaud Saliou.' };

export default function Realisation() {
  return <ProjectGrid category="realisation" title="Réalisation" />;
}
