import '../styles/globals.css';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thibaud Saliou - Réalisateur & Chef Opérateur',
  description: 'Portfolio de Thibaud Saliou, Réalisateur et Chef Opérateur.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="relative min-h-screen flex flex-col">
        <Navbar />
        <main className="pt-32 pb-12 px-6 md:px-12 flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
