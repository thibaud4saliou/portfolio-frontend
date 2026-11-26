import type { FieldDef } from '@/lib/adminForm';

export interface CollectionConfig {
  key: 'projects' | 'reviews' | 'equipment';
  label: string;
  singular: string;
  endpoint: string;
  fields: readonly FieldDef[];
  /** Libellés affichés dans la liste de droite. */
  describe: (item: Record<string, unknown>) => { tag: string; title: string };
}

const orderField: FieldDef = {
  name: 'order',
  label: "Ordre d'affichage",
  type: 'number',
  min: 0,
  help: 'Plus petit = affiché en premier',
};

export const PROJECT_CATEGORY_OPTIONS = [
  { value: 'clip', label: 'Clip vidéo' },
  { value: 'realisation', label: 'Réalisation' },
  { value: 'directeur-photo', label: 'Dir. photographie' },
] as const;

export const COLLECTIONS: readonly CollectionConfig[] = [
  {
    key: 'projects',
    label: 'Vidéos',
    singular: 'vidéo',
    endpoint: '/api/projects',
    fields: [
      { name: 'title', label: 'Titre', type: 'text', required: true },
      { name: 'category', label: 'Catégorie', type: 'select', required: true, options: PROJECT_CATEGORY_OPTIONS },
      { name: 'role', label: 'Rôle', type: 'text', required: true },
      { name: 'year', label: 'Année', type: 'text', required: true },
      { name: 'videoUrl', label: 'Lien vidéo YouTube / Vimeo', type: 'url' },
      { name: 'coverImageUrl', label: 'Miniature', type: 'url', upload: 'image' },
      { name: 'synopsis', label: 'Synopsis', type: 'textarea', rows: 3 },
      { name: 'credits', label: 'Crédits', type: 'textarea', rows: 3 },
      { name: 'stills', label: 'Stills (une URL par ligne)', type: 'urlList', rows: 3, upload: 'image' },
      orderField,
    ],
    describe: (i) => ({
      tag: PROJECT_CATEGORY_OPTIONS.find((o) => o.value === i.category)?.label ?? String(i.category),
      title: String(i.title ?? ''),
    }),
  },
  {
    key: 'reviews',
    label: 'Avis',
    singular: 'avis',
    endpoint: '/api/reviews',
    fields: [
      { name: 'author', label: 'Auteur', type: 'text', required: true },
      { name: 'text', label: "Texte de l'avis", type: 'textarea', rows: 5, required: true },
      orderField,
    ],
    describe: (i) => ({ tag: 'Avis', title: String(i.author ?? '') }),
  },
  {
    key: 'equipment',
    label: 'Matériel',
    singular: 'équipement',
    endpoint: '/api/equipment',
    fields: [
      {
        name: 'category',
        label: 'Catégorie',
        type: 'select',
        required: true,
        options: [
          { value: 'Caméras', label: 'Caméras' },
          { value: 'Optiques', label: 'Optiques' },
          { value: 'Lumière / Machinerie', label: 'Lumière / Machinerie' },
        ],
      },
      { name: 'name', label: 'Nom', type: 'text', required: true },
      orderField,
    ],
    describe: (i) => ({ tag: String(i.category ?? ''), title: String(i.name ?? '') }),
  },
];

export const SETTINGS_SECTIONS: readonly { title: string; fields: readonly FieldDef[] }[] = [
  {
    title: '1. Accueil',
    fields: [
      { name: 'home_video_url', label: "Vidéo d'accueil (.mp4)", type: 'url', upload: 'video' },
      { name: 'home_video_opacity', label: 'Opacité vidéo (0 à 100)', type: 'number', min: 0, max: 100 },
      { name: 'home_subtitle', label: 'Sous-titre (ex : Basé à Rennes…)', type: 'text', wide: true },
      { name: 'demo_reel_image_url', label: 'Image bande démo', type: 'url', upload: 'image' },
      { name: 'demo_reel_link', label: 'Lien bande démo (URL ou /page)', type: 'text' },
      { name: 'profile_photo_url', label: 'Photo de profil', type: 'url', wide: true, upload: 'image' },
      { name: 'history_text', label: 'Texte : Mon histoire & ma vision', type: 'textarea', rows: 5, wide: true },
      { name: 'expertise_text', label: 'Texte : Expertise technique', type: 'textarea', rows: 5, wide: true },
      { name: 'clips_text', label: 'Texte : Réalisation de clips', type: 'textarea', rows: 5, wide: true },
    ],
  },
  {
    title: '2. Réseaux sociaux & contact',
    fields: [
      {
        name: 'contact_email',
        label: 'Email de contact',
        type: 'email',
        help: 'Reçoit les demandes du formulaire de devis',
      },
      { name: 'instagram_url', label: 'Instagram', type: 'url' },
      { name: 'vimeo_url', label: 'Vimeo', type: 'url' },
      { name: 'youtube_url', label: 'YouTube', type: 'url' },
      { name: 'linkedin_url', label: 'LinkedIn', type: 'url' },
      { name: 'malt_url', label: 'Malt', type: 'url' },
    ],
  },
  {
    title: '3. Pages spéciales',
    fields: [
      { name: 'devis_text', label: "Texte d'introduction de la page Devis", type: 'textarea', rows: 4, wide: true },
      { name: 'mentions_legales_text', label: 'Mentions légales', type: 'textarea', rows: 8, wide: true },
      { name: 'rgpd_text', label: 'Politique de confidentialité (RGPD)', type: 'textarea', rows: 8, wide: true },
    ],
  },
];

export const SETTINGS_FIELDS: readonly FieldDef[] = SETTINGS_SECTIONS.flatMap((s) => s.fields);
