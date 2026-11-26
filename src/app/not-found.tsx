import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto pt-24 pb-24 text-center">
      <h1 className="text-3xl font-bold uppercase tracking-widest text-white mb-6">Page introuvable</h1>
      <Link href="/" className="text-gray-400 hover:text-white underline underline-offset-4">
        Retour à l’accueil
      </Link>
    </div>
  );
}
