# Streunerglück - Social Media Post Generator

Ein moderner Post-Generator für Tiervermittlungs-Organisationen. Erstelle ansprechende Social Media Posts mit Drag & Drop Bildbearbeitung und Text-Overlays.

![Dark Mode](https://img.shields.io/badge/Dark%20Mode-Default-blueviolet)
![React](https://img.shields.io/badge/React-19.2-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6)

## Features

- **Dark Mode** (standardmäßig aktiviert)
- **Drag & Drop** Bildpositionierung mit Resize/Rotate
- **Text-Overlays** mit Presets ("früher", "jetzt", "vorher", "nachher")
- **Multi-Format** Support (Instagram, Facebook, Story)
- **Flexible Layouts** (Einzelbild, Nebeneinander, Übereinander, 4er Raster)
- **PNG Export** in voller Auflösung

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui Komponenten
- Konva für Canvas-Bearbeitung

## Installation

```bash
# Repository klonen
git clone https://github.com/SteLeo-Consulting/streunergluck-app.git
cd streunergluck-app

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

## Verwendung

1. **Bilder hochladen**: Drag & Drop oder Klicken zum Auswählen
2. **Layout wählen**: Einzelbild, Nebeneinander, etc.
3. **Format wählen**: Instagram (1080×1080), Facebook (1200×630), Story (1080×1920)
4. **Bilder anpassen**: Ziehen, Skalieren, Rotieren
5. **Text hinzufügen**: Quick-Labels oder eigener Text
6. **Exportieren**: Als PNG herunterladen

## Verfügbare Scripts

| Script | Beschreibung |
|--------|--------------|
| `npm run dev` | Startet den Development Server |
| `npm run build` | Erstellt Production Build |
| `npm run preview` | Vorschau des Production Builds |
| `npm run lint` | ESLint Check |

## Projektstruktur

```
streunergluck-app/
├── src/
│   ├── components/
│   │   ├── ui/           # Shadcn Komponenten
│   │   ├── ImageUploader.tsx
│   │   ├── FormatSelector.tsx
│   │   ├── LayoutSelector.tsx
│   │   └── TextOverlayPanel.tsx
│   ├── types/
│   │   └── index.ts      # TypeScript Interfaces
│   ├── lib/
│   │   └── utils.ts      # Utility Funktionen
│   ├── App.tsx           # Hauptkomponente
│   └── index.css         # Globale Styles
├── TEST-REPORT.md        # Testbericht
└── package.json
```

## Screenshots

Die App verwendet standardmäßig Dark Mode mit einem modernen, tierfokussierten Design.

## Lizenz

MIT

---

Made with ❤️ für Tiere in Not | Streunerglück © 2026
