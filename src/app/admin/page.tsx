"use client";
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("projects");
  const [status, setStatus] = useState("");
  const [itemsList, setItemsList] = useState<any[]>([]);
  
  const [editingId, setEditingId] = useState<string | null>(null);

  const defaultProject = { title: "", category: "clip", role: "", year: "", synopsis: "", videoUrl: "", coverImageUrl: "", order: 0, credits: "", stills: "" };
  const defaultPhoto = { title: "", category: "voyages", subcategory: "", imageUrl: "", order: 0 };
  const defaultReview = { text: "", author: "", order: 0 };
  const defaultEquipment = { category: "Caméras", name: "", order: 0 };
  const defaultSettings = { home_video_url: "", profile_photo_url: "", history_text: "", expertise_text: "", clips_text: "" };

  const [projectData, setProjectData] = useState(defaultProject);
  const [photoData, setPhotoData] = useState(defaultPhoto);
  const [reviewData, setReviewData] = useState(defaultReview);
  const [equipmentData, setEquipmentData] = useState(defaultEquipment);
  const [settingsData, setSettingsData] = useState(defaultSettings);

  useEffect(() => {
    fetchItems(activeTab);
    cancelEdit();
  }, [activeTab]);

  const fetchItems = async (type: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${type}`);
      if (res.ok) {
        const data = await res.json();
        if (type === 'settings') {
          // Gère le cas où l'API renvoie un tableau ou un objet
          setSettingsData(Array.isArray(data) ? data[0] || defaultSettings : data || defaultSettings);
        } else {
          setItemsList(data);
        }
      }
    } catch (error) { console.error("Erreur", error); }
  };

  const handleSubmit = async (e: React.FormEvent, type: string) => {
    e.preventDefault();
    setStatus("Enregistrement...");

    let bodyData = {};
    let method = editingId ? "PUT" : "POST";
    let url = editingId ? `${process.env.NEXT_PUBLIC_API_URL}/api/${type}/${editingId}` : `${process.env.NEXT_PUBLIC_API_URL}/api/${type}`;

    if (type === "projects") {
      const stillsArray = typeof projectData.stills === 'string' ? projectData.stills.split(',').map(s => s.trim()).filter(s => s !== "") : projectData.stills;
      bodyData = { ...projectData, stills: stillsArray, order: Number(projectData.order) };
    } else if (type === "photos") bodyData = { ...photoData, order: Number(photoData.order) };
    else if (type === "reviews") bodyData = { ...reviewData, order: Number(reviewData.order) };
    else if (type === "equipment") bodyData = { ...equipmentData, order: Number(equipmentData.order) };
    else if (type === "settings") {
      bodyData = settingsData;
      method = "PUT";
      url = `${process.env.NEXT_PUBLIC_API_URL}/api/settings/1`; // Met à jour la ligne unique
    }

    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(bodyData) });
      if (res.ok) {
        setStatus(type === 'settings' ? "✅ Configuration sauvegardée !" : (editingId ? "✅ Modification sauvegardée !" : "✅ Ajouté avec succès !"));
        if (type !== 'settings') cancelEdit();
        fetchItems(type); 
      } else setStatus("❌ Erreur serveur");
    } catch (error) { setStatus("❌ Impossible de joindre le serveur"); }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    if (activeTab === "projects") setProjectData({ ...item, stills: item.stills ? item.stills.join(', ') : "", synopsis: item.synopsis || "", credits: item.credits || "", coverImageUrl: item.coverImageUrl || "" });
    if (activeTab === "photos") setPhotoData({ ...item, title: item.title || "", subcategory: item.subcategory || "" });
    if (activeTab === "reviews") setReviewData(item);
    if (activeTab === "equipment") setEquipmentData(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setProjectData(defaultProject);
    setPhotoData(defaultPhoto);
    setReviewData(defaultReview);
    setEquipmentData(defaultEquipment);
  };

  const handleDelete = async (id: string, type: string) => {
    if (!window.confirm("Supprimer définitivement ?")) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${type}/${id}`, { method: "DELETE" });
    if (res.ok) fetchItems(type);
  };

  const existingSubcategories = Array.from(new Set(itemsList.filter(item => item.category === photoData.category && item.subcategory).map(item => item.subcategory)));

  return (
    <div className="max-w-5xl mx-auto pt-12 pb-24 px-6">
      <h1 className="text-3xl font-bold uppercase tracking-wider mb-8 text-white text-center">Tableau de Bord</h1>
      
      <div className="flex flex-wrap gap-4 mb-8 justify-center border-b border-gray-200 pb-4">
        {['projects', 'photos', 'reviews', 'equipment', 'settings'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`text-xs uppercase tracking-widest px-4 py-2 ${activeTab === tab ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white'}`}>
            {tab === 'projects' ? 'Vidéos' : tab === 'photos' ? 'Photographie' : tab === 'reviews' ? 'Avis' : tab === 'equipment' ? 'Matériel' : 'Configuration'}
          </button>
        ))}
      </div>

      {status && <p className="text-center mb-8 text-sm font-bold text-white bg-[#111] p-4 border border-gray-800">{status}</p>}

      <div className={`grid ${activeTab === 'settings' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-12`}>
        
        {/* NOUVEAU FORMULAIRE DE CONFIGURATION */}
        {activeTab === "settings" && (
          <form onSubmit={(e) => handleSubmit(e, 'settings')} className="space-y-6 bg-[#111] p-6 border border-gray-900 w-full max-w-3xl mx-auto">
             <div className="border-b border-gray-800 pb-2 mb-4">
               <h2 className="text-xl font-bold uppercase text-white">Configuration de la page d'accueil</h2>
             </div>
             
             <div><label className="text-xs uppercase text-gray-500 block mb-1">URL Vidéo d'accueil (Cloudinary)</label>
             <input type="url" value={settingsData.home_video_url || ''} onChange={e => setSettingsData({...settingsData, home_video_url: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3" /></div>
             
             <div><label className="text-xs uppercase text-gray-500 block mb-1">URL Photo de Profil (Cloudinary)</label>
             <input type="url" value={settingsData.profile_photo_url || ''} onChange={e => setSettingsData({...settingsData, profile_photo_url: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3" /></div>
             
             <div><label className="text-xs uppercase text-gray-500 block mb-1">Texte : Mon histoire & ma vision</label>
             <textarea rows={5} value={settingsData.history_text || ''} onChange={e => setSettingsData({...settingsData, history_text: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3"></textarea></div>
             
             <div><label className="text-xs uppercase text-gray-500 block mb-1">Texte : Expertise Technique</label>
             <textarea rows={5} value={settingsData.expertise_text || ''} onChange={e => setSettingsData({...settingsData, expertise_text: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3"></textarea></div>

             <div><label className="text-xs uppercase text-gray-500 block mb-1">Texte : Réalisation de clips</label>
             <textarea rows={5} value={settingsData.clips_text || ''} onChange={e => setSettingsData({...settingsData, clips_text: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3"></textarea></div>
             
            <button type="submit" className="w-full bg-white text-black font-bold uppercase py-3 mt-4 hover:bg-gray-300">Sauvegarder les réglages</button>
          </form>
        )}

        {/* COLONNE GAUCHE (AUTRES FORMULAIRES) */}
        {activeTab !== "settings" && (
          <div>
            {activeTab === "projects" && (
              <form onSubmit={(e) => handleSubmit(e, 'projects')} className="space-y-4 bg-[#111] p-6 border border-gray-900">
                 <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                   <h2 className="text-xl font-bold uppercase text-white">{editingId ? 'Modifier Vidéo' : 'Ajouter Vidéo'}</h2>
                   {editingId && <button type="button" onClick={cancelEdit} className="text-xs text-gray-500 hover:text-white uppercase">Annuler</button>}
                 </div>
                 
                 <div><label className="text-xs uppercase text-gray-500 block mb-1">Titre *</label>
                 <input type="text" value={projectData.title} onChange={e => setProjectData({...projectData, title: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3" required /></div>
                 
                 <div><label className="text-xs uppercase text-gray-500 block mb-1">Catégorie *</label>
                 <select value={projectData.category} onChange={e => setProjectData({...projectData, category: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3"><option value="clip">Clip Vidéo</option><option value="realisation">Réalisation</option><option value="directeur-photo">Dir. Photographie</option></select></div>
                 
                 <div><label className="text-xs uppercase text-gray-500 block mb-1">Rôle *</label>
                 <input type="text" value={projectData.role} onChange={e => setProjectData({...projectData, role: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3" required /></div>
                 
                 <div><label className="text-xs uppercase text-gray-500 block mb-1">Année *</label>
                 <input type="text" value={projectData.year} onChange={e => setProjectData({...projectData, year: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3" required /></div>
                 
                 <div><label className="text-xs uppercase text-gray-500 block mb-1">Lien Vidéo YouTube/Vimeo</label>
                 <input type="url" value={projectData.videoUrl} onChange={e => setProjectData({...projectData, videoUrl: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3" /></div>
                 
                 <div><label className="text-xs uppercase text-blue-400 block mb-1">Lien Miniature / Cover (URL)</label>
                 <input type="url" value={projectData.coverImageUrl} onChange={e => setProjectData({...projectData, coverImageUrl: e.target.value})} className="w-full border-l-4 border-blue-500 bg-[#1a1a1a] border-gray-800 text-white p-3" /></div>
                 
                 <div><label className="text-xs uppercase text-gray-500 block mb-1">Synopsis</label>
                 <textarea rows={2} value={projectData.synopsis} onChange={e => setProjectData({...projectData, synopsis: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3"></textarea></div>
                 
                 <div><label className="text-xs uppercase text-gray-500 block mb-1">Crédits</label>
                 <textarea rows={2} value={projectData.credits} onChange={e => setProjectData({...projectData, credits: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3"></textarea></div>
                 
                 <div><label className="text-xs uppercase text-gray-500 block mb-1">Stills (URLs séparées par des virgules)</label>
                 <textarea rows={2} value={projectData.stills} onChange={e => setProjectData({...projectData, stills: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3"></textarea></div>
                 
                <button type="submit" className="w-full bg-white text-black font-bold uppercase py-3 mt-4 hover:bg-gray-300">{editingId ? 'Sauvegarder' : 'Ajouter'}</button>
              </form>
            )}

            {activeTab === "photos" && (
              <form onSubmit={(e) => handleSubmit(e, 'photos')} className="space-y-4 bg-[#111] p-6 border border-gray-900">
                 <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                   <h2 className="text-xl font-bold uppercase text-white">{editingId ? 'Modifier Photo' : 'Ajouter Photo'}</h2>
                   {editingId && <button type="button" onClick={cancelEdit} className="text-xs text-gray-500 hover:text-white uppercase">Annuler</button>}
                 </div>
                 
                <div><label className="text-xs uppercase text-gray-500 block mb-1">Titre de la photo (Optionnel)</label>
                <input type="text" value={photoData.title} onChange={e => setPhotoData({...photoData, title: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3" /></div>
                
                <div><label className="text-xs uppercase text-gray-500 block mb-1">Catégorie *</label>
                <select value={photoData.category} onChange={e => setPhotoData({...photoData, category: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3"><option value="tournage">Tournage</option><option value="voyages">Voyages</option><option value="portrait">Portrait</option></select></div>
                
                <div><label className="text-xs uppercase text-gray-500 block mb-1">Sous-catégorie (ex: Bulgarie)</label>
                <input type="text" list="subcategories" value={photoData.subcategory} onChange={e => setPhotoData({...photoData, subcategory: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3" />
                <datalist id="subcategories">{existingSubcategories.map((sub: any) => <option key={sub} value={sub} />)}</datalist></div>
                
                <div><label className="text-xs uppercase text-gray-500 block mb-1">Lien de l'image (URL) *</label>
                <input type="url" value={photoData.imageUrl} onChange={e => setPhotoData({...photoData, imageUrl: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3" required /></div>
                
                <button type="submit" className="w-full bg-white text-black font-bold uppercase py-3 mt-4 hover:bg-gray-300">{editingId ? 'Sauvegarder' : 'Ajouter'}</button>
              </form>
            )}
            
            {activeTab === "reviews" && (
              <form onSubmit={(e) => handleSubmit(e, 'reviews')} className="space-y-4 bg-[#111] p-6 border border-gray-900">
                 <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                   <h2 className="text-xl font-bold uppercase text-white">{editingId ? 'Modifier Avis' : 'Ajouter Avis'}</h2>
                   {editingId && <button type="button" onClick={cancelEdit} className="text-xs text-gray-500 hover:text-white uppercase">Annuler</button>}
                 </div>
                 
                <div><label className="text-xs uppercase text-gray-500 block mb-1">Auteur *</label>
                <input type="text" value={reviewData.author} onChange={e => setReviewData({...reviewData, author: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3" required /></div>
                
                <div><label className="text-xs uppercase text-gray-500 block mb-1">Texte de l'avis *</label>
                <textarea rows={4} value={reviewData.text} onChange={e => setReviewData({...reviewData, text: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3" required></textarea></div>
                
                <button type="submit" className="w-full bg-white text-black font-bold uppercase py-3 mt-4 hover:bg-gray-300">{editingId ? 'Sauvegarder' : 'Ajouter'}</button>
              </form>
            )}

            {activeTab === "equipment" && (
              <form onSubmit={(e) => handleSubmit(e, 'equipment')} className="space-y-4 bg-[#111] p-6 border border-gray-900">
                 <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                   <h2 className="text-xl font-bold uppercase text-white">{editingId ? 'Modifier Équipement' : 'Ajouter Équipement'}</h2>
                   {editingId && <button type="button" onClick={cancelEdit} className="text-xs text-gray-500 hover:text-white uppercase">Annuler</button>}
                 </div>
                 
                <div><label className="text-xs uppercase text-gray-500 block mb-1">Catégorie *</label>
                <select value={equipmentData.category} onChange={e => setEquipmentData({...equipmentData, category: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3"><option value="Caméras">Caméras</option><option value="Optiques">Optiques</option><option value="Lumière / Machinerie">Lumière / Machinerie</option></select></div>
                
                <div><label className="text-xs uppercase text-gray-500 block mb-1">Nom *</label>
                <input type="text" value={equipmentData.name} onChange={e => setEquipmentData({...equipmentData, name: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-800 text-white p-3" required /></div>
                
                <button type="submit" className="w-full bg-white text-black font-bold uppercase py-3 mt-4 hover:bg-gray-300">{editingId ? 'Sauvegarder' : 'Ajouter'}</button>
              </form>
            )}
          </div>
        )}

        {/* COLONNE DROITE : LISTE (AVEC BOUTON MODIFIER) */}
        {activeTab !== "settings" && (
          <div className="bg-[#111] p-6 border border-gray-900 h-fit max-h-[800px] overflow-y-auto">
            <h2 className="text-xl font-bold uppercase tracking-wider text-white mb-6 border-b border-gray-800 pb-2">Gérer ({itemsList.length})</h2>
            {itemsList.length === 0 ? (
              <p className="text-gray-500 italic text-sm">Aucun élément.</p>
            ) : (
              <ul className="space-y-4">
                {itemsList.map(item => (
                  <li key={item.id} className={`flex justify-between items-center p-4 border ${editingId === item.id ? 'border-white bg-[#222]' : 'border-gray-800 bg-[#1a1a1a]'}`}>
                    <div className="truncate pr-4 text-sm text-gray-300 flex flex-col">
                      <span className="font-bold text-white">[{item.category || 'Avis'}]</span>
                      {item.subcategory && <span className="text-gray-500 text-xs mt-1">↳ {item.subcategory}</span>}
                      <span className="mt-1">{item.title || item.name || item.author || "Image sans titre"}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(item)} className="text-xs uppercase tracking-widest text-blue-400 hover:text-blue-300 font-bold px-3 py-1 border border-blue-900/50 hover:bg-blue-900/20 transition-colors">Modif</button>
                      <button onClick={() => handleDelete(item.id, activeTab)} className="text-xs uppercase tracking-widest text-red-500 hover:text-red-400 font-bold px-3 py-1 border border-red-900/50 hover:bg-red-900/20 transition-colors">X</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}