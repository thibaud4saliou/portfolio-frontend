async function getSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, { cache: 'no-store' });
    const data = await res.json();
    return Array.isArray(data) ? data[0] : data;
  } catch (error) { return null; }
}

export default async function MentionsLegales() {
  const settings = await getSettings() || {};

  return (
    <div className="max-w-4xl mx-auto pt-24 pb-24 px-6 md:px-12 min-h-screen">
      <h1 className="text-3xl font-bold uppercase tracking-widest text-white mb-12 border-b border-gray-900 pb-6">Mentions Légales</h1>
      <div className="text-gray-300 whitespace-pre-line leading-relaxed font-light">
        {settings.mentions_legales_text || "Mentions légales à renseigner dans l'espace administrateur."}
      </div>
    </div>
  );
}