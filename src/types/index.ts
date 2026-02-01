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
}

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  backgroundColor: string;
  padding: number;
  rotation: number;
}

export interface SlideLayout {
  id: string;
  name: string;
  images: number; // Number of image slots
  arrangement: 'single' | 'side-by-side' | 'stacked' | 'grid';
}

export interface Slide {
  id: string;
  layoutId: string;
  images: ImageItem[];
  textOverlays: TextOverlay[];
  backgroundColor: string;
}

export interface Project {
  id: string;
  name: string;
  animalName: string;
  animalType: 'dog' | 'cat' | 'rabbit' | 'bird' | 'other';
  slides: Slide[];
  format: 'instagram' | 'facebook' | 'story';
  createdAt: Date;
  updatedAt: Date;
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

export const LAYOUTS: SlideLayout[] = [
  { id: 'single', name: 'Einzelbild', images: 1, arrangement: 'single' },
  { id: 'side-by-side', name: 'Nebeneinander', images: 2, arrangement: 'side-by-side' },
  { id: 'stacked', name: 'Übereinander', images: 2, arrangement: 'stacked' },
  { id: 'grid-4', name: '4er Raster', images: 4, arrangement: 'grid' },
];

export const DEFAULT_TEXT_PRESETS = [
  { label: 'früher', backgroundColor: '#9333ea', fill: '#ffffff' },
  { label: 'jetzt', backgroundColor: '#9333ea', fill: '#ffffff' },
  { label: 'vorher', backgroundColor: '#dc2626', fill: '#ffffff' },
  { label: 'nachher', backgroundColor: '#16a34a', fill: '#ffffff' },
];
