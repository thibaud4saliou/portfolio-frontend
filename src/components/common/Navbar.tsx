import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50">
      <nav
        aria-label="Navigation principale"
        className="py-6 px-6 md:px-12 flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] items-center bg-[#0a0a0a]/90 backdrop-blur-md border-b border-gray-900 gap-4 md:gap-0"
      >
        <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-6 text-[10px] md:text-xs font-medium tracking-widest uppercase justify-self-start">
          <Link href="/directeur-photo" className="nav-link">Dir. Photo</Link>
          <Link href="/realisation" className="nav-link">Réalisation</Link>
          <Link href="/clips" className="nav-link">Clips</Link>
        </div>

        <div className="text-center justify-self-center order-first md:order-none mb-2 md:mb-0">
          <Link href="/" className="text-xl md:text-2xl font-bold tracking-widest uppercase whitespace-nowrap">
            Thibaud Saliou
          </Link>
        </div>

        <div className="flex justify-center md:justify-end gap-6 text-[10px] md:text-xs font-medium tracking-widest uppercase justify-self-end">
          <Link href="/#a-propos" className="nav-link">À propos</Link>
          <Link href="/devis" className="nav-link text-white font-bold">Devis / Contact</Link>
        </div>
      </nav>
    </header>
  );
}
