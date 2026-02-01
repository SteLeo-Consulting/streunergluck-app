import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Text, Transformer, Group } from 'react-konva';
import useImage from 'use-image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUploader from '@/components/ImageUploader';
import TextOverlayPanel from '@/components/TextOverlayPanel';
import LayoutSelector from '@/components/LayoutSelector';
import FormatSelector from '@/components/FormatSelector';
import type { ImageItem, TextOverlay } from '@/types';
import { CANVAS_SIZES, LAYOUTS } from '@/types';
import {
  Download,
  Moon,
  Sun,
  Trash2,
  PawPrint,
  Image as ImageIcon,
  Palette,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import './index.css';

// Generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Draggable Image Component
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

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={img}
        x={image.x}
        y={image.y}
        width={image.width}
        height={image.height}
        rotation={image.rotation}
        scaleX={image.scaleX}
        scaleY={image.scaleY}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        cornerRadius={15}
        shadowColor="black"
        shadowBlur={20}
        shadowOffset={{ x: 5, y: 5 }}
        shadowOpacity={0.3}
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (node) {
            onChange({
              x: node.x(),
              y: node.y(),
              width: Math.max(50, node.width() * node.scaleX()),
              height: Math.max(50, node.height() * node.scaleY()),
              rotation: node.rotation(),
              scaleX: 1,
              scaleY: 1,
            });
            node.scaleX(1);
            node.scaleY(1);
          }
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 50 || newBox.height < 50) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

// Draggable Text with Background
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
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = groupRef.current;
          if (node) {
            const scaleX = node.scaleX();
            onChange({
              x: node.x(),
              y: node.y(),
              rotation: node.rotation(),
              fontSize: Math.max(12, Math.round(textOverlay.fontSize * scaleX)),
            });
            node.scaleX(1);
            node.scaleY(1);
          }
        }}
      >
        {/* Background rectangle */}
        <Rect
          x={0}
          y={0}
          width={textWidth + padding * 2}
          height={textHeight + padding * 2}
          fill={textOverlay.backgroundColor}
          cornerRadius={8}
        />
        {/* Text */}
        <Text
          x={padding}
          y={padding}
          text={textOverlay.text}
          fontSize={textOverlay.fontSize}
          fontFamily={textOverlay.fontFamily}
          fontStyle="bold"
          fill={textOverlay.fill}
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
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 30 || newBox.height < 20) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

