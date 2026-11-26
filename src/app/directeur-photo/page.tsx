import type { Metadata } from 'next';
import ProjectGrid from '@/components/video/ProjectGrid';

export const metadata: Metadata = {
  title: 'Directeur de la photographie',
  description: 'Projets sur lesquels Thibaud Saliou a été chef opérateur / directeur de la photographie.',
};

export default function DirecteurPhoto() {
  return <ProjectGrid category="directeur-photo" title="Directeur de la photographie" />;
}
