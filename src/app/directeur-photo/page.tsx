import ProjectCard from '../../components/video/ProjectCard';

async function getProjects() {
  try {
    const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/projects', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) { return []; }
}

export default async function DirecteurPhoto() {
  const allProjects = await getProjects();
  const dpProjects = allProjects.filter((p: any) => p.category === 'directeur-photo');

  return (
    <div className="max-w-7xl mx-auto pt-12 pb-24 px-6 md:px-12">
      <h2 className="text-sm text-gray-400 font-bold tracking-[0.3em] uppercase mb-12 text-center md:text-left">
        / Directeur de la Photographie
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {dpProjects.map((p: any) => (
          <ProjectCard 
            key={p.id} 
            title={p.title} 
            role={p.role} 
            link={`/realisation/${p.id}`} 
            coverImageUrl={p.coverImageUrl}
          />
        ))}
      </div>
    </div>
  );
}
