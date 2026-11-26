import type { Metadata } from 'next';
import LegalPage from '@/components/common/LegalPage';
import { getSettings } from '@/lib/api';

export const metadata: Metadata = { title: 'Mentions légales' };

export default async function MentionsLegales() {
  const settings = await getSettings();
  return (
    <LegalPage
      title="Mentions légales"
      content={settings.mentions_legales_text}
      placeholder="Mentions légales en cours de rédaction."
    />
  );
}
