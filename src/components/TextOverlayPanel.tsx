import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TextOverlay } from '@/types';
import { DEFAULT_TEXT_PRESETS } from '@/types';
import { Plus, Type, Trash2 } from 'lucide-react';

interface TextOverlayPanelProps {
  textOverlays: TextOverlay[];
  selectedId: string | null;
  onAddText: (preset?: { label: string; backgroundColor: string; fill: string }) => void;
  onUpdateText: (id: string, attrs: Partial<TextOverlay>) => void;
  onDeleteText: (id: string) => void;
}

export const TextOverlayPanel: React.FC<TextOverlayPanelProps> = ({
  textOverlays,
  selectedId,
  onAddText,
  onUpdateText,
  onDeleteText,
}) => {
  const selectedText = textOverlays.find((t) => t.id === selectedId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Type className="h-5 w-5" />
          Text-Labels
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick presets */}
        <div>
          <Label className="text-sm text-muted-foreground">Schnell-Labels</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {DEFAULT_TEXT_PRESETS.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => onAddText(preset)}
                style={{ borderColor: preset.backgroundColor }}
              >
                <span
                  className="w-3 h-3 rounded mr-2"
                  style={{ backgroundColor: preset.backgroundColor }}
                />
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom text button */}
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => onAddText()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Eigener Text
        </Button>

        {/* Selected text editor */}
        {selectedText && (
          <div className="space-y-4 pt-4 border-t">
            <Label className="text-sm font-medium">Ausgewählter Text</Label>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Text</Label>
              <Input
                value={selectedText.text}
                onChange={(e) =>
                  onUpdateText(selectedText.id, { text: e.target.value })
                }
                placeholder="Label eingeben..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Schriftgröße: {selectedText.fontSize}px
              </Label>
              <Slider
                value={[selectedText.fontSize]}
                onValueChange={([value]) =>
                  onUpdateText(selectedText.id, { fontSize: value })
                }
                min={12}
                max={72}
                step={1}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Textfarbe</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={selectedText.fill}
                    onChange={(e) =>
                      onUpdateText(selectedText.id, { fill: e.target.value })
                    }
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={selectedText.fill}
                    onChange={(e) =>
                      onUpdateText(selectedText.id, { fill: e.target.value })
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Hintergrund</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={selectedText.backgroundColor || '#000000'}
                    onChange={(e) =>
                      onUpdateText(selectedText.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={selectedText.backgroundColor}
                    onChange={(e) =>
                      onUpdateText(selectedText.id, {
                        backgroundColor: e.target.value,
                      })
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => onDeleteText(selectedText.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Label löschen
            </Button>
          </div>
        )}

        {/* List of all texts */}
        {textOverlays.length > 0 && (
          <div className="space-y-2 pt-4 border-t">
            <Label className="text-sm text-muted-foreground">
              Alle Labels ({textOverlays.length})
            </Label>
            <div className="space-y-1">
              {textOverlays.map((text) => (
                <div
                  key={text.id}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                    selectedId === text.id
                      ? 'bg-primary/20 border border-primary'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  onClick={() => onUpdateText(text.id, {})} // Just to select
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: text.backgroundColor }}
                    />
                    <span className="text-sm truncate max-w-[120px]">
                      {text.text}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteText(text.id);
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
  );
};

export default TextOverlayPanel;
