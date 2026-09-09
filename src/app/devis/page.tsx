"use client";
import { useState } from 'react';

export default function DevisContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'clip',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Envoi en cours...");
    
    // Pour l'instant on simule un envoi réussi
    // Plus tard on pourra connecter ça à un service d'emailing (comme Resend ou Formspree)
    setTimeout(() => {
      setStatus("✅ Votre demande a bien été envoyée. Je reviens vers vous très vite !");
      setFormData({ name: '', email: '', type: 'clip', message: '' });
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto pt-12 pb-24 px-6 md:px-12">
      <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-widest text-white mb-16 text-center md:text-left">
        Devis & Contact
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        
        {/* COLONNE GAUCHE : Informations */}
        <div className="space-y-12">
          <div>
            <h3 className="text-xs text-gray-500 font-bold tracking-[0.2em] uppercase mb-4">Discutons de votre projet</h3>
            <p className="text-gray-300 text-lg font-light leading-relaxed">
              Basé à Rennes, je me déplace partout en France et à l'international. 
              N'hésitez pas à me contacter pour m'exposer votre projet, vos envies et vos contraintes de budget. 
              Nous pourrons réfléchir ensemble à la meilleure approche visuelle.
            </p>
          </div>

          <div>
            <h3 className="text-xs text-gray-500 font-bold tracking-[0.2em] uppercase mb-4">Contact Direct</h3>
            <a href="mailto:contact@thibaudsaliou.com" className="text-xl text-white hover:text-gray-400 transition-colors">
              contact@thibaudsaliou.com
            </a>
          </div>

          <div>
            <h3 className="text-xs text-gray-500 font-bold tracking-[0.2em] uppercase mb-4">Réseaux</h3>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-gray-300 hover:text-white transition-colors w-fit">Instagram ↗</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors w-fit">Vimeo ↗</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors w-fit">LinkedIn ↗</a>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : Formulaire */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-8 bg-[#0a0a0a] p-8 md:p-10 border border-gray-900 rounded-sm">
            
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-gray-500">Nom / Structure *</label>
              <input 
                type="text" 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="bg-transparent border-b border-gray-800 text-white p-3 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-gray-500">Email *</label>
              <input 
                type="email" 
                required 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="bg-transparent border-b border-gray-800 text-white p-3 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-gray-500">Type de projet *</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="bg-[#111] border border-gray-800 text-white p-3 focus:outline-none focus:border-gray-500"
              >
                <option value="clip">Clip Vidéo</option>
                <option value="court-metrage">Court-métrage</option>
                <option value="publicite">Publicité / Brand Content</option>
                <option value="photo">Photographie</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-gray-500">Détails du projet (Lieu, Dates, Budget...) *</label>
              <textarea 
                required 
                rows={5}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="bg-transparent border-b border-gray-800 text-white p-3 focus:outline-none focus:border-white transition-colors resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 mt-4 hover:bg-gray-300 transition-colors"
            >
              Envoyer la demande
            </button>

            {status && (
              <p className={`text-center mt-4 text-sm font-bold ${status.includes('✅') ? 'text-green-500' : 'text-gray-400'}`}>
                {status}
              </p>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}
