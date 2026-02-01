import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Text, Transformer } from 'react-konva';
import useImage from 'use-image';
import type { ImageItem, TextOverlay } from '@/types';
import { CANVAS_SIZES } from '@/types';

interface PostCanvasProps {
  format: 'instagram' | 'facebook' | 'story';
  images: ImageItem[];
  textOverlays: TextOverlay[];
  backgroundColor: string;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onImageChange: (id: string, attrs: Partial<ImageItem>) => void;
  onTextChange: (id: string, attrs: Partial<TextOverlay>) => void;
}

// Image component with draggable functionality
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
      trRef.current.getLayer().batchDraw();
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
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(50, node.width() * scaleX),
            height: Math.max(50, node.height() * scaleY),
            rotation: node.rotation(),
            scaleX: 1,
            scaleY: 1,
          });
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

// Text overlay component
const DraggableText: React.FC<{
  textOverlay: TextOverlay;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (attrs: Partial<TextOverlay>) => void;
}> = ({ textOverlay, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        ref={shapeRef}
        text={textOverlay.text}
        x={textOverlay.x}
        y={textOverlay.y}
        fontSize={textOverlay.fontSize}
        fontFamily={textOverlay.fontFamily}
        fill={textOverlay.fill}
        padding={textOverlay.padding}
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
          const node = shapeRef.current;
          onChange({
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            fontSize: Math.max(12, textOverlay.fontSize * node.scaleX()),
          });
          node.scaleX(1);
          node.scaleY(1);
        }}
      />
      {/* Background rect for text */}
      {textOverlay.backgroundColor && (
        <Rect
          x={textOverlay.x - textOverlay.padding}
          y={textOverlay.y - textOverlay.padding}
          width={shapeRef.current?.width() + textOverlay.padding * 2 || 100}
          height={shapeRef.current?.height() + textOverlay.padding * 2 || 30}
          fill={textOverlay.backgroundColor}
          cornerRadius={4}
          listening={false}
        />
      )}
      {isSelected && (
        <Transformer
          ref={trRef}
          enabledAnchors={['middle-left', 'middle-right']}
        />
      )}
    </>
  );
};

export const PostCanvas: React.FC<PostCanvasProps> = ({
  format,
  images,
  textOverlays,
  backgroundColor,
  selectedId,
  onSelect,
  onImageChange,
  onTextChange,
}) => {
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const canvasSize = CANVAS_SIZES[format];

  // Calculate scale to fit container
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight || 500;
        const scaleX = containerWidth / canvasSize.width;
        const scaleY = containerHeight / canvasSize.height;
        setScale(Math.min(scaleX, scaleY, 1) * 0.9);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [canvasSize]);

  const handleDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      onSelect(null);
    }
  };

  // Export function - exposed via ref if needed
  const _exportImage = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL({
        pixelRatio: 1 / scale,
        mimeType: 'image/png',
      });
      const link = document.createElement('a');
      link.download = `streunergluck-post.png`;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  // Silence TS warning, function available for future use
  void _exportImage;

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={containerRef}
        className="relative bg-muted rounded-lg overflow-hidden flex items-center justify-center"
        style={{ minHeight: '400px' }}
      >
        <Stage
          ref={stageRef}
          width={canvasSize.width * scale}
          height={canvasSize.height * scale}
          scaleX={scale}
          scaleY={scale}
          onMouseDown={handleDeselect}
          onTouchStart={handleDeselect}
          style={{
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            borderRadius: '8px',
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
                onSelect={() => onSelect(image.id)}
                onChange={(attrs) => onImageChange(image.id, attrs)}
              />
            ))}

            {/* Text overlays */}
            {textOverlays.map((text) => (
              <DraggableText
                key={text.id}
                textOverlay={text}
                isSelected={selectedId === text.id}
                onSelect={() => onSelect(text.id)}
                onChange={(attrs) => onTextChange(text.id, attrs)}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default PostCanvas;
