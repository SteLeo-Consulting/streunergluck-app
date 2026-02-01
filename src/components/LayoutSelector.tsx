import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LAYOUTS } from '@/types';
import { LayoutGrid, Square, Columns, Rows } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutSelectorProps {
  selectedLayout: string;
  onLayoutChange: (layoutId: string) => void;
}

const LayoutIcon: React.FC<{ arrangement: string }> = ({ arrangement }) => {
  switch (arrangement) {
    case 'single':
      return <Square className="h-6 w-6" />;
    case 'side-by-side':
      return <Columns className="h-6 w-6" />;
    case 'stacked':
      return <Rows className="h-6 w-6" />;
    case 'grid':
      return <LayoutGrid className="h-6 w-6" />;
    default:
      return <Square className="h-6 w-6" />;
  }
};

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  selectedLayout,
  onLayoutChange,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <LayoutGrid className="h-5 w-5" />
          Layout
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {LAYOUTS.map((layout) => (
            <button
              key={layout.id}
              onClick={() => onLayoutChange(layout.id)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                selectedLayout === layout.id
                  ? 'border-primary bg-primary/10'
                  : 'border-muted hover:border-primary/50'
              )}
            >
              <LayoutIcon arrangement={layout.arrangement} />
              <span className="text-sm font-medium">{layout.name}</span>
              <span className="text-xs text-muted-foreground">
                {layout.images} {layout.images === 1 ? 'Bild' : 'Bilder'}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LayoutSelector;
