import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Text, Transformer, Group, Line } from 'react-konva';
import useImage from 'use-image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUploader from '@/components/ImageUploader';
import type { ImageItem, TextOverlay, Slide, PostCategory } from '@/types';
import { CANVAS_SIZES, POST_CATEGORIES, DEFAULT_TEXT_PRESETS, BRAND_COLORS, BRAND_FONTS } from '@/types';
import {
  Download,
  Moon,
  Sun,
  Trash2,
  PawPrint,
  Plus,
  ChevronLeft,
  Settings,
  Instagram,
  Type,
  Palette,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import './index.css';

// Generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Logo component using Konva with Brand Colors
const LogoElement: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => {
  return (
    <Group x={x} y={y} scaleX={scale} scaleY={scale}>
      {/* Envelope icon */}
      <Rect x={0} y={20} width={60} height={45} fill="#f4d03f" cornerRadius={3} />
      <Line points={[0, 20, 30, 45, 60, 20]} stroke="#e5be35" strokeWidth={2} />
      {/* Text - using Brand Lila */}
      <Text x={70} y={0} text="Glücks-" fontSize={42} fontFamily={BRAND_FONTS.headline} fontStyle="normal" fill={BRAND_COLORS.lila} />
      <Text x={0} y={50} text="streunerpost" fontSize={42} fontFamily={BRAND_FONTS.headline} fontStyle="normal" fill={BRAND_COLORS.lila} />
    </Group>
  );
};

// Swirl decoration
const SwirlDecoration: React.FC<{ x: number; y: number; rotation?: number; opacity?: number }> = ({
  x, y, rotation = 0, opacity = 0.3
}) => {
  return (
    <Group x={x} y={y} rotation={rotation} opacity={opacity}>
      <Line
        points={[0, 0, 50, -30, 100, -20, 150, 10, 180, 50]}
        stroke="#9ca3af"
        strokeWidth={3}
        tension={0.5}
        lineCap="round"
      />
    </Group>
  );
};

// Arrow decoration
const ArrowDecoration: React.FC<{ x: number; y: number; rotation?: number }> = ({ x, y, rotation = 0 }) => {
  return (
    <Group x={x} y={y} rotation={rotation}>
      <Line
        points={[0, 0, 40, 0, 35, -8, 40, 0, 35, 8]}
        stroke="#ffffff"
        strokeWidth={4}
        lineCap="round"
        lineJoin="round"
      />
    </Group>
  );
};

// Draggable Image with border and shadow
const DraggableImage: React.FC<{
  image: ImageItem;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (attrs: Partial<ImageItem>) => void;
}> = ({ image, isSelected, onSelect, onChange }) => {
  const [img] = useImage(image.src, 'anonymous');
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const borderWidth = image.borderWidth || 8;
  const borderRadius = image.borderRadius || 20;

  return (
    <>
      <Group
        ref={shapeRef}
        x={image.x}
        y={image.y}
        rotation={image.rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({ x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (node) {
            onChange({
              x: node.x(),
              y: node.y(),
              width: Math.max(50, image.width * node.scaleX()),
              height: Math.max(50, image.height * node.scaleY()),
              rotation: node.rotation(),
            });
            node.scaleX(1);
            node.scaleY(1);
          }
        }}
      >
        {/* Shadow */}
        <Rect
          x={5}
          y={5}
          width={image.width + borderWidth * 2}
          height={image.height + borderWidth * 2}
          fill="rgba(0,0,0,0.2)"
          cornerRadius={borderRadius}
        />
        {/* Border */}
        <Rect
          x={0}
          y={0}
          width={image.width + borderWidth * 2}
          height={image.height + borderWidth * 2}
          fill={image.borderColor || '#ffffff'}
          cornerRadius={borderRadius}
        />
        {/* Image */}
        <Group clipFunc={(ctx) => {
          ctx.beginPath();
          ctx.roundRect(borderWidth, borderWidth, image.width, image.height, borderRadius - 5);
          ctx.closePath();
        }}>
          <KonvaImage
            image={img}
            x={borderWidth}
            y={borderWidth}
            width={image.width}
            height={image.height}
          />
        </Group>
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 50 || newBox.height < 50) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
};

// Draggable Text Label with background
const DraggableTextLabel: React.FC<{
  textOverlay: TextOverlay;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (attrs: Partial<TextOverlay>) => void;
}> = ({ textOverlay, isSelected, onSelect, onChange }) => {
  const groupRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [textWidth, setTextWidth] = useState(100);
  const [textHeight, setTextHeight] = useState(30);

  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const padding = textOverlay.padding || 12;
  const hasBackground = textOverlay.backgroundColor && textOverlay.backgroundColor !== 'transparent';

  return (
    <>
      <Group
        ref={groupRef}
        x={textOverlay.x}
        y={textOverlay.y}
        rotation={textOverlay.rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({ x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={() => {
          const node = groupRef.current;
          if (node) {
            onChange({
              x: node.x(),
              y: node.y(),
              rotation: node.rotation(),
              fontSize: Math.max(12, Math.round(textOverlay.fontSize * node.scaleX())),
            });
            node.scaleX(1);
            node.scaleY(1);
          }
        }}
      >
        {hasBackground && (
          <Rect
            x={0}
            y={0}
            width={textWidth + padding * 2}
            height={textHeight + padding * 2}
            fill={textOverlay.backgroundColor}
            cornerRadius={8}
          />
        )}
        <Text
          x={hasBackground ? padding : 0}
          y={hasBackground ? padding : 0}
          text={textOverlay.text}
          fontSize={textOverlay.fontSize}
          fontFamily={textOverlay.fontFamily}
          fontStyle={textOverlay.fontStyle || 'bold'}
          fill={textOverlay.fill}
          stroke={textOverlay.stroke}
          strokeWidth={textOverlay.strokeWidth || 0}
          align={textOverlay.align || 'left'}
          ref={(node) => {
            if (node) {
              setTextWidth(node.width());
              setTextHeight(node.height());
            }
          }}
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
        />
      )}
    </>
  );
};

// Animal Name with fancy style (like "Macy" in the images) - using Chewy font + Brand Lila
const AnimalNameText: React.FC<{
  name: string;
  x: number;
  y: number;
  fontSize?: number;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (x: number, y: number) => void;
}> = ({ name, x, y, fontSize = 72, isSelected, onSelect, onChange }) => {
  const groupRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Group
        ref={groupRef}
        x={x}
        y={y}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => onChange(e.target.x(), e.target.y())}
      >
        {/* Shadow/outline - Brand Lila darker */}
        <Text
          x={3}
          y={3}
          text={name}
          fontSize={fontSize}
          fontFamily={BRAND_FONTS.headline}
          fontStyle="normal"
          fill="#5a0854"
        />
        {/* Main text - Brand Lila with outline */}
        <Text
          x={0}
          y={0}
          text={name}
          fontSize={fontSize}
          fontFamily={BRAND_FONTS.headline}
          fontStyle="normal"
          fill={BRAND_COLORS.lila}
          stroke="#5a0854"
          strokeWidth={2}
        />
      </Group>
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};

// Story Text Box (white rounded box with text) - using Raleway font
const StoryTextBox: React.FC<{
  text: string;
  x: number;
  y: number;
  width: number;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (attrs: { x?: number; y?: number; text?: string }) => void;
}> = ({ text, x, y, width, isSelected, onSelect, onChange }) => {
  const groupRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const [textHeight, setTextHeight] = useState(100);

  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const padding = 30;

  return (
    <>
      <Group
        ref={groupRef}
        x={x}
        y={y}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
      >
        <Rect
          width={width}
          height={textHeight + padding * 2}
          fill="#ffffff"
          cornerRadius={30}
          shadowColor="rgba(0,0,0,0.1)"
          shadowBlur={10}
          shadowOffset={{ x: 0, y: 4 }}
        />
        <Text
          x={padding}
          y={padding}
          text={text}
          fontSize={24}
          fontFamily={BRAND_FONTS.body}
          fill="#374151"
          width={width - padding * 2}
          align="center"
          lineHeight={1.4}
          ref={(node) => {
            if (node) setTextHeight(node.height());
          }}
        />
      </Group>
      {isSelected && <Transformer ref={trRef} enabledAnchors={['middle-left', 'middle-right']} />}
    </>
  );
};

function App() {
  // Dark mode
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // App state
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [animalName, setAnimalName] = useState('');
  const [animalNamePos, setAnimalNamePos] = useState({ x: 650, y: 80 });
  const [animalSince, setAnimalSince] = useState('');

  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  const canvasSize = CANVAS_SIZES.instagram;
  const currentSlide = slides[currentSlideIndex];

  // Calculate scale
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth - 32;
        const scaleX = containerWidth / canvasSize.width;
        setScale(Math.min(scaleX, 0.55));
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [canvasSize]);

  // Initialize slides when category is selected - using Brand Colors
  const initializeProject = useCallback((category: PostCategory) => {
    setSelectedCategory(category);
    const initialSlides: Slide[] = [
      {
        id: generateId(),
        type: 'start',
        images: [],
        textOverlays: [
          { id: generateId(), text: 'früher', x: 80, y: 130, fontSize: 28, fontFamily: BRAND_FONTS.body, fill: '#ffffff', backgroundColor: BRAND_COLORS.lila, padding: 12, rotation: 0 },
          { id: generateId(), text: 'jetzt', x: 560, y: 310, fontSize: 28, fontFamily: BRAND_FONTS.body, fill: '#ffffff', backgroundColor: BRAND_COLORS.lila, padding: 12, rotation: 0 },
        ],
        decorations: [],
        backgroundColor: category.defaultColors.background,
      },
    ];
    setSlides(initialSlides);
    setCurrentSlideIndex(0);
  }, []);

  // Add new slide - using Brand Colors
  const addSlide = useCallback((type: 'content' | 'end') => {
    if (!selectedCategory) return;

    const newSlide: Slide = {
      id: generateId(),
      type,
      images: [],
      textOverlays: type === 'content'
        ? [{ id: generateId(), text: 'jetzt', x: 100, y: 50, fontSize: 24, fontFamily: BRAND_FONTS.body, fill: '#ffffff', backgroundColor: BRAND_COLORS.lila, padding: 10, rotation: 0 }]
        : [],
      decorations: [],
      backgroundColor: selectedCategory.defaultColors.background,
      storyText: type === 'content' ? '' : '„Man kann nicht alle Tiere der Welt retten,\naber man kann die ganze Welt eines Tieres retten."',
    };

    setSlides(prev => [...prev, newSlide]);
    setCurrentSlideIndex(slides.length);
  }, [selectedCategory, slides.length]);

  // Delete current slide
  const deleteSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setSlides(prev => prev.filter((_, i) => i !== currentSlideIndex));
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
  }, [slides.length, currentSlideIndex]);

  // Handle image upload for current slide
  const handleImagesAdded = useCallback((files: File[]) => {
    if (!currentSlide) return;

    files.forEach((file, fileIndex) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const slotIndex = currentSlide.images.length + fileIndex;
          let x = 50, y = 120, width = 450, height = 550;

          // Position based on slide type and slot
          if (currentSlide.type === 'start') {
            if (slotIndex === 0) {
              x = 40; y = 140; width = 420; height = 550;
            } else {
              x = 500; y = 300; width = 480; height = 580;
            }
          } else if (currentSlide.type === 'content') {
            if (slotIndex === 0) {
              x = 40; y = 60; width = 400; height = 380;
            } else {
              x = 470; y = 90; width = 520; height = 420;
            }
          } else {
            x = 0; y = 250; width = canvasSize.width; height = 700;
          }

          // Maintain aspect ratio
          const aspectRatio = img.width / img.height;
          if (aspectRatio > width / height) {
            height = width / aspectRatio;
          } else {
            width = height * aspectRatio;
          }

          const newImage: ImageItem = {
            id: generateId(),
            src: e.target?.result as string,
            x, y, width, height,
            rotation: currentSlide.type === 'start' ? (slotIndex === 0 ? -5 : 4) : (slotIndex === 0 ? -3 : 2),
            scaleX: 1,
            scaleY: 1,
            borderRadius: 20,
            borderColor: '#ffffff',
            borderWidth: 8,
          };

          setSlides(prev => prev.map((slide, i) =>
            i === currentSlideIndex
              ? { ...slide, images: [...slide.images, newImage] }
              : slide
          ));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }, [currentSlide, currentSlideIndex, canvasSize]);

  // Update image
  const handleImageChange = useCallback((id: string, attrs: Partial<ImageItem>) => {
    setSlides(prev => prev.map((slide, i) =>
      i === currentSlideIndex
        ? { ...slide, images: slide.images.map(img => img.id === id ? { ...img, ...attrs } : img) }
        : slide
    ));
  }, [currentSlideIndex]);

  // Delete image
  const handleDeleteImage = useCallback((id: string) => {
    setSlides(prev => prev.map((slide, i) =>
      i === currentSlideIndex
        ? { ...slide, images: slide.images.filter(img => img.id !== id) }
        : slide
    ));
    if (selectedId === id) setSelectedId(null);
  }, [currentSlideIndex, selectedId]);

  // Add text overlay - using Brand Colors + Fonts
  const handleAddText = useCallback((preset?: { label: string; backgroundColor: string; fill: string }) => {
    const newText: TextOverlay = {
      id: generateId(),
      text: preset?.label || 'Text',
      x: 100,
      y: 100,
      fontSize: 28,
      fontFamily: BRAND_FONTS.body,
      fill: preset?.fill || '#ffffff',
      backgroundColor: preset?.backgroundColor || BRAND_COLORS.lila,
      padding: 12,
      rotation: 0,
    };
    setSlides(prev => prev.map((slide, i) =>
      i === currentSlideIndex
        ? { ...slide, textOverlays: [...slide.textOverlays, newText] }
        : slide
    ));
    setSelectedId(newText.id);
  }, [currentSlideIndex]);

  // Update text
  const handleUpdateText = useCallback((id: string, attrs: Partial<TextOverlay>) => {
    setSlides(prev => prev.map((slide, i) =>
      i === currentSlideIndex
        ? { ...slide, textOverlays: slide.textOverlays.map(t => t.id === id ? { ...t, ...attrs } : t) }
        : slide
    ));
  }, [currentSlideIndex]);

  // Delete text
  const handleDeleteText = useCallback((id: string) => {
    setSlides(prev => prev.map((slide, i) =>
      i === currentSlideIndex
        ? { ...slide, textOverlays: slide.textOverlays.filter(t => t.id !== id) }
        : slide
    ));
    if (selectedId === id) setSelectedId(null);
  }, [currentSlideIndex, selectedId]);

  // Update story text
  const handleStoryTextChange = useCallback((text: string) => {
    setSlides(prev => prev.map((slide, i) =>
      i === currentSlideIndex ? { ...slide, storyText: text } : slide
    ));
  }, [currentSlideIndex]);

  // Update background color
  const handleBackgroundChange = useCallback((color: string) => {
    setSlides(prev => prev.map((slide, i) =>
      i === currentSlideIndex ? { ...slide, backgroundColor: color } : slide
    ));
  }, [currentSlideIndex]);

  // Export current slide
  const handleExportSlide = useCallback(() => {
    if (stageRef.current) {
      setSelectedId(null);
      setTimeout(() => {
        const uri = stageRef.current.toDataURL({ pixelRatio: 1 / scale, mimeType: 'image/png' });
        const link = document.createElement('a');
        link.download = `${animalName || 'post'}-slide-${currentSlideIndex + 1}.png`;
        link.href = uri;
        link.click();
      }, 100);
    }
  }, [scale, animalName, currentSlideIndex]);

  // Export all slides
  const handleExportAll = useCallback(async () => {
    setSelectedId(null);

    for (let i = 0; i < slides.length; i++) {
      setCurrentSlideIndex(i);
      await new Promise(resolve => setTimeout(resolve, 200));

      if (stageRef.current) {
        const uri = stageRef.current.toDataURL({ pixelRatio: 1 / scale, mimeType: 'image/png' });
        const link = document.createElement('a');
        link.download = `${animalName || 'post'}-slide-${i + 1}.png`;
        link.href = uri;
        link.click();
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }, [slides.length, scale, animalName]);

  // Deselect on stage click
  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  // Category Selection View
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PawPrint className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Streunerglück</h1>
                <p className="text-sm text-muted-foreground">Post Generator</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Wähle eine Kategorie</h2>
            <p className="text-muted-foreground">Was möchtest du erstellen?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {POST_CATEGORIES.map((category) => (
              <Card
                key={category.id}
                className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
                onClick={() => initializeProject(category)}
              >
                <CardContent className="pt-6 text-center">
                  <div className="text-5xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  <div className="flex justify-center gap-2 mt-4">
                    {Object.values(category.defaultColors).slice(0, 4).map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border border-muted"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Main Editor View
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Zurück
            </Button>
            <div className="h-6 w-px bg-border" />
            <span className="text-2xl">{selectedCategory.icon}</span>
            <div>
              <h1 className="font-bold">{selectedCategory.name}</h1>
              <p className="text-xs text-muted-foreground">Slide {currentSlideIndex + 1} von {slides.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportSlide}>
              <Download className="h-4 w-4 mr-1" />
              Slide
            </Button>
            <Button size="sm" onClick={handleExportAll}>
              <Download className="h-4 w-4 mr-1" />
              Alle ({slides.length})
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Slide Navigator */}
      <div className="border-b bg-card/50 overflow-x-auto">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(index)}
                className={cn(
                  "flex-shrink-0 w-24 h-24 rounded-lg border-2 overflow-hidden transition-all relative",
                  currentSlideIndex === index ? "border-primary ring-2 ring-primary/20" : "border-muted hover:border-primary/50"
                )}
              >
                <div
                  className="w-full h-full flex items-center justify-center text-xs font-medium"
                  style={{ backgroundColor: slide.backgroundColor }}
                >
                  <span className="bg-black/50 text-white px-2 py-1 rounded">
                    {slide.type === 'start' ? 'Start' : slide.type === 'end' ? 'Ende' : `${index}`}
                  </span>
                </div>
                {slides.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteSlide(); }}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </button>
            ))}

            {/* Add Slide Buttons */}
            <div className="flex flex-col gap-1">
              <Button variant="outline" size="sm" onClick={() => addSlide('content')} className="text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Story
              </Button>
              <Button variant="outline" size="sm" onClick={() => addSlide('end')} className="text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Ende
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {/* Animal Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <PawPrint className="h-4 w-4" />
                  Tier-Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={animalName}
                    onChange={(e) => setAnimalName(e.target.value)}
                    placeholder="z.B. Macy"
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Glücksstreuner seit</Label>
                  <Input
                    value={animalSince}
                    onChange={(e) => setAnimalSince(e.target.value)}
                    placeholder="z.B. 07/2023"
                    className="h-8"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Bilder ({currentSlide?.images.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ImageUploader
                  onImagesAdded={handleImagesAdded}
                  maxFiles={4}
                  currentCount={currentSlide?.images.length || 0}
                />
                {currentSlide?.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {currentSlide.images.map((img, idx) => (
                      <div
                        key={img.id}
                        className={cn(
                          "relative group rounded-lg overflow-hidden border-2 cursor-pointer h-16",
                          selectedId === img.id ? "border-primary" : "border-muted"
                        )}
                        onClick={() => setSelectedId(img.id)}
                      >
                        <img src={img.src} alt={`Bild ${idx + 1}`} className="w-full h-full object-cover" />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-0.5 right-0.5 h-5 w-5 opacity-0 group-hover:opacity-100"
                          onClick={(e) => { e.stopPropagation(); handleDeleteImage(img.id); }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Background - Brand Colors first */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Hintergrund
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {[BRAND_COLORS.gruen, BRAND_COLORS.lila, '#ffffff', '#fef3c7', '#fecaca', '#e0e7ff', '#1f2937'].map(color => (
                    <button
                      key={color}
                      onClick={() => handleBackgroundChange(color)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                        currentSlide?.backgroundColor === color ? "border-primary scale-110" : "border-muted"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center - Canvas */}
          <div className="lg:col-span-6">
            <Card>
              <CardContent className="p-4">
                <div
                  ref={containerRef}
                  className="bg-muted rounded-lg p-2 flex items-center justify-center"
                >
                  {currentSlide && (
                    <Stage
                      ref={stageRef}
                      width={canvasSize.width * scale}
                      height={canvasSize.height * scale}
                      scaleX={scale}
                      scaleY={scale}
                      onMouseDown={handleStageClick}
                      onTouchStart={handleStageClick}
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)', borderRadius: '8px' }}
                    >
                      <Layer>
                        {/* Background */}
                        <Rect x={0} y={0} width={canvasSize.width} height={canvasSize.height} fill={currentSlide.backgroundColor} />

                        {/* Decorations - Swirls */}
                        {currentSlide.type === 'start' && (
                          <>
                            <SwirlDecoration x={850} y={200} rotation={-30} />
                            <SwirlDecoration x={100} y={800} rotation={45} />
                            <SwirlDecoration x={750} y={950} rotation={-15} />
                          </>
                        )}

                        {/* Images */}
                        {currentSlide.images.map((image) => (
                          <DraggableImage
                            key={image.id}
                            image={image}
                            isSelected={selectedId === image.id}
                            onSelect={() => setSelectedId(image.id)}
                            onChange={(attrs) => handleImageChange(image.id, attrs)}
                          />
                        ))}

                        {/* Text overlays */}
                        {currentSlide.textOverlays.map((text) => (
                          <DraggableTextLabel
                            key={text.id}
                            textOverlay={text}
                            isSelected={selectedId === text.id}
                            onSelect={() => setSelectedId(text.id)}
                            onChange={(attrs) => handleUpdateText(text.id, attrs)}
                          />
                        ))}

                        {/* Animal name */}
                        {animalName && currentSlide.type !== 'end' && (
                          <AnimalNameText
                            name={animalName}
                            x={animalNamePos.x}
                            y={animalNamePos.y}
                            isSelected={selectedId === 'animal-name'}
                            onSelect={() => setSelectedId('animal-name')}
                            onChange={(x, y) => setAnimalNamePos({ x, y })}
                          />
                        )}

                        {/* Since text - using Raleway */}
                        {animalSince && currentSlide.type === 'start' && (
                          <Text
                            x={680}
                            y={50}
                            text={`Glücksstreuner\nseit ${animalSince}`}
                            fontSize={22}
                            fontFamily={BRAND_FONTS.body}
                            fill="#6b7280"
                            align="center"
                          />
                        )}

                        {/* Logo for start slide */}
                        {currentSlide.type === 'start' && (
                          <LogoElement x={30} y={880} scale={0.8} />
                        )}

                        {/* Story text box for content slides */}
                        {currentSlide.type === 'content' && currentSlide.storyText && (
                          <StoryTextBox
                            text={currentSlide.storyText}
                            x={50}
                            y={520}
                            width={980}
                            isSelected={selectedId === 'story-text'}
                            onSelect={() => setSelectedId('story-text')}
                            onChange={(attrs) => {
                              if (attrs.text !== undefined) handleStoryTextChange(attrs.text);
                            }}
                          />
                        )}

                        {/* End slide quote */}
                        {currentSlide.type === 'end' && (
                          <>
                            {animalName && (
                              <AnimalNameText
                                name={animalName}
                                x={400}
                                y={30}
                                fontSize={80}
                                isSelected={selectedId === 'end-name'}
                                onSelect={() => setSelectedId('end-name')}
                                onChange={() => {}}
                              />
                            )}
                            <Text
                              x={540}
                              y={130}
                              text={currentSlide.storyText || ''}
                              fontSize={24}
                              fontFamily={BRAND_FONTS.body}
                              fontStyle="italic"
                              fill="#374151"
                              align="center"
                              width={900}
                              offsetX={450}
                            />
                            <Text
                              x={540}
                              y={1000}
                              text="Danke!"
                              fontSize={42}
                              fontFamily={BRAND_FONTS.headline}
                              fontStyle="normal"
                              fill="#ffffff"
                              align="center"
                              offsetX={50}
                            />
                            <ArrowDecoration x={980} y={980} rotation={45} />
                          </>
                        )}

                        {/* Navigation dots */}
                        <Group x={canvasSize.width / 2 - (slides.length * 12) / 2} y={canvasSize.height - 40}>
                          {slides.map((_, i) => (
                            <Rect
                              key={i}
                              x={i * 16}
                              y={0}
                              width={10}
                              height={10}
                              fill={i === currentSlideIndex ? '#ffffff' : 'rgba(255,255,255,0.4)'}
                              cornerRadius={5}
                            />
                          ))}
                        </Group>
                      </Layer>
                    </Stage>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            {/* Text Labels */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Text-Labels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_TEXT_PRESETS.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddText(preset)}
                      className="text-xs"
                    >
                      <span className="w-2 h-2 rounded mr-1" style={{ backgroundColor: preset.backgroundColor }} />
                      {preset.label}
                    </Button>
                  ))}
                </div>
                <Button variant="secondary" size="sm" className="w-full" onClick={() => handleAddText()}>
                  <Plus className="h-3 w-3 mr-1" />
                  Eigener Text
                </Button>

                {/* Text list */}
                {currentSlide?.textOverlays.length > 0 && (
                  <div className="space-y-1 pt-2 border-t">
                    {currentSlide.textOverlays.map((text) => (
                      <div
                        key={text.id}
                        className={cn(
                          "flex items-center justify-between p-2 rounded text-xs cursor-pointer",
                          selectedId === text.id ? "bg-primary/20" : "bg-muted"
                        )}
                        onClick={() => setSelectedId(text.id)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded" style={{ backgroundColor: text.backgroundColor }} />
                          <span className="truncate max-w-[100px]">{text.text}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={(e) => { e.stopPropagation(); handleDeleteText(text.id); }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Story Text (for content slides) */}
            {currentSlide?.type === 'content' && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Story Text
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={currentSlide.storyText || ''}
                    onChange={(e) => handleStoryTextChange(e.target.value)}
                    placeholder="Erzähle die Geschichte..."
                    className="w-full h-32 p-2 text-sm rounded-md border bg-background resize-none"
                  />
                </CardContent>
              </Card>
            )}

            {/* Social Media (coming soon) */}
            <Card className="opacity-60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  Social Media
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Direkt zu Instagram posten - Coming Soon!
                </p>
                <Button variant="outline" size="sm" className="w-full mt-2" disabled>
                  <Settings className="h-3 w-3 mr-1" />
                  Account verbinden
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
