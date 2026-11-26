import type { Metadata } from 'next';
import SocialLinks from '@/components/common/SocialLinks';
import { getSettings } from '@/lib/api';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Devis & contact',
  description: 'Demandez un devis pour votre clip, court-métrage, publicité ou projet photo.',
};

export default async function DevisContact() {
  const settings = await getSettings();
  const email = settings.contact_email || 'thibaud.saliou@gmail.com';

  return (
    <div className="max-w-7xl mx-auto pt-12 pb-24">
      <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-widest text-white mb-16 text-center md:text-left">
        Devis & Contact
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        <div className="space-y-12">
          {settings.devis_text && (
            <div>
              <h2 className="text-xs text-gray-500 font-bold tracking-[0.2em] uppercase mb-4">Discutons de votre projet</h2>
              <p className="text-gray-300 text-lg font-light leading-relaxed whitespace-pre-line">{settings.devis_text}</p>
            </div>
          )}

          <div>
            <h2 className="text-xs text-gray-500 font-bold tracking-[0.2em] uppercase mb-4">Contact direct</h2>
            <a href={`mailto:${email}`} className="text-xl text-white hover:text-gray-400 transition-colors break-all">
              {email}
            </a>
          </div>

          <div>
            <h2 className="text-xs text-gray-500 font-bold tracking-[0.2em] uppercase mb-4">Réseaux</h2>
            <SocialLinks
              settings={settings}
              arrow
              className="flex flex-col gap-2"
              linkClassName="text-gray-300 hover:text-white transition-colors w-fit"
            />
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
