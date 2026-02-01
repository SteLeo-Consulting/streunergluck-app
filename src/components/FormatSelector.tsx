import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Instagram, Smartphone, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormatSelectorProps {
  selectedFormat: 'instagram' | 'facebook' | 'story';
  onFormatChange: (format: 'instagram' | 'facebook' | 'story') => void;
}

const formats = [
  {
    id: 'instagram' as const,
    name: 'Instagram',
    icon: Instagram,
    size: '1080×1080',
    description: 'Quadratisch',
  },
  {
    id: 'facebook' as const,
    name: 'Facebook',
    icon: Monitor,
    size: '1200×630',
    description: 'Querformat',
  },
  {
    id: 'story' as const,
    name: 'Story',
    icon: Smartphone,
    size: '1080×1920',
    description: 'Hochformat',
  },
];

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  selectedFormat,
  onFormatChange,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Instagram className="h-5 w-5" />
          Format
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {formats.map((format) => {
            const Icon = format.icon;
            return (
              <button
                key={format.id}
                onClick={() => onFormatChange(format.id)}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left',
                  selectedFormat === format.id
                    ? 'border-primary bg-primary/10'
                    : 'border-muted hover:border-primary/50'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{format.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {format.size} • {format.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FormatSelector;
