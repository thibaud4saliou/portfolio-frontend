import Link from 'next/link';

// 1. Fonction pour récupérer les Avis
async function getReviews() {
  try {
    const res = await fetch('http://localhost:5001/api/reviews', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Erreur API Avis:", error);
    return [];
  }
}

// 2. Fonction pour récupérer le Matériel
async function getEquipment() {
  try {
    const res = await fetch('http://localhost:5001/api/equipment', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Erreur API Matériel:", error);
    return [];
  }
}

export default async function Home() {
  // Récupération des données depuis la BDD
  const reviews = await getReviews();
  const equipment = await getEquipment();

  // On trie le matériel par catégorie pour le ranger dans les bonnes colonnes
  const cameras = equipment.filter((eq: any) => eq.category === 'Caméras');
  const optics = equipment.filter((eq: any) => eq.category === 'Optiques');
  const lights = equipment.filter((eq: any) => eq.category === 'Lumière / Machinerie');

  return (
    <div className="flex flex-col w-full -mt-32">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#111] text-gray-700 font-mono text-sm border-b border-gray-900">
          [Vidéo Bande Démo (Autoplay / Loop / Muted) en Background]
        </div>
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 text-center px-4 flex flex-col items-center mt-16">
          <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-widest text-white drop-shadow-2xl mb-6">
            Thibaud Saliou
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 uppercase tracking-[0.3em] font-light">
            Réalisateur & Dir. Photographie
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
        
        {/* 2. SECTION PRÉSENTATION (Histoire & Vision) */}
        <section className="py-24 border-b border-gray-900 grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5 relative">
            <div className="sticky top-32 w-full aspect-[4/5] bg-[#111] border border-gray-800 rounded-sm flex items-center justify-center text-gray-600 font-mono text-sm">
              [Photo_Portrait_Thibaud.jpg]
            </div>
          </div>
          
          <div className="md:col-span-7 space-y-16 text-gray-300 leading-relaxed text-lg font-light">
            <div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-6">Mon histoire & ma vision</h3>
              <div className="space-y-4">
                <p>Mon histoire avec l’image a commencé à 13 ans, lorsque je reçois mon premier caméscope à mon anniversaire, déjà fasciné par la puissance de la narration visuelle des films de Zack Snyder. C’est durant mes études de cinéma à l’Université Rennes 2 que mon regard s’est affûté, entre la rigueur documentaire de Wang Bing et Pedro Costa à l’esthétique macabre et stylisée de Dario Argento.</p>
                <p className="font-medium text-white italic">De ces univers très différents, j’en ai tiré une conclusion : une image doit être puissante.</p>
                <p>Qu'il s'agisse de sublimer le quotidien dans une approche naturaliste ou de plonger dans un univers sombre et organique, je cherche sans cesse l'expressivité des visages et la vérité d'un regard. Mon travail sur la lumière et le cadrage n'a qu'un but : produire de l’émotion et remplacer ce que les mots ne pourront jamais dire.</p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-6">Une expertise technique au service de votre univers</h3>
              <div className="space-y-4">
                <p>Mon précédent double parcours de photographe et d'assistant caméra m’a apporté la rigueur, la maîtrise technique mais surtout le regard nécessaire à la création d’émotions. Aujourd'hui, installé à Rennes et exerçant en freelance, je mets cette double exigence — artistique et technique — au service de vos projets en tant que réalisateur, directeur de la photographie et étalonneur.</p>
                <p>Équipé de mon propre matériel professionnel, je me déplace partout en Bretagne et je prends en charge la chaîne image de A à Z pour garantir une identité visuelle forte, cohérente et maîtrisée.</p>
              </div>
            </div>

            <div className="bg-[#0f0f0f] p-8 border border-gray-900 rounded-sm">
              <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-6">Réalisation de clips</h3>
              <div className="space-y-4 mb-8">
                <p>Étant passionné de musique et d’images, le clip musical est aujourd’hui le cœur de ma création. C'est le terrain idéal pour fusionner ma vision cinématographique avec l'identité d'un morceau, quel que soit son genre musical.</p>
                <p>Vous êtes un·e artiste, un groupe ou un label et vous cherchez une production visuelle affirmée pour votre musique ? Je vous accompagne de l'écriture du concept jusqu'à l'étalonnage final :</p>
                <ul className="list-disc list-inside text-gray-400 marker:text-white space-y-2 ml-2">
                  <li>Conception & Réalisation sur-mesure</li>
                  <li>Direction de la photographie & Étalonnage</li>
                  <li>Devis personnalisés selon vos ambitions et vos budgets de production</li>
                </ul>
              </div>
              <Link href="/devis" className="inline-block w-full text-center md:w-auto bg-white text-black font-bold uppercase tracking-widest px-8 py-4 hover:bg-gray-300 transition-colors">
                📩 Me contacter pour votre projet
              </Link>
            </div>
          </div>
        </section>

        {/* 3. SECTION PRIX / SÉLECTIONS */}
        <section className="py-24 border-b border-gray-900">
          <h2 className="text-sm text-gray-400 font-bold tracking-[0.3em] uppercase mb-16 text-center">/ Sélections & Prix</h2>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-80">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-20 h-20 border border-gray-700 rounded-full flex items-center justify-center font-mono text-[10px] text-gray-500 hover:border-white transition-colors duration-300">Laurier</div>
              <p className="text-xs uppercase tracking-widest text-gray-300">Berlin Commercial<br/>Shortlist 2026</p>
            </div>
          </div>
        </section>

        {/* 4. SECTION CARROUSEL D'AVIS */}
        <section className="py-24 border-b border-gray-900">
          <h2 className="text-sm text-gray-400 font-bold tracking-[0.3em] uppercase mb-16 text-center">/ Ils m’ont fait confiance</h2>
          
          {reviews.length === 0 ? (
            <p className="text-center text-gray-600 font-mono text-sm py-12 border border-gray-800 border-dashed">
              Aucun avis dans la base de données.
            </p>
          ) : (
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-8">
              {reviews.map((review: any) => (
                <div key={review.id} className="min-w-[90vw] md:min-w-[500px] max-w-[500px] snap-center bg-[#111] hover:bg-[#151515] transition-colors p-8 md:p-10 border border-gray-800 rounded-sm flex flex-col justify-between">
                  <div className="max-h-64 overflow-y-auto hide-scrollbar mb-8 pr-2">
                    <p className="text-base md:text-lg text-gray-300 italic whitespace-pre-line">« {review.text} »</p>
                  </div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mt-auto">— {review.author}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. SECTION MATÉRIEL */}
        <section className="py-24">
          <h2 className="text-sm text-gray-400 font-bold tracking-[0.3em] uppercase mb-16 text-center">/ Mon Matériel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            
            <div className="bg-[#0f0f0f] p-8 border border-gray-900 rounded-sm">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 border-b border-gray-800 pb-4">Caméras</h3>
              <ul className="text-gray-400 space-y-4 text-sm font-light">
                {cameras.length === 0 && <li className="italic text-gray-600">À remplir dans l'admin</li>}
                {cameras.map((c: any) => <li key={c.id}>{c.name}</li>)}
              </ul>
            </div>
            
            <div className="bg-[#0f0f0f] p-8 border border-gray-900 rounded-sm">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 border-b border-gray-800 pb-4">Optiques</h3>
              <ul className="text-gray-400 space-y-4 text-sm font-light">
                {optics.length === 0 && <li className="italic text-gray-600">À remplir dans l'admin</li>}
                {optics.map((o: any) => <li key={o.id}>{o.name}</li>)}
              </ul>
            </div>
            
            <div className="bg-[#0f0f0f] p-8 border border-gray-900 rounded-sm lg:col-span-1 md:col-span-2">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 border-b border-gray-800 pb-4">Lumière / Machinerie</h3>
              <ul className="text-gray-400 space-y-4 text-sm font-light">
                {lights.length === 0 && <li className="italic text-gray-600">À remplir dans l'admin</li>}
                {lights.map((l: any) => <li key={l.id}>{l.name}</li>)}
              </ul>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
