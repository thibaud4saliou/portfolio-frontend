import type { Metadata, Viewport } from 'next';
import Footer from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import '@/styles/globals.css';

// Rendu à la requête ; les données de l'API sont mises en cache 5 min dans
// lib/api.ts et rafraîchies immédiatement après chaque modification dans l'admin.
export const dynamic = 'force-dynamic';

const SITE_URL = process.env.SITE_URL || 'http://localhost';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Thibaud Saliou | Réalisateur & Chef opérateur à Rennes, Bretagne',
    template: '%s | Thibaud Saliou',
  },
  description:
    'Portfolio de Thibaud Saliou, réalisateur et directeur de la photographie basé à Rennes (Bretagne) : clips, courts-métrages, publicité.',
  openGraph: { type: 'website', locale: 'fr_FR', siteName: 'Thibaud Saliou' },
};

export const viewport: Viewport = { themeColor: '#0a0a0a' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="relative min-h-screen flex flex-col">
        <Navbar />
        <main className="pt-32 pb-12 px-6 md:px-12 flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
