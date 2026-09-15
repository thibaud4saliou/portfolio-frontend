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

  // Amélioration de l'URL vidéo pour s'assurer que l'intégration (embed) marche avec tous les liens YouTube
  let embedUrl = project.videoUrl;
  if (embedUrl?.includes("youtu.be/")) {
    embedUrl = embedUrl.replace("youtu.be/", "youtube.com/embed/");
  } else if (embedUrl?.includes("watch?v=")) {
    embedUrl = embedUrl.replace("watch?v=", "embed/");
  }

  return (
    <div className="max-w-5xl mx-auto pt-24 px-6 pb-24">
      <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-white mb-8">{project.title}</h1>
      
      {embedUrl && (
        <div className="aspect-video w-full bg-[#111] border border-gray-900 mb-12">
          <iframe 
            src={embedUrl} 
            className="w-full h-full" 
            allowFullScreen 
          />
        </div>
      )}

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

      {/* NOUVEAU : SECTION STILLS / GALERIE */}
      {project.stills && project.stills.length > 0 && (
        <div className="mt-16 border-t border-gray-900 pt-12">
          <h3 className="text-white uppercase tracking-widest text-xs font-bold mb-8">Galerie / Stills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.stills.map((imgUrl: string, index: number) => (
              <img 
                key={index} 
                src={imgUrl} 
                alt={`${project.title} - Image${index + 1}`} 
                className="w-full h-auto border border-gray-800 object-cover" 
              />
            ))}
          </div>
        </div>
      )}

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