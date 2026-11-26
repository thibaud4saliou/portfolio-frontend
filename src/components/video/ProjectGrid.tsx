import { getProjects } from '@/lib/api';
import type { ProjectCategory } from '@/lib/types';
import ProjectCard from './ProjectCard';

/** Page liste commune à Clips / Réalisation / Dir. photo (avant : 3 fichiers copiés-collés). */
export default async function ProjectGrid({ category, title }: { category: ProjectCategory; title: string }) {
  const projects = (await getProjects()).filter((p) => p.category === category);

  return (
    <div className="max-w-7xl mx-auto pt-12 pb-24">
      <h1 className="text-sm text-gray-400 font-bold tracking-[0.3em] uppercase mb-12 text-center md:text-left">
        / {title}
      </h1>
      {projects.length === 0 ? (
        <p className="text-center text-gray-600 text-sm py-24 border border-gray-800 border-dashed">
          Projets à venir.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} id={p.id} title={p.title} role={p.role} coverImageUrl={p.coverImageUrl} priority={i < 2} />
          ))}
        </div>
      )}
    </div>
  );
}
