import Link from 'next/link';
import { getEquipment, getReviews, getSettings } from '@/lib/api';
import { isExternal, safeHref } from '@/lib/url';

const EQUIPMENT_GROUPS = ['Caméras', 'Optiques', 'Lumière / Machinerie'] as const;

function opacity(value: string | null | undefined): number {
  if (!value) return 0.6;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 && n <= 100 ? n / 100 : 0.6;
}

export default async function Home() {
  const [reviews, equipment, settings] = await Promise.all([getReviews(), getEquipment(), getSettings()]);

  const videoUrl = safeHref(settings.home_video_url);
  const demoImage = safeHref(settings.demo_reel_image_url);
  const demoLink = safeHref(settings.demo_reel_link);
  const profilePhoto = safeHref(settings.profile_photo_url);
  const awardsImage = safeHref(settings.awards_image_url);

  const demo = demoImage && (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={demoImage} alt="Bande démo" className="w-64 md:w-80 h-auto rounded-sm shadow-2xl" />
  );

  return (
    <div className="flex flex-col w-full -mt-32">
      {/* 1. HERO */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black">
        {videoUrl && (
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover z-0"
            style={{ opacity: opacity(settings.home_video_opacity) }}
          />
        )}
        <div className="relative z-20 text-center px-4 flex flex-col items-center mt-16">
          <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-widest text-white drop-shadow-2xl mb-6">
            Thibaud Saliou
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 uppercase tracking-[0.3em] font-light">
            Réalisateur & Dir. Photographie
          </p>
          <p className="mt-4 text-xs md:text-sm text-gray-400 uppercase tracking-[0.2em]">
            {settings.home_subtitle || 'Basé à Rennes, se déplace en France'}
          </p>

          {demo &&
            (demoLink ? (
              isExternal(demoLink) ? (
                <a href={demoLink} target="_blank" rel="noopener noreferrer" className="mt-12 block hover:scale-105 transition-transform duration-300">
                  {demo}
                </a>
              ) : (
                <Link href={demoLink} className="mt-12 block hover:scale-105 transition-transform duration-300">
                  {demo}
                </Link>
              )
            ) : (
              <div className="mt-12">{demo}</div>
            ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
        {/* 2. PRÉSENTATION */}
        <section id="a-propos" className="py-24 border-b border-gray-900 grid grid-cols-1 md:grid-cols-12 gap-12 scroll-mt-32">
          <div className="md:col-span-5 relative">
            <div className="sticky top-32 w-full aspect-[4/5] bg-[#111] border border-gray-800 rounded-sm overflow-hidden">
              {profilePhoto && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profilePhoto} alt="Portrait de Thibaud Saliou" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              )}
            </div>
          </div>

          <div className="md:col-span-7 space-y-16 text-gray-300 leading-relaxed text-lg font-light">
            {settings.history_text && (
              <div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-6">Mon histoire & ma vision</h2>
                <div className="space-y-4 whitespace-pre-line">{settings.history_text}</div>
              </div>
            )}

            {settings.expertise_text && (
              <div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-6">
                  Une expertise technique au service de votre univers
                </h2>
                <div className="space-y-4 whitespace-pre-line">{settings.expertise_text}</div>
              </div>
            )}

            {awardsImage && (
              <div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-6">Sélections & prix</h2>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={awardsImage} alt="Sélections et prix en festivals" loading="lazy" decoding="async" className="w-full h-auto" />
              </div>
            )}

            <div className="bg-[#0f0f0f] p-8 border border-gray-900 rounded-sm">
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider mb-6">Réalisation de clips</h2>
              {settings.clips_text && <div className="space-y-4 mb-8 whitespace-pre-line">{settings.clips_text}</div>}
              <Link
                href="/devis"
                className="inline-block w-full text-center md:w-auto bg-white text-black font-bold uppercase tracking-widest px-8 py-4 hover:bg-gray-300 transition-colors"
              >
                Me contacter pour votre projet
              </Link>
            </div>
          </div>
        </section>

        {/* 3. AVIS */}
        {reviews.length > 0 && (
          <section className="py-24 border-b border-gray-900">
            <h2 className="text-sm text-gray-400 font-bold tracking-[0.3em] uppercase mb-16 text-center">/ Ils m’ont fait confiance</h2>
            <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-8">
              {reviews.map((review) => (
                <figure
                  key={review.id}
                  className="min-w-[85vw] md:min-w-[500px] max-w-[500px] snap-center bg-[#111] p-8 md:p-10 border border-gray-800 rounded-sm flex flex-col justify-between"
                >
                  <blockquote className="max-h-64 overflow-y-auto hide-scrollbar mb-8 pr-2 text-base md:text-lg text-gray-300 italic whitespace-pre-line">
                    « {review.text} »
                  </blockquote>
                  <figcaption className="text-xs uppercase tracking-widest text-gray-500 font-bold mt-auto">— {review.author}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* 4. MATÉRIEL */}
        {equipment.length > 0 && (
          <section className="py-24">
            <h2 className="text-sm text-gray-400 font-bold tracking-[0.3em] uppercase mb-16 text-center">/ Mon matériel</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {EQUIPMENT_GROUPS.map((group, i) => (
                <div
                  key={group}
                  className={`bg-[#0f0f0f] p-8 border border-gray-900 rounded-sm ${i === 2 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 border-b border-gray-800 pb-4">{group}</h3>
                  <ul className="text-gray-400 space-y-4 text-sm font-light">
                    {equipment
                      .filter((e) => e.category === group)
                      .map((e) => (
                        <li key={e.id}>{e.name}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
