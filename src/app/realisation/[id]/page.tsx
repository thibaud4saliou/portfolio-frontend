import ProjectCard from '../../../components/video/ProjectCard';

async function getProject(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, { cache: 'no-store' });
    const all = await res.json();
    return all.find((p: any) => p.id === id);
  } catch (error) { return null; }
}

async function getAllProjects() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, { cache: 'no-store' });
    return res.json();
  } catch (error) { return []; }
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id);
  const allProjects = await getAllProjects();

  if (!project) return <div className="text-white text-center pt-24">Projet introuvable.</div>;

  const recommendations = allProjects
    .filter((p: any) => p.id !== project.id)
    .slice(0, 2);

  return (
    <div className="max-w-5xl mx-auto pt-24 px-6 pb-24">
      <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-white mb-8">{project.title}</h1>
      
      <div className="aspect-video w-full bg-[#111] border border-gray-900 mb-12">
        <iframe 
          src={project.videoUrl?.replace("watch?v=", "embed/")} 
          className="w-full h-full" 
          allowFullScreen 
        />
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8 text-gray-400 text-sm leading-relaxed">
          <p>{project.synopsis}</p>
          <div className="border-t border-gray-900 pt-8">
            <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-4">Crédits</h4>
            <pre className="font-sans whitespace-pre-wrap">{project.credits}</pre>
          </div>
        </div>
        <div className="text-gray-500 text-xs uppercase tracking-widest space-y-4">
          <p><span className="text-white">Année</span><br/>{project.year}</p>
          <p><span className="text-white">Rôle</span><br/>{project.role}</p>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="mt-24 border-t border-gray-900 pt-12">
          <h3 className="text-white uppercase tracking-widest text-xs font-bold mb-12">Vous aimeriez peut-être aussi...</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {recommendations.map((p: any) => (
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
      )}
    </div>
  );
}