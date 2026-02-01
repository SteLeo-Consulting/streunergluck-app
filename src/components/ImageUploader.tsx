import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImagesAdded: (files: File[]) => void;
  maxFiles?: number;
  currentCount?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesAdded,
  maxFiles = 5,
  currentCount = 0,
}) => {
  const remainingSlots = maxFiles - currentCount;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const filesToAdd = acceptedFiles.slice(0, remainingSlots);
      if (filesToAdd.length > 0) {
        onImagesAdded(filesToAdd);
      }
    },
    [onImagesAdded, remainingSlots]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: remainingSlots,
    disabled: remainingSlots <= 0,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
        isDragActive
          ? 'border-primary bg-primary/10'
          : 'border-muted-foreground/25 hover:border-primary/50',
        remainingSlots <= 0 && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        {isDragActive ? (
          <>
            <Upload className="h-12 w-12 text-primary animate-bounce" />
            <p className="text-lg font-medium">Bilder hier ablegen...</p>
          </>
        ) : (
          <>
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">
                Bilder hierher ziehen oder klicken
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                JPG, PNG, WebP • max. 10MB pro Bild
              </p>
              {remainingSlots > 0 ? (
                <p className="text-sm text-muted-foreground mt-1">
                  Noch {remainingSlots} {remainingSlots === 1 ? 'Bild' : 'Bilder'} möglich
                </p>
              ) : (
                <p className="text-sm text-destructive mt-1">
                  Maximum erreicht ({maxFiles} Bilder)
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
