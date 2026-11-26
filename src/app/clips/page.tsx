import type { Metadata } from 'next';
import ProjectGrid from '@/components/video/ProjectGrid';

export const metadata: Metadata = { title: 'Clips vidéo', description: 'Clips musicaux réalisés par Thibaud Saliou.' };

export default function Clips() {
  return <ProjectGrid category="clip" title="Clips vidéo" />;
}
