"use client";
import { useState, useEffect } from 'react';

export default function Photographie() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [mainFilter, setMainFilter] = useState('tournage');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [photosRes, settingsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/photos`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`)
        ]);
        if (photosRes.ok) setPhotos(await photosRes.json());
        if (settingsRes.ok) {
          const s = await settingsRes.json();
          setSettings(Array.isArray(s) ? s[0] : s);
        }
      } catch (error) { 
        console.error("Erreur", error); 
      } finally { 
        setLoading(false); 
      }
    }
    fetchData();
  }, []);

  const filteredByMain = photos.filter(photo => photo.category === mainFilter);

  const groupedPhotos = filteredByMain.reduce((acc: any, photo) => {
    const sub = photo.subcategory && photo.subcategory.trim() !== '' ? photo.subcategory : 'Autres';
    if (!acc[sub]) acc[sub] = [];
    acc[sub].push(photo);
    return acc;
  }, {});

  // On récupère l'ordre défini dans l'admin, ou on trie par ordre alphabétique par défaut
  const customOrder = settings.photo_categories_order 
    ? settings.photo_categories_order.split(',').map((s: string) => s.trim().toLowerCase()) 
    : [];

  const sortedSubcategories = Object.keys(groupedPhotos).sort((a, b) => {
    if (a === 'Autres') return 1;
    if (b === 'Autres') return -1;
    
    const indexA = customOrder.indexOf(a.toLowerCase());
    const indexB = customOrder.indexOf(b.toLowerCase());
    
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    
    return a.localeCompare(b);
  });

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-24">
      <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-widest text-white mb-12 text-center md:text-left">
        Photographie
      </h1>

      <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-16">
        {[
          { id: 'tournage', label: 'Tournage' },
          { id: 'voyages', label: 'Voyages' },
          { id: 'portrait', label: 'Portrait' }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setMainFilter(f.id)}
            className={`text-xs uppercase tracking-widest px-6 py-3 border transition-colors ${
              mainFilter === f.id 
                ? 'border-white bg-white text-black font-bold' 
                : 'border-gray-800 text-gray-400 hover:border-gray-500 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-500 font-mono text-sm py-24">
          [ Chargement des images... ]
        </div>
      ) : filteredByMain.length === 0 ? (
        <div className="text-center text-gray-600 font-mono text-sm py-24 border border-gray-800 border-dashed">
          Aucune photo dans cette catégorie pour le moment.
        </div>
      ) : (
        <div className="space-y-24">
          {sortedSubcategories.map((sub) => (
            <div key={sub}>
              {sub !== 'Autres' && (
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white mb-8 border-b border-gray-900 pb-4 inline-block">
                  {sub}
                </h2>
              )}
              
              <div className="columns-1 sm:columns-2 md:columns-3 gap-6">
                {groupedPhotos[sub].map((photo: any) => (
                  <div key={photo.id} className="mb-6 break-inside-avoid bg-[#111] border border-gray-900 group cursor-pointer relative overflow-hidden">
                    <img 
                      src={photo.imageUrl} 
                      alt={`Photographie - ${photo.category}`} 
                      className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-all duration-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}