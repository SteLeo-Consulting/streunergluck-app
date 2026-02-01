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

// Post Categories
export const POST_CATEGORIES: PostCategory[] = [
  {
    id: 'gluecksstreunerpost',
    name: 'Glücksstreunerpost',
    description: 'Vorher/Nachher Posts für vermittelte Tiere',
    icon: '🐾',
    defaultColors: {
      background: '#bef264', // Lime green
      primary: '#9333ea', // Purple for labels
      secondary: '#ec4899', // Pink for name with outline
      text: '#1f2937', // Dark text
      accent: '#ffffff', // White
    },
  },
  {
    id: 'vermittlung',
    name: 'Vermittlung',
    description: 'Tiere die ein Zuhause suchen',
    icon: '🏠',
    defaultColors: {
      background: '#fef3c7',
      primary: '#f59e0b',
      secondary: '#d97706',
      text: '#1f2937',
      accent: '#ffffff',
    },
  },
  {
    id: 'spendenaktion',
    name: 'Spendenaktion',
    description: 'Spendenaufrufe und Aktionen',
    icon: '❤️',
    defaultColors: {
      background: '#fecaca',
      primary: '#dc2626',
      secondary: '#b91c1c',
      text: '#1f2937',
      accent: '#ffffff',
    },
  },
];

export const DEFAULT_TEXT_PRESETS = [
  { label: 'früher', backgroundColor: '#9333ea', fill: '#ffffff' },
  { label: 'jetzt', backgroundColor: '#9333ea', fill: '#ffffff' },
  { label: 'vorher', backgroundColor: '#dc2626', fill: '#ffffff' },
  { label: 'nachher', backgroundColor: '#16a34a', fill: '#ffffff' },
];

export const LAYOUTS = [
  { id: 'single', name: 'Einzelbild', images: 1, arrangement: 'single' as const },
  { id: 'side-by-side', name: 'Nebeneinander', images: 2, arrangement: 'side-by-side' as const },
  { id: 'stacked', name: 'Übereinander', images: 2, arrangement: 'stacked' as const },
  { id: 'grid-4', name: '4er Raster', images: 4, arrangement: 'grid' as const },
];
