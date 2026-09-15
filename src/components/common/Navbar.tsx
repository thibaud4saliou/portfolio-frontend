import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full py-6 px-6 md:px-12 flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] items-center bg-[#0a0a0a]/90 backdrop-blur-md z-50 border-b border-gray-900 transition-all gap-4 md:gap-0">
      
      {/* 1. GAUCHE : Liens (Alignés au début) */}
      <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-6 text-[10px] md:text-xs font-medium tracking-widest uppercase justify-self-start">
        <Link href="/realisation" className="nav-link">Réalisation</Link>
        <Link href="/directeur-photo" className="nav-link">Dir. Photo</Link>
        <Link href="/clips" className="nav-link">Clips</Link>
        <Link href="/photographie" className="nav-link">Photographie</Link>
      </div>
      
      {/* 2. CENTRE : Logo (Toujours au milieu) */}
      <div className="text-center justify-self-center order-first md:order-none mb-2 md:mb-0">
        <Link href="/">
          <h1 className="text-xl md:text-2xl font-bold tracking-widest uppercase whitespace-nowrap">Thibaud Saliou</h1>
        </Link>
      </div>

      {/* 3. DROITE : Contact (Alignés à la fin) */}
      <div className="flex justify-center md:justify-end gap-6 text-[10px] md:text-xs font-medium tracking-widest uppercase justify-self-end">
        <Link href="/" className="nav-link">À propos</Link>
        <Link href="/devis" className="nav-link text-white font-bold">Devis / Contact</Link>
      </div>
    </nav>
  );
}