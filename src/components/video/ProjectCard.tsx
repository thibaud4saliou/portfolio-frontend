import Link from 'next/link';

interface ProjectCardProps {
  title: string;
  role: string;
  link: string;
  coverImageUrl?: string;
}

export default function ProjectCard({ title, role, link, coverImageUrl }: ProjectCardProps) {
  return (
    <Link href={link} className="group block">
      <div className="w-full aspect-video bg-[#111] border border-gray-900 overflow-hidden relative mb-4">
        {coverImageUrl ? (
          <img 
            src={coverImageUrl} 
            alt={title} 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600 font-mono text-sm group-hover:text-white transition-colors bg-[#111]">
            [Image_HD_{title.replace(/\s+/g, '_')}.jpg]
          </div>
        )}
      </div>
      <div className="flex justify-between items-baseline">
        <h3 className="text-xl font-bold uppercase tracking-wider text-gray-300 group-hover:text-white transition-colors">{title}</h3>
        <p className="text-xs uppercase tracking-widest text-gray-500">{role}</p>
      </div>
    </Link>
  );
}
