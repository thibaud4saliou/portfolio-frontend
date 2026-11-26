import type { Settings } from '@/lib/types';
import { safeHref } from '@/lib/url';

const NETWORKS = [
  ['instagram_url', 'Instagram'],
  ['vimeo_url', 'Vimeo'],
  ['youtube_url', 'YouTube'],
  ['linkedin_url', 'LinkedIn'],
  ['malt_url', 'Malt'],
] as const;

export default function SocialLinks({
  settings,
  className,
  linkClassName,
  arrow = false,
}: {
  settings: Settings;
  className?: string;
  linkClassName?: string;
  arrow?: boolean;
}) {
  const links = NETWORKS.map(([key, label]) => ({ label, href: safeHref(settings[key]) })).filter((l) => l.href);
  if (links.length === 0) return null;
  return (
    <div className={className}>
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
          {l.label}
          {arrow && ' ↗'}
        </a>
      ))}
    </div>
  );
}
