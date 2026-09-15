import Link from 'next/link';

async function getSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data[0] : data;
  } catch (error) { return null; }
}

export default async function Footer() {
  const settings = await getSettings() || {};
  
  return (
    <footer className="border-t border-gray-900 bg-[#0a0a0a] pt-12 pb-8 px-6 md:px-12 text-xs font-mono text-gray-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>© {new Date().getFullYear()} THIBAUD SALIOU. ALL RIGHTS RESERVED.</div>
        
        <div className="flex flex-wrap justify-center gap-6 uppercase tracking-widest font-sans">
          {settings.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>}
          {settings.vimeo_url && <a href={settings.vimeo_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Vimeo</a>}
          {settings.youtube_url && <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YouTube</a>}
          {settings.linkedin_url && <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>}
          {settings.malt_url && <a href={settings.malt_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Malt</a>}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-8 flex flex-wrap justify-center gap-4 text-[10px] uppercase tracking-widest font-sans">
        <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link>
        <span>·</span>
        <Link href="/politique-confidentialite" className="hover:text-white transition-colors">Politique de confidentialité (RGPD)</Link>
      </div>
    </footer>
  );
}