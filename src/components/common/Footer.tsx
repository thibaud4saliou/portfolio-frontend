import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-900 mt-24 py-8 px-6 md:px-12 flex flex-col text-xs text-gray-500 tracking-widest uppercase gap-6">
      <div className="flex flex-col md:flex-row justify-between items-center w-full">
        <div className="mb-4 md:mb-0">
          © {new Date().getFullYear()} Thibaud Saliou. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
          <a href="https://vimeo.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Vimeo</a>
        </div>
      </div>
      
      {/* Ligne des obligations légales */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-[10px] text-gray-600 border-t border-gray-900 pt-6">
        <Link href="/mentions-legales" className="hover:text-gray-400 transition-colors">Mentions Légales</Link>
        <span className="hidden md:inline">•</span>
        <Link href="/politique-confidentialite" className="hover:text-gray-400 transition-colors">Politique de confidentialité (RGPD)</Link>
      </div>
    </footer>
  );
}
