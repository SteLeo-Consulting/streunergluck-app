# Deployment Guide - Streunerglück App

## Vercel Deployment

### Nach erfolgreichem GitHub Push:

1. Gehe zu: https://vercel.com/new
2. "Import Git Repository" auswählen
3. `SteLeo-Consulting/streunergluck-app` auswählen
4. Settings:
   - **Framework Preset:** Vite
   - **Root Directory:** ./
   - **Build Command:** npm run build
   - **Output Directory:** dist
5. Klicke "Deploy"

### Alternative: Vercel CLI

```bash
# Vercel CLI installieren
npm i -g vercel

# Deployen
cd "C:\Users\Administrator\Desktop\Claude\streunergluck-app"
vercel --prod
```

---

## Lokales Testen

```bash
cd "C:\Users\Administrator\Desktop\Claude\streunergluck-app"
npm run dev
# Server läuft auf http://localhost:5173
```

---

## Aktueller Stand

| Task | Status |
|------|--------|
| React + Shadcn Setup | ✅ |
| Dark Mode (Default) | ✅ |
| Drag & Drop Bilder | ✅ |
| Text-Overlays | ✅ |
| Multi-Layouts | ✅ |
| PNG Export | ✅ |
| GitHub Push | ✅ |
| Vercel Deploy | ✅ |
| Test Report | ✅ |