function App() {
  // Dark mode (default: dark)
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Canvas state
  const [format, setFormat] = useState<'instagram' | 'facebook' | 'story'>('instagram');
  const [layout, setLayout] = useState('side-by-side');
  const [backgroundColor, setBackgroundColor] = useState('#bef264');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [animalName, setAnimalName] = useState('');

  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  const canvasSize = CANVAS_SIZES[format];

  // Calculate scale
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth - 32;
        const scaleX = containerWidth / canvasSize.width;
        setScale(Math.min(scaleX, 0.6));
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [canvasSize]);

  // Handle image upload
  const handleImagesAdded = useCallback(
    (files: File[]) => {
      files.forEach((file, fileIndex) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new window.Image();
          img.onload = () => {
            const layoutInfo = LAYOUTS.find((l) => l.id === layout);
            const slotIndex = images.length + fileIndex;
            let x = 50;
            let y = 50;
            let width = canvasSize.width * 0.4;
            let height = canvasSize.height * 0.6;

            // Position based on layout
            if (layoutInfo?.arrangement === 'side-by-side') {
              width = canvasSize.width * 0.45;
              height = canvasSize.height * 0.7;
              x = slotIndex === 0 ? canvasSize.width * 0.02 : canvasSize.width * 0.52;
              y = canvasSize.height * 0.15;
            } else if (layoutInfo?.arrangement === 'stacked') {
              width = canvasSize.width * 0.8;
              height = canvasSize.height * 0.4;
              x = canvasSize.width * 0.1;
              y = slotIndex === 0 ? canvasSize.height * 0.05 : canvasSize.height * 0.5;
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
              x,
              y,
              width,
              height,
              rotation: slotIndex === 0 ? -3 : 3,
              scaleX: 1,
              scaleY: 1,
            };

            setImages((prev) => [...prev, newImage]);
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    },
    [layout, images.length, canvasSize]
  );

  // Handle text overlay
  const handleAddText = useCallback(
    (preset?: { label: string; backgroundColor: string; fill: string }) => {
      const newText: TextOverlay = {
        id: generateId(),
        text: preset?.label || 'Text',
        x: canvasSize.width * 0.1,
        y: canvasSize.height * 0.1,
        fontSize: 32,
        fontFamily: 'Arial',
        fill: preset?.fill || '#ffffff',
        backgroundColor: preset?.backgroundColor || '#9333ea',
        padding: 12,
        rotation: 0,
      };
      setTextOverlays((prev) => [...prev, newText]);
      setSelectedId(newText.id);
    },
    [canvasSize]
  );

  const handleUpdateText = useCallback((id: string, attrs: Partial<TextOverlay>) => {
    setTextOverlays((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...attrs } : t))
    );
    setSelectedId(id);
  }, []);

  const handleDeleteText = useCallback((id: string) => {
    setTextOverlays((prev) => prev.filter((t) => t.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const handleImageChange = useCallback((id: string, attrs: Partial<ImageItem>) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...attrs } : img))
    );
  }, []);

  const handleDeleteImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  // Deselect on stage click
  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  // Export
  const handleExport = useCallback(() => {
    if (stageRef.current) {
      setSelectedId(null);
      setTimeout(() => {
        const uri = stageRef.current.toDataURL({
          pixelRatio: 1 / scale,
          mimeType: 'image/png',
        });
        const link = document.createElement('a');
        link.download = `streunergluck-${animalName || 'post'}-${format}.png`;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 100);
    }
  }, [scale, animalName, format]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PawPrint className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Streunerglück</h1>
              <p className="text-sm text-muted-foreground">Post Generator</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-3 space-y-4">
            {/* Animal Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <PawPrint className="h-5 w-5" />
                  Tier-Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={animalName}
                    onChange={(e) => setAnimalName(e.target.value)}
                    placeholder="z.B. Pünktchen"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Bilder
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUploader
                  onImagesAdded={handleImagesAdded}
                  maxFiles={4}
                  currentCount={images.length}
                />

                {/* Image list */}
                {images.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">
                      Hochgeladen ({images.length})
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {images.map((img, idx) => (
                        <div
                          key={img.id}
                          className={cn(
                            'relative group rounded-lg overflow-hidden border-2 cursor-pointer',
                            selectedId === img.id
                              ? 'border-primary'
                              : 'border-muted'
                          )}
                          onClick={() => setSelectedId(img.id)}
                        >
                          <img
                            src={img.src}
                            alt={`Bild ${idx + 1}`}
                            className="w-full h-20 object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteImage(img.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <FormatSelector
              selectedFormat={format}
              onFormatChange={setFormat}
            />

            <LayoutSelector
              selectedLayout={layout}
              onLayoutChange={setLayout}
            />
          </div>

          {/* Center - Canvas */}
          <div className="lg:col-span-6">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Vorschau</CardTitle>
                  <Button onClick={handleExport} disabled={images.length === 0}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportieren
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  ref={containerRef}
                  className="bg-muted rounded-lg p-4 flex items-center justify-center min-h-[500px]"
                >
                  <Stage
                    ref={stageRef}
                    width={canvasSize.width * scale}
                    height={canvasSize.height * scale}
                    scaleX={scale}
                    scaleY={scale}
                    onMouseDown={handleStageClick}
                    onTouchStart={handleStageClick}
                    style={{
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <Layer>
                      {/* Background */}
                      <Rect
                        x={0}
                        y={0}
                        width={canvasSize.width}
                        height={canvasSize.height}
                        fill={backgroundColor}
                      />

                      {/* Images */}
                      {images.map((image) => (
                        <DraggableImage
                          key={image.id}
                          image={image}
                          isSelected={selectedId === image.id}
                          onSelect={() => setSelectedId(image.id)}
                          onChange={(attrs) => handleImageChange(image.id, attrs)}
                        />
                      ))}

                      {/* Text overlays */}
                      {textOverlays.map((text) => (
                        <DraggableTextLabel
                          key={text.id}
                          textOverlay={text}
                          isSelected={selectedId === text.id}
                          onSelect={() => setSelectedId(text.id)}
                          onChange={(attrs) => handleUpdateText(text.id, attrs)}
                        />
                      ))}

                      {/* Animal name */}
                      {animalName && (
                        <Text
                          x={canvasSize.width * 0.55}
                          y={canvasSize.height * 0.05}
                          text={animalName}
                          fontSize={64}
                          fontFamily="Arial"
                          fontStyle="bold"
                          fill="#9333ea"
                        />
                      )}
                    </Layer>
                  </Stage>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Text & Style */}
          <div className="lg:col-span-3 space-y-4">
            {/* Background color */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Hintergrund
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer border-0"
                  />
                  <Input
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
                {/* Quick colors */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  {['#bef264', '#fcd34d', '#f9a8d4', '#93c5fd', '#c4b5fd', '#ffffff', '#1f2937'].map(
                    (color) => (
                      <button
                        key={color}
                        onClick={() => setBackgroundColor(color)}
                        className={cn(
                          'w-8 h-8 rounded-full border-2 transition-transform hover:scale-110',
                          backgroundColor === color
                            ? 'border-primary scale-110'
                            : 'border-muted'
                        )}
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <TextOverlayPanel
              textOverlays={textOverlays}
              selectedId={selectedId}
              onAddText={handleAddText}
              onUpdateText={handleUpdateText}
              onDeleteText={handleDeleteText}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
