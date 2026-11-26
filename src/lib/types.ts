export type ProjectCategory = 'clip' | 'realisation' | 'directeur-photo';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  role: string;
  year: string;
  synopsis: string | null;
  videoUrl: string | null;
  coverImageUrl: string | null;
  credits: string | null;
  stills: string[];
  order: number;
}

export interface Review {
  id: string;
  text: string;
  author: string;
  order: number;
}

export interface Equipment {
  id: string;
  category: string;
  name: string;
  order: number;
}

export interface Settings {
  home_video_url?: string | null;
  home_video_opacity?: string | null;
  home_subtitle?: string | null;
  profile_photo_url?: string | null;
  history_text?: string | null;
  expertise_text?: string | null;
  clips_text?: string | null;
  demo_reel_image_url?: string | null;
  demo_reel_link?: string | null;
  youtube_url?: string | null;
  linkedin_url?: string | null;
  malt_url?: string | null;
  instagram_url?: string | null;
  vimeo_url?: string | null;
  contact_email?: string | null;
  devis_text?: string | null;
  mentions_legales_text?: string | null;
  rgpd_text?: string | null;
}
