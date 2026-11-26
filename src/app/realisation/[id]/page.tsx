import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectCard from '@/components/video/ProjectCard';
import { getProject, getProjects } from '@/lib/api';
import { safeHref, toEmbedUrl } from '@/lib/url';

// Next 15+ : params est une Promise.
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return { title: 'Projet introuvable' };
  const cover = safeHref(project.coverImageUrl);
  return {
    title: project.title,
    description: project.synopsis?.slice(0, 160) || `${project.title} — ${project.role}, ${project.year}`,
    openGraph: cover ? { images: [cover] } : undefined,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const [project, all] = await Promise.all([getProject(id), getProjects()]);
  if (!project) notFound();

  // Suggestions : d'abord la même catégorie, puis le reste.
  const others = all.filter((p) => p.id !== project.id);
  const recommendations = [
    ...others.filter((p) => p.category === project.category),
    ...others.filter((p) => p.category !== project.category),
  ].slice(0, 2);

  const embedUrl = toEmbedUrl(project.videoUrl);
  const stills = (project.stills ?? []).map((s) => safeHref(s)).filter((s): s is string => Boolean(s));

  return (
    <article className="max-w-5xl mx-auto pt-12 pb-24">
      <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-white mb-8">{project.title}</h1>

      {embedUrl && (
        <div className="aspect-video w-full bg-[#111] border border-gray-900 mb-12">
          <iframe
            src={embedUrl}
            title={project.title}
            className="w-full h-full"
            loading="lazy"
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8 text-gray-400 text-sm leading-relaxed">
          {project.synopsis && <p className="whitespace-pre-line">{project.synopsis}</p>}
          {project.credits && (
            <div className="border-t border-gray-900 pt-8">
              <h2 className="text-white uppercase tracking-widest text-xs font-bold mb-4">Crédits</h2>
              <p className="whitespace-pre-wrap">{project.credits}</p>
            </div>
          )}
        </div>
        <dl className="text-gray-500 text-xs uppercase tracking-widest space-y-4">
          <div>
            <dt className="text-white">Année</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt className="text-white">Rôle</dt>
            <dd>{project.role}</dd>
          </div>
        </dl>
      </div>

      {stills.length > 0 && (
        <section className="mt-16 border-t border-gray-900 pt-12">
          <h2 className="text-white uppercase tracking-widest text-xs font-bold mb-8">Galerie / Stills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stills.map((src, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src + index}
                src={src}
                alt={`${project.title} — image ${index + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-auto border border-gray-800 object-cover"
              />
            ))}
          </div>
        </section>
      )}

      {recommendations.length > 0 && (
        <section className="mt-24 border-t border-gray-900 pt-12">
          <h2 className="text-white uppercase tracking-widest text-xs font-bold mb-12">Vous aimeriez peut-être aussi…</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {recommendations.map((p) => (
              <ProjectCard key={p.id} id={p.id} title={p.title} role={p.role} coverImageUrl={p.coverImageUrl} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
