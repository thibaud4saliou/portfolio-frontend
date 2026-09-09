import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full py-6 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center bg-[#0a0a0a]/90 backdrop-blur-md z-50 border-b border-gray-900 transition-all">
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm font-medium tracking-widest uppercase mb-4 md:mb-0">
        <Link href="/realisation" className="nav-link">Réalisation</Link>
        <Link href="/directeur-photo" className="nav-link">Dir. Photographie</Link>
        <Link href="/clips" className="nav-link">Clips</Link>
        <Link href="/photographie" className="nav-link">Photographie</Link>
      </div>
      
      <div className="text-center md:absolute md:left-1/2 md:-translate-x-1/2">
        <Link href="/">
          <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase">Thibaud Saliou</h1>
        </Link>
      </div>

      <div className="flex gap-6 text-xs md:text-sm font-medium tracking-widest uppercase mt-4 md:mt-0">
        <Link href="/" className="nav-link">À propos</Link>
        <Link href="/devis" className="nav-link text-white font-bold">Devis / Contact</Link>
      </div>
    </nav>
  );
}
