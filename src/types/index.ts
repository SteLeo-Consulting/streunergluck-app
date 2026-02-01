export interface ImageItem {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  shadowEnabled?: boolean;
}

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  backgroundColor?: string;
  padding: number;
  rotation: number;
  fontStyle?: string;
  align?: 'left' | 'center' | 'right';
  stroke?: string;
  strokeWidth?: number;
}

export interface DecorationElement {
  id: string;
  type: 'logo' | 'icon' | 'shape' | 'swirl' | 'arrow';
  src?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  fill?: string;
  opacity?: number;
}

export interface SlideTemplate {
  id: string;
  type: 'start' | 'content' | 'end';
  name: string;
  description: string;
  thumbnail?: string;
}

export interface Slide {
  id: string;
  type: 'start' | 'content' | 'end';
  images: ImageItem[];
  textOverlays: TextOverlay[];
  decorations: DecorationElement[];
  backgroundColor: string;
  storyText?: string;
}

export interface PostCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultColors: {
    background: string;
    primary: string;
    secondary: string;
    text: string;
    accent: string;
  };
}

export interface Project {
  id: string;
  name: string;
  categoryId: string;
  animalName: string;
  animalInfo: {
    since?: string;
    type?: string;
  };
  slides: Slide[];
  format: 'instagram' | 'facebook' | 'story';
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialMediaAccount {
  id: string;
  platform: 'instagram' | 'facebook';
  accessToken?: string;
  username?: string;
  connected: boolean;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export const CANVAS_SIZES: Record<string, CanvasSize> = {
  instagram: { width: 1080, height: 1080 },
  facebook: { width: 1200, height: 630 },
  story: { width: 1080, height: 1920 },
};

// Brand Colors
export const BRAND_COLORS = {
  lila: '#820B79',
  gruen: '#CDDB62',
  white: '#ffffff',
  dark: '#1f2937',
};

// Brand Fonts
export const BRAND_FONTS = {
  headline: 'Chewy, cursive',
  body: 'Raleway, sans-serif',
};

// Post Categories
export const POST_CATEGORIES: PostCategory[] = [
  {
    id: 'gluecksstreunerpost',
    name: 'Glücksstreunerpost',
    description: 'Vorher/Nachher Posts für vermittelte Tiere',
    icon: '🐾',
    defaultColors: {
      background: BRAND_COLORS.gruen, // Grün als Hintergrund
      primary: BRAND_COLORS.lila, // Lila für Labels
      secondary: BRAND_COLORS.lila, // Lila für Name
      text: BRAND_COLORS.dark, // Dunkler Text
      accent: BRAND_COLORS.white, // Weiß
    },
  },
  {
    id: 'vermittlung',
    name: 'Vermittlung',
    description: 'Tiere die ein Zuhause suchen',
    icon: '🏠',
    defaultColors: {
      background: '#f5f0ff',
      primary: BRAND_COLORS.lila,
      secondary: BRAND_COLORS.gruen,
      text: BRAND_COLORS.dark,
      accent: BRAND_COLORS.white,
    },
  },
  {
    id: 'spendenaktion',
    name: 'Spendenaktion',
    description: 'Spendenaufrufe und Aktionen',
    icon: '❤️',
    defaultColors: {
      background: '#fecaca',
      primary: BRAND_COLORS.lila,
      secondary: '#dc2626',
      text: BRAND_COLORS.dark,
      accent: BRAND_COLORS.white,
    },
  },
];

export const DEFAULT_TEXT_PRESETS = [
  { label: 'früher', backgroundColor: BRAND_COLORS.lila, fill: '#ffffff' },
  { label: 'jetzt', backgroundColor: BRAND_COLORS.lila, fill: '#ffffff' },
  { label: 'vorher', backgroundColor: '#dc2626', fill: '#ffffff' },
  { label: 'nachher', backgroundColor: BRAND_COLORS.gruen, fill: BRAND_COLORS.dark },
];

export const LAYOUTS = [
  { id: 'single', name: 'Einzelbild', images: 1, arrangement: 'single' as const },
  { id: 'side-by-side', name: 'Nebeneinander', images: 2, arrangement: 'side-by-side' as const },
  { id: 'stacked', name: 'Übereinander', images: 2, arrangement: 'stacked' as const },
  { id: 'grid-4', name: '4er Raster', images: 4, arrangement: 'grid' as const },
];
