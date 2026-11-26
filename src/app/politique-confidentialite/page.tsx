import type { Metadata } from 'next';
import LegalPage from '@/components/common/LegalPage';
import { getSettings } from '@/lib/api';

export const metadata: Metadata = { title: 'Politique de confidentialité' };

export default async function PolitiqueConfidentialite() {
  const settings = await getSettings();
  return (
    <LegalPage
      title="Politique de confidentialité (RGPD)"
      content={settings.rgpd_text}
      placeholder="Politique de confidentialité en cours de rédaction."
    />
  );
}
