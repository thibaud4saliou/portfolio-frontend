import Link from 'next/link';
import { safeHref } from '@/lib/url';

interface ProjectCardProps {
  id: string;
  title: string;
  role: string;
  coverImageUrl?: string | null;
  priority?: boolean;
}

export default function ProjectCard({ id, title, role, coverImageUrl, priority = false }: ProjectCardProps) {
  const cover = safeHref(coverImageUrl);
  return (
    <Link href={`/realisation/${encodeURIComponent(id)}`} className="group block">
      <div className="w-full aspect-video bg-[#111] border border-gray-900 overflow-hidden relative mb-4">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- images hébergées ailleurs (URLs libres)
          <img
            src={cover}
            alt={title}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600 text-sm uppercase tracking-widest group-hover:text-white transition-colors">
            {title}
          </div>
        )}
      </div>
      {/* Titre puis rôle en dessous : un rôle long (« Réalisateur, Scénariste, … »)
          ne peut plus déborder sur la carte voisine. */}
      <div className="min-w-0">
        <h3 className="text-xl font-bold uppercase tracking-wider text-gray-300 group-hover:text-white transition-colors break-words">
          {title}
        </h3>
        <p className="mt-2 text-xs uppercase tracking-widest text-gray-500 leading-relaxed break-words">{role}</p>
      </div>
    </Link>
  );
}
