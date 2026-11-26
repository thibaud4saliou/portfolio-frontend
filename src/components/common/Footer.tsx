import Link from 'next/link';
import { getSettings } from '@/lib/api';
import SocialLinks from './SocialLinks';

export default async function Footer() {
  const settings = await getSettings();

  return (
    <footer className="border-t border-gray-900 bg-[#0a0a0a] pt-12 pb-8 px-6 md:px-12 text-xs font-mono text-gray-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>© {new Date().getFullYear()} THIBAUD SALIOU. TOUS DROITS RÉSERVÉS.</div>
        <SocialLinks
          settings={settings}
          className="flex flex-wrap justify-center gap-6 uppercase tracking-widest font-sans"
          linkClassName="hover:text-white transition-colors"
        />
      </div>

      <div className="max-w-7xl mx-auto mt-8 flex flex-wrap justify-center gap-4 text-[10px] uppercase tracking-widest font-sans">
        <Link href="/mentions-legales" className="hover:text-white transition-colors">
          Mentions légales
        </Link>
        <span aria-hidden="true">·</span>
        <Link href="/politique-confidentialite" className="hover:text-white transition-colors">
          Politique de confidentialité (RGPD)
        </Link>
      </div>
    </footer>
  );
}
